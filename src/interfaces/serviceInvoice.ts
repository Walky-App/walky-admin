import { type ICompany } from './company'
import { type IFacility } from './facility'
import { type IJob } from './job'
import { type IServiceOrder } from './serviceOrder'
import { type StatesSettingsDocument } from './setting'

interface IDetails {
  discount_reason: string
  temp_pay_rate: number
  number_of_vacancies: number
  number_of_selected_working_days: number
  number_of_holidays: number
  supervisor_fees: number
  total_overtime_fees: number
  total_hours_per_day: number
  total_of_all_temps_hours: number
  total_base_amount: number
  admin_costs_total: number
  our_fee: number
  processing_fee: number
  estimated_total_per_hour: number
  state_settings_history: StatesSettingsDocument
  temps_details: EmployeeShift[]
  discount: number
  total_cost: number
}

export interface IServiceInvoice {
  details: IDetails
  _id: string
  uid: string
  status: string
  created_by: string
  company_id: ICompany
  service_order_id: IServiceOrder
  job_id: IJob
  facility_id: IFacility
  quickbooks_id: string
  profile_id: string
  note: string
  createdAt: Date
  updatedAt: Date
  transaction_id: string
}

export interface EmployeeShift {
  temp_id: string
  shifts_days?: Date[]
  total_worked_hours: number
  estimated_total_per_hour: number
  regular_hours: number
  overtime_hours: number
  description: string
  role: string
  activity: string
  pay_rate: number
  amount: number
}
