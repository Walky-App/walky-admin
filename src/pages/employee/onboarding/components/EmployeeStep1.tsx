import { useContext, useEffect, useState } from 'react'

import { Controller, type SubmitHandler, useForm } from 'react-hook-form'

import { Button } from 'primereact/button'
import { InputMask } from 'primereact/inputmask'
import { InputText } from 'primereact/inputtext'
import { classNames } from 'primereact/utils'

import { AddressAutoComplete } from '../../../../components/shared/forms/AddressAutoComplete'
import { type IUser } from '../../../../interfaces/User'
import { RequestService } from '../../../../services/RequestService'
import { useUtils } from '../../../../store/useUtils'
import {
  FormDataContext,
  getFormErrorMessage,
  tooltipOptions,
  type IUserFormInputs,
  type StepProps,
  steps,
} from '../EmployeeOnboardingPage'

export const EmployeeStep1 = ({ step, setStep }: StepProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const {
    setFormData,
    defaultValues,
    formData,
    currentUser,
    setCurrentUser,
    moreAddressDetails,
    setMoreAddressDetails,
  } = useContext(FormDataContext)

  const { showToast } = useUtils()

  const values = formData !== null ? formData : defaultValues

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<IUserFormInputs>({ values })

  useEffect(() => {
    if (moreAddressDetails) {
      if (moreAddressDetails.zip !== undefined) {
        setValue('zip', moreAddressDetails.zip)
      }
      if (moreAddressDetails.state !== undefined) {
        setValue('state', moreAddressDetails.state)
      }
      if (moreAddressDetails.city !== undefined) {
        setValue('city', moreAddressDetails.city)
      }
      if (moreAddressDetails.address !== undefined) {
        setValue('address', moreAddressDetails.address)
      }
      if (moreAddressDetails.country !== undefined) {
        setValue('country', moreAddressDetails.country)
      }
      setMoreAddressDetails(undefined)
    }
  }, [moreAddressDetails, setMoreAddressDetails, setValue])

  const updateUserWithDataAndIncrementStep = async (data: IUserFormInputs, step: number) => {
    let userId = currentUser?._id

    if (userId != null) {
      try {
        const userFound: IUser = await RequestService(`users/${userId}`)

        if (userFound !== null) {
          const updatedUser: IUser = {
            ...userFound,
            ...data,
            onboarding: {
              step_number: 1,
              description: steps[0].label ?? '',
              type: data.onboarding?.type,
              completed: data.onboarding?.completed,
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

        setTimeout(() => {
          setStep(step + 1)
        }, 1000)
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
  }

  const onSubmit: SubmitHandler<IUserFormInputs> = async data => {
    setFormData(data)
    setIsLoading(true)

    await updateUserWithDataAndIncrementStep(data, step)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="p-fluid space-y-12">
        {/* Contact Information */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-4 border-b border-gray-900/10 pb-12 sm:gap-y-10 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Contact Information</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">Please provide your contact information.</p>
          </div>
          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
            <div className="sm:col-span-3">
              <Controller
                control={control}
                name="first_name"
                rules={{ required: 'First Name is required' }}
                render={({ field, fieldState }) => (
                  <>
                    <label htmlFor={field.name} className="block text-sm font-medium leading-6 text-gray-900">
                      *First Name:
                    </label>
                    <InputText
                      id={field.name}
                      {...field}
                      className={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2')}
                    />
                  </>
                )}
              />
              {getFormErrorMessage(`first_name`, errors)}
            </div>

            <div className="sm:col-span-3">
              <Controller
                control={control}
                name="last_name"
                rules={{ required: 'Last Name is required' }}
                render={({ field, fieldState }) => (
                  <>
                    <label htmlFor={field.name} className="block text-sm font-medium leading-6 text-gray-900">
                      *Last Name:
                    </label>
                    <InputText
                      id={field.name}
                      {...field}
                      className={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2')}
                    />
                  </>
                )}
              />
              {getFormErrorMessage(`last_name`, errors)}
            </div>

            <div className="sm:col-span-3">
              <Controller
                control={control}
                name="middle_name"
                rules={{ required: false }}
                render={({ field, fieldState }) => (
                  <>
                    <label htmlFor={field.name} className="block text-sm font-medium leading-6 text-gray-900">
                      Middle Name:
                    </label>
                    <InputText
                      id={field.name}
                      {...field}
                      className={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2')}
                    />
                  </>
                )}
              />
              {getFormErrorMessage(`middle_name`, errors)}
            </div>

            <div className="sm:col-span-3">
              <Controller
                control={control}
                name="preferred_name"
                rules={{ required: false }}
                render={({ field, fieldState }) => (
                  <>
                    <label htmlFor={field.name} className="block text-sm font-medium leading-6 text-gray-900">
                      Preferred Name:
                    </label>
                    <InputText
                      id={field.name}
                      {...field}
                      className={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2')}
                    />
                  </>
                )}
              />
              {getFormErrorMessage(`middle_name`, errors)}
            </div>

            <div className="sm:col-span-3">
              <Controller
                control={control}
                name="phone_number"
                rules={{
                  required: 'Mobile Number is required',
                  pattern: {
                    value: /^\(\d{3}\) \d{3}-\d{4}$/,
                    message: 'Invalid Mobile Number. E.g. (123) 456-7890',
                  },
                }}
                render={({ field, fieldState }) => (
                  <>
                    <label htmlFor={field.name} className="block text-sm font-medium leading-6 text-gray-900">
                      *Phone Number:
                    </label>
                    <InputMask
                      id={field.name}
                      {...field}
                      mask="(999) 999-9999"
                      slotChar="x"
                      tooltip="E.g. (281) 330-8004"
                      tooltipOptions={tooltipOptions}
                      className={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2')}
                    />
                  </>
                )}
              />
              {getFormErrorMessage(`phone_number`, errors)}
            </div>
            <div className="sm:col-span-3">
              <Controller
                control={control}
                name="email"
                rules={{
                  required: 'Email is required',
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: 'Invalid email',
                  },
                }}
                render={({ field, fieldState }) => (
                  <>
                    <label htmlFor={field.name} className="block text-sm font-medium leading-6 text-gray-900">
                      *Email:
                    </label>
                    <InputText
                      id={field.name}
                      {...field}
                      className={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2')}
                    />
                  </>
                )}
              />
              {getFormErrorMessage(`email`, errors)}
            </div>
          </div>
        </div>
        {/* Home Address */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-4 border-b border-gray-900/10 pb-12 sm:gap-y-10 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Location</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">Please provide your address information.</p>
          </div>
          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
            <div className="sm:col-span-6">
              <Controller
                control={control}
                name="address"
                rules={{ required: 'Address is required' }}
                render={({ field, fieldState }) => (
                  <>
                    <label htmlFor={field.name} className="block text-sm font-medium leading-6 text-gray-900">
                      *Address:
                    </label>
                    <AddressAutoComplete
                      controlled
                      setMoreAddressDetails={setMoreAddressDetails}
                      currentAddress={field.value}
                      onChange={field.onChange}
                      value={field.value}
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
        <Button type="submit" label="Submit" loading={isLoading} />
      </div>
    </form>
  )
}
