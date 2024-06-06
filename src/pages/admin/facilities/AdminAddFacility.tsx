import { useState, useEffect } from 'react'

import { Controller, type SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import { InputMask } from 'primereact/inputmask'
import { InputNumber } from 'primereact/inputnumber'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { MultiSelect, type MultiSelectChangeEvent } from 'primereact/multiselect'
import { classNames } from 'primereact/utils'

import { AddressAutoComplete, type IAddressAutoComplete } from '../../../components/shared/forms/AddressAutoComplete'
import { HtInputHelpText } from '../../../components/shared/forms/HtInputHelpText'
import { HtInputLabel } from '../../../components/shared/forms/HtInputLabel'
import { HtInfoTooltip } from '../../../components/shared/general/HtInfoTooltip'
import { RequestService } from '../../../services/RequestService'
import { useUtils } from '../../../store/useUtils'
import { jobTitlesOptions, facilityContactRoles } from '../../../utils/formOptions'
import { getFormErrorMessage } from '../../../utils/formUtils'
import { requiredFieldsNoticeText } from '../../../utils/formUtils'
import { roleChecker } from '../../../utils/roleChecker'

interface IFacilityFormInputs {
  user_id: string
  name: string
  country: string
  address: string
  city: string
  state: string
  zip: string
  tax_id: string
  location_pin: number[]
  phone_number: string
  notes: string
  active: boolean
  sqft: number | undefined
  corp_name: string
  company_dbas: string[]
  services: string[]
  images: IImage[]
  contacts: IContact[]
  licenses: ILicenseDocument[]
  _id?: string
}

interface ILicenseDocument {
  id: number
  url: string
  key: string
  timestamp: string
}

interface IContact {
  first_name: string
  last_name: string
  role: string
  phone_number: string
  email: string
}

interface IImage {
  id: number
  url: string
  key: string
  timestamp: string
}

const defaultFacilityFormValues: IFacilityFormInputs = {
  user_id: '',
  name: '',
  country: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  location_pin: [],
  tax_id: '',
  phone_number: '',
  notes: '',
  active: false,
  sqft: undefined,
  corp_name: '',
  company_dbas: [],
  services: [],
  images: [],
  contacts: [
    {
      first_name: '',
      last_name: '',
      role: '',
      phone_number: '',
      email: '',
    },
  ],
  licenses: [],
}

const defaultMoreAddressDetails: IAddressAutoComplete = {
  zip: undefined,
  state: undefined,
  city: undefined,
  location_pin: undefined,
  address: undefined,
  country: undefined,
}

export const AdminAddFacility = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<IFacilityFormInputs>(defaultFacilityFormValues)
  const [facilitiesArray, setFacilitiesArray] = useState<IFacilityFormInputs[]>([])
  const [moreAddressDetails, setMoreAddressDetails] = useState<IAddressAutoComplete | undefined>(
    defaultMoreAddressDetails,
  )

  const { showToast } = useUtils()
  const navigate = useNavigate()
  const role = roleChecker()

  const values = formData !== null ? formData : defaultFacilityFormValues

  const {
    control,
    formState: { errors },
    handleSubmit,
    getValues,
    setValue,
  } = useForm<IFacilityFormInputs>({ values })

  useEffect(() => {
    if (moreAddressDetails) {
      if (moreAddressDetails.zip) {
        setValue('zip', moreAddressDetails.zip)
      }
      if (moreAddressDetails.state) {
        setValue('state', moreAddressDetails.state)
      }
      if (moreAddressDetails.city) {
        setValue('city', moreAddressDetails.city)
      }
      if (moreAddressDetails.location_pin) {
        setValue('location_pin', moreAddressDetails.location_pin)
      }
      if (moreAddressDetails.address) {
        setValue('address', moreAddressDetails.address)
      }
      if (moreAddressDetails.country) {
        setValue('country', moreAddressDetails.country)
      }

      setMoreAddressDetails(undefined)
    }
  }, [moreAddressDetails, setMoreAddressDetails, setValue])

  const { fields } = useFieldArray({
    control,
    name: 'contacts',
  })

  const onSubmit: SubmitHandler<IFacilityFormInputs> = async data => {
    setFormData(data)
    setIsLoading(true)

    let facilityId = facilitiesArray[0]?._id

    if (facilityId != null) {
      try {
        const facilityFound = await RequestService(`facilities/${facilityId}`)

        if (facilityFound !== null) {
          const updatedFacility = {
            ...facilityFound,
            ...data,
            licenses: facilitiesArray[0].licenses,
            images: facilitiesArray[0].images,
          }

          const response = await RequestService(`facilities/${facilityId}`, 'PATCH', updatedFacility)

          if (response?._id !== null) {
            facilityId = response._id

            setFacilitiesArray(prevArray =>
              prevArray.map(facility => (facility._id === response._id ? response : facility)),
            )
          } else {
            throw new Error('Failed to update facility')
          }
        } else {
          throw new Error('Facility not found')
        }
      } catch (error) {
        console.error('Error updating facility:', error)

        showToast({
          severity: 'error',
          summary: 'Error saving changes',
          detail: `${getValues('name')} could not be updated.`,
        })
        setIsLoading(false)
      }
    } else {
      try {
        const response = await RequestService(`facilities`, 'POST', data)

        if (response?._id !== null) {
          facilityId = response._id

          setFacilitiesArray([response])

          showToast({
            severity: 'success',
            summary: 'Facility Added',
            detail: `${getValues('name')} has been added successfully.`,
            life: 2000,
          })

          setTimeout(() => {
            navigate(`/${role}/facilities/${facilityId}`)
          }, 2000)
        } else {
          throw new Error('Failed to add facility')
        }
      } catch (error) {
        console.error('Error adding facility:', error)

        showToast({
          severity: 'error',
          summary: 'Error adding facility',
          detail: `${getValues('name')} already exists.`,
        })
        setIsLoading(false)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
      <div className="space-y-4 sm:space-y-12">
        {/* Business Information */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-4 border-b border-gray-900/10 pb-12 sm:gap-y-10 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Business Information</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Please provide information about your business so that we can verify you on the platform.
            </p>
            {requiredFieldsNoticeText}
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
            <div className="sm:col-span-3">
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
                  <>
                    <HtInfoTooltip message="A Tax Identification Number (TIN) in the United States is a unique identifier assigned to individuals and businesses for tax purposes. It helps government authorities track financial activities, ensure accurate tax reporting, and maintain transparency in financial transactions.">
                      <HtInputLabel htmlFor={field.name} asterisk labelText="Tax ID" />
                    </HtInfoTooltip>
                    <InputMask
                      id={field.name}
                      {...field}
                      mask="99-9999999"
                      slotChar="x"
                      className={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2')}
                      autoComplete="off"
                    />
                    {getFormErrorMessage('tax_id', errors)}
                  </>
                )}
              />
            </div>

            <div className="sm:col-span-3">
              <Controller
                control={control}
                name="corp_name"
                rules={{ required: 'Corporate Name is required' }}
                render={({ field, fieldState }) => (
                  <>
                    <HtInfoTooltip message="A corporate name is the legal name of a corporation. It is the name that appears on the corporation's formation documents and is the name that appears on the corporation's state-issued certificate of incorporation.">
                      <HtInputLabel htmlFor={field.name} asterisk labelText="Corporate Name" />
                    </HtInfoTooltip>
                    <InputText
                      id={field.name}
                      {...field}
                      className={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2')}
                    />
                    {getFormErrorMessage('corp_name', errors)}
                  </>
                )}
              />
            </div>

            <div className="sm:col-span-3">
              <Controller
                control={control}
                name="company_dbas"
                render={({ field, fieldState }) => (
                  <>
                    <HtInfoTooltip message="Doing Business As (DBA) is a company name that is different from the legal name of the business. DBA is also known as a trade name, fictitious business name, or assumed business name.">
                      <HtInputLabel htmlFor={field.name} labelText="Company DBAs" />
                    </HtInfoTooltip>
                    <InputText
                      id={field.name}
                      value={field.value.join(', ')}
                      onChange={e => field.onChange(e.target.value.split(', '))}
                      className={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2')}
                      aria-describedby={`${field.name}-help`}
                    />
                    <HtInputHelpText
                      fieldName={field.name}
                      helpText="Enter DBAs separated by a comma: dba1, dba2, dba3"
                    />
                    {getFormErrorMessage('company_dbas', errors)}
                  </>
                )}
              />
            </div>

            <div className="sm:col-span-3">
              <Controller
                control={control}
                name="name"
                rules={{ required: 'Facility Name is required' }}
                render={({ field, fieldState }) => (
                  <>
                    <HtInfoTooltip message="The name of your first facility. You will be able to add additional facilities after you complete the onboarding process for this facility.">
                      <HtInputLabel htmlFor={field.name} asterisk labelText="Facility Name" />
                    </HtInfoTooltip>
                    <InputText
                      id={field.name}
                      {...field}
                      className={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2')}
                      autoComplete="off"
                    />
                    {getFormErrorMessage('name', errors)}
                  </>
                )}
              />
            </div>

            <div className="sm:col-span-3">
              <Controller
                control={control}
                name="phone_number"
                rules={{
                  required: 'Phone Number is required, should be 10 digits.',
                  pattern: /^\d{10}$/,
                }}
                render={({ field, fieldState }) => (
                  <>
                    <HtInfoTooltip message="The phone number of your facility. This is the number that workers will call if they have questions or need to contact you.">
                      <HtInputLabel htmlFor={field.name} asterisk labelText="Facility Phone Number" />
                    </HtInfoTooltip>
                    <InputMask
                      id={field.name}
                      {...field}
                      mask="(999) 999-9999"
                      slotChar="x"
                      unmask={true}
                      className={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2')}
                      autoComplete="off"
                    />
                    {getFormErrorMessage('phone_number', errors)}
                  </>
                )}
              />
            </div>

            <div className="sm:col-span-3">
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
                  <>
                    <HtInfoTooltip message="The square footage of your facility. This is the total area of your facility in square feet.">
                      <HtInputLabel htmlFor={field.name} asterisk labelText="Facility Square Footage" />
                    </HtInfoTooltip>
                    <InputNumber
                      id={field.name}
                      {...field}
                      onChange={e => field.onChange(Number(e.value))}
                      min={0}
                      max={1000000}
                      className={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2')}
                      pt={{
                        input: { root: { autoComplete: 'off' } },
                      }}
                    />
                    <HtInputHelpText fieldName={field.name} helpText="Max 1,000,000" />
                    {getFormErrorMessage('sqft', errors)}
                  </>
                )}
              />
            </div>

            <div className="sm:col-span-6">
              <Controller
                control={control}
                name="services"
                rules={{ required: 'At least one Service is required' }}
                render={({ field, fieldState }) => (
                  <>
                    <HtInfoTooltip message="The services that your facility offers.">
                      <HtInputLabel htmlFor={field.name} asterisk labelText="Services" />
                    </HtInfoTooltip>
                    <MultiSelect
                      id={field.name}
                      {...field}
                      value={field.value}
                      optionLabel="title"
                      options={jobTitlesOptions}
                      display="chip"
                      selectAll
                      selectAllLabel="Select All"
                      onChange={(e: MultiSelectChangeEvent) => field.onChange(e.value)}
                      placeholder="Select Services"
                      className={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2')}
                    />
                    <HtInputHelpText
                      fieldName={field.name}
                      helpText="Please select all services that your facility offers."
                    />
                    {getFormErrorMessage('services', errors)}
                  </>
                )}
              />
            </div>

            <div className="sm:col-span-6">
              <Controller
                control={control}
                name="notes"
                rules={{ required: false }}
                render={({ field, fieldState }) => (
                  <>
                    <HtInfoTooltip message="Any additional notes that you would like to provide about your facility. This information will be verified before application approval.">
                      <HtInputLabel htmlFor={field.name} labelText="Arrival notes" />
                    </HtInfoTooltip>
                    <InputTextarea
                      id={field.name}
                      {...field}
                      rows={4}
                      cols={30}
                      maxLength={500}
                      className={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2')}
                      autoComplete="off"
                    />
                    <HtInputHelpText
                      fieldName={field.name}
                      helpText="Max 500 characters. Please do not enter contact information into this field."
                    />
                    {getFormErrorMessage('notes', errors)}
                  </>
                )}
              />
            </div>
          </div>
        </div>

        {/* Business Location */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-4 border-b border-gray-900/10 pb-12 sm:gap-y-10 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Business Location</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Please provide your facility business address information.
            </p>
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
                    <HtInfoTooltip message="The address of your facility. This is the physical location of your facility.">
                      <HtInputLabel htmlFor={field.name} asterisk labelText="Facility Address" />
                    </HtInfoTooltip>
                    <AddressAutoComplete
                      controlled
                      setMoreAddressDetails={setMoreAddressDetails}
                      currentAddress={field.value}
                      onChange={field.onChange}
                      value={field.value}
                      classNames={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2')}
                      aria-describedby={`${field.name}-help`}
                    />
                    <HtInputHelpText fieldName={field.name} helpText="Only Commercial Address" />
                    {getFormErrorMessage('address', errors)}
                  </>
                )}
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-4 border-b border-gray-900/10 pb-12 sm:gap-y-10 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Business Contact Information</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">Please provide your contact information below.</p>
            {requiredFieldsNoticeText}
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
              <div className="sm:col-span-3">
                <Controller
                  control={control}
                  name={`contacts.${index}.first_name`}
                  rules={{ required: 'First Name is required' }}
                  render={({ field, fieldState }) => (
                    <>
                      <HtInfoTooltip message="The first name of the contact person.">
                        <HtInputLabel htmlFor={field.name} asterisk labelText="First Name" />
                      </HtInfoTooltip>
                      <InputText
                        id={field.name}
                        {...field}
                        className={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2')}
                        autoComplete="off"
                      />
                      {getFormErrorMessage(`contacts.${index}.first_name`, errors)}
                    </>
                  )}
                />
              </div>

              <div className="sm:col-span-3">
                <Controller
                  control={control}
                  name={`contacts.${index}.last_name`}
                  rules={{ required: 'Last Name is required' }}
                  render={({ field, fieldState }) => (
                    <>
                      <HtInfoTooltip message="The last name of the contact person.">
                        <HtInputLabel htmlFor={field.name} asterisk labelText="Last Name" />
                      </HtInfoTooltip>
                      <InputText
                        id={field.name}
                        {...field}
                        className={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2')}
                      />
                      {getFormErrorMessage(`contacts.${index}.last_name`, errors)}
                    </>
                  )}
                />
              </div>

              <div className="sm:col-span-3">
                <Controller
                  control={control}
                  name={`contacts.${index}.role`}
                  rules={{ required: 'Role is required' }}
                  render={({ field, fieldState }) => (
                    <>
                      <HtInfoTooltip message="The role of the contact person.">
                        <HtInputLabel htmlFor={field.name} asterisk labelText="Role" />
                      </HtInfoTooltip>
                      <Dropdown
                        id={field.name}
                        {...field}
                        filter
                        options={facilityContactRoles}
                        optionLabel="label"
                        className={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2')}
                      />
                      {getFormErrorMessage(`contacts.${index}.role`, errors)}
                    </>
                  )}
                />
              </div>
              <div className="sm:col-span-3">
                <Controller
                  control={control}
                  name={`contacts.${index}.phone_number`}
                  rules={{
                    required: 'Phone Number is required, should be 10 digits.',
                  }}
                  render={({ field, fieldState }) => (
                    <>
                      <HtInfoTooltip message="The phone number of the contact person.">
                        <HtInputLabel htmlFor={field.name} asterisk labelText="Phone Number" />
                      </HtInfoTooltip>
                      <InputMask
                        id={field.name}
                        {...field}
                        mask="(999) 999-9999"
                        slotChar="x"
                        unmask={true}
                        className={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2')}
                        autoComplete="off"
                      />
                      {getFormErrorMessage(`contacts.${index}.phone_number`, errors)}
                    </>
                  )}
                />
              </div>
              <div className="sm:col-span-3">
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
                    <>
                      <HtInfoTooltip message="The email address of the contact person.">
                        <HtInputLabel htmlFor={field.name} asterisk labelText="Email" />
                      </HtInfoTooltip>
                      <InputText
                        id={field.name}
                        {...field}
                        className={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2')}
                      />
                      {getFormErrorMessage(`contacts.${index}.email`, errors)}
                    </>
                  )}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <div>
            <Button type="submit" label="Submit" loading={isLoading} />
          </div>
        </div>
      </div>
    </form>
  )
}
