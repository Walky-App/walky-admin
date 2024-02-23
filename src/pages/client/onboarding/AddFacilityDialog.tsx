import { useContext } from 'react'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputMask } from 'primereact/inputmask'
import { InputText } from 'primereact/inputtext'
import { classNames } from 'primereact/utils'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { countries, states } from './formOptions'
import { FormDataContext, IFormInputs } from '.'
import { Dropdown } from 'primereact/dropdown'

interface AddFacilityDialogProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  toastRef: any
  values: IFormInputs
}

export default function AddFacilityDialog({ visible, setVisible, toastRef, values }: AddFacilityDialogProps) {
  const { setFacilitiesArray, setSelectedFacility } = useContext(FormDataContext)

  const {
    control,
    formState: { errors },
    handleSubmit,
    getValues,
    reset,
  } = useForm<IFormInputs>({ values })

  const getFormErrorMessage = (name: keyof typeof errors) => {
    return errors[name] ? (
      <small className="p-error">{errors[name]?.message}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    )
  }

  const onSubmit: SubmitHandler<IFormInputs> = data => {
    if (values.facilityName) {
      // If we're in "edit" mode, update the facility
      setFacilitiesArray(prevArray =>
        prevArray.map(facility => (facility.businessName === values.businessName ? data : facility)),
      )
      setSelectedFacility(undefined)
    } else {
      // If we're in "add" mode, add a new facility
      setFacilitiesArray(prevArray => [...prevArray, data])
    }

    setVisible(false)

    toastRef.current?.show({
      severity: 'success',
      summary: 'Changes Saved',
      detail: getValues('facilityName'),
    })

    reset()
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
      //   style={{ width: '50vw' }}
      breakpoints={{ '960px': '75vw', '641px': '100vw' }}
      onHide={() => setVisible(false)}
      footer={footerContent}>
      <div className="grid max-w-lg grid-cols-1 gap-x-4 gap-y-0 sm:grid-cols-6 md:col-span-2">
        <div className="sm:col-span-6">
          <label htmlFor="facilityName" className="block text-sm font-medium leading-6 text-gray-900">
            *Facility Name:
          </label>
          <div className="mt-2">
            <Controller
              control={control}
              name="facilityName"
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
          {getFormErrorMessage('facilityName')}
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

        <div className="grid max-w-lg grid-cols-1 gap-x-4 gap-y-0 sm:grid-cols-6 md:col-span-2">
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
                  <InputText
                    id={field.name}
                    {...field}
                    className={classNames({ 'p-invalid': fieldState.invalid }, 'w-full')}
                  />
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
                render={({ field }) => <InputText id={field.name} {...field} className="w-full" />}
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
                  <InputText
                    id={field.name}
                    {...field}
                    className={classNames({ 'p-invalid': fieldState.invalid }, 'w-full')}
                  />
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
                  <Dropdown id={field.name} {...field} filter options={states} className="w-full" />
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
                    className={classNames({ 'p-invalid': fieldState.invalid }, 'w-full')}
                  />
                )}
              />
            </div>
            {getFormErrorMessage('postalCode')}
          </div>
        </div>
      </div>

      {/* Contact Person*/}
      <div className="grid grid-cols-1 gap-y-6 ">
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">Contact Person</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">Please enter contact person detail for this address.</p>
        </div>
        <div className="grid max-w-lg grid-cols-1 gap-x-4 gap-y-0 sm:grid-cols-6 md:col-span-2">
          <div className="sm:col-span-3">
            <label htmlFor="businessContactMobileNumber" className="block text-sm font-medium leading-6 text-gray-900">
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
                    className={classNames({ 'p-invalid': fieldState.invalid }, 'w-full')}
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
                  <InputText
                    id={field.name}
                    {...field}
                    className={classNames({ 'p-invalid': fieldState.invalid }, 'w-full')}
                  />
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
                  <InputText
                    id={field.name}
                    {...field}
                    className={classNames({ 'p-invalid': fieldState.invalid }, 'w-full')}
                  />
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
                    className={classNames({ 'p-invalid': fieldState.invalid }, 'w-full')}
                  />
                )}
              />
            </div>
            {getFormErrorMessage('businessContactDesignation')}
          </div>
        </div>
      </div>
    </Dialog>
  )
}
