import React, { useState, Dispatch, SetStateAction, useRef } from 'react'
import HeaderComponent from '../../../components/shared/general/HeaderComponent'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'
import Step4 from './Step4'
import WelcomeDialog from './WelcomeDialog'
import { Steps } from 'primereact/steps'
import { MenuItem } from 'primereact/menuitem'
import { Toast } from 'primereact/toast'

const defaultValues = {
  taxId: '',
  businessContactMobileNumber: '',
  businessContactFirstName: '',
  businessContactLastName: '',
  businessContactDesignation: '',
  businessName: '',
  facilityName: '',
  country: '',
  address: '',
  address2: '',
  city: '',
  state: '',
  postalCode: '',
  stateLicenseDocument: '',
  cityLicenseDocument: '',
}

export interface IFormInputs {
  taxId: string
  businessContactMobileNumber: string
  businessContactFirstName: string
  businessContactLastName: string
  businessContactDesignation: string
  businessName: string
  facilityName: string
  country: string
  address: string
  address2: string
  city: string
  state: string
  postalCode: string
  stateLicenseDocument: string
  cityLicenseDocument: string
}
export interface FormDataContextProps {
  defaultValues: IFormInputs
  formData: IFormInputs
  setFormData: Dispatch<SetStateAction<IFormInputs>>
  facilitiesArray: IFormInputs[]
  setFacilitiesArray: Dispatch<SetStateAction<IFormInputs[]>>
  selectedFacility: IFormInputs | undefined
  setSelectedFacility: Dispatch<SetStateAction<IFormInputs | undefined>>
}

// Initialize the context with the defined shape and default value
export const FormDataContext = React.createContext<FormDataContextProps>({
  defaultValues: defaultValues,
  formData: defaultValues,
  setFormData: () => {},
  facilitiesArray: [],
  setFacilitiesArray: () => {},
  selectedFacility: defaultValues,
  setSelectedFacility: () => {},
})

export interface StepProps {
  step: number
  setStep: (step: number) => void
}

export default function ClientOnboarding() {
  const [visible, setVisible] = useState<boolean>(true)
  const [activeIndex, setActiveIndex] = React.useState<number>(0)
  const [formData, setFormData] = useState<IFormInputs>(defaultValues)
  const [selectedFacility, setSelectedFacility] = useState<IFormInputs | undefined>()

  console.log('formData: ', formData)

  const [facilitiesArray, setFacilitiesArray] = useState<IFormInputs[]>([])

  console.log('facilitiesArray: ', facilitiesArray)

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
  ]

  return (
    <FormDataContext.Provider
      value={{
        formData,
        setFormData,
        defaultValues,
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
          {/* {activeIndex === 4 && <h1>Step 5</h1>} */}
        </div>
      </div>
    </FormDataContext.Provider>
  )
}
