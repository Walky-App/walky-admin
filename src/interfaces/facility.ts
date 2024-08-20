export interface IFacilityImage {
  url: string
  key: string
  timestamp: string
  _id: string
}

export interface IFacilityFile {
  _id?: string
  url: string
  key: string
  timestamp: Date
  uploaded_by?: string
  FileList?: string[]
}

export interface IFacilityContact {
  email: string
  first_name: string
  last_name: string
  role: string
  phone_number: string
}

interface IDnr {
  _id: string
  user_id: string
  reason: string
}
export interface IFacility {
  _id?: string
  createdAt?: string
  company_id: string | null
  name: string
  tax_id?: string
  license_number?: string
  phone_number: string
  timezone: string
  contacts: IFacilityContact[]
  country: string
  address: string
  zip: string
  city: string
  state: string
  active: boolean
  isApproved: boolean
  sqft?: number
  services: string[]
  location_pin: number[]
  facility_dbas?: string[]
  jobs?: string[]
  location_polygon?: [number, number][]
  contract_url?: string[]
  images?: IFacilityFile[]
  licenses?: IFacilityFile[]
  main_image?: string
  logo_url?: string
  contracts?: string[]
  onsite_map?: string
  entrance_pin?: number[]
  notes?: string
  internal_notes?: string[]
  feedback?: [
    {
      user_id: {
        _id: string
        first_name: string
        last_name: string
        email: string
      }
      rating: number
      comment: string
    },
  ]
  score_rating?: number
  dnr?: IDnr[]
  label?: string
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
