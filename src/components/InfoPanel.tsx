import { useMapStore } from '../store/useMapStore'
import type { Dynasty } from '../data/dynasties'

/** 城市类型图标 */
function cityIcon(type: string) {
  switch (type) {
    case '首都': return '👑'
    case '行在': return '🏛️'
    case '陪都': return '🏯'
    case '重镇': return '⚔️'
    case '关隘': return '🚩'
    default: return '📍'
  }
}

export default function InfoPanel() {
  const activeDynasties = useMapStore((s) => s.activeDynasties)

  if (activeDynasties.length === 0) {
    return (
      <div className="fixed top-4 right-4 z-10 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 p-4 text-gray-400 text-sm max-w-[200px]">
        <p className="text-center leading-relaxed">
          点击底部朝代按钮<br />查看疆域与城市
        </p>
      </div>
    )
  }

  const first = activeDynasties[0]
  // 如果多个朝代同时显示（宋辽金夏），展示列表
  if (activeDynasties.length > 1) {
    return (
      <div className="fixed top-4 right-4 z-10 bg-black/70 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl p-4 text-white max-w-[240px] max-h-[70vh] overflow-y-auto">
        <h3 className="text-sm font-bold text-gray-300 mb-2">当前时期</h3>
        {activeDynasties.map((d) => (
          <DynastyMini key={d.id} dynasty={d} />
        ))}
      </div>
    )
  }

  return <DynastyDetail dynasty={first} />
}

function DynastyMini({ dynasty }: { dynasty: Dynasty }) {
  return (
    <div className="mb-2 last:mb-0 border-l-2 pl-3 py-1" style={{ borderColor: dynasty.color }}>
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-sm" style={{ background: dynasty.color }} />
        <span className="font-bold text-sm">{dynasty.name}</span>
        <span className="text-[10px] text-gray-400">{dynasty.period}</span>
      </div>
      <p className="text-[10px] text-gray-400 mt-0.5">
        🏛 {dynasty.capital} | {dynasty.cities.length} 城 {dynasty.adminRegions.length} 政区
      </p>
    </div>
  )
}

function DynastyDetail({ dynasty }: { dynasty: Dynasty }) {
  const { name, period, capital, color, description, cities, adminRegions } = dynasty

  return (
    <div className="fixed top-4 right-4 z-10 bg-black/70 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl p-4 text-white max-w-[260px] max-h-[80vh] overflow-y-auto">
      {/* 标题 */}
      <div className="flex items-center gap-3 mb-3">
        <span className="w-5 h-5 rounded-md border border-white/30" style={{ background: color }} />
        <div>
          <h2 className="text-xl font-bold">{name}</h2>
          <span className="text-xs text-gray-400">{period}</span>
        </div>
      </div>

      {/* 基本信息 */}
      <div className="space-y-1.5 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-gray-500">🏛 都城</span>
          <span>{capital}</span>
        </div>
      </div>

      <p className="mt-2 text-xs text-gray-400 leading-relaxed border-t border-white/10 pt-2">
        {description}
      </p>

      {/* 重要城市 */}
      {cities.length > 0 && (
        <div className="mt-3 border-t border-white/10 pt-2">
          <h4 className="text-xs font-bold text-gray-300 mb-1.5">📍 重要城市</h4>
          <div className="grid grid-cols-1 gap-1">
            {cities.map((c, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[11px] text-gray-300">
                <span>{cityIcon(c.type)}</span>
                <span>{c.name}</span>
                <span className="text-[9px] text-gray-500">({c.type})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 行政区域 */}
      {adminRegions.length > 0 && (
        <div className="mt-3 border-t border-white/10 pt-2">
          <h4 className="text-xs font-bold text-gray-300 mb-1.5">🏛️ 行政单位</h4>
          <div className="flex flex-wrap gap-1">
            {adminRegions.map((r, i) => (
              <span key={i} className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded text-gray-400">
                {r.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
