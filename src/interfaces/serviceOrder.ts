import { type ICompany } from './company'
import { type IFacility } from './facility'
import { type IJob } from './job'

interface ICostHistory {
  hours: number
  pay_rate: number
  overtime: number
  shifts: number
  start_time: string
  end_time: string
  cost: number
  _id: string
}

interface IDetails {
  admin_cost: number
  our_fee: number
  processing_fee: number
  cost_history: ICostHistory[]
  total_cost: number
}

export interface IPaymentMethod {
  _id: string
  card_name: string
  card_number: string
}

export interface IServiceOrder {
  details: IDetails
  _id: string
  status: string
  created_by: string
  company_id: ICompany
  job_id: IJob
  facility_id: IFacility
  profile_id: string
  createdAt: string
  updatedAt: string
  __v: number
}
