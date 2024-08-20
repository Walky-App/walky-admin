import { type IFacility } from './facility'

export interface ICompanyDocument {
  id: number
  url: string
  key: string
  timestamp: string
}

export interface IPaymentInfo {
  _id?: string
  type?: 'CC' | 'ACH' | string
  address?: string
  city?: string
  state?: string
  country?: string
  zip_code?: string
  payment_status?: 'Active' | 'Inactive' | 'Expired'
  method?: string
  ach_bank_name?: string
  ach_account_name?: string
  ach_account_number?: string
  ach_routing_number?: string
  holder_name?: string
  card_number?: string
  card_name?: string
  expiration_date?: string
  created_by?: string
  createdAt?: string
  updatedAt?: string
}

export interface ICompanyPaymentMethod {
  facilities: string[]
  payment_info: IPaymentInfo
  payment_method: 'CC' | 'ACH' | string
  is_default: boolean
}

export interface ICompanySlim {
  company_name: string
  company_tax_id: string
  company_dbas: string[]
  _id?: string
}

export interface ICompany {
  _id?: string
  company_name: string
  company_dbas?: string[]
  company_tax_id?: string
  company_phone_number: string
  payment_information?: ICompanyPaymentMethod[]
  company_country: string
  company_address: string
  company_city: string
  company_state: string
  company_zip: string
  company_documents?: ICompanyDocument[]
  facilities: string[] | IFacility[]
  users: string[]
  createdAt?: string
  updatedAt?: string
  created_by?: string
  company_location_pin: number[]
  company_ach_requested?: boolean
}

export interface ICompanyWithFacilities extends ICompany {
  facilities: IFacility[]
}
