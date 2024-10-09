import type { MutableRefObject } from 'react'

import type { Toast, ToastMessage, ToastProps } from 'primereact/toast'
import { create } from 'zustand'

import type { IToastParameters } from '../interfaces/global'

type ToastCallback = (toastData: ToastMessage) => void

interface State {
  toast: MutableRefObject<Toast | null>
  toastPosition: ToastProps['position']
  avatarImageUrl: string
  setToast: (ref: MutableRefObject<Toast | null>) => void
  showToast: (options: IToastParameters) => void
  removeToast: (toastData: ToastMessage) => void
  clearAllMessagesFromToast: () => void
  onRemoveToast: ToastCallback
  setRemoveToastCallback: (callback: ToastCallback) => void
  removeToastCallback?: ToastCallback
  setAvatarImageUrl: (value: string) => void
}

export const useUtils = create<State>(set => ({
  toast: {} as MutableRefObject<Toast>,
  toastPosition: 'bottom-right',
  avatarImageUrl: '',
  setToast: ref => set({ toast: ref }),
  showToast: ({ position = 'bottom-right', ...options }) => {
    set(state => {
      state.toastPosition = position
      state.toast.current?.show(options)
      return state
    })
  },
  removeToast: (toastData: ToastMessage) => {
    set(state => {
      state.toast.current?.remove(toastData)
      return state
    })
  },
  clearAllMessagesFromToast: () => {
    set(state => {
      state.toast.current?.clear()
      return state
    })
  },
  onRemoveToast: (toastData: ToastMessage) => {
    set(state => {
      state.removeToastCallback?.(toastData)
      return state
    })
  },
  setRemoveToastCallback: (callback: ToastCallback) => {
    set({ removeToastCallback: callback })
  },
  setAvatarImageUrl: (value: string) => {
    const walky_usr = JSON.parse(localStorage.getItem('walky_usr') || '{}')
    if (walky_usr.avatar === undefined) {
      walky_usr.avatar = value
      localStorage.setItem('walky_usr', JSON.stringify(walky_usr))
    }
    set({ avatarImageUrl: value })
  },
}))
