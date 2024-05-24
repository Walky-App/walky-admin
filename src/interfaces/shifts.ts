import { type Documents } from './global'
import { type ITimeSheet } from './timesheet'

interface HistoryShifts extends Documents {
  date: Date
  user_id: string
  action: string
}

export interface UserShifts extends Documents {
  user_id: string
  timesheet_id: ITimeSheet
  notes: string
  bonus: number
}

export interface Shifts extends Documents {
  shift_day: Date
  shift_start_time: number
  shift_end_time: number
  job_id: string
  vacancy_limit: number
  change_history?: HistoryShifts[]
  user_shifts?: UserShifts[]
}
