import { useState, useEffect } from 'react'

import { useForm, type SubmitHandler, Controller } from 'react-hook-form'
import { useParams, useNavigate } from 'react-router-dom'

import { format } from 'date-fns'
import { Button } from 'primereact/button'
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup'
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

interface ICompanyFormInputs {
  company_name: string
  company_dbas?: string[]
  company_tax_id: string
  company_address: string
  company_phone_number: string
  company_city: string
  company_state: string
  company_zip: string
  company_country: string
  facilities: string[] | IFacility[]
  users: string[]
}

export const CompanyDetailForm = ({ selectedCompanyData }: { selectedCompanyData: ICompany }) => {
  const [moreAddressDetails, setMoreAddressDetails] = useState<IAddressAutoComplete | undefined>()
  const params = useParams()
  const navigate = useNavigate()
  const { showToast } = useUtils()
  const role = roleChecker()

  const [allFacilities, setFacilities] = useState<IFacility[]>([])
  const [allClients, setClients] = useState<IUser[]>([])

  useEffect(() => {
    const getAllFacilities = async () => {
      try {
        let response
        if (role === 'client') {
          response = await requestService({ path: `facilities/company/${params.id}` })
        } else {
          response = await requestService({ path: `facilities/company/${params.id}/with-unassigned-facilities` })
        }

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
  }, [params, role])

  const defaultCompanyFormValues: ICompanyFormInputs = {
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

      setMoreAddressDetails(undefined)
    }
  }, [moreAddressDetails, setValue])

  useEffect(() => {
    if (selectedCompanyData) {
      setValue('company_name', selectedCompanyData.company_name)
      setValue('company_dbas', selectedCompanyData.company_dbas)
      setValue('company_address', selectedCompanyData.company_address)
      setValue('company_phone_number', selectedCompanyData.company_phone_number)
      setValue('company_city', selectedCompanyData.company_city)
      setValue('company_state', selectedCompanyData.company_state)
      setValue('company_zip', selectedCompanyData.company_zip)
      setValue('company_country', selectedCompanyData.company_country)
      setValue('facilities', selectedCompanyData.facilities)
      setValue('users', selectedCompanyData.users)
    }

    if (selectedCompanyData.company_tax_id != null) {
      setValue('company_tax_id', selectedCompanyData.company_tax_id)
    }
  }, [selectedCompanyData, setValue])

  const onSubmit: SubmitHandler<ICompanyFormInputs> = async data => {
    try {
      const response = await requestService({
        path: `companies/${params.id}/with-facility-assignment`,
        method: 'PATCH',
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        throw new Error('Failed to update company')
      }
      showToast({ severity: 'success', summary: 'Company updated successfully' })
    } catch (error) {
      console.error('Error updating company: ', error)
      showToast({ severity: 'error', summary: 'Failed to update company' })
    }
  }

  const accept = async () => {
    try {
      const response = await requestService({ path: `companies/${selectedCompanyData._id}`, method: 'DELETE' })

      if (response.ok) {
        const data = await response.json()
        showToast({ severity: 'success', summary: 'Success', detail: data.message })
        navigate('/admin/companies')
      }
    } catch (error) {
      console.error(error)
      showToast({ severity: 'error', summary: 'Error', detail: 'Error deleting facility' })
      navigate('/admin/companies')
    }
  }

  const reject = () => {
    showToast({ severity: 'warn', summary: 'Rejected', detail: 'You have canceled the facility delete' })
  }

  const handleDeleteConfirm = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    confirmPopup({
      target: event.currentTarget as HTMLElement,
      message:
        'If you delete this Company, all associated facilities, USERS, jobs, licenses, images and company association will be removed. Are you sure you want to proceed?',
      icon: 'pi pi-info-circle',
      defaultFocus: 'reject',
      acceptClassName: 'p-button-danger',
      accept,
      reject,
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
      <div className="space-y-4 sm:space-y-12">
        <div className="grid grid-cols-1 gap-x-8 py-12 sm:gap-y-10 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Company Information</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Please take a moment to provide the essential information for the company.
              {requiredFieldsNoticeText}
              <br />
              <br />
              Created by: {selectedCompanyData.created_by} on{' '}
              {format(selectedCompanyData?.createdAt ?? new Date(), 'MM/dd/yyyy')}
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
            <div className="sm:col-span-3">
              <Controller
                control={control}
                name="company_name"
                rules={{ required: 'Company Name is required' }}
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
                      setMoreAddressDetails={setMoreAddressDetails}
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

            {role === 'admin' ? (
              <div className="sm:col-span-6">
                <Controller
                  control={control}
                  name="users"
                  render={({ field, fieldState }) => {
                    const selectedClients = field.value
                      .map(id => allClients.find(client => client._id === id))
                      .filter(Boolean)
                    return (
                      <>
                        <HtInfoTooltip message="All clients related to this company">
                          <HtInputLabel htmlFor={field.name} labelText="Users" />
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
                          helpText="Please select all users related to this company."
                        />
                        {getFormErrorMessage(field.name, errors)}
                      </>
                    )
                  }}
                />
              </div>
            ) : null}

            <div className="sm:col-span-6">
              <Controller
                control={control}
                name="facilities"
                render={({ field, fieldState }) => {
                  const selectedFacilities = field.value
                    .map(item => allFacilities.find(facility => facility._id === item))
                    .filter(Boolean)
                  return (
                    <>
                      <HtInfoTooltip message="All facilities related to this company">
                        <HtInputLabel htmlFor={field.name} labelText="Facilities" />
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
                        disabled={role === 'client'}
                      />
                      <HtInputHelpText fieldName={field.name} helpText="All facilities which this company owns." />
                      {getFormErrorMessage(field.name, errors)}
                    </>
                  )
                }}
              />
            </div>
            <div className="flex gap-2 sm:col-span-6">
              <Button
                type="submit"
                label="Update Company"
                icon="pi pi-save"
                pt={{ label: { className: 'text-nowrap' } }}
              />
              {role === 'admin' ? (
                <div className="basis-2/5">
                  <ConfirmPopup />
                  <Button
                    onClick={handleDeleteConfirm}
                    icon="pi pi-times"
                    label="Delete Company"
                    severity="danger"
                    pt={{ label: { className: 'text-nowrap' } }}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
