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
  id: number
  name: string
}

export interface NavigationButtonInterface {
  to: string
  text: string
}
