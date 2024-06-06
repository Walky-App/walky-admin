import { useState, useEffect } from 'react'

import { useForm, type SubmitHandler, Controller } from 'react-hook-form'
import { useParams, useNavigate } from 'react-router-dom'

import { Button } from 'primereact/button'
import { InputMask } from 'primereact/inputmask'
import { InputText } from 'primereact/inputtext'
import { MultiSelect, type MultiSelectChangeEvent } from 'primereact/multiselect'
import { classNames } from 'primereact/utils'

import { AddressAutoComplete } from '../../../../components/shared/forms/AddressAutoComplete'
import { type IAddressAutoComplete } from '../../../../components/shared/forms/AddressAutoComplete'
import { HtInputHelpText } from '../../../../components/shared/forms/HtInputHelpText'
import { HtInputLabel } from '../../../../components/shared/forms/HtInputLabel'
import { HtInfoTooltip } from '../../../../components/shared/general/HtInfoTooltip'
import { type IFacility } from '../../../../interfaces/Facility'
import { type IUser } from '../../../../interfaces/User'
import { requestService } from '../../../../services/requestServiceNew'
import { useUtils } from '../../../../store/useUtils'
import { getFormErrorMessage } from '../../../../utils/formUtils'
import { requiredFieldsNoticeText } from '../../../../utils/formUtils'
import { useAdminCompanyPageContext } from '../AdminCompanyPage'

interface ICompanyFormInputs {
  corp_name: string
  company_dbas: string[]
  tax_id: string
  address: string
  phone_number: string
  city: string
  state: string
  zip: string
  country: string
  facilities: string[]
  clients: string[]
}

export const AdminCompanyDetails = () => {
  const [moreAddressDetails, setMoreAddressDetails] = useState<IAddressAutoComplete | undefined>()
  const params = useParams()
  const navigate = useNavigate()
  const { showToast } = useUtils()

  const [allFacilities, setFacilities] = useState<IFacility[]>([])
  const [allClients, setClients] = useState<IUser[]>([])

  const { selectedCompanyData } = useAdminCompanyPageContext()

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

  const defaultCompanyFormValues: ICompanyFormInputs = {
    corp_name: '',
    company_dbas: [],
    tax_id: '',
    address: '',
    phone_number: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    facilities: [],
    clients: [],
  }

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<ICompanyFormInputs>({
    defaultValues: defaultCompanyFormValues,
  })

  useEffect(() => {
    if (moreAddressDetails) {
      if (moreAddressDetails.zip != null) {
        setValue('zip', moreAddressDetails.zip)
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

  useEffect(() => {
    if (selectedCompanyData) {
      setValue('corp_name', selectedCompanyData.corp_name)
      setValue('company_dbas', selectedCompanyData.company_dbas)
      setValue('tax_id', selectedCompanyData.tax_id)
      setValue('address', selectedCompanyData.address)
      setValue('phone_number', selectedCompanyData.phone_number)
      setValue('city', selectedCompanyData.city)
      setValue('state', selectedCompanyData.state)
      setValue('zip', selectedCompanyData.zip)
      setValue('country', selectedCompanyData.country)
      setValue('facilities', selectedCompanyData.facilities)
      setValue('clients', selectedCompanyData.clients)
    }
  }, [selectedCompanyData, setValue])

  const onSubmit: SubmitHandler<ICompanyFormInputs> = async data => {
    try {
      const response = await requestService({
        path: `companies/${params.id}`,
        method: 'PATCH',
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        throw new Error('Failed to update company')
      }
      showToast({ severity: 'success', summary: 'Company updated successfully' })
      setTimeout(() => {
        navigate(`/admin/companies`)
      }, 2000)
    } catch (error) {
      console.error('Error updating company: ', error)
      showToast({ severity: 'error', summary: 'Failed to update company' })
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
                name="corp_name"
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
                name="address"
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
                name="phone_number"
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

            <div className="sm:col-span-3">
              <Controller
                control={control}
                name="clients"
                rules={{ required: 'At least one client is required' }}
                render={({ field, fieldState }) => {
                  const selectedClients = field.value
                    .map(id => allClients.find(client => client._id === id))
                    .filter(Boolean)
                  return (
                    <>
                      <HtInfoTooltip message="All clients related to this company">
                        <HtInputLabel htmlFor={field.name} asterisk labelText="Clients" />
                      </HtInfoTooltip>
                      <MultiSelect
                        id={field.name}
                        {...field}
                        value={selectedClients}
                        optionLabel="email"
                        options={allClients}
                        display="chip"
                        selectAll
                        selectAllLabel="Select All"
                        onChange={(e: MultiSelectChangeEvent) => {
                          field.onChange(e.value.map((client: IUser) => client._id))
                        }}
                        placeholder="Select Services"
                        className={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2')}
                      />
                      <HtInputHelpText
                        fieldName={field.name}
                        helpText="Please select all clients related to this company."
                      />
                      {getFormErrorMessage('services', errors)}
                    </>
                  )
                }}
              />
            </div>

            <div className="sm:col-span-6">
              <Controller
                control={control}
                name="facilities"
                rules={{ required: 'At least one facility is required' }}
                render={({ field, fieldState }) => {
                  const selectedFacilities = field.value
                    .map(item => allFacilities.find(facility => facility._id === item))
                    .filter(Boolean)
                  return (
                    <>
                      <HtInfoTooltip message="All facilities related to this company">
                        <HtInputLabel htmlFor={field.name} asterisk labelText="Facilities" />
                      </HtInfoTooltip>
                      <MultiSelect
                        id={field.name}
                        {...field}
                        value={selectedFacilities}
                        optionLabel="name"
                        options={allFacilities}
                        display="chip"
                        selectAll
                        selectAllLabel="Select All"
                        onChange={(e: MultiSelectChangeEvent) => {
                          field.onChange(e.value.map((facility: IFacility) => facility._id))
                        }}
                        placeholder="Select Services"
                        className={classNames({ 'p-invalid': fieldState.invalid }, 'mt-2')}
                      />
                      <HtInputHelpText
                        fieldName={field.name}
                        helpText="Please select all facilities that this company owns."
                      />
                      {getFormErrorMessage('services', errors)}
                    </>
                  )
                }}
              />
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
