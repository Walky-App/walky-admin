import { useEffect, useState } from 'react'

import { Controller, type SubmitHandler, useForm } from 'react-hook-form'

import { Button } from 'primereact/button'
import { InputMask } from 'primereact/inputmask'
import { InputText } from 'primereact/inputtext'
import { classNames } from 'primereact/utils'

import { AddressAutoComplete } from '../../../components/shared/forms/AddressAutoComplete'
import { type IAddressAutoComplete } from '../../../components/shared/forms/AddressAutoComplete'
import { HtInputHelpText } from '../../../components/shared/forms/HtInputHelpText'
import { HtInputLabel } from '../../../components/shared/forms/HtInputLabel'
import { HtInfoTooltip } from '../../../components/shared/general/HtInfoTooltip'
import { requestService } from '../../../services/requestServiceNew'
import { useUtils } from '../../../store/useUtils'
import { getFormErrorMessage } from '../../../utils/formUtils'

export interface ICompanyFormInputs {
  corp_name: string
  company_dbas: string[]
  tax_id: string
  address: string
  phone_number: string
  city: string
  state: string
  zip: string
  country: string
}

export const AdminAddCompany = () => {
  const [moreAddressDetails, setMoreAddressDetails] = useState<IAddressAutoComplete | undefined>()

  const { showToast } = useUtils()

  const defaultValues: ICompanyFormInputs = {
    corp_name: '',
    company_dbas: [],
    tax_id: '',
    address: '',
    phone_number: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  }

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<ICompanyFormInputs>({ defaultValues })

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
      if (moreAddressDetails.address) {
        setValue('address', moreAddressDetails.address)
      }
      if (moreAddressDetails.country) {
        setValue('country', moreAddressDetails.country)
      }

      setMoreAddressDetails(undefined)
    }
  }, [moreAddressDetails, setValue])

  const requiredFieldsNoticeText = (
    <p className="mt-1 text-sm leading-6 text-gray-600">
      <span style={{ color: 'red' }}>*</span> indicates a required field.
    </p>
  )

  const onSubmit: SubmitHandler<ICompanyFormInputs> = async (data: ICompanyFormInputs) => {
    try {
      const response = await requestService({ path: 'companies', method: 'POST', body: JSON.stringify(data) })
      if (!response.ok) {
        throw new Error('Failed to add company')
      }
      showToast({ severity: 'success', summary: 'Company added successfully' })
    } catch (error) {
      console.error('Error adding company: ', error)
      showToast({ severity: 'error', summary: 'Failed to add company' })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
      <div className="space-y-12">
        <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Company Information</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Please take a moment to provide the essential information for the company. We require you to specify the
              company name and provide an address for the company.
            </p>
            {requiredFieldsNoticeText}
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
                </>
              )}
            />
            {getFormErrorMessage('corp_name', errors)}
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
                </>
              )}
            />
            {getFormErrorMessage('company_dbas', errors)}
          </div>

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
                </>
              )}
            />
            {getFormErrorMessage('tax_id', errors)}
          </div>

          <div className="sm:col-span-3">
            <Controller
              control={control}
              name="address"
              rules={{ required: 'Address is required' }}
              render={({ field, fieldState }) => (
                <>
                  <HtInfoTooltip message="The address of your facility. This is the physical location of your facility.">
                    <HtInputLabel htmlFor={field.name} asterisk labelText="Company Address" />
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
                  <HtInputHelpText fieldName={field.name} helpText="Only Commercial Address" />
                </>
              )}
            />
            {getFormErrorMessage('address', errors)}
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
                    <HtInputLabel htmlFor={field.name} asterisk labelText="Company Phone Number" />
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
                </>
              )}
            />
            {getFormErrorMessage('phone_number', errors)}
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
