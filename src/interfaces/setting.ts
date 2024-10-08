export interface HolidayDocument {
  holiday_name: string
  holiday_date: Date
}

export interface HtuSettingsDocument {
  target: string
  rate: number
}

interface IFees {
  name: string
  value: number
}

export interface AdminCostsDocument {
  total: number
  fees: IFees[]
}

export interface OvertimeDocument {
  holiday_rate: number
  overtime_rate: number
  minimun_hours: number
}

export interface StatesSettingsDocument {
  _id: string
  state: string
  admin_costs: AdminCostsDocument
  our_fee: number
  processing_fee: number
  overtime_rate: OvertimeDocument
  minimun_wage: number
  supervisor_fee: number
  holiday: HolidayDocument[]
  htu: HtuSettingsDocument[]
  licenses_required: boolean
  max_hours_per_day: number
}
