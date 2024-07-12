import { type INotificationPreference } from '../utils/formOptions'
import { type IOnboardingStep, type IUser } from './User'

export interface ILoginData {
  user: IUser
  access_token: string
  message?: Error
}

export interface ITerms {
  is_accepted?: boolean
  accepted_at?: Date
  ip_address?: string
}

export interface ISignupData {
  first_name: string
  last_name: string
  role: string
  password: string
  password_confirmed: string
  notifications: INotificationPreference[]
  email: string
  phone_number: string
  otp?: string
  terms: ITerms
  onboarding?: IOnboardingStep
  companies?: string[]
}
