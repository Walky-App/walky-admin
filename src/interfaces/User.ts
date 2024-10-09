/* eslint-disable filename-rules/match */

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
  avatar: string
  avatar_url: string
  birthday: Date
  campuses: string[]
  correctPassword: (candidatePassword: string, userPassword: string) => Promise<boolean>
  createdAt: Date
  email: string
  first_name: string
  interests: string[]
  is_active: boolean
  is_onboarded: boolean
  is_parent: boolean
  is_profile_complete: boolean
  is_verified: boolean
  languages: string[]
  last_name: string
  location: {
    type: string
    coordinates: [number, number]
  }
  middle_name: string
  otp: number
  password: string | undefined
  password_confirmed: string | undefined
  password_reset: boolean
  password_changed_at: Date
  peers: string[]
  peers_pending: string[]
  peers_blocked: string[]
  is_dog_owner: boolean
  title: string
  phone_number: string
  profile_bio: string
  push_notification_token: string
  relationship_status: string
  role: string
  school_id: string
  study_main: string
  study_secondary: string
  unread_notifications_count: number
}
