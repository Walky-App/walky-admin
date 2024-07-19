export interface IPaymentInfo {
  _id: string
  type: 'CC' | 'ACH'
  address: string
  city: string
  state: string
  country: string
  zip_code: string
  payment_status: 'Active' | 'Inactive' | 'Expired'
  method: 'CC' | 'ACH'
  ach_bank_name?: string //check
  holder_name?: string
  ach_account_name?: string //check
  ach_account_number?: string //check
  ach_routing_number?: string //check
  card_number?: string
  card_name?: string
  expiration_date?: string
  createdAt: string
  updatedAt: string
  __v: number
}

export interface IPaymentMethod {
  payment_info: IPaymentInfo
  facilities: string[]
  payment_method: 'CC' | 'ACH'
  is_default: boolean
}

export interface ICompanySlim {
  company_name: string
  company_tax_id: string
  company_dbas: string[]
}

export interface ICompany {
  _id?: string
  company_name: string
  company_dbas?: string[]
  company_tax_id?: string
  company_phone_number: string
  payment_information?: IPaymentMethod[]
  company_country: string
  company_address: string
  company_city: string
  company_state: string
  company_zip: string
  facilities: string[]
  users: string[]
  createdAt?: string
  updatedAt?: string
  company_location_pin: number[]
}
