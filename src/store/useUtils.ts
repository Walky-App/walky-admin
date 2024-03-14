import type { MutableRefObject } from 'react'

import type { Toast } from 'primereact/toast'
import { create } from 'zustand'

interface State {
  toast: MutableRefObject<Toast | null>
  setToast: (ref: MutableRefObject<Toast | null>) => void
  showToast: (severity: 'success' | 'info' | 'warn' | 'error', summary: string, detail: string) => void
}

const useStore = create<State>(set => ({
  toast: {} as MutableRefObject<Toast>,
  setToast: ref => set({ toast: ref }),
  showToast: (severity, summary, detail) => {
    set(state => {
      state.toast.current?.show({ severity, summary, detail })
      return state
    })
  },
}))

export default useStore
