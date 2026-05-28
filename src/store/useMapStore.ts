import { create } from 'zustand'
import type { Dynasty, DynastyGroup } from '../data/dynasties'
import { groupByEra } from '../data/dynasties'

export type SceneMode = '3d' | '2d'
export type DrawingTool = 'none' | 'arrow' | 'brush'

export interface DrawingPoint {
  x: number
  y: number
}

export interface ArrowAnnotation {
  id: string
  kind: 'arrow'
  color: string
  width: number
  start: DrawingPoint
  end: DrawingPoint
}

export interface BrushAnnotation {
  id: string
  kind: 'brush'
  color: string
  width: number
  points: DrawingPoint[]
}

export type DrawingAnnotation = ArrowAnnotation | BrushAnnotation

interface MapState {
  activeDynasties: Dynasty[]
  setActiveDynasty: (dynasty: Dynasty) => void
  clearDynasties: () => void

  sceneMode: SceneMode
  toggleSceneMode: () => void

  loading: boolean
  setLoading: (v: boolean) => void

  groups: DynastyGroup[]

  drawingTool: DrawingTool
  setDrawingTool: (tool: DrawingTool) => void
  strokeColor: string
  setStrokeColor: (color: string) => void
  strokeWidth: number
  setStrokeWidth: (width: number) => void
  annotations: DrawingAnnotation[]
  addAnnotation: (annotation: DrawingAnnotation) => void
  undoAnnotation: () => void
  clearAnnotations: () => void

  selectedBattleId: string | null
  setSelectedBattleId: (battleId: string | null) => void
  selectedRegionId: string | null
  setSelectedRegionId: (regionId: string | null) => void
  setBattleViewSelection: (battleId: string | null) => void
  setRegionViewSelection: (regionId: string | null) => void
}

export const useMapStore = create<MapState>((set) => ({
  activeDynasties: [],
  sceneMode: '2d',
  loading: true,
  groups: groupByEra(),

  drawingTool: 'none',
  strokeColor: '#ffb703',
  strokeWidth: 6,
  annotations: [],
  selectedBattleId: null,
  selectedRegionId: null,

  setActiveDynasty: (dynasty) => set({ activeDynasties: [dynasty] }),
  clearDynasties: () => set({ activeDynasties: [] }),

  toggleSceneMode: () =>
    set((state) => ({
      sceneMode: state.sceneMode === '3d' ? '2d' : '3d',
      drawingTool: state.sceneMode === '3d' ? 'none' : state.drawingTool,
    })),

  setLoading: (v) => set({ loading: v }),

  setDrawingTool: (tool) => set({ drawingTool: tool }),
  setStrokeColor: (color) => set({ strokeColor: color }),
  setStrokeWidth: (width) => set({ strokeWidth: width }),
  addAnnotation: (annotation) =>
    set((state) => ({ annotations: [...state.annotations, annotation] })),
  undoAnnotation: () =>
    set((state) => ({ annotations: state.annotations.slice(0, -1) })),
  clearAnnotations: () => set({ annotations: [] }),

  setSelectedBattleId: (battleId) => set({ selectedBattleId: battleId }),
  setSelectedRegionId: (regionId) => set({ selectedRegionId: regionId }),
  setBattleViewSelection: (battleId) =>
    set({
      selectedBattleId: battleId,
      selectedRegionId: null,
      sceneMode: battleId ? '3d' : undefined,
      drawingTool: battleId ? 'none' : undefined,
    }),
  setRegionViewSelection: (regionId) =>
    set({
      selectedRegionId: regionId,
      selectedBattleId: null,
      sceneMode: regionId ? '3d' : undefined,
      drawingTool: regionId ? 'none' : undefined,
    }),
}))
