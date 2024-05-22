import { useState, useRef, useEffect } from 'react'

import { Controller, type SubmitHandler, useForm, type FieldErrors } from 'react-hook-form'

import { Button } from 'primereact/button'
import { Calendar } from 'primereact/calendar'
import { Checkbox } from 'primereact/checkbox'
import { Dropdown } from 'primereact/dropdown'
import { InputMask } from 'primereact/inputmask'
import { InputText } from 'primereact/inputtext'
import { Toast } from 'primereact/toast'
import { classNames } from 'primereact/utils'

import { UploadAvatar } from '../../../components/shared/forms/UploadAvatar'
import { useAuth } from '../../../contexts/AuthContext'
import { RequestService } from '../../../services/RequestService'
import { requestService } from '../../../services/requestServiceNew'
import { useUtils } from '../../../store/useUtils'
import { tooltipOptions } from '../../client/onboarding/ClientOnboardingPage'

interface IUserFormValues {
  first_name?: string
  middle_name?: string
  last_name?: string
  email?: string
  gender?: string
  birth_date?: Date
  phone_number?: string
  address?: string
  city?: string
  state?: string
  zip?: string
  notifications?: string[]
}

export const AdminProfile = () => {
  const [formUser, setFormUser] = useState<IUserFormValues>({
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    gender: '',
    birth_date: new Date(),
    phone_number: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    notifications: [],
  })
  const { user } = useAuth()
  const { showToast } = useUtils()

  const toast = useRef<Toast>(null)

  const defaultValues = {
    first_name: formUser?.first_name,
    middle_name: formUser?.middle_name,
    last_name: formUser?.last_name,
    email: formUser?.email,
    gender: formUser?.gender,
    birth_date: formUser?.birth_date,
    phone_number: formUser?.phone_number,
    address: formUser?.address,
    city: formUser?.city,
    state: formUser?.state,
    zip: formUser?.zip,
    notifications: formUser?.notifications,
  }

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({ defaultValues })

  useEffect(() => {
    if (!user) return
    const getUser = async () => {
      const userFound = await RequestService(`users/${user?._id}`)
      setFormUser(userFound)
      reset(userFound)
    }
    getUser()
  }, [user, reset])

  function getFormErrorMessage(path: string, errors: FieldErrors) {
    const pathParts = path.split('.')
    let error: FieldErrors = errors

    for (const part of pathParts) {
      if (typeof error !== 'object' || error === null) {
        return null
      }
      error = error[part as keyof typeof error] as FieldErrors
    }

    if (error?.message) {
      return error.message ? <p className="mt-2 text-sm text-red-600">{String(error.message)}</p> : null
    }

    return null
  }

  const onSubmit: SubmitHandler<IUserFormValues> = async data => {
    try {
      const response = await RequestService(`users/${user?._id}`, 'PATCH', data)
      if (response._id) {
        setFormUser(response)
        showToast({ severity: 'success', summary: 'Success', detail: 'User updated' })
      }
    } catch (error) {
      console.error('Error updating user:', error)
    }
  }

  const handlePasswordReset = async () => {
    try {
      const request = await requestService({
        path: '/auth/reset',
        method: 'POST',
        body: JSON.stringify({ email: formUser.email }),
      })

      if (request.ok) {
        const data = await request.json()
        if (data.message) {
          showToast({ severity: 'success', summary: 'Success', detail: 'Password reset email sent' })
        }
      }
    } catch (error) {
      console.error('Error resetting password:', error)
      showToast({ severity: 'error', summary: 'Error', detail: 'Error resetting password' })
    }
  }

  const genderOptions = [
    { title: 'Male', value: 'Male' },
    { title: 'Female', value: 'Female' },
    { title: 'Other', value: 'Other' },
  ]

  return (
    <>
      <div className="mb-12 flex w-full items-center justify-between border-b border-gray-200 pb-5 ">
        <h3 className="text-base font-semibold leading-6 text-gray-900">Your Profile Details</h3>
        <Button label="Reset Password" severity="secondary" icon="pi pi-lock" onClick={handlePasswordReset} />
      </div>

      {user?.role ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-12">
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
              <div>
                <h2 className="text-base font-semibold leading-7 text-gray-900">Avatar</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  This information will be displayed publicly so be careful what you share.
                </p>
              </div>
              <div>
                <UploadAvatar formUser={user} setFormUser={setFormUser} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
              <div>
                <h2 className="text-base font-semibold leading-7 text-gray-900">Personal Information</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Use a permanent address where you can receive mail.
                </p>
              </div>

              <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
                {/* First Name */}
                <div className="sm:col-span-3">
                  <label htmlFor="first_name" className="block text-sm font-medium leading-6 text-gray-900">
                    First name
                  </label>
                  <div className="mt-2">
                    <Controller
                      name="first_name"
                      control={control}
                      rules={{ required: 'First name is required' }}
                      render={({ field, fieldState }) => (
                        <InputText
                          disabled
                          id={field.name}
                          value={field.value}
                          name="first_name"
                          className={classNames({ 'p-invalid': fieldState.error }, 'w-full')}
                          onChange={e => field.onChange(e.target.value)}
                        />
                      )}
                    />
                  </div>
                  {getFormErrorMessage('first_name', errors)}
                </div>

                {/* Last Name */}
                <div className="sm:col-span-3">
                  <label htmlFor="last_name" className="block text-sm font-medium leading-6 text-gray-900">
                    Last name
                  </label>
                  <div className="mt-2">
                    <Controller
                      name="last_name"
                      control={control}
                      rules={{ required: 'Last name is required' }}
                      render={({ field, fieldState }) => (
                        <InputText
                          disabled
                          value={field.value}
                          name="last_name"
                          className={classNames({ 'p-invalid': fieldState.error }, 'w-full')}
                          onChange={e => field.onChange(e.target.value)}
                        />
                      )}
                    />
                  </div>
                  {getFormErrorMessage('last_name', errors)}
                </div>

                {/* Middle Name */}
                <div className="sm:col-span-3">
                  <label htmlFor="middle_name" className="block text-sm font-medium leading-6 text-gray-900">
                    Middle Name
                  </label>
                  <div className="mt-2">
                    <Controller
                      name="middle_name"
                      control={control}
                      render={({ field, fieldState }) => (
                        <InputText
                          disabled
                          id={field.name}
                          value={field.value}
                          name="middle_name"
                          className={classNames({ 'p-invalid': fieldState.error }, 'w-full')}
                          onChange={e => field.onChange(e.target.value)}
                        />
                      )}
                    />
                  </div>
                  {getFormErrorMessage('middle_name', errors)}
                </div>

                {/* Gender */}
                <div className="sm:col-span-3">
                  <label htmlFor="gender" className="block text-sm font-medium leading-6 text-gray-900">
                    Gender
                  </label>
                  <div className="mt-2">
                    <Controller
                      name="gender"
                      control={control}
                      rules={{ required: 'Gender is required.' }}
                      render={({ field, fieldState }) => (
                        <div>
                          <Dropdown
                            id={field.name}
                            value={field.value}
                            optionLabel="title"
                            options={genderOptions}
                            focusInputRef={field.ref}
                            onChange={e => field.onChange(e.value)}
                            className={classNames({ 'p-invalid': fieldState.error }, 'w-full')}
                          />
                        </div>
                      )}
                    />
                  </div>
                  {getFormErrorMessage('gender', errors)}
                </div>

                {/* Email */}
                <div className="sm:col-span-3">
                  <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                    Email address
                  </label>
                  <div className="mt-2">
                    <Controller
                      name="email"
                      control={control}
                      rules={{ required: 'Email is required' }}
                      render={({ field, fieldState }) => (
                        <InputText
                          disabled
                          value={field.value}
                          name="email"
                          className={classNames({ 'p-invalid': fieldState.error }, 'w-full')}
                          onChange={e => field.onChange(e.target.value)}
                        />
                      )}
                    />
                  </div>
                  {getFormErrorMessage('email', errors)}
                </div>

                {/* Phone Number */}
                <div className="sm:col-span-3">
                  <label htmlFor="phone_number" className="block text-sm font-medium leading-6 text-gray-900">
                    Phone number
                  </label>
                  <div className="mt-2">
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
                        <InputMask
                          id={field.name}
                          {...field}
                          mask="(999) 999-9999"
                          slotChar="x"
                          tooltip="E.g. (281) 330-8004"
                          tooltipOptions={tooltipOptions}
                          className={classNames({ 'p-invalid': fieldState.error }, 'w-full')}
                        />
                      )}
                    />
                    {getFormErrorMessage('phone_number', errors)}
                  </div>
                </div>

                {/* Birthday */}
                <div className="sm:col-span-6 sm:col-start-1">
                  <label htmlFor="birthday" className="block text-sm font-medium leading-6 text-gray-900">
                    Birthday
                  </label>
                  <div className="mt-2">
                    <Controller
                      name="birth_date"
                      control={control}
                      rules={{ required: 'Birth date is required' }}
                      render={({ field, fieldState }) => (
                        <div>
                          <Calendar
                            maxDate={new Date(2008, 0, 1)}
                            minDate={new Date(1940, 0, 1)}
                            inputId={field.name}
                            value={field.value ? new Date(field.value) : undefined}
                            onChange={field.onChange}
                            dateFormat="mm/dd/yy"
                            className={classNames({ 'p-invalid': fieldState.error }, 'w-full')}
                            showIcon
                          />
                        </div>
                      )}
                    />
                  </div>
                  {getFormErrorMessage('birth_date', errors)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
              <div>
                <h2 className="text-base font-semibold leading-7 text-gray-900">Address</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Use a permanent address where you can receive mail.
                </p>
              </div>

              <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                <div className="col-span-full">
                  <label htmlFor="address" className="block text-sm font-medium leading-6 text-gray-900">
                    Street address
                  </label>
                  <div className="mt-2">
                    <Controller
                      name="address"
                      control={control}
                      rules={{ required: 'Address is required' }}
                      render={({ field, fieldState }) => (
                        <InputText
                          id={field.name}
                          value={field.value}
                          name="address"
                          className={classNames({ 'p-invalid': fieldState.error }, 'w-full')}
                          onChange={e => field.onChange(e.target.value)}
                        />
                      )}
                    />
                  </div>
                  {getFormErrorMessage('address', errors)}
                </div>

                <div className="sm:col-span-2 sm:col-start-1">
                  <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
                    City
                  </label>
                  <div className="mt-2">
                    <Controller
                      name="city"
                      control={control}
                      rules={{ required: 'City is required' }}
                      render={({ field, fieldState }) => (
                        <InputText
                          id={field.name}
                          value={field.value}
                          name="city"
                          className={classNames({ 'p-invalid': fieldState.error }, 'w-full')}
                          onChange={e => field.onChange(e.target.value)}
                        />
                      )}
                    />
                  </div>
                  {getFormErrorMessage('city', errors)}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="state" className="block text-sm font-medium leading-6 text-gray-900">
                    State / Province
                  </label>
                  <div className="mt-2">
                    <Controller
                      name="state"
                      control={control}
                      rules={{ required: 'State is required' }}
                      render={({ field, fieldState }) => (
                        <InputText
                          id={field.name}
                          value={field.value}
                          name="state"
                          className={classNames({ 'p-invalid': fieldState.error }, 'w-full')}
                          onChange={e => field.onChange(e.target.value)}
                        />
                      )}
                    />
                  </div>
                  {getFormErrorMessage('state', errors)}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="zip" className="block text-sm font-medium leading-6 text-gray-900">
                    ZIP / Postal code
                  </label>
                  <div className="mt-2">
                    <Controller
                      name="zip"
                      control={control}
                      rules={{
                        required: 'ZIP is required',
                        pattern: {
                          value: /^\d{5}$/,
                          message: 'ZIP should be exactly 5 digits',
                        },
                      }}
                      render={({ field, fieldState }) => (
                        <>
                          <InputMask
                            id={field.name}
                            {...field}
                            mask="99999"
                            slotChar="x"
                            tooltip="E.g. 33065"
                            tooltipOptions={tooltipOptions}
                            className={classNames({ 'p-invalid': fieldState.error }, 'w-full')}
                          />
                          {fieldState.error ? <p className="error">{fieldState.error.message}</p> : null}
                        </>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
              <div>
                <h2 className="text-base font-semibold leading-7 text-gray-900">Notifications</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  We'll always let you know about important changes, but you pick what else you want to hear about.
                </p>
              </div>

              <div className="max-w-2xl space-y-10 md:col-span-2">
                <fieldset>
                  <legend className="text-sm font-semibold leading-6 text-gray-900">By Email / SMS</legend>
                  <div className="mt-6 space-y-6">
                    <div className="relative flex gap-x-3">
                      <div className="flex h-6 items-center">
                        <Controller
                          name="notifications"
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              inputId="notification_email"
                              checked={field.value?.includes('notification_email') || false}
                              onChange={e => {
                                const value = field.value || [] // Initialize as empty array if undefined
                                if (e.checked) {
                                  field.onChange([...value, 'notification_email']) // Use spread operator to add new value
                                } else {
                                  field.onChange(value.filter((item: string) => item !== 'notification_email'))
                                }
                              }}
                            />
                          )}
                        />
                      </div>
                      <div className="text-sm leading-6">
                        <label htmlFor="notification_email" className="font-medium text-gray-900">
                          Email Notifications
                        </label>
                        <p className="text-gray-500">Get notified when someones posts a comment on a posting.</p>
                      </div>
                    </div>
                    <div className="relative flex gap-x-3">
                      <div className="flex h-6 items-center">
                        <Controller
                          name="notifications"
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              inputId="notification_sms"
                              checked={field.value?.includes('notification_sms') || false}
                              onChange={e => {
                                const value = field.value || [] // Initialize as empty array if undefined
                                if (e.checked) {
                                  field.onChange([...value, 'notification_sms']) // Use spread operator to add new value
                                } else {
                                  field.onChange(value.filter((item: string) => item !== 'notification_sms'))
                                }
                              }}
                            />
                          )}
                        />
                      </div>
                      <div className="text-sm leading-6">
                        <label htmlFor="notification_sms" className="font-medium text-gray-900">
                          SMS Push Notifications
                        </label>
                        <p className="text-gray-500">Get notified when a candidate applies for a job.</p>
                      </div>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
          </div>
          <Toast ref={toast} />
          <div className="mt-6 flex items-center justify-end gap-x-6">
            <Button type="submit" label="Submit" />
          </div>
        </form>
      ) : null}
    </>
  )
}
