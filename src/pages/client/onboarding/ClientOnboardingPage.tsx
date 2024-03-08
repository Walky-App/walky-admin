import React, { Dispatch, SetStateAction, useRef, useState } from 'react'
import { FieldErrors } from 'react-hook-form'
import { MenuItem } from 'primereact/menuitem'
import { Steps } from 'primereact/steps'
import { Toast } from 'primereact/toast'
import { TooltipOptions } from 'primereact/tooltip/tooltipoptions'

import HeaderComponent from '../../../components/shared/general/HeaderComponent'
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

export interface FormDataContextProps {
  defaultValues: IFacilityFormInputs
  formData: IFacilityFormInputs
  setFormData: Dispatch<SetStateAction<IFacilityFormInputs>>
  facilitiesArray: IFacilityFormInputs[]
  setFacilitiesArray: Dispatch<SetStateAction<IFacilityFormInputs[]>>
  selectedFacility: IFacilityFormInputs | undefined
  setSelectedFacility: Dispatch<SetStateAction<IFacilityFormInputs | undefined>>
}

// Initialize the context with the defined shape and default value
export const FormDataContext = React.createContext<FormDataContextProps>({
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
    return error.message ? <p className="mt-2 text-sm text-red-600">{String(error.message)}</p> : null
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

export const ClientOnboarding = () => {
  const user = GetTokenInfo()
  const [visible, setVisible] = useState<boolean>(true)
  const [activeIndex, setActiveIndex] = React.useState<number>(0)
  const [formData, setFormData] = useState<IFacilityFormInputs>({
    ...defaultFacilityFormValues,
    user_id: user?._id || '',
  })

  const [selectedFacility, setSelectedFacility] = useState<IFacilityFormInputs | undefined>()

  const [facilitiesArray, setFacilitiesArray] = useState<IFacilityFormInputs[]>([])
  console.log('facilitiesArray: ', facilitiesArray)

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
      label: 'Licenses',
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
    <React.Fragment key="step1">
      <WelcomeDialog visible={visible} setVisible={setVisible} />
      <Step1 step={activeIndex} setStep={setActiveIndex} />
    </React.Fragment>,
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
      }}>
      <Toast ref={toast} />
      <HeaderComponent title="Client Onboarding" />
      <Steps
        model={steps}
        activeIndex={activeIndex}
        onSelect={e => setActiveIndex(e.index)}
        readOnly={true}
        pt={{
          label: { className: 'hidden sm:inline' },
          menuitem: { className: 'before:top-full before:sm:top-1/2' },
        }}
      />
      <div className="mt-10">{onboardingSteps[activeIndex]}</div>
    </FormDataContext.Provider>
  )
}
