import { InputText } from 'primereact/inputtext'
import { InputMask } from 'primereact/inputmask'
import { Dropdown } from 'primereact/dropdown'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'

import { classNames } from 'primereact/utils'
import { useContext, useRef } from 'react'
import { useForm, Controller, SubmitHandler, useFieldArray } from 'react-hook-form'
import { countries, states } from './formOptions'
import { FormDataContext, IFacilityFormInputs, StepProps, getFormErrorMessage, tooltipOptions } from '.'
import { InputNumber } from 'primereact/inputnumber'
import { RequestService } from '../../../services/RequestService'

export default function Step1({ step, setStep }: StepProps) {
  const { setFormData, defaultValues, formData, setFacilitiesArray, editingIndex, setEditingIndex } =
    useContext(FormDataContext)

  const toast = useRef(null)

  const values = formData || defaultValues

  const {
    control,
    formState: { errors },
    handleSubmit,
    getValues,
    reset,
  } = useForm<IFacilityFormInputs>({ values })

  const { fields } = useFieldArray({
    control,
    name: 'contacts',
  })

  const onSubmit: SubmitHandler<IFacilityFormInputs> = async data => {
    setFormData(data)

    if (editingIndex !== null) {
      // Update the facility at editingIndex
      setFacilitiesArray(prevArray => [...prevArray.slice(0, editingIndex), data, ...prevArray.slice(editingIndex + 1)])
      setEditingIndex(null) // Reset editingIndex
    } else {
      // Add the new facility to the end of the facilitiesArray
      setFacilitiesArray(prevArray => [...prevArray, data])
    }

    try {
      const response = await RequestService(`facilities`, 'POST', data)
      if (response.ok) {
        // @ts-ignore
        toast.current?.show({
          severity: 'success',
          summary: 'Form Submitted',
          detail: getValues('name'),
          onClose: () => setStep(step + 1),
        })
      } else {
        throw new Error('Failed to add facility')
      }
    } catch (error) {
      console.error('Error adding facility:', error)
      // @ts-ignore
      toast.current?.show({ severity: 'error', summary: 'Error adding facility', detail: getValues('name') })
    }

    reset()
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
              <label htmlFor="tax_id" className="block text-sm font-medium leading-6 text-gray-900">
                *Tax ID:
              </label>
              <div className="mt-2">
                <Controller
                  control={control}
                  name="tax_id"
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
                      tooltipOptions={tooltipOptions}
                      className={classNames({ 'p-invalid': fieldState.invalid })}
                    />
                  )}
                />
              </div>
              {getFormErrorMessage('tax_id', errors)}
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="corp_name" className="block text-sm font-medium leading-6 text-gray-900">
                *Corporate Name:
              </label>
              <div className="mt-2">
                <Controller
                  control={control}
                  name="corp_name"
                  rules={{ required: 'Corporate Name is required' }}
                  render={({ field, fieldState }) => (
                    <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                  )}
                />
              </div>
              {getFormErrorMessage('corp_name', errors)}
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="company_dbas" className="block text-sm font-medium leading-6 text-gray-900">
                *Company DBAs:
              </label>
              <div className="mt-2">
                <Controller
                  control={control}
                  name="company_dbas"
                  rules={{ required: 'Company DBAs is required' }}
                  render={({ field, fieldState }) => (
                    <InputText
                      id={field.name}
                      value={field.value.join(', ')}
                      onChange={e => field.onChange(e.target.value.split(', '))}
                      tooltip="Enter company DBAs separated by comma"
                      tooltipOptions={tooltipOptions}
                      className={classNames({ 'p-invalid': fieldState.invalid })}
                    />
                  )}
                />
              </div>
              {getFormErrorMessage('company_dbas', errors)}
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                *Facility Name:
              </label>
              <div className="mt-2">
                <Controller
                  control={control}
                  name="name"
                  rules={{ required: 'Facility Name is required' }}
                  render={({ field, fieldState }) => (
                    <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                  )}
                />
              </div>
              {getFormErrorMessage('name', errors)}
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="phone_number" className="block text-sm font-medium leading-6 text-gray-900">
                *Facility Phone Number:
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
                      className={classNames({ 'p-invalid': fieldState.invalid })}
                    />
                  )}
                />
              </div>
              {getFormErrorMessage('phone_number', errors)}
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="sqft" className="block text-sm font-medium leading-6 text-gray-900">
                *Facility Square Footage:
              </label>
              <div className="mt-2">
                <Controller
                  control={control}
                  name="sqft"
                  rules={{
                    required: 'Facility Square Footage is required',
                    pattern: {
                      value: /^\d+$/,
                      message: 'Invalid Facility Square Footage. It should be a number.',
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <InputNumber
                      id={field.name}
                      {...field}
                      onChange={e => field.onChange(Number(e.value))}
                      suffix=" sqft"
                      min={0}
                      tooltip="E.g. 10000 sqft"
                      tooltipOptions={tooltipOptions}
                      className={classNames({ 'p-invalid': fieldState.invalid })}
                    />
                  )}
                />
              </div>
              {getFormErrorMessage('sqft', errors)}
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
            {/* <div className="sm:col-span-3">
              <label htmlFor="facilityName" className="block text-sm font-medium leading-6 text-gray-900">
                *Facility Name:
              </label>
              <div className="mt-2">
                <Controller
                  control={control}
                  name="name"
                  rules={{ required: 'Facility Name is required' }}
                  render={({ field, fieldState }) => (
                    <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                  )}
                />
              </div>
              {getFormErrorMessage('name', errors)}
            </div> */}

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
              {getFormErrorMessage('country', errors)}
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
              {getFormErrorMessage('address', errors)}
            </div>

            {/* <div className="sm:col-span-3">
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
            </div> */}

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
              {getFormErrorMessage('city', errors)}
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
                      options={states}
                      className={classNames({ 'p-invalid': fieldState.invalid })}
                    />
                  )}
                />
              </div>
              {getFormErrorMessage('state', errors)}
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="postalCode" className="block text-sm font-medium leading-6 text-gray-900">
                *Postal Code:
              </label>
              <div className="mt-2">
                <Controller
                  control={control}
                  name="zip"
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
              {getFormErrorMessage('zip', errors)}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Business Contact Information</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">Please provide your contact information below.</p>
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
              <div className="sm:col-span-3">
                <label
                  htmlFor={`contacts.${index}.first_name`}
                  className="block text-sm font-medium leading-6 text-gray-900">
                  *First Name:
                </label>
                <div className="mt-2">
                  <Controller
                    control={control}
                    name={`contacts.${index}.first_name`}
                    rules={{ required: 'First Name is required' }}
                    render={({ field, fieldState }) => (
                      <InputText
                        id={field.name}
                        {...field}
                        className={classNames({ 'p-invalid': fieldState.invalid })}
                      />
                    )}
                  />
                </div>
                {getFormErrorMessage(`contacts.${index}.first_name`, errors)}
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor={`contacts.${index}.last_name`}
                  className="block text-sm font-medium leading-6 text-gray-900">
                  *Last Name:
                </label>
                <div className="mt-2">
                  <Controller
                    control={control}
                    name={`contacts.${index}.last_name`}
                    rules={{ required: 'Last Name is required' }}
                    render={({ field, fieldState }) => (
                      <InputText
                        id={field.name}
                        {...field}
                        className={classNames({ 'p-invalid': fieldState.invalid })}
                      />
                    )}
                  />
                </div>
                {getFormErrorMessage(`contacts.${index}.last_name`, errors)}
              </div>

              <div className="sm:col-span-3">
                <label htmlFor={`contacts.${index}.role`} className="block text-sm font-medium leading-6 text-gray-900">
                  *Role:
                </label>
                <div className="mt-2">
                  <Controller
                    control={control}
                    name={`contacts.${index}.role`}
                    rules={{ required: 'Role is required' }}
                    render={({ field, fieldState }) => (
                      <Dropdown
                        id={field.name}
                        {...field}
                        filter
                        options={['Owner', 'AP', 'Onsite', 'Security', 'Other']}
                        className={classNames({ 'p-invalid': fieldState.invalid })}
                      />
                    )}
                  />
                </div>
                {getFormErrorMessage(`contacts.${index}.role`, errors)}
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor={`contacts.${index}.phone_number`}
                  className="block text-sm font-medium leading-6 text-gray-900">
                  *Phone Number:
                </label>
                <div className="mt-2">
                  <Controller
                    control={control}
                    name={`contacts.${index}.phone_number`}
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
                        className={classNames({ 'p-invalid': fieldState.invalid })}
                      />
                    )}
                  />
                </div>
                {getFormErrorMessage(`contacts.${index}.phone_number`, errors)}
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor={`contacts.${index}.email`}
                  className="block text-sm font-medium leading-6 text-gray-900">
                  *Email:
                </label>
                <div className="mt-2">
                  <Controller
                    control={control}
                    name={`contacts.${index}.email`}
                    rules={{
                      required: 'Email is required',
                      pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: 'Invalid email',
                      },
                    }}
                    render={({ field, fieldState }) => (
                      <InputText
                        id={field.name}
                        {...field}
                        className={classNames({ 'p-invalid': fieldState.invalid })}
                      />
                    )}
                  />
                </div>
                {getFormErrorMessage(`contacts.${index}.email`, errors)}
              </div>
            </div>
          ))}
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
