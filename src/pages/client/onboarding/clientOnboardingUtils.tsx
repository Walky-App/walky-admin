import { type Dispatch, type SetStateAction, createContext } from 'react'

import { type TooltipOptions } from 'primereact/tooltip/tooltipoptions'

import { type IAddressAutoComplete } from '../../../components/shared/forms/AddressAutoComplete'

export interface ILicenseDocument {
  id: number
  url: string
  key: string
  timestamp: string
}

export interface IContact {
  first_name: string
  last_name: string
  role: string
  phone_number: string
  email: string
}

export interface IImage {
  id: number
  url: string
  key: string
  timestamp: string
}

export interface ICompanyOnboardingFormInputs {
  company_name: string
  company_dbas: string[]
  company_tax_id: string
  company_phone_number: string
  company_address: string
  company_city: string
  company_state: string
  company_zip: string
  company_country: string
  facilities: string[]
  users: string[]
  company_id?: string
}

export interface IFacilityOnboardingFormInputs {
  user_id: string
  name: string
  tax_id: string
  phone_number: string
  sqft: number | undefined
  address: string
  city: string
  state: string
  zip: string
  country: string
  notes: string
  services: string[]
  active: boolean
  images: IImage[]
  location_pin: number[]
  contacts: IContact[]
  licenses: ILicenseDocument[]
  _id?: string
}

export interface IClientOnboardingFormInputs extends ICompanyOnboardingFormInputs, IFacilityOnboardingFormInputs {}

export const defaultCompanyFormValues: ICompanyOnboardingFormInputs = {
  company_name: '',
  company_dbas: [],
  company_tax_id: '',
  company_phone_number: '',
  company_address: '',
  company_city: '',
  company_state: '',
  company_zip: '',
  company_country: '',
  facilities: [],
  users: [],
}

export const defaultFacilityFormValues: IFacilityOnboardingFormInputs = {
  user_id: '',
  name: '',
  tax_id: '',
  phone_number: '',
  sqft: undefined,
  country: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  notes: '',
  services: [],
  active: false,
  images: [],
  location_pin: [],
  contacts: [
    {
      first_name: '',
      last_name: '',
      role: '',
      phone_number: '',
      email: '',
    },
  ],
  licenses: [],
}

export const defaultClientOnboardingFormValues: IClientOnboardingFormInputs = {
  ...defaultCompanyFormValues,
  ...defaultFacilityFormValues,
}

export interface IGetAcceptRecipient {
  email: string
  first_name: string
  last_name: string
  fullname?: string
  mobile?: string
  thumb_url?: string
  role?: string
  company_name?: string
  company_number?: string
  order_num?: string
}

export interface IGetAcceptDocumentDetails {
  id: string
  name: string
  external_id: string
  value: number
  type: string
  tags: string
  company_name: string
  company_id: string
  company_logo_url: string
  is_selfsign: boolean
  is_signing_biometric: boolean
  is_signing_initials: boolean
  is_private: boolean
  status: string
  send_date: string
  sign_date: string | null
  user_id: string
  email_send_template_id: string
  email_send_subject: string
  email_send_message: string
  is_signing: boolean
  is_signing_order: boolean
  is_video: boolean
  expiration_date: string
  is_scheduled_sending: boolean
  scheduled_sending_time: string
  is_reminder_sending: boolean
  video_id: number
  thumb_url: string
  preview_url: string
  recipients: IGetAcceptRecipient[]
}

export interface FormDataContextProps {
  defaultValues: IClientOnboardingFormInputs
  formData: IClientOnboardingFormInputs
  setFormData: Dispatch<SetStateAction<IClientOnboardingFormInputs>>
  facilitiesArray: IClientOnboardingFormInputs[]
  setFacilitiesArray: Dispatch<SetStateAction<IClientOnboardingFormInputs[]>>
  selectedFacility: IClientOnboardingFormInputs | undefined
  setSelectedFacility: Dispatch<SetStateAction<IClientOnboardingFormInputs | undefined>>
  documentData: IGetAcceptDocumentDetails | null
  setDocumentData: Dispatch<SetStateAction<IGetAcceptDocumentDetails | null>>
  documentUrl: string
  setDocumentUrl: Dispatch<SetStateAction<string>>
  documentLoading?: boolean
  setDocumentLoading?: Dispatch<SetStateAction<boolean>>
  prevDocRecipient: IGetAcceptRecipient | null
  setPrevDocRecipient: Dispatch<SetStateAction<IGetAcceptRecipient | null>>
  moreAddressDetailsCompany: IAddressAutoComplete | undefined
  setMoreAddressDetailsCompany: Dispatch<SetStateAction<IAddressAutoComplete | undefined>>
  moreAddressDetailsFacility: IAddressAutoComplete | undefined
  setMoreAddressDetailsFacility: Dispatch<SetStateAction<IAddressAutoComplete | undefined>>
}

export const FormDataContext = createContext<FormDataContextProps>({
  defaultValues: defaultClientOnboardingFormValues,
  formData: defaultClientOnboardingFormValues,
  setFormData: () => {
    throw new Error('setFormData function must be overridden in FormDataContext')
  },
  facilitiesArray: [],
  setFacilitiesArray: () => {
    throw new Error('setFacilitiesArray function must be overridden in FormDataContext')
  },
  selectedFacility: defaultClientOnboardingFormValues,
  setSelectedFacility: () => {
    throw new Error('setSelectedFacility function must be overridden in FormDataContext')
  },
  documentUrl: '',
  setDocumentUrl: () => {
    throw new Error('setDocumentUrl function must be overridden in FormDataContext')
  },
  documentData: null,
  setDocumentData: () => {
    throw new Error('setDocumentId function must be overridden in FormDataContext')
  },
  documentLoading: true,
  setDocumentLoading: () => {
    throw new Error('setDocumentLoading function must be overridden in FormDataContext')
  },
  prevDocRecipient: null,
  setPrevDocRecipient: () => {
    throw new Error('setPrevDocRecipient function must be overridden in FormDataContext')
  },
  moreAddressDetailsCompany: undefined,
  setMoreAddressDetailsCompany: () => {
    throw new Error('setMoreAddressDetails function must be overridden in FormDataContext')
  },
  moreAddressDetailsFacility: undefined,
  setMoreAddressDetailsFacility: () => {
    throw new Error('setMoreAddressDetails function must be overridden in FormDataContext')
  },
})

export interface StepProps {
  step: number
  setStep: (step: number) => void
}

export const tooltipOptions: TooltipOptions = {
  position: 'top',
  showDelay: 300,
  hideDelay: 500,
  pt: {
    text: {
      className: 'max-w-lg text-sm',
    },
  },
}

export const defaultMoreAddressDetails: IAddressAutoComplete = {
  zip: undefined,
  state: undefined,
  city: undefined,
  location_pin: undefined,
  address: undefined,
  country: undefined,
}
