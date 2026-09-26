import { create } from 'zustand'

// Global interaction state: currently expanded domain / hovered domain / whether entered
interface StoreState {
  active: string | null // Currently expanded domain id (null = overview)
  hovered: string | null // Hovered domain id
  entered: boolean // Whether entered through intro
  setActive: (id: string | null) => void
  setHovered: (id: string | null) => void
  enter: () => void
}

export const useStore = create<StoreState>((set) => ({
  active: null,
  hovered: null,
  entered: false,
  setActive: (id) => set({ active: id }),
  setHovered: (id) => set({ hovered: id }),
  enter: () => set({ entered: true }),
}))

// Development debug hook: can use __store.getState().setActive('ads') in console
declare global {
  interface Window {
    __store?: typeof useStore
  }
}
if (import.meta.env.DEV) window.__store = useStore
