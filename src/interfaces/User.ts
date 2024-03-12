export interface IUser {
  _id: string
  access_token: string
  active: boolean
  address?: string
  avatar?: string
  birth_date?: Date
  city?: string
  country?: string
  created_at: string
  email: string
  first_name: string
  middle_name?: string
  gender?: string
  last_name: string
  notifications?: string[]
  phone_number?: string
  role: string
  role_id?: string
  state: string
  updated_at: string
  verified: boolean
  zip?: number
}
