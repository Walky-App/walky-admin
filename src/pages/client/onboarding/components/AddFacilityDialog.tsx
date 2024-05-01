import { Fragment, useContext, useEffect } from 'react'

import { Controller, type SubmitHandler, useFieldArray, useForm } from 'react-hook-form'

import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { Dropdown } from 'primereact/dropdown'
import { Image } from 'primereact/image'
import { InputMask } from 'primereact/inputmask'
import { InputNumber } from 'primereact/inputnumber'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { MultiSelect, type MultiSelectChangeEvent } from 'primereact/multiselect'
import { Panel } from 'primereact/panel'
import { classNames } from 'primereact/utils'

import { AddressAutoComplete } from '../../../../components/shared/forms/AddressAutoComplete'
import { RequestService } from '../../../../services/RequestService'
import { useUtils } from '../../../../store/useUtils'
import { services } from '../../../../utils/formOptions'
import { FormDataContext, type IFacilityFormInputs, getFormErrorMessage, tooltipOptions } from '../ClientOnboardingPage'

interface AddFacilityDialogProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  values: IFacilityFormInputs
}

export const AddFacilityDialog = ({ visible, setVisible, values }: AddFacilityDialogProps) => {
  const {
    facilitiesArray,
    setFacilitiesArray,
    selectedFacility,
    setSelectedFacility,
    moreAddressDetails,
    setMoreAddressDetails,
  } = useContext(FormDataContext)

  const { showToast } = useUtils()

  const { corp_name, tax_id } = facilitiesArray[0]

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
    const newFacilityData = {
      ...data,
      corp_name,
      tax_id,
    }
    if (selectedFacility?._id) {
      // If we're in "edit" mode, update the facility
      try {
        const facilityFound = await RequestService(`facilities/${selectedFacility?._id}`)

        const updatedFacility = {
          ...facilityFound,
          ...data,
          licenses: selectedFacility?.licenses,
          images: selectedFacility?.images,
        }

        const response = await RequestService(`facilities/${selectedFacility?._id}`, 'PATCH', updatedFacility)

        if (response?._id) {
          showToast({
            severity: 'info',
            summary: 'Changes saved for:',
            detail: getValues('name'),
          })

          setFacilitiesArray(prevArray =>
            prevArray.map(facility => (facility._id === response._id ? response : facility)),
          )
        } else {
          throw new Error('Failed to update facility')
        }
      } catch (error) {
        console.error('Error adding facility:', error)
        showToast({ severity: 'error', summary: 'Error saving changes', detail: getValues('name') })
      }
      setVisible(false)
      setSelectedFacility(undefined)
    } else {
      // If we're in "add" mode, add a new facility
      try {
        const response = await RequestService(`facilities`, 'POST', newFacilityData)

        if (response?._id) {
          showToast({ severity: 'info', summary: 'Facility Added', detail: getValues('name') })

          setFacilitiesArray(prevState => [...prevState, response])
        } else {
          throw new Error('Failed to add facility')
        }
      } catch (error) {
        console.error('Error adding facility:', error)
        showToast({ severity: 'error', summary: 'Error adding facility', detail: getValues('name') })
      }

      setVisible(false)
    }
  }

  const footerContent = (
    <div>
      <Button severity="secondary" label="Cancel" onClick={() => setVisible(false)} outlined />
      <Button label="Save" onClick={handleSubmit(onSubmit)} />
    </div>
  )

  return (
    <Dialog
      header={selectedFacility?._id ?? '' ? 'Edit Facility Information' : 'Add Facility Information'}
      visible={visible}
      draggable={false}
      blockScroll
      breakpoints={{ '960px': '75vw', '641px': '100vw' }}
      onHide={() => setVisible(false)}
      footer={footerContent}>
      <div className="flex flex-col gap-y-4">
        {/* Facility Info */}
        <div className="grid max-w-lg grid-cols-1 gap-x-4 gap-y-0 sm:grid-cols-6 md:col-span-2 [&>*]:mb-4">
          <div className="sm:col-span-3">
            <Controller
              control={control}
              name="name"
              rules={{ required: 'Facility Name is required' }}
              render={({ field, fieldState }) => (
                <>
                  <label htmlFor={field.name} className="block text-sm font-medium leading-6 text-gray-900">
                    *Facility Name:
                  </label>
                  <InputText
                    id={field.name}
                    {...field}
                    className={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2 w-full')}
                  />
                </>
              )}
            />
            {getFormErrorMessage('name', errors)}
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
                    *Facility Phone Number:
                  </label>
                  <InputMask
                    id={field.name}
                    {...field}
                    mask="(999) 999-9999"
                    slotChar="x"
                    tooltip="E.g. (281) 330-8004"
                    tooltipOptions={tooltipOptions}
                    className={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2 w-full')}
                  />
                </>
              )}
            />
            {getFormErrorMessage('phone_number', errors)}
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
                  <label htmlFor={field.name} className="block text-sm font-medium leading-6 text-gray-900">
                    *Facility Square Footage:
                  </label>
                  <InputNumber
                    id={field.name}
                    {...field}
                    onChange={e => field.onChange(Number(e.value))}
                    min={0}
                    tooltip="E.g. 10000"
                    tooltipOptions={tooltipOptions}
                    className={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2 w-full')}
                  />
                </>
              )}
            />
            {getFormErrorMessage('sqft', errors)}
          </div>

          <div className="sm:col-span-3">
            <Controller
              control={control}
              name="services"
              rules={{ required: 'At least one Serivce is required' }}
              render={({ field, fieldState }) => (
                <>
                  <label htmlFor={field.name} className="block text-sm font-medium leading-6 text-gray-900">
                    *Services:
                  </label>
                  <MultiSelect
                    id={field.name}
                    {...field}
                    value={field.value}
                    options={services}
                    display="chip"
                    selectAll
                    selectAllLabel="Select All"
                    onChange={(e: MultiSelectChangeEvent) => field.onChange(e.value)}
                    placeholder="Select Services"
                    className={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2 w-full')}
                  />
                </>
              )}
            />
            {getFormErrorMessage('services', errors)}
          </div>

          <div className="sm:col-span-6">
            <Controller
              control={control}
              name="notes"
              rules={{ required: false }}
              render={({ field, fieldState }) => (
                <>
                  <label htmlFor={field.name} className="block text-sm font-medium leading-6 text-gray-900">
                    Arrival notes:
                  </label>
                  <InputTextarea
                    id={field.name}
                    {...field}
                    rows={4}
                    cols={30}
                    className={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2 w-full')}
                  />
                </>
              )}
            />
            {getFormErrorMessage('notes', errors)}
          </div>
        </div>
        {/* Location */}
        <div className="grid max-w-lg grid-cols-1 gap-x-4 gap-y-0 sm:grid-cols-6 md:col-span-2 [&>*]:mb-4">
          <div className="sm:col-span-6">
            <h2 className="text-base font-semibold leading-7 text-gray-900">Location</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Please provide your business address information below.
            </p>
          </div>

          <div className="sm:col-span-6">
            <Controller
              control={control}
              name="address"
              rules={{ required: 'Address is required' }}
              render={({ field, fieldState }) => (
                <>
                  <label htmlFor={field.name} className="block text-sm font-medium leading-6 text-gray-900">
                    *Street Address:
                  </label>
                  <AddressAutoComplete
                    controlled
                    setMoreAddressDetails={setMoreAddressDetails}
                    currentAddress={field.value}
                    onChange={field.onChange}
                    value={field.value}
                    className={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2 w-full')}
                  />
                </>
              )}
            />
            {getFormErrorMessage('address', errors)}
          </div>
        </div>

        {/* Contact Person*/}
        <div className="grid max-w-lg grid-cols-1 gap-x-4 gap-y-0 sm:grid-cols-6 md:col-span-2 [&>*]:mb-4">
          <div className="sm:col-span-6">
            <h2 className="text-base font-semibold leading-7 text-gray-900">Contact Person</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">Please enter contact person detail for this address.</p>
          </div>

          {fields.map((field, index) => (
            <Fragment key={field.id}>
              <div className="sm:col-span-3">
                <Controller
                  control={control}
                  name={`contacts.${index}.first_name`}
                  rules={{ required: 'First Name is required' }}
                  render={({ field, fieldState }) => (
                    <>
                      <label htmlFor={field.name} className="block text-sm font-medium leading-6 text-gray-900">
                        *First Name:
                      </label>
                      <InputText
                        id={field.name}
                        {...field}
                        className={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2 w-full')}
                      />
                    </>
                  )}
                />
                {getFormErrorMessage(`contacts.${index}.first_name`, errors)}
              </div>

              <div className="sm:col-span-3">
                <Controller
                  control={control}
                  name={`contacts.${index}.last_name`}
                  rules={{ required: 'Last Name is required' }}
                  render={({ field, fieldState }) => (
                    <>
                      <label htmlFor={field.name} className="block text-sm font-medium leading-6 text-gray-900">
                        *Last Name:
                      </label>
                      <InputText
                        id={field.name}
                        {...field}
                        className={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2 w-full')}
                      />
                    </>
                  )}
                />
                {getFormErrorMessage(`contacts.${index}.last_name`, errors)}
              </div>

              <div className="sm:col-span-3">
                <Controller
                  control={control}
                  name={`contacts.${index}.role`}
                  rules={{ required: 'Role is required' }}
                  render={({ field, fieldState }) => (
                    <>
                      <label htmlFor={field.name} className="block text-sm font-medium leading-6 text-gray-900">
                        *Role:
                      </label>
                      <Dropdown
                        id={field.name}
                        {...field}
                        filter
                        options={['Owner', 'AP', 'Onsite', 'Security', 'Other']}
                        className={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2 w-full')}
                      />
                    </>
                  )}
                />
                {getFormErrorMessage(`contacts.${index}.role`, errors)}
              </div>
              <div className="sm:col-span-3">
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
                        className={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2 w-full')}
                      />
                    </>
                  )}
                />
                {getFormErrorMessage(`contacts.${index}.phone_number`, errors)}
              </div>
              <div className="sm:col-span-6">
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
                      <label htmlFor={field.name} className="block text-sm font-medium leading-6 text-gray-900">
                        *Email:
                      </label>
                      <InputText
                        id={field.name}
                        {...field}
                        className={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2 w-full')}
                      />
                    </>
                  )}
                />
                {getFormErrorMessage(`contacts.${index}.email`, errors)}
              </div>
            </Fragment>
          ))}
        </div>

        {/* Images and Upload */}
        {selectedFacility?._id ? (
          <div className="grid max-w-lg grid-cols-1 gap-x-4 gap-y-0 sm:grid-cols-6 md:col-span-2 [&>*]:mb-4">
            {selectedFacility?.images.length > 0 ? (
              <div className="sm:col-span-6">
                <Panel header="Uploaded Images">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-3 sm:flex-col">
                    {selectedFacility?.images.map(image => {
                      const fileName = image.key.split('/').pop()
                      return (
                        <div
                          key={image.timestamp}
                          className="flex w-full flex-col items-center justify-center text-center sm:w-auto">
                          <Image src={image.url} alt={fileName} preview pt={{ image: { className: 'h-16 w-auto' } }} />
                          <p className="cursor-default px-5 py-1.5 text-sm font-semibold leading-6 text-gray-900 hover:text-gray-500">
                            {fileName}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </Panel>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </Dialog>
  )
}
