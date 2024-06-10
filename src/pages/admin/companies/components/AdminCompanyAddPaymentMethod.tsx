import { useEffect, useState } from 'react'

import { Controller, type SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'

import { Button } from 'primereact/button'
import { InputMask } from 'primereact/inputmask'
import { InputText } from 'primereact/inputtext'
import { SelectButton, type SelectButtonChangeEvent } from 'primereact/selectbutton'
import { classNames } from 'primereact/utils'

import { AddressAutoComplete, type IAddressAutoComplete } from '../../../../components/shared/forms/AddressAutoComplete'
import { HtInputLabel } from '../../../../components/shared/forms/HtInputLabel'
import { HtInfoTooltip } from '../../../../components/shared/general/HtInfoTooltip'
import { requestService } from '../../../../services/requestServiceNew'
import { useUtils } from '../../../../store/useUtils'
import { getFormErrorMessage } from '../../../../utils/formUtils'
import { requiredFieldsNoticeText } from '../../../../utils/formUtils'
import { GetTokenInfo } from '../../../../utils/tokenUtil'

export interface IPaymentMethod {
  _id?: string
  type?: string
  address: string
  city: string
  state: string
  country: string
  zip_code: string
  payment_status: 'Active' | 'Inactive' | 'Expired'
  card_number?: string
  expiration_date?: string
  ccv?: string
  bank_name?: string
  holder_name: string
  account_number?: string
  routing_number?: string
  created_by?: string
}

export const AdminCompanyAddPaymentMethod = () => {
  const [moreAddressDetails, setMoreAddressDetails] = useState<IAddressAutoComplete | undefined>()
  const navigate = useNavigate()
  const { id } = useParams()
  const { first_name } = GetTokenInfo()

  const paymentMethodOptions = [
    { label: 'Automated Clearing House', value: 'ACH' },
    { label: 'Credit Card', value: 'CC' },
    { label: 'Electronic Check', value: 'ECheck' },
  ]

  const [paymentOption, setPaymentOption] = useState(paymentMethodOptions[1])
  //   useEffect(() => {
  //     const getAllFacilities = async () => {
  //       try {
  //         const response = await requestService({ path: 'facilities' })
  //         if (response.ok) {
  //           const fetchedFacilities: IFacility[] = await response.json()
  //           setFacilities(fetchedFacilities)
  //         } else {
  //           setFacilities([])
  //         }
  //       } catch (error) {
  //         console.error('Error fetching facilities data:', error)
  //       }
  //     }

  //     getAllFacilities()
  //   }, [])

  const { showToast } = useUtils()

  const defaultValues: IPaymentMethod = {
    type: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zip_code: '',
    payment_status: 'Active',
    holder_name: '',
  }
  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<IPaymentMethod>({ defaultValues })

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

  const onSubmit: SubmitHandler<IPaymentMethod> = async (data: IPaymentMethod) => {
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
      showToast({ severity: 'success', summary: 'Payment method added successfully' })
      setTimeout(() => {
        navigate('/admin/companies/:id/payment')
      }, 2000)
    } catch (error) {
      console.error('Error adding company: ', error)
      showToast({ severity: 'error', summary: 'Failed to add company' })
    }
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
      <div className="space-y-4 sm:space-y-12">
        <div className="grid grid-cols-1 gap-x-8 gap-y-4 border-b border-gray-900/10 pb-12 sm:gap-y-10 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Payment Information</h2>
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
                    render={({ field, fieldState }) => (
                      <>
                        <HtInfoTooltip message="A credit card number is a unique identifier assigned to the card.">
                          <HtInputLabel htmlFor={field.name} asterisk labelText="Card Number" />
                        </HtInfoTooltip>
                        <InputMask
                          id={field.name}
                          {...field}
                          mask="9999 9999 9999 9999"
                          slotChar="x"
                          className={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2')}
                          autoComplete="off"
                        />
                      </>
                    )}
                  />
                  {getFormErrorMessage('card_number', errors)}
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
                      </>
                    )}
                  />
                  {getFormErrorMessage('expiration_date', errors)}
                </div>

                <div className="sm:col-span-3">
                  <Controller
                    control={control}
                    name="ccv"
                    rules={{
                      required: 'CCV is required',
                      pattern: {
                        value: /^[0-9]{3,4}$/,
                        message: 'Invalid CCV. It should be 3 or 4 digits long.',
                      },
                    }}
                    render={({ field, fieldState }) => (
                      <>
                        <HtInfoTooltip message="The CCV (Card Verification Value) is a 3 or 4 digit number on the back of your credit card.">
                          <HtInputLabel htmlFor={field.name} asterisk labelText="CCV" />
                        </HtInfoTooltip>
                        <InputMask
                          id={field.name}
                          {...field}
                          mask="999"
                          slotChar="x"
                          className={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2')}
                          autoComplete="off"
                        />
                      </>
                    )}
                  />
                  {getFormErrorMessage('ccv', errors)}
                </div>
              </>
            ) : null}

            {paymentOption.value === 'ACH' || paymentOption.value === 'ECheck' ? (
              <div className="sm:col-span-3">
                <Controller
                  control={control}
                  name="bank_name"
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
                    </>
                  )}
                />
                {getFormErrorMessage('bank_name', errors)}

                <Controller
                  control={control}
                  name="account_number"
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
                    </>
                  )}
                />
                {getFormErrorMessage('account_number', errors)}

                <Controller
                  control={control}
                  name="routing_number"
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
                    </>
                  )}
                />
                {getFormErrorMessage('routing_number', errors)}
              </div>
            ) : null}

            <div className="sm:col-span-3">
              <Controller
                control={control}
                name="holder_name"
                rules={{ required: 'Holder Name is required' }}
                render={({ field, fieldState }) => (
                  <>
                    <HtInfoTooltip message="Name of the account holder.">
                      <HtInputLabel htmlFor={field.name} asterisk labelText="Holder Name" />
                    </HtInfoTooltip>
                    <InputText
                      id={field.name}
                      {...field}
                      className={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2')}
                    />
                  </>
                )}
              />
              {getFormErrorMessage('holder_name', errors)}
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
                      currentAddress={field.value}
                      onChange={field.onChange}
                      value={field.value}
                      className={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2')}
                      aria-describedby={`${field.name}-help`}
                    />
                  </>
                )}
              />
              {getFormErrorMessage('address', errors)}
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
