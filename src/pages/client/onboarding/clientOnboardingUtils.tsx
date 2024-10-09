import { type Dispatch, type SetStateAction, createContext, useState, useCallback } from 'react'

import { type TooltipOptions } from 'primereact/tooltip/tooltipoptions'

import { type IAddressAutoComplete } from '../../../components/shared/forms/AddressAutoComplete'
import { type IUser } from '../../../interfaces/User'
import { type ICompany } from '../../../interfaces/company'
import { type IFacility } from '../../../interfaces/facility'
import { type ITokenInfo } from '../../../interfaces/services'
import { requestService } from '../../../services/requestServiceNew'
import { useUtils } from '../../../store/useUtils'
import { GetTokenInfo, SetToken } from '../../../utils/tokenUtil'

export interface IClientOnboardingFormInputs extends ICompany, IFacility {
  user_id: string
}

export const defaultCompanyFormValues: ICompany = {
  company_name: '',
  company_dbas: [],
  company_tax_id: undefined,
  company_phone_number: '',
  company_address: '',
  company_city: '',
  company_state: '',
  company_zip: '',
  company_country: '',
  facilities: [],
  users: [],
  company_location_pin: [],
}

export const defaultFacilityFormValues: IFacility = {
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
  company_id: '',
  isApproved: false,
  timezone: '',
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
  contract_url: [],
}

export const defaultClientOnboardingFormValues: IClientOnboardingFormInputs = {
  ...defaultCompanyFormValues,
  ...defaultFacilityFormValues,
  user_id: '',
}

export const createCompanyFormData = (companyData: ICompany): ICompany => {
  const {
    company_name,
    company_tax_id,
    company_dbas,
    company_phone_number,
    company_address,
    company_city,
    company_state,
    company_zip,
    company_country,
    facilities,
    users,
    _id,
    company_location_pin,
  } = companyData

  return {
    company_name,
    company_tax_id,
    company_dbas,
    company_phone_number,
    company_address,
    company_city,
    company_state,
    company_zip,
    company_country,
    facilities,
    users,
    _id,
    company_location_pin,
  }
}

export const createFacilityFormData = (facilityData: IFacility): IFacility => {
  const {
    company_id,
    name,
    tax_id,
    phone_number,
    sqft,
    address,
    city,
    state,
    zip,
    country,
    notes,
    services,
    active,
    images,
    location_pin,
    contacts,
    licenses,
    _id,
    timezone,
    isApproved,
    contract_url,
  } = facilityData

  return {
    company_id,
    name,
    tax_id,
    phone_number,
    sqft,
    address,
    city,
    state,
    zip,
    country,
    notes,
    services,
    active,
    images,
    location_pin,
    contacts,
    licenses,
    _id,
    timezone,
    isApproved,
    contract_url,
  }
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
  company: string
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
  userId: string
  defaultValues: IClientOnboardingFormInputs
  formData: IClientOnboardingFormInputs
  setFormData: Dispatch<SetStateAction<IClientOnboardingFormInputs>>
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
  userId: '',
  defaultValues: defaultClientOnboardingFormValues,
  formData: defaultClientOnboardingFormValues,
  setFormData: () => {
    throw new Error('setFormData function must be overridden in FormDataContext')
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

export interface IOnboardingUpdateInfo {
  step_number: number
  description: string
  type: string
  completed: boolean
}

export const useUpdateOnboardingStatus = () => {
  const [isLoading, setIsLoading] = useState(false)

  const { showToast } = useUtils()

  const updateOnboardingStatus = useCallback(async () => {
    setIsLoading(true)
    const userToken = GetTokenInfo()
    const userId = userToken?._id

    if (userId != null) {
      try {
        const response = await requestService({ path: `users/${userId}` })

        if (!response.ok) {
          throw new Error('User not found')
        }

        const userFound: IUser = await response.json()

        const updatedUserObject: IUser = {
          ...userFound,
        }

        const updateResponse = await requestService({
          path: `users/${userId}`,
          method: 'PATCH',
          body: JSON.stringify(updatedUserObject),
        })

        if (!updateResponse.ok) {
          throw new Error('Failed to update user')
        }

        const updatedUserData: ITokenInfo = {
          ...userToken,
        }
        SetToken(updatedUserData)
        return true
      } catch (error) {
        console.error('Error updating user:', error)
        showToast({
          severity: 'error',
          summary: 'Error saving changes',
          detail: `Information could not be updated.`,
          life: 2000,
        })
        return false
      } finally {
        setIsLoading(false)
      }
    }
  }, [showToast])

  return { updateOnboardingStatus, isLoading }
}
