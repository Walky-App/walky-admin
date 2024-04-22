/* eslint-disable filename-rules/match */
export interface IFacilityImage {
  url: string
  key: string
  timestamp: string
  _id: string
}

export interface IFacilityDNR {
  _id: string
  user_id: string
  reason: string
}
export interface IFacility {
  _id: string
  account_info: string[]
  active: boolean
  address: string
  city: string
  city_license: string
  company_dbas: string[]
  contacts: string[]
  contract_url: string[]
  contracts: string[]
  corp_name: string
  country: string
  createdAt: string
  entrance_image: string
  entrance_pin: number[]
  history: string[]
  images: IFacilityImage[]
  internal_notes: string[]
  invoices: string[]
  isApproved: boolean
  jobs: string[]
  location_pin: number[]
  location_polygon: [number, number][]
  logo_url: string
  main_image: string
  messages: string[]
  name: string
  notes: string
  onsite_map: string
  parking_details: string
  phone_number: string
  services: string[]
  sqft: number
  state: string
  state_license: string
  tax_id: string
  zip: string
  dnr: IFacilityDNR[]
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
