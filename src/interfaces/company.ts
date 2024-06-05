export interface IPaymentMethod {
  method: 'CC' | 'ACH'
  card_number?: string
  expiration_date?: string
  ccv?: string
  bank_name?: string
  holder_name?: string
  account_number?: string
  routing_number?: string
  address?: string
  city?: string
  state?: string
  country?: string
  zip_code?: string
  payment_status?: 'Active' | 'Inactive' | 'Expired'
}

export interface ICompany {
  _id: string
  company_name: string
  company_dbas?: string[]
  company_tax_id: string
  company_phone_number: string
  payment_information: IPaymentMethod[]
  company_country: string
  company_address: string
  company_city: string
  company_state: string
  company_zip: string
  facilities: string[]
  users: string[]
  createdAt: string
  updatedAt: string
}
