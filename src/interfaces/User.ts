export interface IUser {
  _id: string
  access_token: string
  role: string
  first_name: string
  last_name: string
  avatar?: string
  active: boolean
  address?: string
  created_at: string
  email: string
  phone?: string
  updated_at: string
  city?: string
  country?: string
  gender?: string
  notifications?: string[]
  role_id?: string
  state: string
  verified: boolean
  zip?: string
}
