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
  bank_name?: string
  holder_name?: string
  account_number?: string
  routing_number?: string
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
}

export interface ICompany {
  _id?: string
  company_name: string
  company_dbas: string[] | undefined
  company_tax_id: string
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
