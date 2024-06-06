import { useContext, useEffect, useState } from 'react'

import { Controller, type SubmitHandler, useForm } from 'react-hook-form'

import { Button } from 'primereact/button'
import { InputMask } from 'primereact/inputmask'
import { InputText } from 'primereact/inputtext'
import { classNames } from 'primereact/utils'

import { AddressAutoComplete } from '../../../../components/shared/forms/AddressAutoComplete'
import { HtInputHelpText } from '../../../../components/shared/forms/HtInputHelpText'
import { HtInputLabel } from '../../../../components/shared/forms/HtInputLabel'
import { HtInfoTooltip } from '../../../../components/shared/general/HtInfoTooltip'
import { type ICompany } from '../../../../interfaces/company'
import { requestService } from '../../../../services/requestServiceNew'
import { useUtils } from '../../../../store/useUtils'
import { getFormErrorMessage } from '../../../../utils/formUtils'
import { requiredFieldsNoticeText } from '../../../../utils/formUtils'
import { type StepProps, FormDataContext, type IClientOnboardingFormInputs } from '../clientOnboardingUtils'

export const CompanyInformationForm = ({ step, setStep }: StepProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const { setFormData, defaultValues, formData, moreAddressDetailsCompany, setMoreAddressDetailsCompany } =
    useContext(FormDataContext)

  const { showToast } = useUtils()

  const values = formData !== null ? formData : defaultValues

  const {
    control,
    formState: { errors },
    handleSubmit,
    getValues,
    setValue,
  } = useForm<IClientOnboardingFormInputs>({ values })

  useEffect(() => {
    if (moreAddressDetailsCompany) {
      if (moreAddressDetailsCompany.zip != null) {
        setValue('company_zip', moreAddressDetailsCompany.zip)
      }
      if (moreAddressDetailsCompany.state != null) {
        setValue('company_state', moreAddressDetailsCompany.state)
      }
      if (moreAddressDetailsCompany.city != null) {
        setValue('company_city', moreAddressDetailsCompany.city)
      }
      if (moreAddressDetailsCompany.address != null) {
        setValue('company_address', moreAddressDetailsCompany.address)
      }
      if (moreAddressDetailsCompany.country != null) {
        setValue('company_country', moreAddressDetailsCompany.country)
      }

      setMoreAddressDetailsCompany(undefined)
    }
  }, [moreAddressDetailsCompany, setMoreAddressDetailsCompany, setValue])

  const onSubmit: SubmitHandler<IClientOnboardingFormInputs> = async data => {
    setFormData(data)
    setIsLoading(true)

    let companyId = formData?.company_id

    if (companyId != null) {
      try {
        const response = await requestService({ path: `companies/${companyId}` })
        if (!response.ok) throw new Error('Failed to fetch company data')
        const companyFound: ICompany = await response.json()

        if (companyFound != null) {
          const updatedCompany = {
            ...companyFound,
            ...data,
          }

          const response = await requestService({
            path: `companies/${companyId}`,
            method: 'PATCH',
            body: JSON.stringify(updatedCompany),
          })
          if (!response.ok) throw new Error('Failed to update company')
          const companyData: ICompany = await response.json()

          if (companyData?._id != null) {
            companyId = companyData._id

            setFormData(prev => ({
              ...prev,
              company_id: companyData._id,
              company_name: companyData.company_name,
              company_dbas: companyData?.company_dbas || [],
              company_tax_id: companyData.company_tax_id,
              company_phone_number: companyData.company_phone_number,
              company_country: companyData.company_country,
              company_address: companyData.company_address,
              company_city: companyData.company_city,
              company_state: companyData.company_state,
              company_zip: companyData.company_zip,
            }))
            setTimeout(() => {
              setStep(step + 1)
            }, 1000)
          }
        }
      } catch (error) {
        console.error('Error updating company:', error)

        showToast({
          severity: 'error',
          summary: 'Error saving changes',
          detail: `Company ${getValues('name')} could not be updated.`,
        })
        setIsLoading(false)
      }
    } else {
      try {
        const response = await requestService({ method: 'POST', path: 'companies', body: JSON.stringify(data) })

        if (!response.ok) throw new Error('Failed to add company')
        const companyData: ICompany = await response.json()
        if (companyData?._id != null) {
          companyId = companyData._id

          setFormData(prev => ({
            ...prev,
            company_id: companyData._id,
            company_name: companyData.company_name,
            company_dbas: companyData?.company_dbas || [],
            company_tax_id: companyData.company_tax_id,
            company_phone_number: companyData.company_phone_number,
            company_country: companyData.company_country,
            company_address: companyData.company_address,
            company_city: companyData.company_city,
            company_state: companyData.company_state,
            company_zip: companyData.company_zip,
          }))
          setTimeout(() => {
            setStep(step + 1)
          }, 1000)
        }
      } catch (error) {
        console.error('Error adding company:', error)
        showToast({
          severity: 'error',
          summary: 'Error adding company',
          detail: `Company ${getValues('name')} could not be added.`,
        })
        setIsLoading(false)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
      <div className="space-y-4 sm:space-y-12">
        {/* Company Information */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-4 border-b border-gray-900/10 pb-12 sm:gap-y-10 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Company Information</h2>
            <p className="mt-4 text-sm leading-6 text-gray-600">
              Please take a moment to provide the essential information for the company.
            </p>
            {requiredFieldsNoticeText}
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
            <div className="sm:col-span-3">
              <Controller
                control={control}
                name="company_name"
                rules={{ required: 'Corporate Name is required' }}
                render={({ field, fieldState }) => (
                  <>
                    <HtInfoTooltip message="A corporate name is the legal name of a corporation.">
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
                    <HtInfoTooltip message="Doing Business As (DBA) is also known as a trade name, fictitious business name, or assumed business name.">
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
                    <HtInfoTooltip message="A Tax Identification Number (TIN) in the United States is a unique identifier assigned to individuals and businesses for tax purposes.">
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
                name="company_phone_number"
                rules={{
                  required: 'Phone Number is required, should be 10 digits.',
                  pattern: /^\d{10}$/,
                }}
                render={({ field, fieldState }) => (
                  <>
                    <HtInfoTooltip message="The phone number of the company. This is the number that administrators would call if they have questions or need to contact you.">
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

            <div className="sm:col-span-6">
              <Controller
                control={control}
                name="company_address"
                rules={{ required: 'Address is required' }}
                render={({ field, fieldState }) => (
                  <>
                    <HtInfoTooltip message="Legal address of the company.">
                      <HtInputLabel htmlFor={field.name} asterisk labelText="Company Address" />
                    </HtInfoTooltip>
                    <AddressAutoComplete
                      controlled
                      setMoreAddressDetails={setMoreAddressDetailsCompany}
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
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <div>
          <Button type="submit" label="Submit" loading={isLoading} />
        </div>
      </div>
    </form>
  )
}
