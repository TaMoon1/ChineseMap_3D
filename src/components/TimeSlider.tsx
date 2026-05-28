import { useMapStore } from '../store/useMapStore'

export default function TimeSlider() {
  const groups = useMapStore((s) => s.groups)
  const activeDynasties = useMapStore((s) => s.activeDynasties)
  const setActiveDynasty = useMapStore((s) => s.setActiveDynasty)

  const activeIds = new Set(activeDynasties.map((d) => d.id))

  return (
    <div className="fixed bottom-0 left-0 right-0 z-10 flex justify-center pb-4 px-4 pointer-events-none">
      <div className="pointer-events-auto bg-black/70 backdrop-blur-md rounded-2xl px-5 py-3 shadow-2xl border border-white/10 max-w-[95vw] overflow-x-auto">
        <div className="flex gap-6">
          {groups.map((group) => (
            <div key={group.era} className="flex items-center gap-1.5">
              {/* era 分隔标签 */}
              <span className="text-[10px] text-gray-500 font-medium mr-1 uppercase tracking-wider">
                {group.era}
              </span>
              {group.items.map((d) => {
                const isActive = activeIds.has(d.id)
                return (
                  <button
                    key={d.id}
                    onClick={() => setActiveDynasty(d)}
                    className={`
                      relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                      transition-all duration-200 cursor-pointer select-none whitespace-nowrap text-sm
                      ${isActive
                        ? 'text-white shadow-md scale-105'
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                      }
                    `}
                    style={
                      isActive
                        ? {
                            background: `${d.color}44`,
                            border: `1px solid ${d.color}88`,
                          }
                        : { border: '1px solid transparent' }
                    }
                    title={`${d.name} (${d.period})`}
                  >
                    {/* 小色块 */}
                    <span
                      className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                      style={{ background: d.color }}
                    />
                    <span>{d.name}</span>
                  </button>
                )
              })}
              {/* era 分隔线 */}
              <span className="w-px h-6 bg-white/10 ml-2 last:hidden" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
