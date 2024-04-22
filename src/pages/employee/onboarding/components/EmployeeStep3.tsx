import { useContext, useState } from 'react'

import { Controller, type SubmitHandler, useForm } from 'react-hook-form'

import { Button } from 'primereact/button'
import { MultiSelect, type MultiSelectChangeEvent } from 'primereact/multiselect'
import { classNames } from 'primereact/utils'

import { EmployeeFinishOnboardingDialog } from '.'
import { type IUser } from '../../../../interfaces/User'
import { RequestService } from '../../../../services/RequestService'
import { useUtils } from '../../../../store/useUtils'
import { job_preferences, notifications_preferences } from '../../../../utils/formOptions'
import {
  FormDataContext,
  getFormErrorMessage,
  type IUserFormInputs,
  type StepProps,
  steps,
} from '../EmployeeOnboardingPage'

export const EmployeeStep3 = ({ step, setStep }: StepProps) => {
  const [visible, setVisible] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(false)

  const { setFormData, defaultValues, formData, currentUser, setCurrentUser } = useContext(FormDataContext)

  const { showToast } = useUtils()

  const values = formData !== null ? formData : defaultValues

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<IUserFormInputs>({ values })

  const updateUserWithDataAndIncrementStep = async (data: IUserFormInputs) => {
    let userId = currentUser?._id

    if (userId != null) {
      try {
        const userFound: IUser = await RequestService(`users/${userId}`)

        if (userFound !== null) {
          const updatedUser: IUser = {
            ...userFound,
            ...data,
            onboarding: {
              ...userFound.onboarding,
              step_number: 4,
              description: steps[3].label ?? '',
              completed: false,
            },
          }

          const response = await RequestService(`users/${userId}`, 'PATCH', updatedUser)

          if (response?._id !== null) {
            userId = response._id

            setCurrentUser(response)
          } else {
            throw new Error('Failed to update user')
          }
        } else {
          throw new Error('User not found')
        }

        // This line is commented out to prevent the form from advancing to the next step
        // setStep(step + 1)

        // This line is added to show the FinishOnboardingDialog
        setVisible(true)
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

  const onSubmit: SubmitHandler<IUserFormInputs> = async data => {
    setFormData(data)
    setIsLoading(true)

    await updateUserWithDataAndIncrementStep(data)
  }

  return (
    <>
      <EmployeeFinishOnboardingDialog visible={visible} setVisible={setVisible} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-fluid space-y-12">
          {/* Job Preferences */}
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">Jobs</h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Please let us know what type of positions you may be interested in.
              </p>
            </div>

            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
              <div className="sm:col-span-6">
                <Controller
                  control={control}
                  name="job_preferences"
                  rules={{ required: 'At least one choice is required' }}
                  render={({ field, fieldState }) => (
                    <>
                      <label htmlFor={field.name} className="block text-sm font-medium leading-6 text-gray-900">
                        *Preferred Jobs:
                      </label>
                      <MultiSelect
                        id={field.name}
                        {...field}
                        value={field.value}
                        options={job_preferences}
                        display="chip"
                        selectAll
                        selectAllLabel="Select All"
                        onChange={(e: MultiSelectChangeEvent) => field.onChange(e.value)}
                        placeholder="Select Services"
                        className={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2')}
                      />
                    </>
                  )}
                />
                {getFormErrorMessage('services', errors)}
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">Notifications</h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Please let us know the preferred notifications you would like to receive.
              </p>
            </div>

            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
              <div className="sm:col-span-6">
                <Controller
                  control={control}
                  name="notifications"
                  rules={{ required: false }}
                  render={({ field, fieldState }) => (
                    <>
                      <label htmlFor={field.name} className="block text-sm font-medium leading-6 text-gray-900">
                        *Preferred Notifications:
                      </label>
                      <MultiSelect
                        id={field.name}
                        {...field}
                        value={field.value}
                        options={notifications_preferences}
                        display="chip"
                        selectAll
                        selectAllLabel="Select All"
                        onChange={(e: MultiSelectChangeEvent) => field.onChange(e.value)}
                        placeholder="Select Notifications"
                        className={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2')}
                      />
                    </>
                  )}
                />
                {getFormErrorMessage('address', errors)}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <Button
            severity="secondary"
            label="Back"
            outlined
            onClick={() => {
              setStep(step - 1)
            }}
          />
          <Button type="submit" label="Submit" loading={isLoading} />
        </div>
      </form>
    </>
  )
}
