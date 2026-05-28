import { battlePresetMap } from '../data/battlePresets'
import { historicalRegionMap } from '../data/historicalRegions'
import type { Dynasty } from '../data/dynasties'
import { useMapStore } from '../store/useMapStore'
import { getPhaseColorForPanel } from '../utils/battleStyles'

function cityIcon(type: string) {
  switch (type) {
    case '首都':
      return '宫'
    case '行在':
      return '驻'
    case '陪都':
      return '副'
    case '重镇':
      return '要'
    case '关隘':
      return '关'
    default:
      return '城'
  }
}

export default function InfoPanel() {
  const activeDynasties = useMapStore((state) => state.activeDynasties)
  const selectedBattleId = useMapStore((state) => state.selectedBattleId)
  const setSelectedBattleId = useMapStore((state) => state.setSelectedBattleId)
  const selectedRegionId = useMapStore((state) => state.selectedRegionId)
  const setSelectedRegionId = useMapStore((state) => state.setSelectedRegionId)

  const battle = selectedBattleId ? battlePresetMap.get(selectedBattleId) ?? null : null
  const region = selectedRegionId ? historicalRegionMap.get(selectedRegionId) ?? null : null

  return (
    <div className="fixed right-4 top-4 z-20 flex max-h-[calc(100vh-2rem)] w-[340px] flex-col gap-3">
      {battle ? (
        <section className="overflow-hidden rounded-2xl border border-sky-400/20 bg-black/75 text-white shadow-2xl backdrop-blur-md">
          <div className="flex items-start justify-between gap-3 border-b border-white/10 px-4 py-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-sky-300">Battle Overlay</p>
              <h2 className="mt-1 text-xl font-semibold">{battle.name}</h2>
              <p className="text-xs text-gray-400">
                {battle.era} · {battle.years}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedBattleId(null)}
              className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-gray-300 transition hover:bg-white/10"
            >
              关闭
            </button>
          </div>

          <div className="space-y-3 px-4 py-3 text-sm">
            <p className="leading-6 text-gray-200">{battle.summary}</p>

            {battle.phases?.length ? (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">阶段时间</p>
                <div className="space-y-2">
                  {battle.phases.map((phase, index) => (
                    <div key={phase.id} className="rounded-xl border border-white/5 bg-white/5 px-3 py-2">
                      <div className="flex items-center gap-2 text-sm text-gray-100">
                        <span
                          className="h-3 w-3 rounded-full border border-white/20"
                          style={{ backgroundColor: getPhaseColorForPanel(battle, phase, index) }}
                        />
                        <span>{phase.name}</span>
                      </div>
                      <p className="mt-1 text-[11px] text-gray-400">{phase.time}</p>
                      <p className="mt-1 text-[11px] leading-5 text-gray-500">{phase.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">势力颜色</p>
              <div className="space-y-2">
                {battle.forces.map((force) => (
                  <div key={force.id} className="flex items-center gap-2 text-sm text-gray-200">
                    <span className="h-3.5 w-3.5 rounded-full border border-white/20" style={{ backgroundColor: force.color }} />
                    <span>{force.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">说明</p>
              <p className="text-xs leading-5 text-gray-400">{battle.note}</p>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">位置依据</p>
              <p className="text-xs leading-5 text-gray-400">{battle.locationBasis}</p>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">参考资料</p>
              <div className="space-y-1.5">
                {battle.sources.map((source) => (
                  <a
                    key={source.url}
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-xs text-sky-300 transition hover:text-sky-200"
                  >
                    {source.title}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {region ? (
        <section className="overflow-hidden rounded-2xl border border-emerald-400/20 bg-black/75 text-white shadow-2xl backdrop-blur-md">
          <div className="flex items-start justify-between gap-3 border-b border-white/10 px-4 py-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-emerald-300">Historical Region</p>
              <h2 className="mt-1 text-xl font-semibold">{region.name}</h2>
              <p className="text-xs text-gray-400">{region.era}</p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedRegionId(null)}
              className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-gray-300 transition hover:bg-white/10"
            >
              关闭
            </button>
          </div>

          <div className="space-y-3 px-4 py-3 text-sm">
            <p className="leading-6 text-gray-200">{region.summary}</p>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">位置依据</p>
              <p className="text-xs leading-5 text-gray-400">{region.locationBasis}</p>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">参考资料</p>
              <div className="space-y-1.5">
                {region.sources.map((source) => (
                  <a
                    key={source.url}
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-xs text-emerald-300 transition hover:text-emerald-200"
                  >
                    {source.title}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <DynastyCard activeDynasties={activeDynasties} />
    </div>
  )
}

function DynastyCard({ activeDynasties }: { activeDynasties: Dynasty[] }) {
  if (activeDynasties.length === 0) {
    return (
      <section className="rounded-2xl border border-white/10 bg-black/65 p-4 text-sm text-gray-400 shadow-2xl backdrop-blur-md">
        点击底部朝代按钮查看疆域、都城和重要城市。
      </section>
    )
  }

  if (activeDynasties.length > 1) {
    return (
      <section className="max-h-[40vh] overflow-y-auto rounded-2xl border border-white/10 bg-black/75 p-4 text-white shadow-2xl backdrop-blur-md">
        <h3 className="mb-2 text-sm font-semibold text-gray-300">当前朝代</h3>
        <div className="space-y-2">
          {activeDynasties.map((dynasty) => (
            <div key={dynasty.id} className="rounded-xl border border-white/5 bg-white/5 px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: dynasty.color }} />
                <span className="font-medium">{dynasty.name}</span>
                <span className="text-[10px] text-gray-400">{dynasty.period}</span>
              </div>
              <p className="mt-1 text-xs text-gray-400">
                都城 {dynasty.capital} · {dynasty.cities.length} 城市 · {dynasty.adminRegions.length} 行政区
              </p>
            </div>
          ))}
        </div>
      </section>
    )
  }

  const dynasty = activeDynasties[0]

  return (
    <section className="max-h-[50vh] overflow-y-auto rounded-2xl border border-white/10 bg-black/75 p-4 text-white shadow-2xl backdrop-blur-md">
      <div className="mb-3 flex items-center gap-3">
        <span className="h-5 w-5 rounded-md border border-white/30" style={{ backgroundColor: dynasty.color }} />
        <div>
          <h3 className="text-xl font-semibold">{dynasty.name}</h3>
          <p className="text-xs text-gray-400">{dynasty.period}</p>
        </div>
      </div>

      <p className="text-sm text-gray-200">都城：{dynasty.capital}</p>
      <p className="mt-2 border-t border-white/10 pt-2 text-xs leading-6 text-gray-400">{dynasty.description}</p>

      {dynasty.cities.length > 0 ? (
        <div className="mt-3 border-t border-white/10 pt-3">
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">重要城市</h4>
          <div className="grid gap-1.5">
            {dynasty.cities.map((city, index) => (
              <div key={`${city.name}-${index}`} className="flex items-center gap-2 text-xs text-gray-300">
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded bg-white/10 px-1 text-[10px]">
                  {cityIcon(city.type)}
                </span>
                <span>{city.name}</span>
                <span className="text-[10px] text-gray-500">({city.type})</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {dynasty.adminRegions.length > 0 ? (
        <div className="mt-3 border-t border-white/10 pt-3">
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">行政单位</h4>
          <div className="flex flex-wrap gap-1.5">
            {dynasty.adminRegions.map((region, index) => (
              <span key={`${region.name}-${index}`} className="rounded bg-white/5 px-2 py-1 text-[10px] text-gray-400">
                {region.name}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  )
}
