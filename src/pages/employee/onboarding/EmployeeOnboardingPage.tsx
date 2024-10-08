import { Fragment, useState, useEffect } from 'react'

import { useNavigate } from 'react-router-dom'

import { Skeleton } from 'primereact/skeleton'
import { Steps } from 'primereact/steps'

import { type IAddressAutoComplete } from '../../../components/shared/forms/AddressAutoComplete'
import { HeadingComponent } from '../../../components/shared/general/HeadingComponent'
import { type IUser } from '../../../interfaces/User'
import { requestService } from '../../../services/requestServiceNew'
import { GetTokenInfo } from '../../../utils/tokenUtil'
import {
  EmployeeJobPreferencesForm,
  EmployeeProfileInformationForm,
  EmployeeUploadCredentialsForm,
  EmployeeWelcomeDialog,
} from './components'
import { defaultUserValues, defaultMoreAddressDetails, FormDataContext, steps } from './employeeOnboardingUtils'

export const EmployeeOnboarding = () => {
  const [loading, setLoading] = useState(true)
  const [visible, setVisible] = useState<boolean>(true)
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [formData, setFormData] = useState<IUser>({
    ...defaultUserValues,
  })

  const [moreAddressDetails, setMoreAddressDetails] = useState<IAddressAutoComplete | undefined>(
    defaultMoreAddressDetails,
  )

  const navigate = useNavigate()

  useEffect(() => {
    if (formData?.onboarding?.completed ?? false) {
      navigate('/employee/dashboard')
    }
  }, [formData?.onboarding?.completed, navigate])

  const onboardingSteps = [
    <Fragment key="step1">
      {formData?.onboarding?.step_number == null || formData.onboarding.step_number === 1 ? (
        <EmployeeWelcomeDialog visible={visible} setVisible={setVisible} />
      ) : null}
      <EmployeeProfileInformationForm step={activeIndex} setStep={setActiveIndex} />
    </Fragment>,
    <EmployeeJobPreferencesForm key="step2" step={activeIndex} setStep={setActiveIndex} />,
    <EmployeeUploadCredentialsForm key="step3" step={activeIndex} setStep={setActiveIndex} />,
  ]

  useEffect(() => {
    const userId = GetTokenInfo()._id

    const getUser = async () => {
      try {
        const response = await requestService({ path: `users/${userId}` })
        const responseData = await response.json()

        if (!response.ok) throw new Error(responseData.message)

        const userData = responseData as IUser

        setFormData(prevFormData => ({
          ...prevFormData,
          ...userData,
        }))

        setActiveIndex(userData.onboarding?.step_number ?? 0)
        setLoading(false)
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
        moreAddressDetails,
        setMoreAddressDetails,
      }}>
      <HeadingComponent title="Employee Onboarding" />
      {loading ? (
        <Skeleton />
      ) : (
        <>
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
        </>
      )}
    </FormDataContext.Provider>
  )
}
