import { type Dispatch, type SetStateAction, createContext } from 'react'

import { type MenuItem } from 'primereact/menuitem'

import { type IAddressAutoComplete } from '../../../components/shared/forms/AddressAutoComplete'
import { type IUser } from '../../../interfaces/User'

export const defaultUserValues: IUser = {
  _id: '',
  first_name: '',
  last_name: '',
  middle_name: '',
  preferred_name: '',
  phone_number: '',
  email: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  country: '',
  avatar: '',
  documents: [],
  onboarding: {
    step_number: 1,
    description: '',
    type: '',
    completed: false,
  },
  job_preferences: [],
  notifications: [],
  access_token: '',
  active: false,
  createdAt: '',
  role: '',
  verified: false,
  is_approved: false,
}

export interface FormDataContextProps {
  defaultValues: IUser
  formData: IUser
  setFormData: Dispatch<SetStateAction<IUser>>
  moreAddressDetails: IAddressAutoComplete | undefined
  setMoreAddressDetails: Dispatch<SetStateAction<IAddressAutoComplete | undefined>>
}

export const FormDataContext = createContext<FormDataContextProps>({
  defaultValues: defaultUserValues,
  formData: defaultUserValues,
  setFormData: () => {
    throw new Error('setFormData function must be overridden in FormDataContext')
  },
  moreAddressDetails: undefined,
  setMoreAddressDetails: () => {
    throw new Error('setMoreAddressDetails function must be overridden in FormDataContext')
  },
})

export interface StepProps {
  step: number
  setStep: (step: number) => void
}

export const defaultMoreAddressDetails: IAddressAutoComplete = {
  zip: undefined,
  state: undefined,
  city: undefined,
  location_pin: undefined,
  address: undefined,
  country: undefined,
}

export const steps: MenuItem[] = [
  {
    label: 'Profile Information',
  },
  {
    label: 'Job Preferences',
  },
  {
    label: 'Upload Credentials',
  },
]
