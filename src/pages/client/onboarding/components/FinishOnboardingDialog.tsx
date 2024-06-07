import { useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { Image } from 'primereact/image'

import { type IUser } from '../../../../interfaces/User'
import { type ITokenInfo } from '../../../../interfaces/services'
import { requestService } from '../../../../services/requestServiceNew'
import { useUtils } from '../../../../store/useUtils'
import { GetTokenInfo, SetToken } from '../../../../utils/tokenUtil'
import { clientOnboardingSteps } from '../ClientOnboardingPage'

interface FinishedOnboardingDialogProps {
  visible: boolean
  setVisible: (visible: boolean) => void
}

export const FinishOnboardingDialog = ({ visible, setVisible }: FinishedOnboardingDialogProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const { showToast } = useUtils()

  const navigate = useNavigate()
  const userToken = GetTokenInfo()

  const updateUserFinishOnboarding = async () => {
    const userId = userToken?._id
    if (userId != null) {
      try {
        const response = await requestService({ path: `users/${userId}` })

        if (!response.ok) {
          throw new Error('User not found')
        }

        const userFound: IUser = await response.json()

        const updatedUserObject: IUser = {
          ...userFound,
          onboarding: {
            ...userFound.onboarding,
            step_number: 5,
            description: clientOnboardingSteps[4].label ?? '',
            type: 'client',
            completed: true,
          },
        }

        const updateResponse = await requestService({
          path: `users/${userId}`,
          method: 'PATCH',
          body: JSON.stringify(updatedUserObject),
        })

        if (!updateResponse.ok) {
          throw new Error('Failed to update user')
        }

        const updatedUser: IUser = await updateResponse.json()

        const updatedUserData: ITokenInfo = {
          ...userToken,
          onboarding: {
            ...updatedUser.onboarding,
          },
        }
        SetToken(updatedUserData)
        navigate('/client/dashboard')
      } catch (error) {
        console.error('Error updating user:', error)

        showToast({
          severity: 'error',
          summary: 'Error saving changes',
          detail: `Information could not be updated.`,
          life: 2000,
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  const onSubmit = async () => {
    setIsLoading(true)

    await updateUserFinishOnboarding()
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
                Nice work Your profile is under review.
              </h3>
              <div className="mt-2">
                <p className="text-wrap text-sm text-gray-500">
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
