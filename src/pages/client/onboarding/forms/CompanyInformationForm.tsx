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
// import { clientOnboardingSteps } from '../ClientOnboardingPage'
import {
  type StepProps,
  FormDataContext,
  type IClientOnboardingFormInputs,
  createCompanyFormData, // useUpdateOnboardingStatus,
  // type IOnboardingUpdateInfo,
} from '../clientOnboardingUtils'

export const CompanyInformationForm = ({ step, setStep }: StepProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const { formData, setFormData, defaultValues, moreAddressDetailsCompany, setMoreAddressDetailsCompany } =
    useContext(FormDataContext)

  const { showToast } = useUtils()

  // const { updateOnboardingStatus } = useUpdateOnboardingStatus()

  // const updateOnboardingInfo: IOnboardingUpdateInfo = {
  //   step_number: 1,
  //   description: clientOnboardingSteps[0].label ?? 'Company Information',
  //   type: 'client',
  //   completed: false,
  // }

  const formValues = formData != null ? formData : defaultValues

  const {
    control,
    formState: { errors },
    handleSubmit,
    getValues,
    setValue,
  } = useForm<IClientOnboardingFormInputs>({ values: formValues })

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
      if (moreAddressDetailsCompany.location_pin != null) {
        setValue('company_location_pin', moreAddressDetailsCompany.location_pin)
      }

      setMoreAddressDetailsCompany(undefined)
    }
  }, [moreAddressDetailsCompany, setMoreAddressDetailsCompany, setValue])

  const onSubmit: SubmitHandler<IClientOnboardingFormInputs> = async data => {
    setIsLoading(true)

    const companyId = formData?.company_id

    const requestData: ICompany = {
      company_name: data.company_name,
      company_dbas: data.company_dbas,
      company_tax_id: data.company_tax_id,
      company_phone_number: data.company_phone_number,
      company_country: data.company_country,
      company_address: data.company_address,
      company_city: data.company_city,
      company_state: data.company_state,
      company_zip: data.company_zip,
      company_location_pin: data.company_location_pin,
      facilities: formData.facilities,
      users: [formData?.user_id],
    }

    if (companyId) {
      try {
        const response = await requestService({ path: `companies/${companyId}` })
        if (!response.ok) throw new Error('Failed to fetch company data')
        const companyFound: ICompany = await response.json()

        if (companyFound != null) {
          const companyFormData = createCompanyFormData(companyFound)
          const updatedCompany = {
            ...companyFormData,
            ...requestData,
          }

          const response = await requestService({
            path: `companies/${companyId}`,
            method: 'PATCH',
            body: JSON.stringify(updatedCompany),
          })

          if (!response.ok) throw new Error('Failed to update company')
          const patchedCompanyData: ICompany = await response.json()

          if (patchedCompanyData?._id != null) {
            const companyFormData = createCompanyFormData(patchedCompanyData)
            setFormData(prev => ({
              ...prev,
              ...companyFormData,
              company_id: companyFormData._id ?? '',
            }))

            // await updateOnboardingStatus(updateOnboardingInfo)

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
        const response = await requestService({ method: 'POST', path: 'companies', body: JSON.stringify(requestData) })

        if (!response.ok) {
          const data = await response.json()
          const errorMessage = data.message ?? 'Failed to add company'
          showToast({
            severity: 'error',
            summary: 'Error adding company',
            detail: errorMessage,
          })
        }
        const companyData: ICompany = await response.json()

        if (companyData?._id != null) {
          const companyFormData = createCompanyFormData(companyData)
          setFormData(prev => ({
            ...prev,
            ...companyFormData,
            company_id: companyFormData._id ?? '',
          }))

          // await updateOnboardingStatus(updateOnboardingInfo)

          setTimeout(() => {
            setStep(step + 1)
          }, 1000)
        }
      } catch (error) {
        console.error('Error adding company:', error)
        setIsLoading(false)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
      <div className="space-y-4 sm:space-y-12">
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
                    {getFormErrorMessage(field.name, errors)}
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
                    <HtInfoTooltip message="Doing Business As (DBA) is also known as a trade name, fictitious business name, or assumed business name.">
                      <HtInputLabel htmlFor={field.name} labelText="Company DBAs" />
                    </HtInfoTooltip>
                    <InputText
                      id={field.name}
                      value={field.value?.join(', ')}
                      onChange={e => field.onChange(e.target.value.split(', '))}
                      className={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2')}
                      aria-describedby={`${field.name}-help`}
                    />
                    <HtInputHelpText
                      fieldName={field.name}
                      helpText="Enter DBAs separated by a comma: dba1, dba2, dba3"
                    />
                    {getFormErrorMessage(field.name, errors)}
                  </>
                )}
              />
            </div>

            <div className="sm:col-span-3">
              <Controller
                control={control}
                name="company_tax_id"
                render={({ field, fieldState }) => (
                  <>
                    <HtInfoTooltip message="A Tax Identification Number (TIN) is a unique identifier assigned to individuals and businesses for tax purposes.">
                      <HtInputLabel htmlFor={field.name} labelText="Tax ID" />
                    </HtInfoTooltip>
                    <InputMask
                      id={field.name}
                      {...field}
                      mask="99-9999999"
                      slotChar="x"
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
                name="company_phone_number"
                rules={{
                  required: 'Phone Number is required, should be 10 digits.',
                }}
                render={({ field, fieldState }) => (
                  <>
                    <HtInfoTooltip message="This is the number that administrators would call if they have questions or need to contact you.">
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
                    {getFormErrorMessage(field.name, errors)}
                  </>
                )}
              />
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
                      classNames={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2')}
                      aria-describedby={`${field.name}-help`}
                    />
                    <HtInputHelpText fieldName={field.name} helpText="Only Commercial Address" />
                    {getFormErrorMessage(field.name, errors)}
                  </>
                )}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <div>
          <Button type="submit" label="Save & Continue" loading={isLoading} />
        </div>
      </div>
    </form>
  )
}
