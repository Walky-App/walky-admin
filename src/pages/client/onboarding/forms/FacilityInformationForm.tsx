import { useContext, useEffect, useLayoutEffect, useState } from 'react'

import { Controller, type SubmitHandler, useFieldArray, useForm } from 'react-hook-form'

import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import { InputMask } from 'primereact/inputmask'
import { InputNumber } from 'primereact/inputnumber'
import { InputSwitch } from 'primereact/inputswitch'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { MultiSelect, type MultiSelectChangeEvent } from 'primereact/multiselect'
import { classNames } from 'primereact/utils'

import { AddressAutoComplete } from '../../../../components/shared/forms/AddressAutoComplete'
import { HtInputHelpText } from '../../../../components/shared/forms/HtInputHelpText'
import { HtInputLabel } from '../../../../components/shared/forms/HtInputLabel'
import { HtInfoTooltip } from '../../../../components/shared/general/HtInfoTooltip'
import { type IFacility } from '../../../../interfaces/facility'
import { requestService } from '../../../../services/requestServiceNew'
import { useUtils } from '../../../../store/useUtils'
import { facilityContactRoles, jobTitlesOptions } from '../../../../utils/formOptions'
import { getFormErrorMessage } from '../../../../utils/formUtils'
import { requiredFieldsNoticeText } from '../../../../utils/formUtils'
// import { clientOnboardingSteps } from '../ClientOnboardingPage'
import {
  type StepProps,
  FormDataContext,
  type IClientOnboardingFormInputs, // type IOnboardingUpdateInfo,
  // useUpdateOnboardingStatus,
} from '../clientOnboardingUtils'

export const FacilityInformationForm = ({ step, setStep }: StepProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [checked, setChecked] = useState(false)
  const [userAsDefaultContact] = useState(true)

  const { setFormData, defaultValues, formData, moreAddressDetailsFacility, setMoreAddressDetailsFacility } =
    useContext(FormDataContext)

  const { showToast } = useUtils()

  // const { updateOnboardingStatus } = useUpdateOnboardingStatus()

  // const updateOnboardingInfo: IOnboardingUpdateInfo = {
  //   step_number: 2,
  //   description: clientOnboardingSteps[1].label ?? 'Facility Information',
  //   type: 'client',
  //   completed: false,
  // }

  const formValues = formData != null ? formData : defaultValues

  const {
    control,
    formState: { errors },
    clearErrors,
    handleSubmit,
    getValues,
    setValue,
  } = useForm<IClientOnboardingFormInputs>({ values: formValues })

  useEffect(() => {
    if (moreAddressDetailsFacility) {
      if (moreAddressDetailsFacility.zip != null) {
        setValue('zip', moreAddressDetailsFacility.zip)
      }
      if (moreAddressDetailsFacility.state != null) {
        setValue('state', moreAddressDetailsFacility.state)
      }
      if (moreAddressDetailsFacility.city != null) {
        setValue('city', moreAddressDetailsFacility.city)
      }
      if (moreAddressDetailsFacility.address != null) {
        setValue('address', moreAddressDetailsFacility.address)
      }
      if (moreAddressDetailsFacility.country != null) {
        setValue('country', moreAddressDetailsFacility.country)
      }
      if (moreAddressDetailsFacility.location_pin != null) {
        setValue('location_pin', moreAddressDetailsFacility.location_pin)
      }

      setMoreAddressDetailsFacility(undefined)
    }
  }, [moreAddressDetailsFacility, setMoreAddressDetailsFacility, setValue])

  const { fields } = useFieldArray({
    control,
    name: 'contacts',
  })

  useEffect(() => {
    const isSameAsCompany =
      formData.name === formData.company_name &&
      formData.phone_number === formData.company_phone_number &&
      formData.address === formData.company_address &&
      formData.city === formData.company_city &&
      formData.state === formData.company_state &&
      formData.zip === formData.company_zip &&
      formData.country === formData.company_country &&
      formData.location_pin === formData.company_location_pin

    setChecked(isSameAsCompany)
  }, [
    formData.address,
    formData.city,
    formData.company_address,
    formData.company_city,
    formData.company_country,
    formData.company_location_pin,
    formData.company_name,
    formData.company_phone_number,
    formData.company_state,
    formData.company_zip,
    formData.country,
    formData.location_pin,
    formData.name,
    formData.phone_number,
    formData.state,
    formData.zip,
  ])

  useLayoutEffect(() => {
    if (checked) {
      setValue('name', formData?.company_name)
      setValue('phone_number', formData?.company_phone_number)
      setValue('address', formData?.company_address)
      setValue('city', formData?.company_city)
      setValue('state', formData?.company_state)
      setValue('zip', formData?.company_zip)
      setValue('country', formData?.company_country)
      setValue('location_pin', formData?.company_location_pin)
    } else {
      setValue('name', formData?.name)
      setValue('phone_number', formData?.phone_number)
      setValue('address', formData?.address)
      setValue('city', formData?.city)
      setValue('state', formData?.state)
      setValue('zip', formData?.zip)
      setValue('country', formData?.country)
      setValue('location_pin', formData?.location_pin)
    }
  }, [checked, setValue, formData])

  const onSubmit: SubmitHandler<IClientOnboardingFormInputs> = async data => {
    setIsLoading(true)

    const facilityData: IFacility = {
      ...formData,
      name: data.name,
      license_number: data.license_number,
      phone_number: data.phone_number,
      sqft: data.sqft,
      services: data.services,
      notes: data.notes,
      address: data.address,
      city: data.city,
      state: data.state,
      zip: data.zip,
      country: data.country,
      contacts: data.contacts,
      location_pin: data.location_pin,
    }

    const requestData = {
      ...facilityData,
      company_id: formValues.company_id,
    }

    const facilityId = formValues?.facilities[0]

    if (facilityId != null) {
      try {
        const res = await requestService({ path: `facilities/${facilityId}` })
        if (!res.ok) throw new Error('Error fetching facility details')
        const facilityFoundData: IFacility = await res.json()

        const updatedFacility = {
          ...facilityFoundData,
          ...requestData,
          licenses: formData.licenses,
          images: formData.images,
        }

        const response = await requestService({
          path: `facilities/${facilityId}`,
          method: 'PATCH',
          body: JSON.stringify(updatedFacility),
        })
        if (!response.ok) throw new Error('Failed to update facility')
        const updatedFacilityData: IFacility = await response.json()

        if (updatedFacilityData?._id != null) {
          const updatedFacilityId = updatedFacilityData._id
          setFormData(prev => ({ ...prev, ...updatedFacilityData, facilities: [updatedFacilityId] }))

          // await updateOnboardingStatus(updateOnboardingInfo)

          setTimeout(() => {
            setStep(step + 1)
          }, 1000)
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
        const response = await requestService({ path: 'facilities', method: 'POST', body: JSON.stringify(requestData) })
        if (!response.ok) throw new Error('Error adding facility')
        const createdFacilityData: IFacility = await response.json()

        if (createdFacilityData?._id != null) {
          const createdFacilityId = createdFacilityData._id
          setFormData(prev => ({ ...prev, ...createdFacilityData, facilities: [createdFacilityId] }))

          // await updateOnboardingStatus()

          setTimeout(() => {
            setStep(step + 1)
          }, 1000)
        }
      } catch (error) {
        console.error('Error adding facility:', error)

        showToast({
          severity: 'error',
          summary: 'Error adding facility',
          detail: `Failed to add facility ${getValues('name')}`,
        })
        setIsLoading(false)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="p-fluid space-y-4 sm:space-y-12">
        <div className="grid grid-cols-1 gap-x-8 gap-y-4 border-b border-gray-900/10 pb-12 sm:gap-y-10 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Business same as the Facility?</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Please provide information about your business so that we can verify you on the platform.
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
            <div className="flex flex-col justify-center space-y-1 sm:col-span-6">
              <div className="flex items-center">
                <label htmlFor="company_same_as_facility" className="mr-3 text-xl font-semibold">
                  No
                </label>
                <InputSwitch
                  inputId="company_same_as_facility"
                  name="company_same_as_facility"
                  checked={checked}
                  onChange={e => {
                    setChecked(e.value)
                    clearErrors()
                  }}
                />
                <label htmlFor="company_same_as_facility" className="ml-3 text-xl font-semibold">
                  Yes
                </label>
              </div>
              <HtInputHelpText
                fieldName="company_same_as_facility"
                helpText="Select Yes if the Facility Name, Phone Number, Address, and Tax ID are the same as the Company."
              />
            </div>
          </div>
        </div>

        {/* Facility Information */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-4 border-b border-gray-900/10 pb-12 sm:gap-y-10 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Facility Information</h2>
            <p className="mt-4 text-sm leading-6 text-gray-600">
              Please provide information about your business so that we can verify you on the platform.
            </p>
            {requiredFieldsNoticeText}
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
            <div className="sm:col-span-3">
              <Controller
                control={control}
                name="name"
                rules={{ required: 'Facility Name is required' }}
                render={({ field, fieldState }) => (
                  <>
                    <HtInfoTooltip message="The name of your first facility. You will be able to add additional facilities in the next step.">
                      <HtInputLabel htmlFor={field.name} asterisk labelText="Facility Name" />
                    </HtInfoTooltip>
                    <InputText
                      id={field.name}
                      {...field}
                      className={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2')}
                      autoComplete="off"
                      disabled={checked}
                    />
                    {getFormErrorMessage(field.name, errors)}
                  </>
                )}
              />
            </div>

            <div className="sm:col-span-3">
              <Controller
                control={control}
                name="license_number"
                render={({ field, fieldState }) => (
                  <>
                    <HtInfoTooltip message="Primary state or city license number for this facility.">
                      <HtInputLabel htmlFor={field.name} labelText="License Number" />
                    </HtInfoTooltip>
                    <InputText
                      id={field.name}
                      {...field}
                      className={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2')}
                      autoComplete="off"
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
                  required: 'Phone Number is required, should be 10 digits.',
                }}
                render={({ field, fieldState }) => (
                  <>
                    <HtInfoTooltip message="The main phone number of your facility.">
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
                      disabled={checked}
                    />
                    {getFormErrorMessage(field.name, errors)}
                  </>
                )}
              />
            </div>

            <div className="sm:col-span-3">
              <Controller
                control={control}
                name="sqft"
                render={({ field, fieldState }) => (
                  <>
                    <HtInfoTooltip message="The square footage of your facility.">
                      <HtInputLabel htmlFor={field.name} labelText="Facility Square Footage" />
                    </HtInfoTooltip>
                    <InputNumber
                      inputId={field.name}
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
                    {getFormErrorMessage(field.name, errors)}
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
                    <HtInfoTooltip message="The services or job types that your facility offers.">
                      <HtInputLabel htmlFor={field.name} asterisk labelText="Services" />
                    </HtInfoTooltip>
                    <MultiSelect
                      inputId={field.name}
                      {...field}
                      value={field.value}
                      optionLabel="title"
                      options={jobTitlesOptions}
                      display="chip"
                      selectAll
                      selectAllLabel="Select All"
                      onChange={(e: MultiSelectChangeEvent) => field.onChange(e.value)}
                      placeholder="Select Services"
                      className={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2 w-full')}
                    />
                    <HtInputHelpText
                      fieldName={field.name}
                      helpText="Please select all services that your facility offers."
                    />
                    {getFormErrorMessage(field.name, errors)}
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
                    <HtInfoTooltip message="Any additional notes about your facility. This information will be verified before application approval.">
                      <HtInputLabel htmlFor={field.name} labelText="Arrival notes" />
                    </HtInfoTooltip>
                    <HtInputHelpText
                      fieldName={field.name}
                      helpText="Max 500 characters. Please do not enter contact information into this field."
                    />
                    <InputTextarea
                      id={field.name}
                      {...field}
                      rows={4}
                      cols={30}
                      maxLength={500}
                      className={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2')}
                      autoComplete="off"
                    />
                    {getFormErrorMessage(field.name, errors)}
                  </>
                )}
              />
            </div>
          </div>
        </div>

        {/* Facility Location */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-4 border-b border-gray-900/10 pb-12 sm:gap-y-10 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Facility Location</h2>
            <p className="mt-4 text-sm leading-6 text-gray-600">
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
                      inputId={field.name}
                      controlled
                      setMoreAddressDetails={setMoreAddressDetailsFacility}
                      currentAddress={field.value}
                      onChange={field.onChange}
                      value={field.value}
                      classNames={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2')}
                      aria-describedby={`${field.name}-help`}
                      disabled={checked}
                    />
                    <HtInputHelpText fieldName={field.name} helpText="Only Commercial Address" />
                    {getFormErrorMessage(field.name, errors)}
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
            <p className="mt-4 text-sm leading-6 text-gray-600">Please provide your contact information below.</p>
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
                      <HtInputLabel htmlFor={field.name} asterisk={!userAsDefaultContact} labelText="First Name" />
                      <InputText
                        id={field.name}
                        {...field}
                        className={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2')}
                        autoComplete="off"
                        disabled={userAsDefaultContact}
                      />
                      {getFormErrorMessage(field.name, errors)}
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
                      <HtInputLabel htmlFor={field.name} asterisk={!userAsDefaultContact} labelText="Last Name" />
                      <InputText
                        id={field.name}
                        {...field}
                        className={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2')}
                        autoComplete="off"
                        disabled={userAsDefaultContact}
                      />
                      {getFormErrorMessage(field.name, errors)}
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
                        inputId={field.name}
                        {...field}
                        filter
                        options={facilityContactRoles}
                        optionLabel="label"
                        className={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2')}
                        autoComplete="off"
                      />
                      {getFormErrorMessage(field.name, errors)}
                    </>
                  )}
                />
              </div>
              <div className="sm:col-span-3">
                <Controller
                  control={control}
                  name={`contacts.${index}.phone_number`}
                  rules={{
                    required: 'Phone Number is required.',
                  }}
                  render={({ field, fieldState }) => (
                    <>
                      <HtInputLabel htmlFor={field.name} asterisk={!userAsDefaultContact} labelText="Phone Number" />
                      <InputMask
                        id={field.name}
                        {...field}
                        mask="(999) 999-9999"
                        slotChar="x"
                        unmask={true}
                        className={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2')}
                        autoComplete="off"
                        disabled={true}
                      />
                      {getFormErrorMessage(field.name, errors)}
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
                      <HtInputLabel htmlFor={field.name} asterisk={!userAsDefaultContact} labelText="Email" />
                      <InputText
                        id={field.name}
                        {...field}
                        className={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2')}
                        autoComplete="off"
                        disabled={userAsDefaultContact}
                      />
                      {getFormErrorMessage(field.name, errors)}
                    </>
                  )}
                />
              </div>
            </div>
          ))}
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
        <Button type="submit" label="Save & Continue" loading={isLoading} />
      </div>
    </form>
  )
}
