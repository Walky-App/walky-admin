import { useEffect, useState } from 'react'

import { Controller, type SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { Button } from 'primereact/button'
import { InputMask } from 'primereact/inputmask'
import { InputText } from 'primereact/inputtext'
import { MultiSelect, type MultiSelectChangeEvent } from 'primereact/multiselect'
import { classNames } from 'primereact/utils'

import { AddressAutoComplete } from '../../../components/shared/forms/AddressAutoComplete'
import { type IAddressAutoComplete } from '../../../components/shared/forms/AddressAutoComplete'
import { HtInputHelpText } from '../../../components/shared/forms/HtInputHelpText'
import { HtInputLabel } from '../../../components/shared/forms/HtInputLabel'
import { HtInfoTooltip } from '../../../components/shared/general/HtInfoTooltip'
import { type IUser } from '../../../interfaces/User'
import { type ICompany } from '../../../interfaces/company'
import { type IFacility } from '../../../interfaces/facility'
import { requestService } from '../../../services/requestServiceNew'
import { useUtils } from '../../../store/useUtils'
import { getFormErrorMessage } from '../../../utils/formUtils'
import { requiredFieldsNoticeText } from '../../../utils/formUtils'
import { roleChecker } from '../../../utils/roleChecker'
import { GetTokenInfo } from '../../../utils/tokenUtil'

export const AdminAddCompany = () => {
  const [moreAddressDetails, setMoreAddressDetails] = useState<IAddressAutoComplete | undefined>()
  const [allFacilities, setFacilities] = useState<IFacility[]>([])
  const [allClients, setClients] = useState<IUser[]>([])
  const navigate = useNavigate()
  const client_id = GetTokenInfo()?._id
  const role = roleChecker()

  useEffect(() => {
    const getAllFacilities = async () => {
      try {
        const response = await requestService({ path: 'facilities' })
        if (response.ok) {
          const fetchedFacilities: IFacility[] = await response.json()
          setFacilities(fetchedFacilities)
        } else {
          setFacilities([])
        }
      } catch (error) {
        console.error('Error fetching facilities data:', error)
      }
    }

    const getAllClients = async () => {
      try {
        const response = await requestService({ path: 'users/clients' })
        if (response.ok) {
          const fetchedClients: IUser[] = await response.json()
          setClients(fetchedClients)
        } else {
          setClients([])
        }
      } catch (error) {
        console.error('Error fetching clients data:', error)
      }
    }

    getAllFacilities()
    getAllClients()
  }, [])

  const { showToast } = useUtils()

  const defaultValues: ICompany = {
    company_name: '',
    company_dbas: [],
    company_tax_id: '',
    company_address: '',
    company_phone_number: '',
    company_city: '',
    company_state: '',
    company_zip: '',
    company_country: '',
    facilities: [],
    users: [],
    createdAt: '',
    company_location_pin: [],
  }

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<ICompany>({ defaultValues })

  useEffect(() => {
    if (moreAddressDetails) {
      if (moreAddressDetails.zip != null) {
        setValue('company_zip', moreAddressDetails.zip)
      }
      if (moreAddressDetails.state != null) {
        setValue('company_state', moreAddressDetails.state)
      }
      if (moreAddressDetails.city != null) {
        setValue('company_city', moreAddressDetails.city)
      }
      if (moreAddressDetails.address != null) {
        setValue('company_address', moreAddressDetails.address)
      }
      if (moreAddressDetails.country != null) {
        setValue('company_country', moreAddressDetails.country)
      }
      if (moreAddressDetails.location_pin != null) {
        setValue('company_location_pin', moreAddressDetails.location_pin)
      }

      setMoreAddressDetails(undefined)
    }
  }, [moreAddressDetails, setValue])

  const onSubmit: SubmitHandler<ICompany> = async (data: ICompany) => {
    try {
      if (role === 'client') {
        data.users = [client_id]
      }

      const response = await requestService({ path: 'companies', method: 'POST', body: JSON.stringify(data) })
      if (!response.ok) {
        throw new Error('Failed to add company')
      }
      showToast({ severity: 'success', summary: 'Company added successfully' })
      setTimeout(() => {
        if (role === 'admin') {
          navigate('/admin/companies')
        } else {
          navigate('/client/companies')
        }
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
            <h2 className="text-base font-semibold leading-7 text-gray-900">Company Information</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
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
                      <HtInputLabel htmlFor={field.name} asterisk labelText="Company Name" />
                    </HtInfoTooltip>
                    <InputText
                      id={field.name}
                      {...field}
                      className={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2')}
                    />
                  </>
                )}
              />
              {getFormErrorMessage('company_name', errors)}
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
                  </>
                )}
              />
              {getFormErrorMessage('company_dbas', errors)}
            </div>

            <div className="sm:col-span-3">
              <Controller
                control={control}
                name="company_tax_id"
                render={({ field, fieldState }) => (
                  <>
                    <HtInfoTooltip message="A Tax Identification Number (TIN) in the United States is a unique identifier assigned to individuals and businesses for tax purposes.">
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
                  </>
                )}
              />
              {getFormErrorMessage('company_tax_id', errors)}
            </div>

            <div className="sm:col-span-3">
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
                      setMoreAddressDetails={setMoreAddressDetails}
                      currentAddress={field.value}
                      onChange={field.onChange}
                      value={field.value}
                      classNames={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2')}
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
                name="company_phone_number"
                rules={{
                  required: 'Phone Number is required, should be 10 digits.',
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
              {getFormErrorMessage('company_phone_number', errors)}
            </div>

            {role === 'admin' ? (
              <div className="sm:col-span-3">
                <Controller
                  control={control}
                  name="users"
                  render={({ field, fieldState }) => (
                    <>
                      <HtInfoTooltip message="All clients related to this company">
                        <HtInputLabel htmlFor={field.name} labelText="Users" />
                      </HtInfoTooltip>
                      <MultiSelect
                        id={field.name}
                        {...field}
                        value={field.value}
                        optionLabel="email"
                        options={allClients}
                        display="chip"
                        selectAll
                        selectAllLabel="Select All"
                        onChange={(e: MultiSelectChangeEvent) => {
                          field.onChange(e.value)
                        }}
                        placeholder="Select Services"
                        className={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2')}
                      />
                      <HtInputHelpText
                        fieldName={field.name}
                        helpText="Please select all users related to this company."
                      />
                      {getFormErrorMessage('services', errors)}
                    </>
                  )}
                />
              </div>
            ) : null}

            {role === 'admin' ? (
              <div className="sm:col-span-6">
                <Controller
                  control={control}
                  name="facilities"
                  render={({ field, fieldState }) => (
                    <>
                      <HtInfoTooltip message="All facilities related to this company">
                        <HtInputLabel htmlFor={field.name} labelText="Facilities" />
                      </HtInfoTooltip>
                      <MultiSelect
                        id={field.name}
                        {...field}
                        value={field.value}
                        optionLabel="name"
                        options={allFacilities}
                        display="chip"
                        selectAll
                        selectAllLabel="Select All"
                        onChange={(e: MultiSelectChangeEvent) => field.onChange(e.value)}
                        placeholder="Select facilities"
                        className={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2')}
                      />
                      <HtInputHelpText
                        fieldName={field.name}
                        helpText="Please select all facilities that this company owns."
                      />
                      {getFormErrorMessage('services', errors)}
                    </>
                  )}
                />
              </div>
            ) : null}
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
