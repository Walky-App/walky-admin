import { useEffect, useState } from 'react'

import { Controller, type SubmitHandler, useForm, useWatch } from 'react-hook-form'
import { useParams } from 'react-router-dom'

import { Button } from 'primereact/button'
import { InputMask } from 'primereact/inputmask'
import { InputText } from 'primereact/inputtext'
import { MultiSelect, type MultiSelectChangeEvent } from 'primereact/multiselect'
import { SelectButton, type SelectButtonChangeEvent } from 'primereact/selectbutton'
import { classNames } from 'primereact/utils'

import { AddressAutoComplete, type IAddressAutoComplete } from '../../../components/shared/forms/AddressAutoComplete'
import { HtInputHelpText } from '../../../components/shared/forms/HtInputHelpText'
import { HtInputLabel } from '../../../components/shared/forms/HtInputLabel'
import { HtInfoTooltip } from '../../../components/shared/general/HtInfoTooltip'
import { type ICompany, type IPaymentInfo } from '../../../interfaces/company'
import { type IFacility } from '../../../interfaces/facility'
import { requestService } from '../../../services/requestServiceNew'
import { useUtils } from '../../../store/useUtils'
import { getFormErrorMessage } from '../../../utils/formUtils'
import { requiredFieldsNoticeText } from '../../../utils/formUtils'
import { GetTokenInfo } from '../../../utils/tokenUtil'

export interface IAddCCPaymentFormData extends IPaymentInfo {
  facilities: string[]
  is_default: boolean
}

export const CreditCardView = ({
  setSelectedCompanyData,
}: {
  setSelectedCompanyData: React.Dispatch<React.SetStateAction<ICompany>>
}) => {
  const [moreAddressDetails, setMoreAddressDetails] = useState<IAddressAutoComplete | undefined>()
  const [facilitiesByCompany, setFacilitiesByCompany] = useState<IFacility[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const { id } = useParams()
  const { first_name } = GetTokenInfo()

  const paymentMethodOptions = [
    { label: 'Automated Clearing House', value: 'ACH' },
    { label: 'Credit Card', value: 'CC' },
    { label: 'Electronic Check', value: 'ECheck' },
  ]

  const [paymentOption, setPaymentOption] = useState(paymentMethodOptions[1])

  useEffect(() => {
    const getAllFacilities = async () => {
      try {
        const response = await requestService({ path: `facilities/company/${id}` })
        if (response.ok) {
          const fetchedFacilities: IFacility[] = await response.json()
          setFacilitiesByCompany(fetchedFacilities)
        } else {
          setFacilitiesByCompany([])
        }
      } catch (error) {
        console.error('Error fetching facilities data:', error)
      }
    }

    getAllFacilities()
  }, [id])

  const { showToast } = useUtils()

  const defaultValues: IAddCCPaymentFormData = {
    card_number: '',
    expiration_date: '',
    card_name: '',
    address: '',
    state: '',
    zip_code: '',
    city: '',
    facilities: [],
    is_default: true,
  }

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
  } = useForm<IAddCCPaymentFormData>({ defaultValues })

  useEffect(() => {
    if (moreAddressDetails) {
      if (moreAddressDetails.zip != null) {
        setValue('zip_code', moreAddressDetails.zip)
      }
      if (moreAddressDetails.state != null) {
        setValue('state', moreAddressDetails.state)
      }
      if (moreAddressDetails.city != null) {
        setValue('city', moreAddressDetails.city)
      }
      if (moreAddressDetails.address != null) {
        setValue('address', moreAddressDetails.address)
      }
      if (moreAddressDetails.country != null) {
        setValue('country', moreAddressDetails.country)
      }

      setMoreAddressDetails(undefined)
    }
  }, [moreAddressDetails, setValue])

  const address = useWatch({ control, name: 'address' })
  const city = useWatch({ control, name: 'city' })
  const state = useWatch({ control, name: 'state' })
  const zip = useWatch({ control, name: 'zip_code' })

  const onSubmit: SubmitHandler<IPaymentInfo> = async (data: IPaymentInfo) => {
    setLoading(true)

    try {
      data = {
        ...data,
        created_by: first_name,
        type: paymentOption.value,
        payment_status: 'Active',
      }
      const response = await requestService({
        path: `companies/${id}/payment-method`,
        method: 'POST',
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        throw new Error('Failed to add company')
      }
      const updatedCompanyData = await response.json()
      setSelectedCompanyData(updatedCompanyData)
      showToast({ severity: 'success', summary: 'Payment method added successfully' })
      reset()
    } catch (error) {
      console.error('Error adding company: ', error)
      showToast({ severity: 'error', summary: 'Failed to verify and add payment information' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
      <div className="space-y-4 sm:space-y-12">
        <div className="grid grid-cols-1 gap-x-8 gap-y-4 pb-12 sm:gap-y-10 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Add Payment Information</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Please take a moment to fill out payment information.
            </p>
            {requiredFieldsNoticeText}
          </div>
          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-1 md:col-span-2">
            <div>
              <SelectButton
                value={paymentOption.value}
                onChange={(e: SelectButtonChangeEvent) => {
                  const selectedOption = paymentMethodOptions.find(option => option.value === e.value)
                  if (selectedOption) {
                    setPaymentOption(selectedOption)
                  }
                }}
                options={paymentMethodOptions}
                className="hidden"
                optionLabel="label"
                optionValue="value"
              />
            </div>
            {paymentOption.value === 'CC' ? (
              <>
                <div className="sm:col-span-3">
                  <Controller
                    control={control}
                    name="card_number"
                    rules={{
                      required: 'Card number is required',
                    }}
                    render={({ field, fieldState }) => (
                      <>
                        <HtInfoTooltip message="A credit card number is a unique identifier assigned to the card.">
                          <HtInputLabel htmlFor={field.name} asterisk labelText="Card Number" />
                        </HtInfoTooltip>
                        <InputMask
                          id={field.name}
                          {...field}
                          mask="9999 9999 9999 999?9"
                          slotChar="x"
                          className={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2')}
                          autoComplete="off"
                        />
                        <HtInputHelpText fieldName={field.name} helpText="It can be 15 or 16 digits." />
                        {getFormErrorMessage(field.name, errors)}
                      </>
                    )}
                  />
                </div>

                <div className="sm:col-span-3">
                  <Controller
                    control={control}
                    name="expiration_date"
                    rules={{
                      required: 'Expiration date is required',
                      pattern: {
                        value: /^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/,
                        message: 'Invalid expiration date. It should be in MM/YY or MM/YYYY format.',
                      },
                    }}
                    render={({ field, fieldState }) => (
                      <>
                        <HtInfoTooltip message="The expiration date of the credit card.">
                          <HtInputLabel htmlFor={field.name} asterisk labelText="Expiration Date" />
                        </HtInfoTooltip>
                        <InputMask
                          id={field.name}
                          {...field}
                          mask="99/99"
                          slotChar="x"
                          className={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2')}
                          autoComplete="off"
                        />
                        {getFormErrorMessage(field.name, errors)}
                      </>
                    )}
                  />
                </div>
              </>
            ) : null}

            {paymentOption.value === 'ACH' || paymentOption.value === 'ECheck' ? (
              <div className="sm:col-span-3">
                <Controller
                  control={control}
                  name="ach_bank_name"
                  rules={{ required: 'Bank Name is required' }}
                  render={({ field, fieldState }) => (
                    <>
                      <HtInfoTooltip message="Name of the bank.">
                        <HtInputLabel htmlFor={field.name} asterisk labelText="Bank Name" />
                      </HtInfoTooltip>
                      <InputText
                        id={field.name}
                        {...field}
                        className={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2')}
                      />
                      {getFormErrorMessage(field.name, errors)}
                    </>
                  )}
                />

                <Controller
                  control={control}
                  name="ach_account_number"
                  rules={{ required: 'Account Number is required' }}
                  render={({ field, fieldState }) => (
                    <>
                      <HtInfoTooltip message="Bank account number.">
                        <HtInputLabel htmlFor={field.name} asterisk labelText="Account Number" />
                      </HtInfoTooltip>
                      <InputText
                        id={field.name}
                        {...field}
                        className={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2')}
                      />
                      {getFormErrorMessage(field.name, errors)}
                    </>
                  )}
                />

                <Controller
                  control={control}
                  name="ach_routing_number"
                  rules={{ required: 'Routing Number is required' }}
                  render={({ field, fieldState }) => (
                    <>
                      <HtInfoTooltip message="Bank routing number.">
                        <HtInputLabel htmlFor={field.name} asterisk labelText="Routing Number" />
                      </HtInfoTooltip>
                      <InputText
                        id={field.name}
                        {...field}
                        className={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2')}
                      />
                      {getFormErrorMessage(field.name, errors)}
                    </>
                  )}
                />
              </div>
            ) : null}

            <div className="sm:col-span-3">
              <Controller
                control={control}
                name="card_name"
                rules={{ required: 'Card name is required' }}
                render={({ field, fieldState }) => (
                  <>
                    <HtInfoTooltip message="Reference name for the card in the application.">
                      <HtInputLabel htmlFor={field.name} asterisk labelText="Card Name" />
                    </HtInfoTooltip>
                    <InputText
                      id={field.name}
                      {...field}
                      className={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2')}
                      autoComplete="off"
                    />
                    <HtInputHelpText fieldName={field.name} helpText="Example: My AMEX, or My Visa." />
                    {getFormErrorMessage(field.name, errors)}
                  </>
                )}
              />
            </div>

            <div className="sm:col-span-3">
              <Controller
                control={control}
                name="address"
                rules={{ required: 'Address is required' }}
                render={({ field, fieldState }) => (
                  <>
                    <HtInfoTooltip message="Provide billing address.">
                      <HtInputLabel htmlFor={field.name} asterisk labelText="Billing Address" />
                    </HtInfoTooltip>
                    <AddressAutoComplete
                      controlled
                      setMoreAddressDetails={setMoreAddressDetails}
                      currentAddress={field.value ?? ''}
                      onChange={field.onChange}
                      value={field.value}
                      classNames={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2')}
                      aria-describedby={`${field.name}-help`}
                    />
                    {getFormErrorMessage(field.name, errors)}
                  </>
                )}
              />
              <div className="mt-4">
                <p className="mt-1 text-sm leading-6">
                  <strong>State:</strong> {state}
                </p>
                <p className="mt-1 text-sm leading-6">
                  <strong>Zip:</strong> {zip}
                </p>
                <p className="mt-1 text-sm leading-6">
                  <strong>City:</strong> {city}
                </p>
                <p className="mt-1 text-sm leading-6">
                  <strong>Address:</strong> {address}
                </p>
              </div>
            </div>

            <div className="sm:col-span-3">
              <Controller
                control={control}
                name="facilities"
                rules={{ required: 'At least one facility is required' }}
                render={({ field, fieldState }) => (
                  <>
                    <HtInfoTooltip message="All facilities related to this company which will be using this payment method to list jobs">
                      <HtInputLabel htmlFor={field.name} asterisk labelText="Facilities" />
                    </HtInfoTooltip>
                    <MultiSelect
                      id={field.name}
                      {...field}
                      value={field.value}
                      optionLabel="name"
                      options={facilitiesByCompany}
                      display="chip"
                      selectAll
                      selectAllLabel="Select All"
                      onChange={(e: MultiSelectChangeEvent) => {
                        field.onChange(e.value)
                      }}
                      placeholder="Select facilities"
                      className={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2')}
                    />
                    <HtInputHelpText
                      fieldName={field.name}
                      helpText="Please select all facilities which will be using this payment method as primary."
                    />
                    {getFormErrorMessage(field.name, errors)}
                  </>
                )}
              />
            </div>
            <div className="sm:col-span-3">
              <Button type="submit" size="large" label="Add CC Payment Method" loading={loading} />
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
