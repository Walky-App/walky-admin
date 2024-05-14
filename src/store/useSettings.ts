import { create } from 'zustand'

import { type StatesSettingsDocument } from '../interfaces/setting'

interface State {
  settings: StatesSettingsDocument[]
  setSettings: (settings: StatesSettingsDocument[]) => void
}

export const useSettings = create<State>(set => ({
  settings: [],
  setSettings: settings => set({ settings }),
}))
