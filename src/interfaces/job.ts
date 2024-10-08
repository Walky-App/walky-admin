import { type IUser } from './User'
import { type IFacility } from './facility'
import { type Shifts } from './shifts'

export interface IApplicantWithoutPopulate {
  user: IUser | string
  is_approved: boolean
  is_working: boolean
  _id: string
}

export interface IApplicant {
  user: IUser
  is_approved: boolean
  is_working: boolean
  rejection_reason: string
  _id: string
  first_name: string
  last_name: string
}

export interface IFeedback {
  email: string
  rating: number
  comment: number
}

export interface IRestriction {
  start: number
  end: number
}

export interface IDnr {
  email: string
  reason: string
}

export interface IJobShiftDay {
  day: Date
  shifts_id: Shifts
}

export interface IJob {
  _id: string
  uid: string
  created_by: string
  facility: IFacility
  title: string
  start_time: string
  end_time: string
  total_hours: number
  lunch_break: number
  job_days: IJobShiftDay[]
  job_dates: string[]
  job_tips: string[]
  vacancy: number
  hourly_rate: number
  applicants: IApplicant[]
  saved_by: string[]
  dnr: IDnr[]
  is_completed: boolean
  is_full: boolean
  is_active: boolean
  feedback: IFeedback[]
  clock_in_restriction: IRestriction[]
  clock_out_restriction: IRestriction[]
  distance: number
  createdAt: Date
  updatedAt: Date
  applicants_feedback_ids: string[]
  job_id?: IJob
}
