export interface IPunches {
  punch_in: boolean
  location: number[]
  in_range: boolean
  is_success: boolean
  time_stamp: Date
}

export interface ITimeSheet {
  employee_id: string
  job_id: string
  facility_id: string
  is_clocked_in: boolean
  punches: IPunches[]
}
