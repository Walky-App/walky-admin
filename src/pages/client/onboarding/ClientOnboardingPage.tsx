import { createContext, type Dispatch, Fragment, type SetStateAction, useState, useEffect } from 'react'

import { type MenuItem } from 'primereact/menuitem'
import { Steps } from 'primereact/steps'
import { type TooltipOptions } from 'primereact/tooltip/tooltipoptions'

import { type IAddressAutoComplete } from '../../../components/shared/forms/AddressAutoComplete'
import { HeaderComponent } from '../../../components/shared/general/HeaderComponent'
import { type IUser } from '../../../interfaces/User'
import { RequestService } from '../../../services/RequestService'
import { GetTokenInfo } from '../../../utils/tokenUtil'
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
  currentUser: IUser | undefined
  setCurrentUser: Dispatch<SetStateAction<IUser | undefined>>
  facilitiesArray: IFacilityFormInputs[]
  setFacilitiesArray: Dispatch<SetStateAction<IFacilityFormInputs[]>>
  selectedFacility: IFacilityFormInputs | undefined
  setSelectedFacility: Dispatch<SetStateAction<IFacilityFormInputs | undefined>>
  documentData: IGetAcceptDocumentDetails | null
  setDocumentData: Dispatch<SetStateAction<IGetAcceptDocumentDetails | null>>
  documentUrl: string
  setDocumentUrl: Dispatch<SetStateAction<string>>
  documentLoading?: boolean
  setDocumentLoading?: Dispatch<SetStateAction<boolean>>
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
  currentUser: undefined,
  setCurrentUser: () => {
    throw new Error('setCurrentUser function must be overridden in FormDataContext')
  },
  facilitiesArray: [],
  setFacilitiesArray: () => {
    throw new Error('setFacilitiesArray function must be overridden in FormDataContext')
  },
  selectedFacility: defaultFacilityFormValues,
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
  moreAddressDetails: undefined,
  setMoreAddressDetails: () => {
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
  const [currentUser, setCurrentUser] = useState<IUser | undefined>(undefined)
  const [formData, setFormData] = useState<IFacilityFormInputs>(defaultFacilityFormValues)
  const [visible, setVisible] = useState<boolean>(true)
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [selectedFacility, setSelectedFacility] = useState<IFacilityFormInputs | undefined>()
  const [facilitiesArray, setFacilitiesArray] = useState<IFacilityFormInputs[]>([])
  const [documentData, setDocumentData] = useState<IGetAcceptDocumentDetails | null>(null)
  const [documentUrl, setDocumentUrl] = useState('')
  const [documentLoading, setDocumentLoading] = useState(true)
  const [prevDocRecipient, setPrevDocRecipient] = useState<IGetAcceptRecipient | null>(null)
  const [moreAddressDetails, setMoreAddressDetails] = useState<IAddressAutoComplete | undefined>(
    defaultMoreAddressDetails,
  )

  useEffect(() => {
    const userId = GetTokenInfo()._id

    const getUserDetails = async () => {
      try {
        const response = await RequestService(`users/${userId}`)

        setCurrentUser(response)
        setFormData({
          ...defaultFacilityFormValues,
          user_id: response._id || '',
          address: response.address || '',
          contacts: [
            {
              first_name: response.first_name || '',
              last_name: response.last_name || '',
              role: '',
              phone_number: response.phone_number || '',
              email: response.email || '',
            },
          ],
        })
      } catch (error) {
        console.error(error)
      }
    }
    getUserDetails()
  }, [])

  useEffect(() => {
    if (activeIndex === 1 && facilitiesArray.length !== 0) {
      const docRecipient: IGetAcceptRecipient = {
        email: facilitiesArray[0]?.contacts[0].email,
        first_name: facilitiesArray[0]?.contacts[0].first_name,
        last_name: facilitiesArray[0]?.contacts[0].last_name,
        company_name: facilitiesArray[0]?.corp_name,
        company_number: facilitiesArray[0]?.phone_number,
        mobile: facilitiesArray[0]?.contacts[0].phone_number,
      }

      if (JSON.stringify(docRecipient) !== JSON.stringify(prevDocRecipient)) {
        setDocumentData(null)
        setDocumentUrl('')
        const sendDocumentFromTemplate = async () => {
          const body = {
            name: 'HempTemps Client Agreement',
            type: 'sales',
            template_id: 'ke36vcj367m3',
            email: docRecipient.email,
            first_name: docRecipient.first_name,
            last_name: docRecipient.last_name,
            company_name: docRecipient.company_name,
            company_number: docRecipient.company_number,
            mobile: docRecipient.mobile,
          }
          try {
            const response = await RequestService('getaccept', 'POST', body)
            if (response.errors) {
              throw response.errors
            } else {
              setDocumentData(response)
            }
          } catch (error) {
            console.error('Error sending document:', error)
          }
        }

        sendDocumentFromTemplate()

        setPrevDocRecipient(docRecipient)
      }
    }
  }, [activeIndex, facilitiesArray, prevDocRecipient, setDocumentData, setPrevDocRecipient])

  useEffect(() => {
    setDocumentLoading(true)
    if (activeIndex === 4 && documentData?.id) {
      const documentId = documentData?.id

      const getDocumentRecipients = async () => {
        try {
          if (!documentId) {
            setDocumentLoading(false)
            throw new Error('Document ID is missing')
          }

          let response = await RequestService(`getaccept/${documentId}/recipients`, 'GET')
          if (response.errors) {
            throw response.errors
          }

          while (!response.document_url) {
            await new Promise(resolve => setTimeout(resolve, 3000))

            response = await RequestService(`getaccept/${documentId}/recipients`, 'GET')
            if (response.errors) {
              throw response.errors
            }
          }

          setDocumentUrl(response.document_url)
          setDocumentLoading(false)
        } catch (error) {
          console.error('Error fetching document recipients:', error)
          setDocumentLoading(false)
        }
      }

      getDocumentRecipients()
    }
  }, [activeIndex, documentData, setDocumentUrl])

  const steps: MenuItem[] = [
    {
      label: 'Business Information',
    },
    {
      label: 'Documents and Images',
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
        currentUser,
        setCurrentUser,
        formData,
        setFormData,
        defaultValues: defaultFacilityFormValues,
        facilitiesArray,
        setFacilitiesArray,
        selectedFacility,
        setSelectedFacility,
        documentData,
        setDocumentData,
        documentUrl,
        setDocumentUrl,
        documentLoading,
        setDocumentLoading,
        prevDocRecipient,
        setPrevDocRecipient,
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
          label: { className: 'hidden xl:inline' },
          menuitem: { className: 'before:top-full before:sm:top-1/2' },
        }}
      />
      <div className="mt-4">{onboardingSteps[activeIndex]}</div>
    </FormDataContext.Provider>
  )
}
