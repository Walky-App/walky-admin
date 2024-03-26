import { createContext, type Dispatch, Fragment, type SetStateAction, useState, useEffect } from 'react'

import { type FieldErrors } from 'react-hook-form'

import { type MenuItem } from 'primereact/menuitem'
import { Steps } from 'primereact/steps'
import { type TooltipOptions } from 'primereact/tooltip/tooltipoptions'

import { type IAddressAutoComplete } from '../../../components/shared/forms/AddressAutoComplete'
import { HeaderComponent } from '../../../components/shared/general/HeaderComponent'
import { type IUserDocument, type IUser } from '../../../interfaces/user'
import { RequestService } from '../../../services/RequestService'
import { GetTokenInfo } from '../../../utils/TokenUtils'
import { EmployeeStep1, EmployeeStep2, EmployeeWelcomeDialog } from './components'

const defaultUserValues: IUserFormInputs = {
  _id: '',
  first_name: '',
  last_name: '',
  middle_name: '',
  gender: '',
  phone_number: '',
  email: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  country: '',
  documents: [],
}

export interface IUserFormInputs {
  _id: string
  first_name: string
  last_name: string
  middle_name: string
  gender: string
  phone_number: string
  email: string
  address: string
  city: string
  state: string
  zip: string
  country: string
  documents: IUserDocument[]
}

export interface FormDataContextProps {
  defaultValues: IUserFormInputs
  formData: IUserFormInputs
  setFormData: Dispatch<SetStateAction<IUserFormInputs>>
  currentUser: IUser | undefined
  setCurrentUser: Dispatch<SetStateAction<IUser | undefined>>
  moreAddressDetails: IAddressAutoComplete | undefined
  setMoreAddressDetails: Dispatch<SetStateAction<IAddressAutoComplete | undefined>>
}

// Initialize the context with the defined shape and default value
export const FormDataContext = createContext<FormDataContextProps>({
  defaultValues: defaultUserValues,
  formData: defaultUserValues,
  setFormData: () => {
    throw new Error('setFormData function must be overridden in FormDataContext')
  },
  currentUser: undefined,
  setCurrentUser: () => {
    throw new Error('setCurrentUser function must be overridden in FormDataContext')
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

export const EmployeeOnboarding = () => {
  const [visible, setVisible] = useState<boolean>(true)
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [formData, setFormData] = useState<IUserFormInputs>({
    ...defaultUserValues,
  })
  const [currentUser, setCurrentUser] = useState<IUser | undefined>(undefined)
  const [moreAddressDetails, setMoreAddressDetails] = useState<IAddressAutoComplete | undefined>(
    defaultMoreAddressDetails,
  )

  const steps: MenuItem[] = [
    {
      label: 'Employee Information',
    },
    {
      label: 'Documents and Certificates',
    },
    {
      label: 'Locations',
    },
    {
      label: 'Payment Information',
    },
    {
      label: 'Terms and Conditions',
    },
  ]

  const onboardingSteps = [
    <Fragment key="step1">
      <EmployeeWelcomeDialog visible={visible} setVisible={setVisible} />
      <EmployeeStep1 step={activeIndex} setStep={setActiveIndex} />
    </Fragment>,
    <EmployeeStep2 key="step2" step={activeIndex} setStep={setActiveIndex} />,
    // <Step3 key="step3" step={activeIndex} setStep={setActiveIndex} />,
    // <Step4 key="step4" step={activeIndex} setStep={setActiveIndex} />,
    // <Step5 key="step5" step={activeIndex} setStep={setActiveIndex} />,
  ]

  useEffect(() => {
    const getUser = async () => {
      const { _id } = GetTokenInfo()
      try {
        const response = await RequestService(`users/${_id}`)
        setCurrentUser(response)
        setFormData(prevFormData => ({
          ...prevFormData,
          _id: response._id,
          first_name: response.first_name,
          last_name: response.last_name,
          middle_name: response.middle_name,
          gender: response.gender,
          email: response.email,
          phone_number: response.phone_number,
          address: response.address,
          documents: response.documents,
        }))
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    getUser()
  }, [])

  return (
    <FormDataContext.Provider
      value={{
        formData,
        setFormData,
        defaultValues: defaultUserValues,
        currentUser,
        setCurrentUser,
        moreAddressDetails,
        setMoreAddressDetails,
      }}>
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
