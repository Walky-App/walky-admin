import { useContext, useEffect, useState } from 'react'

import { Controller, type SubmitHandler, useForm } from 'react-hook-form'

import { Avatar } from 'primereact/avatar'
import { Button } from 'primereact/button'
import { InputMask } from 'primereact/inputmask'
import { InputText } from 'primereact/inputtext'
import { classNames } from 'primereact/utils'

import { AddressAutoComplete } from '../../../../components/shared/forms/AddressAutoComplete'
import { HtInputHelpText } from '../../../../components/shared/forms/HtInputHelpText'
import { HtInputLabel } from '../../../../components/shared/forms/HtInputLabel'
import { UploadAvatar } from '../../../../components/shared/forms/UploadAvatar'
import { HtInfoTooltip } from '../../../../components/shared/general/HtInfoTooltip'
import { type IUser } from '../../../../interfaces/User'
import { requestService } from '../../../../services/requestServiceNew'
import { useUtils } from '../../../../store/useUtils'
import { getFormErrorMessage, requiredFieldsNoticeText } from '../../../../utils/formUtils'
import { type IOnboardingUpdateInfo, useUpdateOnboardingStatus } from '../../../client/onboarding/clientOnboardingUtils'
import { FormDataContext, type StepProps, steps } from '../employeeOnboardingUtils'

const goodHeadshotExamples = [
  '/assets/headshots/good-examples/30.jpg',
  '/assets/headshots/good-examples/51.jpg',
  '/assets/headshots/good-examples/52.jpg',
  '/assets/headshots/good-examples/74.jpg',
  '/assets/headshots/good-examples/80.jpg',
]

const badHeadshotExamples = [
  '/assets/headshots/bad-examples/1.jpg',
  '/assets/headshots/bad-examples/5.jpg',
  '/assets/headshots/bad-examples/12.jpg',
  '/assets/headshots/bad-examples/15.jpg',
  '/assets/headshots/bad-examples/48.jpg',
]

export const EmployeeProfileInformationForm = ({ step, setStep }: StepProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const { setFormData, defaultValues, formData, moreAddressDetails, setMoreAddressDetails } =
    useContext(FormDataContext)

  const { showToast } = useUtils()

  const { updateOnboardingStatus } = useUpdateOnboardingStatus()

  const updatedOnboardingInfo: IOnboardingUpdateInfo = {
    step_number: 1,
    description: steps[0].label ?? 'Profile Information',
    type: 'employee',
    completed: false,
  }

  const formValues = formData !== null ? formData : defaultValues

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    getValues,
  } = useForm<IUser>({ values: formValues })

  useEffect(() => {
    if (moreAddressDetails) {
      if (moreAddressDetails.zip != null) {
        setValue('zip', moreAddressDetails.zip)
      }
      if (moreAddressDetails.state != null) {
        setValue('state', moreAddressDetails.state)
      }
      if (moreAddressDetails.city != null) {
        setValue('city', moreAddressDetails.city)
      }
      if (moreAddressDetails.address != null) {
        setValue('address', moreAddressDetails.address)
      }
      if (moreAddressDetails.country != null) {
        setValue('country', moreAddressDetails.country)
      }
      setMoreAddressDetails(undefined)
    }
  }, [moreAddressDetails, setMoreAddressDetails, setValue])

  const handleAvatarClick = () => {
    const currentFormValues = getValues()
    setFormData(currentFormValues)
  }

  const onSubmit: SubmitHandler<IUser> = async data => {
    setFormData(data)
    setIsLoading(true)

    const userId = formData?._id

    if (userId != null) {
      try {
        const response = await requestService({ path: `users/${userId}` })
        const responseData = await response.json()
        if (!response.ok) throw new Error(responseData.message)
        const userFound = responseData as IUser

        if (userFound !== null) {
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
        {/* Contact Information */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-4 border-b border-gray-900/10 pb-12 sm:gap-y-10 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Contact Information</h2>
            <p className="mt-4 text-sm leading-6 text-gray-600">Please provide your contact information.</p>
            {requiredFieldsNoticeText}
          </div>
          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
            <div className="sm:col-span-3">
              <Controller
                control={control}
                name="first_name"
                rules={{ required: 'First Name is required' }}
                render={({ field, fieldState }) => (
                  <>
                    <HtInputLabel htmlFor={field.name} asterisk labelText="First Name:" />
                    <InputText
                      disabled
                      id={field.name}
                      {...field}
                      className={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2')}
                    />
                    {getFormErrorMessage(field.name, errors)}
                  </>
                )}
              />
            </div>

            <div className="sm:col-span-3">
              <Controller
                control={control}
                name="last_name"
                rules={{ required: 'Last Name is required' }}
                render={({ field, fieldState }) => (
                  <>
                    <HtInputLabel htmlFor={field.name} asterisk labelText="Last Name:" />
                    <InputText
                      disabled
                      id={field.name}
                      {...field}
                      className={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2')}
                    />
                    {getFormErrorMessage(field.name, errors)}
                  </>
                )}
              />
            </div>

            <div className="sm:col-span-3">
              <Controller
                control={control}
                name="middle_name"
                rules={{ required: false }}
                render={({ field, fieldState }) => (
                  <>
                    <HtInputLabel htmlFor={field.name} labelText="Middle Name:" />
                    <InputText
                      id={field.name}
                      {...field}
                      className={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2')}
                    />
                    {getFormErrorMessage(field.name, errors)}
                  </>
                )}
              />
            </div>

            <div className="sm:col-span-3">
              <Controller
                control={control}
                name="preferred_name"
                rules={{ required: false }}
                render={({ field, fieldState }) => (
                  <>
                    <HtInputLabel htmlFor={field.name} labelText="Preferred Name:" />
                    <InputText
                      id={field.name}
                      {...field}
                      className={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2')}
                    />
                    {getFormErrorMessage(field.name, errors)}
                  </>
                )}
              />
            </div>

            <div className="sm:col-span-3">
              <Controller
                control={control}
                name="phone_number"
                rules={{
                  required: 'Mobile Number is required, should be 10 digits.',
                }}
                render={({ field, fieldState }) => (
                  <>
                    <HtInputLabel htmlFor={field.name} asterisk labelText="Phone Number:" />
                    <InputMask
                      disabled
                      id={field.name}
                      {...field}
                      mask="(999) 999-9999"
                      slotChar="x"
                      unmask={true}
                      className={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2')}
                    />
                    {getFormErrorMessage(field.name, errors)}
                  </>
                )}
              />
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
                    <HtInputLabel htmlFor={field.name} asterisk labelText="Email:" />
                    <InputText
                      disabled
                      id={field.name}
                      {...field}
                      className={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2')}
                    />
                    {getFormErrorMessage(field.name, errors)}
                  </>
                )}
              />
            </div>
          </div>
        </div>
        {/* Home Address */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-4 border-b border-gray-900/10 pb-12 sm:gap-y-10 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Home Address</h2>
            <p className="mt-4 text-sm leading-6 text-gray-600">Please provide your home address.</p>
            {requiredFieldsNoticeText}
          </div>
          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
            <div className="sm:col-span-6">
              <Controller
                control={control}
                name="address"
                rules={{ required: 'Address is required' }}
                render={({ field, fieldState }) => (
                  <>
                    <HtInfoTooltip message="This is an address where you reside and receive your mail.">
                      <HtInputLabel htmlFor={field.name} asterisk labelText="Address:" />
                    </HtInfoTooltip>
                    <AddressAutoComplete
                      inputId={field.name}
                      controlled
                      setMoreAddressDetails={setMoreAddressDetails}
                      currentAddress={field.value ?? ''}
                      onChange={field.onChange}
                      value={field.value}
                      classNames={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2')}
                    />
                    {getFormErrorMessage(field.name, errors)}
                  </>
                )}
              />
            </div>
          </div>
        </div>

        {/* Profile Picture */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-4 border-b border-gray-900/10 pb-12 sm:gap-y-10 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Profile Picture</h2>
            <p className="mt-4 text-sm leading-6 text-gray-600">
              Please provide a recent headshot photo for your employee profile.
            </p>
            {requiredFieldsNoticeText}
            <div className="mt-10">
              <strong className="text-sm leading-6 text-gray-600">Photo Tips</strong>
              <ol className="mt-1 list-inside list-decimal text-sm leading-6 text-gray-600">
                <li>Use a clear, high-quality photo.</li>
                <li>Make sure your face is visible (face the camera directly).</li>
                <li>Use a neutral background (preferably light colored).</li>
                <li>Make sure there is nothing else in the photo.</li>
                <li>Take the photo in a well-lit environment.</li>
                <li>Do not use filters.</li>
                <li>Smile!</li>
              </ol>
            </div>
          </div>
          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
            <div className="sm:col-span-6">
              <Controller
                control={control}
                name="avatar"
                rules={{ required: 'Profile Picture is required' }}
                render={({ field }) => (
                  <>
                    <HtInputLabel htmlFor="avatar" asterisk labelText="Upload Photo:" />
                    <div role="button" tabIndex={0} onClick={handleAvatarClick} onKeyPress={handleAvatarClick}>
                      <UploadAvatar formUser={formData} setFormUser={setFormData} />
                    </div>
                    {getFormErrorMessage(field.name, errors)}
                  </>
                )}
              />
              <div className="mt-10 space-y-4">
                <div>
                  <div className="mb-2 space-x-1">
                    <i className="pi pi-thumbs-up-fill text-primary" />
                    <strong className="text-sm text-gray-600">Good Examples:</strong>
                  </div>
                  <div className="-mx-2 flex flex-wrap">
                    {goodHeadshotExamples.map(src => (
                      <div key={src} className="mb-2 flex-1 px-2">
                        <Avatar image={src} size="xlarge" shape="square" />
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="mb-2 space-x-1">
                    <i className="pi pi-thumbs-down-fill text-red-700" />
                    <strong className="text-sm text-gray-600">Bad Examples:</strong>
                  </div>
                  <div className="-mx-2 flex flex-wrap">
                    {badHeadshotExamples.map(src => (
                      <div key={src} className="mb-2 flex-1 px-2">
                        <Avatar image={src} size="xlarge" shape="square" />
                      </div>
                    ))}
                  </div>
                  <HtInputHelpText
                    fieldName="avatar"
                    helpText="*Any uploaded pictures that do not comply with our policies and guidelines will be rejected."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <Button type="submit" label="Save & Continue" loading={isLoading} />
      </div>
    </form>
  )
}
