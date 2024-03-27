import { createContext, type Dispatch, Fragment, type SetStateAction, useRef, useState } from 'react'

import { type FieldErrors } from 'react-hook-form'

import { type MenuItem } from 'primereact/menuitem'
import { Steps } from 'primereact/steps'
import { Toast } from 'primereact/toast'
import { type TooltipOptions } from 'primereact/tooltip/tooltipoptions'

import { type IAddressAutoComplete } from '../../../components/shared/forms/AddressAutoComplete'
import { HeaderComponent } from '../../../components/shared/general/HeaderComponent'
import { GetTokenInfo } from '../../../utils/TokenUtils'
import { Step1, Step2, Step3, Step4, Step5, WelcomeDialog } from './components'

const defaultFacilityFormValues: IFacilityFormInputs = {
  user_id: '',
  name: '',
  country: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  location_pin: [],
  tax_id: '',
  phone_number: '',
  notes: '',
  active: false,
  sqft: undefined,
  corp_name: '',
  company_dbas: [],
  services: [],
  images: [],
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

export interface IFacilityFormInputs {
  user_id: string
  name: string
  country: string
  address: string
  city: string
  state: string
  zip: string
  tax_id: string
  location_pin: number[]
  phone_number: string
  notes: string
  active: boolean
  sqft: number | undefined
  corp_name: string
  company_dbas: string[]
  services: string[]
  images: IImage[]
  contacts: IContact[]
  licenses: ILicenseDocument[]
  _id?: string
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
  defaultValues: IFacilityFormInputs
  formData: IFacilityFormInputs
  setFormData: Dispatch<SetStateAction<IFacilityFormInputs>>
  facilitiesArray: IFacilityFormInputs[]
  setFacilitiesArray: Dispatch<SetStateAction<IFacilityFormInputs[]>>
  selectedFacility: IFacilityFormInputs | undefined
  setSelectedFacility: Dispatch<SetStateAction<IFacilityFormInputs | undefined>>
  documentData: IGetAcceptDocumentDetails | null
  setDocumentData: Dispatch<SetStateAction<IGetAcceptDocumentDetails | null>>
  prevDocRecipient: IGetAcceptRecipient | null
  setPrevDocRecipient: Dispatch<SetStateAction<IGetAcceptRecipient | null>>
  moreAddressDetails: IAddressAutoComplete | undefined
  setMoreAddressDetails: Dispatch<SetStateAction<IAddressAutoComplete | undefined>>
}

export const FormDataContext = createContext<FormDataContextProps>({
  defaultValues: defaultFacilityFormValues,
  formData: defaultFacilityFormValues,
  setFormData: () => {
    throw new Error('setFormData function must be overridden in FormDataContext')
  },
  facilitiesArray: [],
  setFacilitiesArray: () => {
    throw new Error('setFacilitiesArray function must be overridden in FormDataContext')
  },
  selectedFacility: defaultFacilityFormValues,
  setSelectedFacility: () => {
    throw new Error('setSelectedFacility function must be overridden in FormDataContext')
  },
  documentData: null,
  setDocumentData: () => {
    throw new Error('setDocumentId function must be overridden in FormDataContext')
  },
  prevDocRecipient: null,
  setPrevDocRecipient: () => {
    throw new Error('setPrevDocRecipient function must be overridden in FormDataContext')
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

export function getFormErrorMessage(path: string, errors: FieldErrors) {
  const pathParts = path.split('.')
  let error: FieldErrors = errors

  for (const part of pathParts) {
    if (typeof error !== 'object' || error === null) {
      return null
    }
    error = error[part as keyof typeof error] as FieldErrors
  }

  if (error?.message) {
    return <p className="mt-2 text-sm text-red-600">{String(error.message)}</p>
  }

  return null
}

export const tooltipOptions: TooltipOptions = {
  position: 'top',
  showDelay: 300,
  hideDelay: 500,
  pt: {
    text: {
      className: 'bg-green-500 max-w-lg text-sm',
    },
  },
}

const defaultMoreAddressDetails: IAddressAutoComplete = {
  zip: undefined,
  state: undefined,
  city: undefined,
  location_pin: undefined,
  address: undefined,
  country: undefined,
}

export const ClientOnboarding = () => {
  const user = GetTokenInfo()
  const [visible, setVisible] = useState<boolean>(true)
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [formData, setFormData] = useState<IFacilityFormInputs>({
    ...defaultFacilityFormValues,
    user_id: user?._id || '',
  })
  const [moreAddressDetails, setMoreAddressDetails] = useState<IAddressAutoComplete | undefined>(
    defaultMoreAddressDetails,
  )
  const [selectedFacility, setSelectedFacility] = useState<IFacilityFormInputs | undefined>()
  const [facilitiesArray, setFacilitiesArray] = useState<IFacilityFormInputs[]>([])
  const [documentData, setDocumentData] = useState<IGetAcceptDocumentDetails | null>(null)
  const [prevDocRecipient, setPrevDocRecipient] = useState<IGetAcceptRecipient | null>(null)

  const toast = useRef(null)

  const steps: MenuItem[] = [
    {
      label: 'Business Information',
      command: event => {
        // @ts-expect-error toast.current may be null
        toast.current?.show({ severity: 'info', summary: 'First Step', detail: event.item.label })
      },
    },
    {
      label: 'Documents and Images',
      command: event => {
        // @ts-expect-error toast.current may be null
        toast.current?.show({ severity: 'info', summary: 'Second Step', detail: event.item.label })
      },
    },
    {
      label: 'Locations',
      command: event => {
        // @ts-expect-error toast.current may be null
        toast.current?.show({ severity: 'info', summary: 'Third Step', detail: event.item.label })
      },
    },
    {
      label: 'Payment Information',
      command: event => {
        // @ts-expect-error toast.current may be null
        toast.current?.show({ severity: 'info', summary: 'Fourth Step', detail: event.item.label })
      },
    },
    {
      label: 'Terms and Conditions',
      command: event => {
        // @ts-expect-error toast.current may be null
        toast.current?.show({ severity: 'info', summary: 'Fifth Step', detail: event.item.label })
      },
    },
  ]

  const onboardingSteps = [
    <Fragment key="step1">
      <WelcomeDialog visible={visible} setVisible={setVisible} />
      <Step1 step={activeIndex} setStep={setActiveIndex} />
    </Fragment>,
    <Step2 key="step2" step={activeIndex} setStep={setActiveIndex} />,
    <Step3 key="step3" step={activeIndex} setStep={setActiveIndex} />,
    <Step4 key="step4" step={activeIndex} setStep={setActiveIndex} />,
    <Step5 key="step5" step={activeIndex} setStep={setActiveIndex} />,
  ]

  return (
    <FormDataContext.Provider
      value={{
        formData,
        setFormData,
        defaultValues: defaultFacilityFormValues,
        facilitiesArray,
        setFacilitiesArray,
        selectedFacility,
        setSelectedFacility,
        documentData,
        setDocumentData,
        prevDocRecipient,
        setPrevDocRecipient,
        moreAddressDetails,
        setMoreAddressDetails,
      }}>
      <Toast ref={toast} />
      <HeaderComponent title="Client Onboarding" />
      <Steps
        model={steps}
        activeIndex={activeIndex}
        onSelect={e => setActiveIndex(e.index)}
        readOnly={true}
        pt={{
          label: { className: 'hidden xl:inline' },
          menuitem: { className: 'before:top-full before:sm:top-1/2' },
        }}
      />
      <div className="mt-10">{onboardingSteps[activeIndex]}</div>
    </FormDataContext.Provider>
  )
}
