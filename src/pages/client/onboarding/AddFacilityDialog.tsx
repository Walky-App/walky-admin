import { useContext } from 'react'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputMask } from 'primereact/inputmask'
import { InputText } from 'primereact/inputtext'
import { classNames } from 'primereact/utils'
import { Controller, SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import { countries, states } from './formOptions'
import { FormDataContext, IFacilityFormInputs, getFormErrorMessage, tooltipOptions } from '.'
import { Dropdown } from 'primereact/dropdown'
import { RequestService } from '../../../services/RequestService'
import { InputNumber } from 'primereact/inputnumber'

interface AddFacilityDialogProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  toastRef: any
  values: IFacilityFormInputs
}

export default function AddFacilityDialog({ visible, setVisible, toastRef, values }: AddFacilityDialogProps) {
  const { facilitiesArray, setFacilitiesArray, selectedFacility, setSelectedFacility } = useContext(FormDataContext)
  const { corp_name, tax_id } = facilitiesArray[0]

  const {
    control,
    formState: { errors },
    handleSubmit,
    getValues,
    // reset,
  } = useForm<IFacilityFormInputs>({ values })

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
    if (values.name) {
      // If we're in "edit" mode, update the facility
      try {
        const response = await RequestService(`facilities/${selectedFacility?._id}`, 'PATCH', data)

        if (response?._id) {
          toastRef.current?.show({
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
        // @ts-ignore
        toastRef.current?.show({ severity: 'error', summary: 'Error saving changes', detail: getValues('name') })
      }
      setVisible(false)
      setSelectedFacility(undefined)
    } else {
      // If we're in "add" mode, add a new facility
      try {
        const response = await RequestService(`facilities`, 'POST', newFacilityData)

        if (response?._id) {
          toastRef.current?.show({
            severity: 'info',
            summary: 'Facility Added',
            detail: getValues('name'),
          })
          setFacilitiesArray(prevArray => [...prevArray, response])
        } else {
          throw new Error('Failed to add facility')
        }
      } catch (error) {
        console.error('Error adding facility:', error)
        // @ts-ignore
        toastRef.current?.show({ severity: 'error', summary: 'Error adding facility', detail: getValues('name') })
      }

      setVisible(false)

      // reset()
    }
  }

  const footerContent = (
    <div>
      <Button severity="secondary" label="Cancel" onClick={() => setVisible(false)} outlined />
      <Button label="Save" onClick={handleSubmit(onSubmit)} autoFocus />
    </div>
  )

  return (
    <Dialog
      header="Add Facility Information"
      visible={visible}
      draggable={false}
      blockScroll
      // style={{ width: '50vw' }}
      breakpoints={{ '960px': '75vw', '641px': '100vw' }}
      onHide={() => setVisible(false)}
      footer={footerContent}>
      <div className="flex flex-col gap-y-4">
        <div className="grid max-w-lg grid-cols-1 gap-x-4 gap-y-0 sm:grid-cols-6 md:col-span-2 [&>*]:mb-4">
          <div className="sm:col-span-3">
            <label htmlFor="facilityName" className="block text-sm font-medium leading-6 text-gray-900">
              *Facility Name:
            </label>
            <div className="mt-2">
              <Controller
                control={control}
                name="name"
                rules={{ required: 'Facility Name is required' }}
                render={({ field, fieldState }) => (
                  <InputText
                    id={field.name}
                    {...field}
                    className={classNames({ 'p-invalid': fieldState.invalid }, 'w-full')}
                  />
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
                    min={0}
                    tooltip="E.g. 10000"
                    tooltipOptions={tooltipOptions}
                    className={classNames({ 'p-invalid': fieldState.invalid })}
                  />
                )}
              />
            </div>
            {getFormErrorMessage('sqft', errors)}
          </div>
        </div>
        {/* Location */}
        <div className="grid grid-cols-1 gap-y-6 pb-2">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Location</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Please provide your business address information below.
            </p>
          </div>

          <div className="grid max-w-lg grid-cols-1 gap-x-4 gap-y-0 sm:grid-cols-6 md:col-span-2 [&>*]:mb-4">
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
                      options={countries}
                      className={classNames({ 'p-invalid': fieldState.invalid }, 'w-full')}
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
                    <InputText
                      id={field.name}
                      {...field}
                      className={classNames({ 'p-invalid': fieldState.invalid }, 'w-full')}
                    />
                  )}
                />
              </div>
              {getFormErrorMessage('address', errors)}
            </div>

            {/* <div className="sm:col-span-3 mb-4">
            <label htmlFor="address2" className="block text-sm font-medium leading-6 text-gray-900">
              Apt, Suite or Unit:
            </label>
            <div className="mt-2">
              <Controller
                control={control}
                name="address2"
                render={({ field }) => <InputText id={field.name} {...field} className="w-full" />}
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
                    <InputText
                      id={field.name}
                      {...field}
                      className={classNames({ 'p-invalid': fieldState.invalid }, 'w-full')}
                    />
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
                      className={classNames({ 'p-invalid': fieldState.invalid }, 'w-full')}
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
                      className={classNames({ 'p-invalid': fieldState.invalid }, 'w-full')}
                    />
                  )}
                />
              </div>
              {getFormErrorMessage('zip', errors)}
            </div>
          </div>
        </div>

        {/* Contact Person*/}
        <div className="grid grid-cols-1 gap-y-6 ">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Contact Person</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">Please enter contact person detail for this address.</p>
          </div>

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid max-w-lg grid-cols-1 gap-x-4 gap-y-0 sm:grid-cols-6 md:col-span-2 [&>*]:mb-4">
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
                        className={classNames({ 'p-invalid': fieldState.invalid }, 'w-full')}
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
                        className={classNames({ 'p-invalid': fieldState.invalid }, 'w-full')}
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
                        className={classNames({ 'p-invalid': fieldState.invalid }, 'w-full')}
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
                        className={classNames({ 'p-invalid': fieldState.invalid }, 'w-full')}
                      />
                    )}
                  />
                </div>
                {getFormErrorMessage(`contacts.${index}.phone_number`, errors)}
              </div>
              <div className="sm:col-span-6">
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
                        className={classNames({ 'p-invalid': fieldState.invalid }, 'w-full')}
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
    </Dialog>
  )
}
