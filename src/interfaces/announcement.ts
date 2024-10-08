import { type IUser } from './User'

interface IRecipientFilters {
  states: string[]
  roles: string[]
}
export interface IAnnouncement {
  _id: string
  title: string
  message: string
  recipients: IUser['_id'][]
  recipient_filters: IRecipientFilters
  created_by: IUser['_id']
  created_at: Date
  updated_at: Date
}
