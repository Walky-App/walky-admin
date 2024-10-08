export interface IPunch {
  _id: string
  punch_in: boolean
  location: number[]
  in_range: boolean
  is_success: boolean
  time_stamp: string
}

export interface ITimeSheet {
  _id: string
  employee_id: string
  job_id: string
  facility_id: string
  is_clocked_in: boolean
  punches: IPunch[]
  createdAt: string
  note?: string
}

export interface IUserTimesheetsProps {
  selectedUserId: string
}

export interface IPayPeriod {
  label: string
  start: string
  end: string
}
