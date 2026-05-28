import { useEffect } from 'react'
import { useMapStore } from '../store/useMapStore'

const COLORS = ['#ffb703', '#fb5607', '#ff006e', '#3a86ff', '#06d6a0', '#ffffff']

export default function DrawingToolbar() {
  const sceneMode = useMapStore((state) => state.sceneMode)
  const drawingTool = useMapStore((state) => state.drawingTool)
  const setDrawingTool = useMapStore((state) => state.setDrawingTool)
  const strokeColor = useMapStore((state) => state.strokeColor)
  const setStrokeColor = useMapStore((state) => state.setStrokeColor)
  const strokeWidth = useMapStore((state) => state.strokeWidth)
  const setStrokeWidth = useMapStore((state) => state.setStrokeWidth)
  const annotations = useMapStore((state) => state.annotations)
  const undoAnnotation = useMapStore((state) => state.undoAnnotation)
  const clearAnnotations = useMapStore((state) => state.clearAnnotations)

  const is3D = sceneMode === '3d'
  const isDrawing = is3D && drawingTool !== 'none'

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDrawingTool('none')
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [setDrawingTool])

  return (
    <div className="fixed left-4 top-4 z-30 w-[252px] rounded-2xl border border-white/10 bg-black/70 p-4 text-white shadow-2xl backdrop-blur-md">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">3D 标注画笔</p>
          <p className="text-[11px] text-gray-400">
            {is3D ? '进入绘制模式后会自动锁定 3D 相机' : '切换到 3D 后可使用箭头和画笔'}
          </p>
        </div>
        <span
          className={`rounded-full px-2 py-1 text-[10px] font-medium ${
            isDrawing ? 'bg-amber-400/20 text-amber-200' : 'bg-white/10 text-gray-300'
          }`}
        >
          {isDrawing ? '绘制中' : is3D ? '已就绪' : '2D 模式'}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <ToolbarButton
          active={drawingTool === 'none'}
          disabled={!is3D}
          label="浏览"
          onClick={() => setDrawingTool('none')}
        />
        <ToolbarButton
          active={drawingTool === 'arrow'}
          disabled={!is3D}
          label="箭头"
          onClick={() => setDrawingTool(drawingTool === 'arrow' ? 'none' : 'arrow')}
        />
        <ToolbarButton
          active={drawingTool === 'brush'}
          disabled={!is3D}
          label="画笔"
          onClick={() => setDrawingTool(drawingTool === 'brush' ? 'none' : 'brush')}
        />
      </div>

      <div className="mt-4">
        <p className="mb-2 text-[11px] uppercase tracking-[0.24em] text-gray-500">Color</p>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setStrokeColor(color)}
              className={`h-7 w-7 rounded-full border transition-transform ${
                strokeColor === color
                  ? 'scale-110 border-white shadow-[0_0_0_2px_rgba(255,255,255,0.22)]'
                  : 'border-white/20'
              }`}
              style={{ backgroundColor: color }}
              aria-label={`选择颜色 ${color}`}
            />
          ))}
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between text-[11px] text-gray-400">
          <span>线宽</span>
          <span>{strokeWidth}px</span>
        </div>
        <input
          type="range"
          min={3}
          max={14}
          step={1}
          value={strokeWidth}
          onChange={(event) => setStrokeWidth(Number(event.target.value))}
          className="w-full accent-amber-400"
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={undoAnnotation}
          disabled={annotations.length === 0}
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-100 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          撤销
        </button>
        <button
          type="button"
          onClick={clearAnnotations}
          disabled={annotations.length === 0}
          className="rounded-xl border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-100 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-40"
        >
          清空
        </button>
      </div>

      <p className="mt-3 text-[11px] leading-5 text-gray-500">
        左键拖动即可绘制，按 <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-[10px]">Esc</kbd> 可快速退出绘制。
      </p>
    </div>
  )
}

interface ToolbarButtonProps {
  active: boolean
  disabled: boolean
  label: string
  onClick: () => void
}

function ToolbarButton({ active, disabled, label, onClick }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-xl border px-3 py-2 text-sm transition ${
        active
          ? 'border-amber-300/50 bg-amber-400/15 text-amber-100'
          : 'border-white/10 bg-white/5 text-gray-200 hover:bg-white/10'
      } disabled:cursor-not-allowed disabled:opacity-40`}
    >
      {label}
    </button>
  )
}
