import { InputText } from 'primereact/inputtext'
import { InputMask } from 'primereact/inputmask'
import { Dropdown } from 'primereact/dropdown'
import { FileUpload } from 'primereact/fileupload'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'

import { classNames } from 'primereact/utils'
import { useRef, useState } from 'react'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'

interface IFormInputs {
  taxId: string
  businessContactMobileNumber: string
  businessContactFirstName: string
  businessContactLastName: string
  businessContactDesignation: string
  country: string
  address: string
  address2: string
  city: string
  state: string
  postalCode: string
  stateLicenseDocument: string
  cityLicenseDocument: string
}

export default function Step1() {
  const toast = useRef(null)

  const show = () => {
    // @ts-ignore
    toast.current?.show({ severity: 'success', summary: 'Form Submitted', detail: getValues('taxId') })
  }

  const [formData, setFormData] = useState({})
  console.log('formData: ', formData)

  const defaultValues = {
    taxId: '',
    businessContactMobileNumber: '',
    businessContactFirstName: '',
    businessContactLastName: '',
    businessContactDesignation: '',
    country: '',
    address: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    stateLicenseDocument: '',
    cityLicenseDocument: '',
  }

  const {
    control,
    formState: { errors },
    handleSubmit,
    getValues,
    reset,
  } = useForm<IFormInputs>({ defaultValues })

  const onSubmit: SubmitHandler<IFormInputs> = data => {
    setFormData(data)
    show()

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
                      tooltip="E.g. 12-3456789"
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
                      options={[
                        { label: 'United States', value: 'usa' },
                        { label: 'Canada', value: 'canada' },
                        { label: 'Mexico', value: 'mexico' },
                      ]}
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
                  render={({ field, fieldState }) => (
                    <Dropdown
                      id={field.name}
                      {...field}
                      filter
                      options={[
                        { label: 'Alabama', value: 'AL' },
                        { label: 'Alaska', value: 'AK' },
                        { label: 'Arizona', value: 'AZ' },
                        { label: 'Arkansas', value: 'AR' },
                        { label: 'California', value: 'CA' },
                        { label: 'Colorado', value: 'CO' },
                        { label: 'Connecticut', value: 'CT' },
                        { label: 'Delaware', value: 'DE' },
                        { label: 'Florida', value: 'FL' },
                        { label: 'Georgia', value: 'GA' },
                        { label: 'Hawaii', value: 'HI' },
                        { label: 'Idaho', value: 'ID' },
                        { label: 'Illinois', value: 'IL' },
                        { label: 'Indiana', value: 'IN' },
                        { label: 'Iowa', value: 'IA' },
                        { label: 'Kansas', value: 'KS' },
                        { label: 'Kentucky', value: 'KY' },
                        { label: 'Louisiana', value: 'LA' },
                        { label: 'Maine', value: 'ME' },
                        { label: 'Maryland', value: 'MD' },
                        { label: 'Massachusetts', value: 'MA' },
                        { label: 'Michigan', value: 'MI' },
                        { label: 'Minnesota', value: 'MN' },
                        { label: 'Mississippi', value: 'MS' },
                        { label: 'Missouri', value: 'MO' },
                        { label: 'Montana', value: 'MT' },
                        { label: 'Nebraska', value: 'NE' },
                        { label: 'Nevada', value: 'NV' },
                        { label: 'New Hampshire', value: 'NH' },
                        { label: 'New Jersey', value: 'NJ' },
                        { label: 'New Mexico', value: 'NM' },
                        { label: 'New York', value: 'NY' },
                        { label: 'North Carolina', value: 'NC' },
                        { label: 'North Dakota', value: 'ND' },
                        { label: 'Ohio', value: 'OH' },
                        { label: 'Oklahoma', value: 'OK' },
                        { label: 'Oregon', value: 'OR' },
                        { label: 'Pennsylvania', value: 'PA' },
                        { label: 'Rhode Island', value: 'RI' },
                        { label: 'South Carolina', value: 'SC' },
                        { label: 'South Dakota', value: 'SD' },
                        { label: 'Tennessee', value: 'TN' },
                        { label: 'Texas', value: 'TX' },
                        { label: 'Utah', value: 'UT' },
                        { label: 'Vermont', value: 'VT' },
                        { label: 'Virginia', value: 'VA' },
                        { label: 'Washington', value: 'WA' },
                        { label: 'West Virginia', value: 'WV' },
                        { label: 'Wisconsin', value: 'WI' },
                        { label: 'Wyoming', value: 'WY' },
                      ]}
                    />
                  )}
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

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Business License Document</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Please upload your business license documents. Please make sure your upload is clear without any warped or
              blur portions and shows all relevant information.
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
            <div className="sm:col-span-6">
              <label htmlFor="demo" className="block text-sm font-medium leading-6 text-gray-900">
                *Upload State License Document
              </label>
              <div className="mt-2">
                <FileUpload
                  mode="basic"
                  name="demo[]"
                  url="/api/upload"
                  accept="image/*"
                  maxFileSize={1000000}
                  // onUpload={onUpload}
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="demo" className="block text-sm font-medium leading-6 text-gray-900">
                *Upload City License Document
              </label>
              <div className="mt-2">
                <FileUpload
                  name="demo"
                  url={'/api/upload'}
                  multiple
                  accept="image/*"
                  maxFileSize={1000000}
                  emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>}
                />
              </div>
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

export const countries = [
  { label: 'United States', value: 'US' },
  { label: 'Canada', value: 'CA' },
  { label: 'Mexico', value: 'MX' },
]
