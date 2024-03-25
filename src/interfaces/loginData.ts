import { type IUser } from './User'

export interface ILoginData {
  user: IUser
  access_token: string
  message?: Error
}
