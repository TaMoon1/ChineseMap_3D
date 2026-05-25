import { create } from 'zustand'
import type { Dynasty, DynastyGroup } from '../data/dynasties'
import { groupByEra } from '../data/dynasties'

export type SceneMode = '3d' | '2d'

interface MapState {
  activeDynasties: Dynasty[]
  setActiveDynasty: (dynasty: Dynasty) => void
  clearDynasties: () => void

  sceneMode: SceneMode
  toggleSceneMode: () => void

  loading: boolean
  setLoading: (v: boolean) => void

  groups: DynastyGroup[]
}

export const useMapStore = create<MapState>((set) => ({
  activeDynasties: [],
  sceneMode: '2d',
  loading: true,
  groups: groupByEra(),

  setActiveDynasty: (dynasty) => set({ activeDynasties: [dynasty] }),
  clearDynasties: () => set({ activeDynasties: [] }),

  toggleSceneMode: () =>
    set((s) => ({ sceneMode: s.sceneMode === '3d' ? '2d' : '3d' })),

  setLoading: (v) => set({ loading: v }),
}))
