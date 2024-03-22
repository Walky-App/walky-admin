/* eslint-disable filename-rules/match */
export interface IFacility {
  images: boolean
  _id: string
  corp_name: string
  name: string
  tax_id: string
  phone_number: string
  company_dbas: string[]
  isApproved: boolean
  contacts: string[]
  country: string
  address: string
  zip: string
  city: string
  state: string
  city_license: string
  state_license: string
  active: boolean
  sqft: number
  services: string[]
  jobs: string[]
  location_pin: number[]
  location_polygon: [number, number][]
  contract_url: string[]
  entrance_image: string
  main_image: string
  logo_url: string
  contracts: string[]
  onsite_map: string
  entrance_pin: number[]
  parking_details: string
  notes: string
  internal_notes: string[]
  messages: string[]
  history: string[]
  account_info: string[]
  invoices: string[]
}

export interface IAddressDetails {
  address_components: {
    long_name: string
    short_name: string
    types: string[]
  }[]
  formatted_address: string
  geometry: {
    location: {
      lat: number
      lng: number
    }
    viewport: {
      northeast: {
        lat: number
        lng: number
      }
      southwest: {
        lat: number
        lng: number
      }
    }
  }
  name: string
  place_id: string
}

export interface IAddress {
  description: string
  id: string

  matched_substrings: unknown[]
  place_id: string
  reference: string
  structured_formatting: {
    main_text: string
    main_text_matched_substrings: unknown[]
    secondary_text: string
  }
  terms: unknown[]
  types: string[]
  unformatted_address: string
}
