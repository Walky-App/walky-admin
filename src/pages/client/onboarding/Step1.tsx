import { InputText } from 'primereact/inputtext'
import { InputMask } from 'primereact/inputmask'
import { Dropdown } from 'primereact/dropdown'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'

import { classNames } from 'primereact/utils'
import { useContext, useRef } from 'react'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { countries, states } from './formOptions'
import { FormDataContext, IFormInputs, StepProps } from '.'

export default function Step1({ step, setStep }: StepProps) {
  const { setFormData, defaultValues, setFacilitiesArray } = useContext(FormDataContext)

  const toast = useRef(null)

  const {
    control,
    formState: { errors },
    handleSubmit,
    getValues,
    reset,
  } = useForm<IFormInputs>({ defaultValues })

  const onSubmit: SubmitHandler<IFormInputs> = data => {
    setFormData(data)
    setFacilitiesArray(prevArray => [...prevArray, data])
    setStep(step + 1)

    // @ts-ignore
    toast.current?.show({ severity: 'success', summary: 'Form Submitted', detail: getValues('facilityName') })

    reset()
  }

  const getFormErrorMessage = (name: keyof typeof errors) => {
    return errors[name] ? (
      <small className="p-error">{errors[name]?.message}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
      <Toast ref={toast} />
      <div className="space-y-12">
        {/* Business Information */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Business Information</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Please provide information about your business so that we can verify you on the platform.
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
            <div className="sm:col-span-3">
              <label htmlFor="taxId" className="block text-sm font-medium leading-6 text-gray-900">
                *Tax ID:
              </label>
              <div className="mt-2">
                <Controller
                  control={control}
                  name="taxId"
                  rules={{
                    required: 'Tax ID is required',
                    pattern: {
                      value: /^\d{2}-\d{7}$/,
                      message: 'Invalid Tax ID. E.g. 12-3456789',
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <InputMask
                      id={field.name}
                      {...field}
                      mask="99-9999999"
                      slotChar="x"
                      tooltip="A Tax Identification Number (TIN) in the United States is a unique identifier assigned to individuals and businesses for tax purposes. It helps government authorities track financial activities, ensure accurate tax reporting, and maintain transparency in financial transactions."
                      tooltipOptions={{ position: 'bottom' }}
                      className={classNames({ 'p-invalid': fieldState.invalid })}
                    />
                  )}
                />
              </div>
              {getFormErrorMessage('taxId')}
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="businessContactMobileNumber"
                className="block text-sm font-medium leading-6 text-gray-900">
                *Business Contact Mobile Number:
              </label>
              <div className="mt-2">
                <Controller
                  control={control}
                  name="businessContactMobileNumber"
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
                      tooltipOptions={{ position: 'bottom' }}
                      className={classNames({ 'p-invalid': fieldState.invalid })}
                    />
                  )}
                />
              </div>
              {getFormErrorMessage('businessContactMobileNumber')}
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="businessContactFirstName" className="block text-sm font-medium leading-6 text-gray-900">
                *Business Contact First Name:
              </label>
              <div className="mt-2">
                <Controller
                  control={control}
                  name="businessContactFirstName"
                  rules={{ required: 'First Name is required' }}
                  render={({ field, fieldState }) => (
                    <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                  )}
                />
              </div>
              {getFormErrorMessage('businessContactFirstName')}
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="businessContactLastName" className="block text-sm font-medium leading-6 text-gray-900">
                *Business Contact Last Name:
              </label>
              <div className="mt-2">
                <Controller
                  control={control}
                  name="businessContactLastName"
                  rules={{ required: 'Last Name is required' }}
                  render={({ field, fieldState }) => (
                    <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                  )}
                />
              </div>
              {getFormErrorMessage('businessContactLastName')}
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="businessContactDesignation" className="block text-sm font-medium leading-6 text-gray-900">
                *Business Contact Designation:
              </label>
              <div className="mt-2">
                <Controller
                  control={control}
                  name="businessContactDesignation"
                  rules={{ required: 'Designation is required' }}
                  render={({ field, fieldState }) => (
                    <Dropdown
                      id={field.name}
                      {...field}
                      filter
                      options={['Manager', 'Owner', 'Employee']}
                      className={classNames({ 'p-invalid': fieldState.invalid })}
                    />
                  )}
                />
              </div>
              {getFormErrorMessage('businessContactDesignation')}
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="businessName" className="block text-sm font-medium leading-6 text-gray-900">
                *Business Name:
              </label>
              <div className="mt-2">
                <Controller
                  control={control}
                  name="businessName"
                  rules={{ required: 'Business Name is required' }}
                  render={({ field, fieldState }) => (
                    <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                  )}
                />
              </div>
              {getFormErrorMessage('businessContactDesignation')}
            </div>
          </div>
        </div>

        {/* Business Location */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Business Location</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Please provide your business address information below.
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
            <div className="sm:col-span-3">
              <label htmlFor="facilityName" className="block text-sm font-medium leading-6 text-gray-900">
                *Facility Name:
              </label>
              <div className="mt-2">
                <Controller
                  control={control}
                  name="facilityName"
                  rules={{ required: 'Facility Name is required' }}
                  render={({ field, fieldState }) => (
                    <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                  )}
                />
              </div>
              {getFormErrorMessage('facilityName')}
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="country" className="block text-sm font-medium leading-6 text-gray-900">
                *Country:
              </label>
              <div className="mt-2">
                <Controller
                  control={control}
                  name="country"
                  rules={{ required: 'Country is required' }}
                  render={({ field, fieldState }) => (
                    <Dropdown
                      id={field.name}
                      {...field}
                      filter
                      options={countries}
                      className={classNames({ 'p-invalid': fieldState.invalid })}
                    />
                  )}
                />
              </div>
              {getFormErrorMessage('country')}
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="address" className="block text-sm font-medium leading-6 text-gray-900">
                *Address:
              </label>
              <div className="mt-2">
                <Controller
                  control={control}
                  name="address"
                  rules={{ required: 'Address is required' }}
                  render={({ field, fieldState }) => (
                    <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                  )}
                />
              </div>
              {getFormErrorMessage('address')}
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="address2" className="block text-sm font-medium leading-6 text-gray-900">
                Apt, Suite or Unit:
              </label>
              <div className="mt-2">
                <Controller
                  control={control}
                  name="address2"
                  render={({ field }) => <InputText id={field.name} {...field} />}
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
                *City:
              </label>
              <div className="mt-2">
                <Controller
                  control={control}
                  name="city"
                  rules={{ required: 'City is required' }}
                  render={({ field, fieldState }) => (
                    <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                  )}
                />
              </div>
              {getFormErrorMessage('city')}
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="state" className="block text-sm font-medium leading-6 text-gray-900">
                *State:
              </label>
              <div className="mt-2">
                <Controller
                  control={control}
                  name="state"
                  rules={{ required: 'State is required' }}
                  render={({ field, fieldState }) => <Dropdown id={field.name} {...field} filter options={states} />}
                />
              </div>
              {getFormErrorMessage('state')}
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="postalCode" className="block text-sm font-medium leading-6 text-gray-900">
                *Postal Code:
              </label>
              <div className="mt-2">
                <Controller
                  control={control}
                  name="postalCode"
                  rules={{ required: 'Postal Code is required' }}
                  render={({ field, fieldState }) => (
                    <InputMask
                      id={field.name}
                      {...field}
                      mask="99999"
                      slotChar="x"
                      tooltip="E.g. 90210"
                      tooltipOptions={{ position: 'bottom' }}
                      className={classNames({ 'p-invalid': fieldState.invalid })}
                    />
                  )}
                />
              </div>
              {getFormErrorMessage('postalCode')}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <div>
          <Button type="submit" label="Submit" />
        </div>
      </div>
    </form>
  )
}
