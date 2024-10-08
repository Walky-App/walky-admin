import { useNavigate } from 'react-router-dom'

import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { Image } from 'primereact/image'

import { type IOnboardingUpdateInfo, useUpdateOnboardingStatus } from '../../../client/onboarding/clientOnboardingUtils'

interface Props {
  visible: boolean
  setVisible: (visible: boolean) => void
  onboardingInfo: IOnboardingUpdateInfo
}

export const EmployeeFinishOnboardingDialog = ({ visible, setVisible, onboardingInfo }: Props) => {
  const navigate = useNavigate()

  const { updateOnboardingStatus, isLoading } = useUpdateOnboardingStatus()

  const updatedOnboardingInfo: IOnboardingUpdateInfo = {
    ...onboardingInfo,
  }

  const onSubmit = async () => {
    const success = await updateOnboardingStatus(updatedOnboardingInfo)
    if (success === true) {
      navigate('/employee/dashboard')
    }
  }

  return (
    <div className="flex justify-center">
      <Dialog
        visible={visible}
        modal
        blockScroll
        onHide={() => setVisible(false)}
        content={
          <div className="flex flex-col rounded-lg bg-white px-8 py-5 sm:w-full">
            <div className="flex justify-center">
              <Image src="/assets/logos/logo-horizontal-cropped.png" alt="Image" width="250" />
            </div>
            <div className="mb-3 mt-3 text-center sm:mb-5 sm:mt-5">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                Nice work! Your profile is under review!
              </h3>
              <div className="mt-2">
                <p className="text-wrap text-sm text-gray-500">
                  Once it has been approved you will receive a confirmation email saying your account has been
                  successfully created.
                </p>
              </div>
            </div>
            <div className="mx-auto">
              <Button label="Continue" loading={isLoading} onClick={onSubmit} />
            </div>
          </div>
        }
      />
    </div>
  )
}
