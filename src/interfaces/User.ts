/* eslint-disable filename-rules/match */
import { type ICompanyWithFacilities, type ICompany } from './company'
import { type ProgressHTU } from './htu'

export interface IOnboardingStep {
  step_number: number
  description: string
  type: string
  completed: boolean
}

export interface IUserDocument {
  id: number
  url: string
  key: string
  timestamp: string
}

export interface IUserInternalNote {
  note: string
  createdBy: string
  _id?: string
  createdAt?: Date
}
export interface IUser {
  _id: string
  access_token: string
  active: boolean
  createdAt: string
  email: string
  first_name: string
  last_name: string
  role: string
  state: string
  updated_at?: string
  experience_level?: string
  verified: boolean
  internal_notes?: IUserInternalNote[]
  isOnboarded?: boolean
  is_approved: boolean
  onboarding?: IOnboardingStep
  onboarding_notificationsSent?: boolean
  job_preferences?: string[]
  address?: string
  avatar?: string
  birth_date?: Date
  city?: string
  country?: string
  gender?: string
  middle_name?: string
  preferred_name?: string
  notifications?: string[]
  phone_number?: string
  role_id?: string
  zip?: string
  documents?: IUserDocument[]
  student_record?: ProgressHTU
  score_rating?: number
  is_shift_supervisor?: boolean
  wps_training?: Date
  companies?: string[] | ICompany[]
}

export interface IUserPopulated extends IUser {
  companies: ICompanyWithFacilities[]
}
