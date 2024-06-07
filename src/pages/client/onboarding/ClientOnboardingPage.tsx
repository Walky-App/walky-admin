import { Fragment, useState, useEffect } from 'react'

import { useNavigate } from 'react-router-dom'

import { type MenuItem } from 'primereact/menuitem'
import { Steps } from 'primereact/steps'

import { type IAddressAutoComplete } from '../../../components/shared/forms/AddressAutoComplete'
import { HeadingComponent } from '../../../components/shared/general/HeadingComponent'
import { RequestService } from '../../../services/RequestService'
import { requestService } from '../../../services/requestServiceNew'
import { GetTokenInfo } from '../../../utils/tokenUtil'
import {
  type IClientOnboardingFormInputs,
  defaultClientOnboardingFormValues,
  type IGetAcceptDocumentDetails,
  type IGetAcceptRecipient,
  defaultMoreAddressDetails,
  FormDataContext,
} from './clientOnboardingUtils'
import { WelcomeDialog } from './components'
import { AdditionalLocationsForm } from './forms/AdditionalLocationsForm'
import { CompanyInformationForm } from './forms/CompanyInformationForm'
import { DocumentsAndImagesUploadForm } from './forms/DocumentsAndImagesUploadForm'
import { FacilityInformationForm } from './forms/FacilityInformationForm'
import { PaymentInformationForm } from './forms/PaymentInformationForm'
import { SignGetAcceptForm } from './forms/SignGetAcceptForm'

export const clientOnboardingSteps: MenuItem[] = [
  {
    label: 'Company Information',
  },
  {
    label: 'Facility Information',
  },
  {
    label: 'Documents and Images',
  },
  {
    label: 'Locations',
  },
  {
    label: 'Terms and Conditions',
  },
]

export const ClientOnboarding = () => {
  const [formData, setFormData] = useState<IClientOnboardingFormInputs>(defaultClientOnboardingFormValues)
  const [visible, setVisible] = useState<boolean>(true)
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [selectedFacility, setSelectedFacility] = useState<IClientOnboardingFormInputs | undefined>()
  const [facilitiesArray, setFacilitiesArray] = useState<IClientOnboardingFormInputs[]>([])
  const [documentData, setDocumentData] = useState<IGetAcceptDocumentDetails | null>(null)
  const [documentUrl, setDocumentUrl] = useState('')
  const [documentLoading, setDocumentLoading] = useState(true)
  const [prevDocRecipient, setPrevDocRecipient] = useState<IGetAcceptRecipient | null>(null)
  const [moreAddressDetailsCompany, setMoreAddressDetailsCompany] = useState<IAddressAutoComplete | undefined>(
    defaultMoreAddressDetails,
  )
  const [moreAddressDetailsFacility, setMoreAddressDetailsFacility] = useState<IAddressAutoComplete | undefined>(
    defaultMoreAddressDetails,
  )

  const navigate = useNavigate()
  const userToken = GetTokenInfo()

  useEffect(() => {
    if (userToken?.onboarding?.completed ?? false) {
      navigate('/client/dashboard')
    }
  }, [userToken?.onboarding?.completed, navigate])

  useEffect(() => {
    const userId = GetTokenInfo()._id

    const getUserDetails = async () => {
      try {
        const response = await requestService({ path: `users/${userId}` })
        if (!response.ok) throw new Error('Error fetching user details')
        const userData = await response.json()

        setFormData({
          ...defaultClientOnboardingFormValues,
          user_id: userData._id ?? '',
          address: userData.address ?? '',
          contacts: [
            {
              first_name: userData.first_name ?? '',
              last_name: userData.last_name ?? '',
              role: '',
              phone_number: userData.phone_number ?? '',
              email: userData.email ?? '',
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
        company_name: facilitiesArray[0]?.company_name,
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
            template_id: 'ke36vc68zqyw',
            email: docRecipient.email,
            first_name: docRecipient.first_name,
            last_name: docRecipient.last_name,
            company_name: docRecipient.company_name,
            company_number: docRecipient.company_number,
            mobile: docRecipient.mobile,
          }
          try {
            const response = await RequestService('getaccept', 'POST', body)
            if (response.errors != null) {
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
    if (activeIndex === 4 && documentData?.id != null) {
      const documentId = documentData?.id

      const getDocumentRecipients = async () => {
        try {
          if (!documentId) {
            setDocumentLoading(false)
            throw new Error('Document ID is missing')
          }

          let response = await RequestService(`getaccept/${documentId}/recipients`, 'GET')
          if (response.errors != null) {
            throw response.errors
          }

          while (!response.document_url) {
            await new Promise(resolve => setTimeout(resolve, 3000))

            response = await RequestService(`getaccept/${documentId}/recipients`, 'GET')
            if (response.errors != null) {
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

  const onboardingSteps = [
    <Fragment key="step1">
      <WelcomeDialog visible={visible} setVisible={setVisible} />
      <CompanyInformationForm step={activeIndex} setStep={setActiveIndex} />
    </Fragment>,
    <FacilityInformationForm key="step2" step={activeIndex} setStep={setActiveIndex} />,
    <DocumentsAndImagesUploadForm key="step3" step={activeIndex} setStep={setActiveIndex} />,
    <AdditionalLocationsForm key="step4" step={activeIndex} setStep={setActiveIndex} />,
    <PaymentInformationForm key="step5" step={activeIndex} setStep={setActiveIndex} />,
    <SignGetAcceptForm key="step6" step={activeIndex} setStep={setActiveIndex} />,
  ]

  return (
    <FormDataContext.Provider
      value={{
        formData,
        setFormData,
        defaultValues: defaultClientOnboardingFormValues,
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
        moreAddressDetailsCompany,
        setMoreAddressDetailsCompany,
        moreAddressDetailsFacility,
        setMoreAddressDetailsFacility,
      }}>
      <HeadingComponent title="Client Onboarding" />
      <Steps
        model={clientOnboardingSteps}
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
