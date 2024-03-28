import { type IUser } from './User'

interface IApplicant {
  user: IUser
  is_approved: boolean
  is_working: boolean
  rejection_reason: string
}

export interface IJob {
  _id: string
  created_by: string
  facility: string
  title: string
  start_time: number
  end_time: number
  total_hours: number
  lunch_break: number
  job_dates: Date[]
  job_tips: string[]
  vacancy: number
  applicants: IApplicant[]
  dnr: { email: string; reason: string }[]
  is_completed: boolean
  is_full: boolean
  is_active: { type: boolean }
  feedback: [{ email: string; rating: number; comment: string }]
  clock_in_restriction: [{ start: number; end: number }]
  clock_out_restriction: [{ start: number; end: number }]
  distance: number
  createdAt: Date
  updatedAt: Date
}
