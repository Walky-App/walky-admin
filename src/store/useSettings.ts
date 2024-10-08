import { create } from 'zustand'

import { type StatesSettingsDocument } from '../interfaces/setting'

interface State {
  settings: StatesSettingsDocument | null
  setSettings: (settings: StatesSettingsDocument | null) => void
}

export const useSettings = create<State>(set => ({
  settings: null,
  setSettings: settings => set({ settings }),
}))
