import type { ToastMessage, ToastMessageOptions, ToastProps } from 'primereact/toast'

export interface Documents {
  __v?: number
  _id: string
  createdAt?: Date
  updatedAt?: Date
}

export interface LoginData {
  email: string
  password: string
}

export interface SelectedOptionInterface {
  name: string
  code: string
}

export interface NavigationButtonInterface {
  to: string
  text: string
  disbalePlusIcon?: boolean
}

export interface DisableButtonInterface {
  path: string
  status: boolean
  redirect: string
}

export interface TagsInterface {
  state: string
  value: number
}

export interface FilterInterface {
  search: string
  selected: string
}

export type IToastParameters = ToastMessageOptions &
  ToastMessage & {
    position?: ToastProps['position']
  }

export interface IToastData extends ToastMessage {
  message: ToastMessage
}

export interface IParams {
  id?: string
}
