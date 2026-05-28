import { useMapStore } from '../store/useMapStore'

export default function ViewToggle() {
  const sceneMode = useMapStore((s) => s.sceneMode)
  const toggle = useMapStore((s) => s.toggleSceneMode)

  return (
    <button
      onClick={toggle}
      className="fixed bottom-6 right-6 z-20 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl px-3 py-2 cursor-pointer hover:bg-black/80 transition-colors text-white text-sm"
    >
      {sceneMode === '3d' ? '🔄 切换2D' : '🌍 切换3D'}
    </button>
  )
}
