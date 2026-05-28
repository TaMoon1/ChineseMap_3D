import Map3D from './components/Map3D'
import SearchBar from './components/SearchBar'
import InfoPanel from './components/InfoPanel'
import TimeSlider from './components/TimeSlider'
import ViewToggle from './components/ViewToggle'
import DrawingToolbar from './components/DrawingToolbar'
import { useMapStore } from './store/useMapStore'

export default function App() {
  const loading = useMapStore((state) => state.loading)

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#0a0e1a]">
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#0a0e1a]">
          <div className="text-center text-gray-400">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
            <p className="text-sm">地图加载中...</p>
          </div>
        </div>
      )}

      <Map3D />

      <SearchBar />
      <InfoPanel />
      <DrawingToolbar />
      <ViewToggle />
      <TimeSlider />
    </div>
  )
}
