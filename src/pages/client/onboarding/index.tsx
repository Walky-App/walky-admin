import React, { Dispatch, SetStateAction, useRef, useState } from 'react'
import { FieldErrors } from 'react-hook-form'
import { MenuItem } from 'primereact/menuitem'
import { Steps } from 'primereact/steps'
import { Toast } from 'primereact/toast'
import { TooltipOptions } from 'primereact/tooltip/tooltipoptions'

import HeaderComponent from '../../../components/shared/general/HeaderComponent'
import { GetTokenInfo } from '../../../utils/TokenUtils'
import { Step1 } from './Step1'
import { Step2 } from './Step2'
import { Step3 } from './Step3'
import { Step4 } from './Step4'
import { Step5 } from './Step5'
import WelcomeDialog from './WelcomeDialog'

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
  contacts: [
    {
      first_name: '',
      last_name: '',
      role: '',
      phone_number: '',
      email: '',
    },
  ],
}

export interface ILicenseDocument {
  id: number
  url: string
  key: string
  timestamp: string
  // createdBy: string
}

export interface IContact {
  first_name: string
  last_name: string
  role: string
  phone_number: string
  email: string
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
  contacts: IContact[]
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
  setFormData: () => {},
  facilitiesArray: [],
  setFacilitiesArray: () => {},
  selectedFacility: defaultFacilityFormValues,
  setSelectedFacility: () => {},
})

export interface StepProps {
  step: number
  setStep: (step: number) => void
}

export function getFormErrorMessage<TFormInputs extends Record<string, any>>(
  path: string,
  errors: FieldErrors<TFormInputs> = {},
) {
  const pathParts = path.split('.')
  let error: FieldErrors<TFormInputs> | undefined = errors

  for (const part of pathParts) {
    if (typeof error !== 'object' || error === null) {
      return null
    }
    error = error[part as keyof typeof error] as FieldErrors<TFormInputs>
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

  const toast = useRef(null)

  const steps: MenuItem[] = [
    {
      label: 'Business Information',
      command: event => {
        // @ts-ignore
        toast.current?.show({ severity: 'info', summary: 'First Step', detail: event.item.label })
      },
    },
    {
      label: 'Licenses',
      command: event => {
        // @ts-ignore
        toast.current?.show({ severity: 'info', summary: 'Second Step', detail: event.item.label })
      },
    },
    {
      label: 'Locations',
      command: event => {
        // @ts-ignore
        toast.current?.show({ severity: 'info', summary: 'Third Step', detail: event.item.label })
      },
    },
    {
      label: 'Payment Information',
      command: event => {
        // @ts-ignore
        toast.current?.show({ severity: 'info', summary: 'Fourth Step', detail: event.item.label })
      },
    },
    {
      label: 'Terms and Conditions',
      command: event => {
        // @ts-ignore
        toast.current?.show({ severity: 'info', summary: 'Fifth Step', detail: event.item.label })
      },
    },
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
      <div>
        <Toast ref={toast}></Toast>
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
        <div className="mt-10">
          {activeIndex === 0 && <WelcomeDialog visible={visible} setVisible={setVisible} />}
          {activeIndex === 0 && <Step1 step={activeIndex} setStep={setActiveIndex} />}
          {activeIndex === 1 && <Step2 step={activeIndex} setStep={setActiveIndex} />}
          {activeIndex === 2 && <Step3 step={activeIndex} setStep={setActiveIndex} />}
          {activeIndex === 3 && <Step4 step={activeIndex} setStep={setActiveIndex} />}
          {activeIndex === 4 && <Step5 step={activeIndex} setStep={setActiveIndex} />}
        </div>
      </div>
    </FormDataContext.Provider>
  )
}
