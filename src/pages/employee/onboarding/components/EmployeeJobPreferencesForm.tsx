import { useContext, useState } from 'react'

import { Controller, type SubmitHandler, useForm } from 'react-hook-form'

import { Button } from 'primereact/button'
import { MultiSelect, type MultiSelectChangeEvent } from 'primereact/multiselect'
import { classNames } from 'primereact/utils'

import { HtInputLabel } from '../../../../components/shared/forms/HtInputLabel'
import { HtInfoTooltip } from '../../../../components/shared/general/HtInfoTooltip'
import { type IUser } from '../../../../interfaces/User'
import { requestService } from '../../../../services/requestServiceNew'
import { useUtils } from '../../../../store/useUtils'
import { job_preferences } from '../../../../utils/formOptions'
import { getFormErrorMessage } from '../../../../utils/formUtils'
import { type IOnboardingUpdateInfo, useUpdateOnboardingStatus } from '../../../client/onboarding/clientOnboardingUtils'
import { FormDataContext, type StepProps, steps } from '../employeeOnboardingUtils'

export const EmployeeJobPreferencesForm = ({ step, setStep }: StepProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const { formData, setFormData, defaultValues } = useContext(FormDataContext)

  const { showToast } = useUtils()

  const { updateOnboardingStatus } = useUpdateOnboardingStatus()

  const updatedOnboardingInfo: IOnboardingUpdateInfo = {
    step_number: 2,
    description: steps[1].label ?? 'Job Preferences',
    type: 'employee',
    completed: false,
  }

  const values = formData != null ? formData : defaultValues

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<IUser>({ values })

  const onSubmit: SubmitHandler<IUser> = async data => {
    setIsLoading(true)

    const userId = formData?._id

    if (userId != null) {
      try {
        const response = await requestService({ path: `users/${userId}` })
        const responseData = await response.json()
        if (!response.ok) throw new Error(responseData.message)

        const userFound = responseData as IUser

        if (userFound != null) {
          const updatedUser: IUser = {
            ...userFound,
            ...data,
          }

          const response = await requestService({
            path: `users/${userId}`,
            method: 'PATCH',
            body: JSON.stringify(updatedUser),
          })

          const responseData = await response.json()

          if (!response.ok) throw new Error(responseData.message)

          const userUpdated = responseData as IUser

          setFormData(userUpdated)
        }
      } catch (error) {
        console.error('Error updating user:', error)

        showToast({
          severity: 'error',
          summary: 'Error saving changes',
          detail: `Information could not be updated.`,
          life: 2000,
        })
        setIsLoading(false)
      }
    }

    const success = await updateOnboardingStatus(updatedOnboardingInfo)
    if (success === true) {
      setTimeout(() => {
        setStep(step + 1)
      }, 1000)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="p-fluid space-y-12">
        {/* Job Preferences */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Jobs</h2>
            <p className="mt-4 text-sm leading-6 text-gray-600">
              Please let us know what type of positions you may be interested in.
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
            <div className="sm:col-span-6">
              <Controller
                control={control}
                name="job_preferences"
                render={({ field, fieldState }) => (
                  <>
                    <HtInfoTooltip message="Please select the type of jobs you are interested in.">
                      <HtInputLabel htmlFor={field.name} labelText="Preferred Jobs:" />
                    </HtInfoTooltip>
                    <MultiSelect
                      inputId={field.name}
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
                    {getFormErrorMessage(field.name, errors)}
                  </>
                )}
              />
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
  )
}
