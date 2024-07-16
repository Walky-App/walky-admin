import { Fragment, useState, useEffect, useCallback } from 'react'

import { useNavigate } from 'react-router-dom'

import { type MenuItem } from 'primereact/menuitem'
import { Steps } from 'primereact/steps'

import { HTLoadingLogo } from '../../../components/shared/HTLoadingLogo'
import { type IAddressAutoComplete } from '../../../components/shared/forms/AddressAutoComplete'
import { HeadingComponent } from '../../../components/shared/general/HeadingComponent'
import { type IUser } from '../../../interfaces/User'
import { type ICompany } from '../../../interfaces/company'
import { type IFacility } from '../../../interfaces/facility'
import { requestService } from '../../../services/requestServiceNew'
import { GetTokenInfo } from '../../../utils/tokenUtil'
import {
  type IClientOnboardingFormInputs,
  defaultClientOnboardingFormValues,
  type IGetAcceptDocumentDetails,
  type IGetAcceptRecipient,
  defaultMoreAddressDetails,
  FormDataContext,
  createCompanyFormData,
  createFacilityFormData,
} from './clientOnboardingUtils'
import { WelcomeDialog } from './components'
import { CompanyInformationForm } from './forms/CompanyInformationForm'
import { DocumentsAndImagesUploadForm } from './forms/DocumentsAndImagesUploadForm'
import { FacilityInformationForm } from './forms/FacilityInformationForm'
import { SignGetAcceptForm } from './forms/SignGetAcceptForm'

export const clientOnboardingSteps: MenuItem[] = [
  { label: 'Company Information' },
  { label: 'Facility Information' },
  { label: 'Licenses and Images' },
  { label: 'Terms and Conditions' },
]

export const ClientOnboarding = () => {
  const [loading, setLoading] = useState(false)
  const [onboardingDataLoaded, setOnboardingDataLoaded] = useState(false)
  const [formData, setFormData] = useState<IClientOnboardingFormInputs>(defaultClientOnboardingFormValues)
  const [visible, setVisible] = useState<boolean>(true)
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [documentData, setDocumentData] = useState<IGetAcceptDocumentDetails | null>(null)
  const [documentUrl, setDocumentUrl] = useState('')
  const [documentLoading, setDocumentLoading] = useState(false)
  const [prevDocRecipient, setPrevDocRecipient] = useState<IGetAcceptRecipient | null>(null)
  const [moreAddressDetailsCompany, setMoreAddressDetailsCompany] = useState<IAddressAutoComplete | undefined>(
    defaultMoreAddressDetails,
  )
  const [moreAddressDetailsFacility, setMoreAddressDetailsFacility] = useState<IAddressAutoComplete | undefined>(
    defaultMoreAddressDetails,
  )

  const userToken = GetTokenInfo()
  const userId = userToken._id

  const navigate = useNavigate()

  useEffect(() => {
    if (userToken?.onboarding?.completed ?? false) {
      navigate('/client/dashboard')
    } else {
      setActiveIndex(userToken?.onboarding?.step_number ?? 0)
    }
  }, [navigate, userToken?.onboarding?.completed, userToken?.onboarding?.step_number])

  const getUserData = useCallback(async () => {
    try {
      const response = await requestService({ path: `users/${userId}` })
      if (!response.ok) throw new Error('Error fetching user details')
      const userData: IUser = await response.json()

      return userData
    } catch (error) {
      console.error(error)
    }
  }, [userId])

  const getUserCompanies = useCallback(async () => {
    try {
      const response = await requestService({ path: 'companies/byclient' })
      if (!response.ok && response.status !== 204) throw new Error('Error fetching user companies')

      if (response.status === 204) return []

      const data: { companies: ICompany[] } = await response.json()

      return data.companies
    } catch (error) {
      console.error(error)
    }
  }, [])

  const getCompanyFacilities = useCallback(async (companyID: string) => {
    try {
      const response = await requestService({ path: `facilities/company/${companyID}` })
      if (!response.ok && response.status !== 204) throw new Error('Error fetching user facilities')
      const facilitiesData: IFacility[] = response.status === 204 ? [] : await response.json()

      return facilitiesData
    } catch (error) {
      console.error(error)
    }
  }, [])

  useEffect(() => {
    const getOnboardingData = async () => {
      setLoading(true)
      setOnboardingDataLoaded(false)

      try {
        const userData = await getUserData()

        setFormData(prev => ({
          ...prev,
          user_id: userData?._id ?? userId,
        }))

        const companiesData = await getUserCompanies()

        let companyFormData: ICompany = {} as ICompany
        if (companiesData != null && companiesData.length > 0) {
          companyFormData = createCompanyFormData(companiesData[0])
          setFormData(prev => ({
            ...prev,
            ...companyFormData,
            company_id: companyFormData?._id ?? '',
          }))
        }

        let facilitiesData: IFacility[] = []
        if (companyFormData?._id != null) {
          const companyId = companyFormData._id
          facilitiesData = (await getCompanyFacilities(companyId)) || []
        }

        let facilityFormData: IFacility = {} as IFacility
        if (facilitiesData != null && facilitiesData.length > 0) {
          facilityFormData = createFacilityFormData(facilitiesData[0])
        }
        setDocumentUrl(prev => facilityFormData.contract_url?.[0] ?? prev)

        setFormData(prev => ({
          ...prev,
          ...facilityFormData,
          contacts:
            facilityFormData.contacts != null && facilityFormData.contacts.length > 0
              ? facilityFormData.contacts
              : [
                  {
                    first_name: userData?.first_name ?? '',
                    last_name: userData?.last_name ?? '',
                    role: '',
                    phone_number: userData?.phone_number ?? '',
                    email: userData?.email ?? '',
                  },
                ],
        }))

        setOnboardingDataLoaded(true)
      } catch (error) {
        console.error('Error fetching onboarding data:', error)
      } finally {
        setLoading(false)
      }
    }

    getOnboardingData()
  }, [getUserData, getUserCompanies, getCompanyFacilities, userId])

  useEffect(() => {
    if (onboardingDataLoaded && activeIndex === 2 && formData.facilities.length !== 0 && documentUrl === '') {
      setDocumentLoading(true)
      const docRecipient: IGetAcceptRecipient = {
        email: formData?.contacts[0].email,
        first_name: formData?.contacts[0].first_name,
        last_name: formData?.contacts[0].last_name,
        company_name: formData?.company_name,
        company_number: formData?.phone_number,
        mobile: formData?.contacts[0].phone_number,
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
            const response = await requestService({ path: 'getaccept', method: 'POST', body: JSON.stringify(body) })
            if (!response.ok) throw new Error('Error sending document')
            const documentData: IGetAcceptDocumentDetails = await response.json()

            setDocumentData(documentData)
            setDocumentLoading(false)
          } catch (error) {
            console.error('Error sending document:', error)
          } finally {
            setDocumentLoading(false)
          }
        }

        sendDocumentFromTemplate()

        setPrevDocRecipient(docRecipient)
      }
    }
  }, [
    activeIndex,
    documentUrl,
    formData?.company_name,
    formData?.contacts,
    formData?.contract_url?.length,
    formData.facilities.length,
    formData?.phone_number,
    loading,
    onboardingDataLoaded,
    prevDocRecipient,
  ])

  useEffect(() => {
    if (onboardingDataLoaded && activeIndex === 3 && documentData?.id != null && documentUrl === '') {
      setDocumentLoading(true)

      const documentId = documentData?.id

      const getDocumentRecipients = async () => {
        try {
          if (!documentId) {
            setDocumentLoading(false)
            throw new Error('Document ID is missing')
          }
          const response = await requestService({ path: `getaccept/${documentId}/recipients` })
          if (!response.ok) throw new Error('Error fetching document recipients')

          let recipientsData = await response.json()

          while (!recipientsData.document_url) {
            await new Promise(resolve => setTimeout(resolve, 3000))

            const response = await requestService({ path: `getaccept/${documentId}/recipients` })
            if (!response.ok) throw new Error('Error fetching document recipients')
            recipientsData = await response.json()
          }

          const newDocumentUrl = recipientsData.document_url

          setDocumentUrl(newDocumentUrl)

          const updateFacilityWithDocumentUrl = await requestService({
            path: `facilities/${formData.facilities[0]}`,
            method: 'PATCH',
            body: JSON.stringify({ contract_url: [newDocumentUrl] }),
          })
          if (!updateFacilityWithDocumentUrl.ok) throw new Error('Error updating facility with document url')
          const updatedFacility = await updateFacilityWithDocumentUrl.json()

          setFormData(prev => ({
            ...prev,
            ...updatedFacility,
          }))

          setDocumentLoading(false)
        } catch (error) {
          console.error('Error fetching document recipients:', error)
          setDocumentLoading(false)
        }
      }
      getDocumentRecipients()
    }
  }, [activeIndex, documentData?.id, documentUrl, formData.facilities, onboardingDataLoaded])

  const onboardingSteps = [
    <Fragment key="step1">
      {userToken?.onboarding?.step_number == null ? <WelcomeDialog visible={visible} setVisible={setVisible} /> : null}
      <CompanyInformationForm step={activeIndex} setStep={setActiveIndex} />
    </Fragment>,
    <FacilityInformationForm key="step2" step={activeIndex} setStep={setActiveIndex} />,
    <DocumentsAndImagesUploadForm key="step3" step={activeIndex} setStep={setActiveIndex} />,
    <SignGetAcceptForm key="step4" />,
  ]

  return (
    <FormDataContext.Provider
      value={{
        userId,
        formData,
        setFormData,
        defaultValues: defaultClientOnboardingFormValues,
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
      {loading ? (
        <HTLoadingLogo />
      ) : (
        <>
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
        </>
      )}
    </FormDataContext.Provider>
  )
}
