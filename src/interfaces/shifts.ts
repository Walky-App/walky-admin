import { type IUser } from './User'
import { type Documents } from './global'

interface HistoryShifts extends Documents {
  date: Date
  user_id: string
  action: string
}

export interface UserShifts extends Documents {
  user_id: string
  timesheet_id: string
  notes: string
  bonus: number
}

export interface UserShiftsPopulate extends Documents {
  user_id: IUser
  timesheet_id: string
  notes: string
  is_supervisor: boolean
  bonus: number
}

export interface Shifts extends Documents {
  shift_day: Date
  shift_start_time: string
  shift_end_time: string
  job_id: string
  vacancy_limit: number
  change_history?: HistoryShifts[]
  user_shifts?: UserShiftsPopulate[]
}
