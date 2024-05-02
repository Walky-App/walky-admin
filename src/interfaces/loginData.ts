import { type IUser } from './User'

export interface ILoginData {
  user: IUser
  access_token: string
  message?: Error
}

export interface ISignupData {
  first_name: string
  last_name: string
  role: string
  password: string
  password_confirmed: string
  email: string
  phone_number: string
  otp?: string
}
