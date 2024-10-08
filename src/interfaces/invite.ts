import { type ICompany } from './company'
import type { Documents } from './global'

export interface IInvite extends Documents {
  invitee: string
  created_by: string
  role: string
  status: string
  company_id: ICompany | string
}
