import { useEffect, useMemo, useRef, useState } from 'react'
import { battlePresets, searchBattlePresets } from '../data/battlePresets'
import { historicalRegions, searchHistoricalRegions } from '../data/historicalRegions'
import { useMapStore } from '../store/useMapStore'

type SearchItem =
  | { id: string; kind: 'battle'; name: string; meta: string; aliases: string[] }
  | { id: string; kind: 'region'; name: string; meta: string; aliases: string[] }

export default function SearchBar() {
  const selectedBattleId = useMapStore((state) => state.selectedBattleId)
  const setSelectedBattleId = useMapStore((state) => state.setSelectedBattleId)
  const selectedRegionId = useMapStore((state) => state.selectedRegionId)
  const setSelectedRegionId = useMapStore((state) => state.setSelectedRegionId)
  const setBattleViewSelection = useMapStore((state) => state.setBattleViewSelection)
  const setRegionViewSelection = useMapStore((state) => state.setRegionViewSelection)

  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)

  const results = useMemo<SearchItem[]>(() => {
    const battles = searchBattlePresets(query).map((battle) => ({
      id: battle.id,
      kind: 'battle' as const,
      name: battle.name,
      meta: `${battle.era} · ${battle.years}`,
      aliases: battle.aliases,
    }))

    const regions = searchHistoricalRegions(query).map((region) => ({
      id: region.id,
      kind: 'region' as const,
      name: region.name,
      meta: `${region.era} · 历史地域`,
      aliases: region.aliases,
    }))

    return [...battles, ...regions]
  }, [query])

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    window.addEventListener('mousedown', handlePointerDown)
    return () => window.removeEventListener('mousedown', handlePointerDown)
  }, [])

  function handleSelectItem(item: SearchItem) {
    if (item.kind === 'battle') {
      const battle = battlePresets.find((entry) => entry.id === item.id)
      setBattleViewSelection(item.id)
      setQuery(battle?.name ?? item.name)
    } else {
      const region = historicalRegions.find((entry) => entry.id === item.id)
      setRegionViewSelection(item.id)
      setQuery(region?.name ?? item.name)
    }
    setOpen(false)
  }

  function handleSubmit() {
    if (results.length === 0) return
    handleSelectItem(results[0])
  }

  function handleClear() {
    setSelectedBattleId(null)
    setSelectedRegionId(null)
    setQuery('')
    setOpen(false)
  }

  const hasSelection = Boolean(selectedBattleId || selectedRegionId)

  return (
    <div ref={rootRef} className="fixed left-1/2 top-4 z-30 w-full max-w-xl -translate-x-1/2 px-4">
      <div className="rounded-2xl border border-white/10 bg-black/60 shadow-2xl backdrop-blur-md">
        <div className="relative">
          <input
            type="text"
            value={query}
            placeholder="搜索战役或历史区域，如：赤壁、淝水、荆州、关中、巴蜀"
            onChange={(event) => {
              setQuery(event.target.value)
              setOpen(true)
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => {
              window.setTimeout(() => setOpen(false), 120)
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                handleSubmit()
              }
              if (event.key === 'Escape') {
                setOpen(false)
              }
            }}
            className="w-full rounded-2xl bg-transparent px-5 py-3 pr-32 text-sm text-white outline-none placeholder:text-gray-500"
          />

          <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
            {hasSelection ? (
              <button
                type="button"
                onClick={handleClear}
                className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-gray-300 transition hover:bg-white/10"
              >
                清除
              </button>
            ) : null}
            <button
              type="button"
              onClick={handleSubmit}
              className="rounded-lg border border-sky-400/20 bg-sky-500/15 px-3 py-1 text-[11px] text-sky-100 transition hover:bg-sky-500/25"
            >
              搜索
            </button>
          </div>
        </div>

        <div className="border-t border-white/5 px-5 pb-3 pt-2 text-[11px] text-gray-500">
          已支持战役示意图、分阶段时间线与历史地域范围图层
        </div>

        {open ? (
          <div className="max-h-[52vh] overflow-y-auto border-t border-white/10 px-2 pb-2">
            {results.length > 0 ? (
              results.map((item) => {
                const active =
                  (item.kind === 'battle' && selectedBattleId === item.id) ||
                  (item.kind === 'region' && selectedRegionId === item.id)

                return (
                  <button
                    key={`${item.kind}-${item.id}`}
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleSelectItem(item)}
                    className={`mt-2 flex w-full items-start justify-between rounded-xl px-3 py-2 text-left transition ${
                      active ? 'bg-sky-500/15 text-white' : 'text-gray-200 hover:bg-white/5'
                    }`}
                  >
                    <span>
                      <span className="block text-sm font-medium">{item.name}</span>
                      <span className="block text-[11px] text-gray-400">{item.meta}</span>
                    </span>
                    <span className="ml-3 text-[10px] text-gray-500">
                      {item.kind === 'battle' ? '战役' : '地域'} · {item.aliases.slice(0, 2).join(' / ')}
                    </span>
                  </button>
                )
              })
            ) : (
              <p className="px-3 py-3 text-sm text-gray-400">
                没有找到对应内容，可以试试“赤壁之战”“淝水之战”“荆州”“关中”“巴蜀”。
              </p>
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}
