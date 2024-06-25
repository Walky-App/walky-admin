import { create } from 'zustand'

import { type StatesSettingsDocument } from '../interfaces/setting'

interface State {
  settings: StatesSettingsDocument | null
  setSettings: (settings: StatesSettingsDocument | null) => void
  fetchSettings: () => void
}

export const useSettings = create<State>(set => ({
  settings: null,
  setSettings: settings => set({ settings }),
  fetchSettings: async () => {
    try {
      const response = await fetch('settings/user')
      if (response.ok) {
        const data = await response.json()
        set({ settings: data })
      }
    } catch (error) {
      console.error('Error fetching settings', error)
    }
  },
}))
