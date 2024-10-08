import { type ICompany } from './company'
import { type IFacility } from './facility'
import { type IJob } from './job'
import { type IServiceInvoice } from './serviceInvoice'
import { type StatesSettingsDocument } from './setting'

interface IDetails {
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
  our_fee_total: number
  processing_fee_total: number
  estimated_total_per_hour: number
  state_settings_history: StatesSettingsDocument
  total_cost: number
}

export interface IPaymentMethod {
  _id: string
  card_name: string
  card_number: string
  is_default: boolean
}

export interface IServiceOrder {
  details: IDetails
  _id: string
  uid: string
  status: string
  created_by: string
  company_id: ICompany
  job_id: IJob
  facility_id: IFacility
  service_invoice_id: IServiceInvoice
  profile_id: string
  createdAt: Date
  updatedAt: Date
  transaction_id: string
  ach_authorized: boolean
}
