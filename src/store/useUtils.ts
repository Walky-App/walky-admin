import type { MutableRefObject } from 'react'

import type { Toast, ToastProps } from 'primereact/toast'
import { create } from 'zustand'

import type { IToastParameters } from '../interfaces/global'

interface State {
  toast: MutableRefObject<Toast | null>
  toastPosition: ToastProps['position']
  setToast: (ref: MutableRefObject<Toast | null>) => void
  showToast: ({ severity, detail, summary, position }: IToastParameters) => void
}

export const useUtils = create<State>(set => ({
  toast: {} as MutableRefObject<Toast>,
  toastPosition: 'bottom-right',
  setToast: ref => set({ toast: ref }),
  showToast: ({ severity, detail, summary, position = 'bottom-right' }) => {
    set(state => {
      state.toastPosition = position
      state.toast.current?.show({ severity, detail, summary })
      return state
    })
  },
}))
