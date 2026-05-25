import Map3D from './components/Map3D'
import SearchBar from './components/SearchBar'
import InfoPanel from './components/InfoPanel'
import TimeSlider from './components/TimeSlider'
import ViewToggle from './components/ViewToggle'
import { useMapStore } from './store/useMapStore'

export default function App() {
  const loading = useMapStore((s) => s.loading)

  return (
    <div className="w-screen h-screen relative overflow-hidden bg-[#0a0e1a]">
      {/* 加载遮罩 */}
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#0a0e1a]">
          <div className="text-center text-gray-400">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm">加载地图中...</p>
          </div>
        </div>
      )}

      {/* 3D 地图 */}
      <Map3D />

      {/* UI 叠加层 */}
      <SearchBar />
      <InfoPanel />
      <ViewToggle />
      <TimeSlider />
    </div>
  )
}
