import { useContext, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { Image } from 'primereact/image'

import { type IUser } from '../../../../interfaces/User'
import { type ITokenInfo } from '../../../../interfaces/services'
import { requestService } from '../../../../services/requestServiceNew'
import { useUtils } from '../../../../store/useUtils'
import { GetTokenInfo, SetToken } from '../../../../utils/tokenUtil'
import { steps, FormDataContext } from '../EmployeeOnboardingPage'

interface Props {
  visible: boolean
  setVisible: (visible: boolean) => void
}

export const EmployeeFinishOnboardingDialog = ({ visible, setVisible }: Props) => {
  const [isLoading, setIsLoading] = useState(false)

  const { currentUser, setCurrentUser } = useContext(FormDataContext)

  const { showToast } = useUtils()

  const navigate = useNavigate()

  const currentToken = GetTokenInfo()

  const updateUserFinishOnboarding = async () => {
    const userId = currentUser?._id
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
            type: 'employee',
            step_number: 5,
            description: steps[4].label ?? '',
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

        setCurrentUser(updatedUser)

        const updatedUserData: ITokenInfo = {
          ...currentToken,
          onboarding: {
            ...updatedUser?.onboarding,
            step_number: 5,
            description: steps[4].label ?? '',
            type: 'employee',
            completed: true,
          },
        }
        SetToken(updatedUserData)

        navigate('/employee/dashboard')
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
