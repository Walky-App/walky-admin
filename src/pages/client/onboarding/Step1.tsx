import { PhotoIcon } from '@heroicons/react/24/solid'

import { InputText } from 'primereact/inputtext'
import { InputMask } from 'primereact/inputmask'
import { Dropdown } from 'primereact/dropdown'
import { FileUpload } from 'primereact/fileupload'

import { classNames } from 'primereact/utils'
import { useState } from 'react'
import { useForm, Controller, SubmitHandler, RegisterOptions, FieldValues, ControllerFieldState } from 'react-hook-form'
import TextInput from '../../../components/shared/forms/TextInput'
import { countries, states } from './formOptions'

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
  // state license document upload pdf, jpeg, jpg, png
  stateLicenseDocument: string
  // city license document upload pdf, jpeg, jpg, png
  cityLicenseDocument: string
}

export default function Step1() {
  const [showMessage, setShowMessage] = useState(false)

  const [formData, setFormData] = useState({})

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
    reset,
  } = useForm<IFormInputs>()

  const onSubmit: SubmitHandler<IFormInputs> = data => {
    setFormData(data)
    setShowMessage(true)

    reset()
  }

  const getFormErrorMessage = (name: keyof typeof errors) => {
    return errors[name] ? (
      <small className="p-error">{errors[name]?.message}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    )
  }

  interface InputComponentProps {
    name: keyof IFormInputs
    label: string
    rules: RegisterOptions
    renderInput: (field: FieldValues, fieldState: ControllerFieldState) => React.ReactElement
  }

  const InputComponent: React.FC<InputComponentProps> = ({ name, label, rules, renderInput }) => {
    return (
      <>
        <label htmlFor={name} className="block text-sm font-medium leading-6 text-gray-900">
          {label}
        </label>
        <div className="mt-2">
          <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field, fieldState }) => renderInput(field, fieldState)}
          />
        </div>
      </>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
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
              <InputComponent
                name="taxId"
                label="Tax ID:*"
                rules={{
                  required: true,
                  pattern: {
                    value: /^\d{2}-\d{7}$/,
                    message: 'Invalid Tax ID. E.g. 12-3456789',
                  },
                }}
                renderInput={(field, fieldState) => (
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

            <div className="sm:col-span-3">
              <InputComponent
                name="businessContactMobileNumber"
                label="Business Contact Mobile Number*"
                rules={{ required: true }}
                renderInput={(field, fieldState) => (
                  <InputMask
                    id={field.name}
                    {...field}
                    mask="(999) 999-9999"
                    slotChar="x"
                    tooltip="E.g. (123) 456-7890"
                    tooltipOptions={{ position: 'bottom' }}
                    className={classNames({ 'p-invalid': fieldState.invalid })}
                  />
                )}
              />
            </div>

            <div className="sm:col-span-3">
              <InputComponent
                name="businessContactFirstName"
                label="Business Contact First Name*"
                rules={{ required: 'Business Contact First Name is required.' }}
                renderInput={(field, fieldState) => (
                  <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                )}
              />
            </div>

            <div className="sm:col-span-3">
              <InputComponent
                name="businessContactLastName"
                label="Business Contact Last Name*"
                rules={{ required: 'Business Contact Last Name is required.' }}
                renderInput={(field, fieldState) => (
                  <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                )}
              />
            </div>

            <div className="sm:col-span-3">
              <InputComponent
                name="businessContactDesignation"
                label="Business Contact Designation*"
                rules={{ required: 'Business Contact Designation is required.' }}
                renderInput={(field, fieldState) => (
                  <Dropdown
                    id={field.name}
                    {...field}
                    options={[
                      { label: 'Manager', value: 'Manager' },
                      { label: 'Owner', value: 'Owner' },
                      { label: 'Other', value: 'Other' },
                    ]}
                    placeholder="Select a Designation"
                    className={classNames({ 'p-invalid': fieldState.invalid })}
                  />
                )}
              />
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
              <InputComponent
                name="country"
                label="Country*"
                rules={{ required: true }}
                renderInput={(field, fieldState) => (
                  <Dropdown
                    id={field.name}
                    {...field}
                    options={countries}
                    placeholder="Select a Country"
                    className={classNames({ 'p-invalid': fieldState.invalid })}
                  />
                )}
              />
            </div>

            <div className="sm:col-span-3">
              <InputComponent
                name="address"
                label="Street Address*"
                rules={{ required: true }}
                renderInput={(field, fieldState) => (
                  <TextInput id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                )}
              />
            </div>

            <div className="sm:col-span-3">
              <InputComponent
                name="address2"
                label="Apt, Suite or Unit"
                rules={{ required: false }}
                renderInput={(field, fieldState) => (
                  <TextInput id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                )}
              />
            </div>

            <div className="sm:col-span-3">
              <InputComponent
                name="city"
                label="City*"
                rules={{ required: true }}
                renderInput={(field, fieldState) => (
                  <TextInput id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                )}
              />
            </div>

            <div className="sm:col-span-3">
              <InputComponent
                name="state"
                label="State*"
                rules={{ required: true }}
                renderInput={(field, fieldState) => (
                  <Dropdown
                    id={field.name}
                    {...field}
                    options={states}
                    placeholder="Select a State"
                    className={classNames({ 'p-invalid': fieldState.invalid })}
                  />
                )}
              />
            </div>

            <div className="sm:col-span-3">
              <InputComponent
                name="postalCode"
                label="ZIP / Postal Code*"
                rules={{ required: true }}
                renderInput={(field, fieldState) => (
                  <InputMask
                    id={field.name}
                    {...field}
                    mask="99999"
                    slotChar="x"
                    tooltip="E.g. 12345"
                    tooltipOptions={{ position: 'bottom' }}
                    className={classNames({ 'p-invalid': fieldState.invalid })}
                  />
                )}
              />
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
                Upload State License Document*
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
                Upload City License Document*
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
        <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          Save
        </button>
      </div>
    </form>
  )
}
