import { create } from 'zustand'

export type Step = 1 | 2 | 3 | 4 | 5

interface AppState {
  currentStep: Step
  unlockedSteps: Step[]
  wishes: string[]
  userName: string | null
  setStep: (step: Step) => void
  unlockStep: (step: Step) => void
  addWish: (wish: string) => void
  setWishes: (wishes: string[]) => void
  setUserName: (name: string) => void
}

export const useStore = create<AppState>((set) => ({
  currentStep: 1,
  unlockedSteps: [1],
  wishes: [],
  userName: null,
  setStep: (step) => set({ currentStep: step }),
  unlockStep: (step) => set((state) => ({
    unlockedSteps: state.unlockedSteps.includes(step) ? state.unlockedSteps : [...state.unlockedSteps, step]
  })),
  addWish: (wish) => set((state) => ({ wishes: [...state.wishes, wish] })),
  setWishes: (wishes) => set({ wishes }),
  setUserName: (name) => set({ userName: name }),
}))
