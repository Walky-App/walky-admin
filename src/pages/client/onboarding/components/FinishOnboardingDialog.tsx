import { useNavigate } from 'react-router-dom'

import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { Image } from 'primereact/image'

import { clientOnboardingSteps } from '../ClientOnboardingPage'
import { type IOnboardingUpdateInfo, useUpdateOnboardingStatus } from '../clientOnboardingUtils'

interface FinishedOnboardingDialogProps {
  visible: boolean
  setVisible: (visible: boolean) => void
}

export const FinishOnboardingDialog = ({ visible, setVisible }: FinishedOnboardingDialogProps) => {
  const navigate = useNavigate()

  const { updateOnboardingStatus, isLoading } = useUpdateOnboardingStatus()

  const updatedOnboardingInfo: IOnboardingUpdateInfo = {
    step_number: 4,
    description: clientOnboardingSteps[3].label ?? 'Terms and Conditions',
    type: 'client',
    completed: true,
  }
  const onSubmit = async () => {
    const success = await updateOnboardingStatus(updatedOnboardingInfo)
    if (success === true) {
      navigate('/client/dashboard')
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
                Nice work! Your profile is under review.
              </h3>
              <div className="mt-2">
                <p className="text-wrap">
                  Congratulations! your profile is successfully created and submitted to admin approval once admin
                  approved you received confirmation email.
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
