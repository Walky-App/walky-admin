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
