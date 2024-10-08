import { useState, useEffect } from 'react'

import { useNavigate } from 'react-router-dom'

import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import { InputMask } from 'primereact/inputmask'
import { type InputMaskChangeEvent } from 'primereact/inputmask'
import { InputSwitch } from 'primereact/inputswitch'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { MultiSelect, type MultiSelectChangeEvent } from 'primereact/multiselect'
import { classNames } from 'primereact/utils'

import { AddressAutoComplete, type IAddressAutoComplete } from '../../../components/shared/forms/AddressAutoComplete'
import { HtInputHelpText } from '../../../components/shared/forms/HtInputHelpText'
import { HtInputLabel } from '../../../components/shared/forms/HtInputLabel'
import { HtInfoTooltip } from '../../../components/shared/general/HtInfoTooltip'
import { type IUser } from '../../../interfaces/User'
import { type ICompany } from '../../../interfaces/company'
import { type IFacility } from '../../../interfaces/facility'
import { requestService } from '../../../services/requestServiceNew'
import { useUtils } from '../../../store/useUtils'
import { jobTitlesOptions, facilityContactRoles } from '../../../utils/formOptions'
import { requiredFieldsNoticeText } from '../../../utils/formUtils'
import { roleChecker } from '../../../utils/roleChecker'

const defaultFacilityFormValues: IFacility = {
  name: '',
  country: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  location_pin: [],
  license_number: '',
  phone_number: '',
  notes: '',
  active: false,
  sqft: 0,
  services: [],
  company_id: '',
  contacts: [
    {
      first_name: '',
      last_name: '',
      role: '',
      phone_number: '',
      email: '',
    },
  ],
  createdAt: '',
  isApproved: false,
  main_image: '',
  timezone: '',
}

const defaultMoreAddressDetails: IAddressAutoComplete = {
  zip: undefined,
  state: undefined,
  city: undefined,
  location_pin: undefined,
  address: undefined,
  country: undefined,
}

export const AdminAddFacility = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [companies, setCompanies] = useState<ICompany[]>([])
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null)
  const [checked, setChecked] = useState(true)
  const [client, setClient] = useState<IUser | undefined>()
  const [formData, setFormData] = useState<IFacility>(defaultFacilityFormValues)
  const [moreAddressDetails, setMoreAddressDetails] = useState<IAddressAutoComplete | undefined>(
    defaultMoreAddressDetails,
  )

  const { showToast } = useUtils()
  const navigate = useNavigate()
  const role = roleChecker()

  useEffect(() => {
    const getCompanies = async () => {
      try {
        if (role === 'client') {
          setChecked(false)
          const response = await requestService({ path: `companies/byclient` })
          if (response.ok) {
            const data = await response.json()
            const { companies, user } = data
            setClient(user)
            setCompanies(companies)
          }
        } else {
          const response = await requestService({ path: 'companies' })
          if (response.ok) {
            const allCompanies = await response.json()
            setCompanies(allCompanies)
          }
        }
      } catch (error) {
        console.error('error', error)
        showToast({
          severity: 'error',
          summary: 'Failed to fetch companies',
          detail: 'Unable to fetch companies. Please try again.',
          life: 2000,
        })
      }
    }
    getCompanies()
  }, [role, showToast])

  useEffect(() => {
    if (moreAddressDetails) {
      setFormData(prevState => ({
        ...prevState,
        country: moreAddressDetails.country ?? '',
        state: moreAddressDetails.state ?? '',
        zip: moreAddressDetails.zip ?? '',
        city: moreAddressDetails.city ?? '',
        location_pin: moreAddressDetails.location_pin ?? [],
        address: moreAddressDetails.address ?? '',
      }))
    }
  }, [moreAddressDetails, setMoreAddressDetails])

  const handleFormUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target as HTMLInputElement
    setFormData(prevState => ({ ...prevState, [name]: value }))
  }

  const handleFormUpdateContact = (e: React.ChangeEvent<HTMLInputElement> | InputMaskChangeEvent) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      contacts: [{ ...prevState.contacts[0], [name]: value }],
    }))
  }

  const handleFormUpdateNumber = (e: InputMaskChangeEvent) => {
    const { name, value } = e.target
    setFormData(prevState => ({ ...prevState, [name]: value }))
  }

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await requestService({ path: 'facilities', method: 'POST', body: JSON.stringify(formData) })
      if (response.ok) {
        showToast({
          severity: 'success',
          summary: 'Facility Added',
          detail: `${formData.name} Facility has been added successfully.`,
          life: 2000,
        })
        setTimeout(() => {
          navigate(`/${role}/facilities/`)
        }, 2000)
      } else {
        const errorData = await response.json()
        console.error('Failed to create the facility.', errorData.message)
        showToast({
          severity: 'error',
          summary: 'Error',
          detail: `Failed to add facility. ${errorData?.error?.keyPattern?.address === 1 ? 'Check facility address' : null}`,
        })
      }
    } catch (error) {
      console.error('Error occurred while creating facility:', error)
      showToast({
        severity: 'error',
        summary: 'Failed to add facility',
        detail: 'Unable to add facility.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCompanySameAsFacility = (companySelectedId: string | null = null) => {
    const companySelected = companies?.find((company: ICompany) => company._id === companySelectedId)

    if (companySelected !== null && companySelected !== undefined) {
      setFormData(prevState => ({
        ...prevState,
        company_id: companySelectedId ?? '',
        name: companySelected.company_name,
        tax_id: companySelected.company_tax_id,
        phone_number: companySelected.company_phone_number,
        address: companySelected.company_address,
        city: companySelected.company_city,
        state: companySelected.company_state,
        zip: companySelected.company_zip,
        country: companySelected.company_country,
        location_pin: companySelected.company_location_pin,
      }))
    } else {
      setFormData(prevState => ({
        ...prevState,
        name: '',
        license_number: '',
        phone_number: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        location_pin: [],
      }))
    }
  }

  return (
    <form onSubmit={handleOnSubmit}>
      <div className="p-fluid space-y-4 sm:space-y-12">
        {/* Business Information */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-4 pb-12 sm:gap-y-10 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Business Information</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Please provide information about your business so that we can verify you on the platform.
            </p>
          </div>
          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
            <div className="sm:col-span-5">
              <HtInputLabel htmlFor="company_name" labelText="Select Company" />
              <Dropdown
                inputId="company_name"
                optionLabel="company_name"
                optionValue="_id"
                value={selectedCompanyId}
                name="company_name"
                options={companies}
                filter
                onChange={e => {
                  const selectedCompany = companies?.find((company: ICompany) => company._id === e.value)
                  if (selectedCompany !== null && selectedCompany !== undefined) {
                    setSelectedCompanyId(e.value)
                    setFormData({ ...formData, company_id: e.value })

                    role === 'admin' && handleCompanySameAsFacility(e.value)
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Don't show the rest of the form until a company is selected */}
        <div>
          {selectedCompanyId !== null && selectedCompanyId !== undefined ? (
            <>
              {role === 'admin' ? (
                <div className="grid grid-cols-1 gap-x-8 gap-y-4 pb-12 sm:gap-y-10 md:grid-cols-3">
                  <div>
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Business same as the Facility?</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      Please provide information about your business so that we can verify you on the platform.
                    </p>
                  </div>

                  <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
                    <div className="flex w-72 items-center">
                      <h2 className="mr-3 text-xl font-semibold">No</h2>
                      <InputSwitch
                        checked={checked}
                        onChange={e => {
                          setChecked(e.value)
                          if (e.value) {
                            handleCompanySameAsFacility(selectedCompanyId)
                          } else {
                            handleCompanySameAsFacility()
                          }
                        }}
                      />
                      <h2 className="ml-3 text-xl font-semibold">Yes</h2>
                    </div>
                  </div>
                </div>
              ) : null}

              <div>
                {/* Facility Location */}
                <div className="grid grid-cols-1 gap-x-8 gap-y-4 border-b border-t border-gray-900/10 py-12 sm:gap-y-10 md:grid-cols-3">
                  <div>
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Facility Location</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      Please type in the address and choose from the dropdown to select the correct address.
                    </p>
                    {requiredFieldsNoticeText}
                  </div>

                  <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
                    <div className="sm:col-span-6">
                      <HtInfoTooltip message="The address of your facility. This is the physical location of your facility.">
                        <HtInputLabel htmlFor="address" asterisk labelText="Facility Address" />
                      </HtInfoTooltip>
                      <AddressAutoComplete
                        controlled
                        value={formData.address}
                        disabled={checked}
                        setMoreAddressDetails={setMoreAddressDetails}
                        currentAddress={formData.address}
                        classNames={classNames({ 'p-invalid': false }, 'mt-2')}
                        aria-describedby="address-help"
                      />
                      <HtInputHelpText fieldName="address" helpText="Commercial Address ONLY" />
                    </div>
                  </div>
                </div>

                {/* Facility Information */}
                <div className="grid grid-cols-1 gap-x-8 gap-y-4 border-b border-gray-900/10 py-12 sm:gap-y-10 md:grid-cols-3">
                  <div>
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Facility Information</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      Please provide information about your business so that we can verify you on the platform.
                    </p>
                    {requiredFieldsNoticeText}
                  </div>

                  <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
                    <div className="sm:col-span-3">
                      <HtInfoTooltip message="Primary state or city license number for this facility.">
                        <HtInputLabel htmlFor="license_number" labelText="License Number" />
                      </HtInfoTooltip>
                      <InputText
                        value={formData.license_number}
                        id="license_number"
                        name="license_number"
                        onChange={handleFormUpdate}
                        autoComplete="off"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <HtInfoTooltip message="The name of your first facility. You will be able to add additional facilities after you complete the onboarding process for this facility.">
                        <HtInputLabel htmlFor="name" asterisk labelText="Facility Name" />
                      </HtInfoTooltip>
                      <InputText
                        name="name"
                        id="name"
                        required
                        autoComplete="off"
                        onChange={handleFormUpdate}
                        value={formData.name}
                        placeholder="e.g. Main Facility"
                        disabled={checked}
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <HtInfoTooltip message="The phone number of your facility. This is the number that workers will call if they have questions or need to contact you.">
                        <HtInputLabel htmlFor="phone-number" asterisk labelText="Facility Phone Number" />
                      </HtInfoTooltip>
                      <InputMask
                        name="phone_number"
                        id="phone-number"
                        mask="(999) 999-9999"
                        slotChar="#"
                        unmask={true}
                        autoComplete="off"
                        placeholder="(123) 456-7890"
                        value={formData.phone_number}
                        required
                        onChange={handleFormUpdateNumber}
                        disabled={checked}
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <HtInfoTooltip message="The square footage of your facility. This is the total area of your facility in square feet.">
                        <HtInputLabel htmlFor="sqft" labelText="Facility Square Footage" />
                      </HtInfoTooltip>
                      <InputText
                        name="sqft"
                        id="sqft"
                        onChange={handleFormUpdate}
                        keyfilter={/[0-9]/}
                        min={0}
                        max={1000000}
                      />
                      <HtInputHelpText fieldName="sqft" helpText="Max 1,000,000" />
                    </div>

                    <div className="sm:col-span-6">
                      <HtInfoTooltip message="The services that your facility offers.">
                        <HtInputLabel htmlFor="services" asterisk labelText="Services" />
                      </HtInfoTooltip>
                      <MultiSelect
                        required
                        id="services"
                        value={formData.services}
                        optionLabel="title"
                        options={jobTitlesOptions}
                        display="chip"
                        selectAll
                        selectAllLabel="Select All"
                        onChange={e => setFormData(prevState => ({ ...prevState, services: e.value }))}
                        placeholder="Select Services"
                        className={classNames({ 'p-invalid': false }, 'mt-2')}
                      />
                      <HtInputHelpText
                        fieldName="services"
                        helpText="Please select all services that your facility offers."
                      />
                    </div>

                    <div className="sm:col-span-6">
                      <HtInfoTooltip message="Any additional notes that you would like to provide about your facility. This information will be verified before application approval.">
                        <HtInputLabel htmlFor="notes" labelText="Arrival notes" />
                      </HtInfoTooltip>
                      <InputTextarea
                        id="notes"
                        rows={4}
                        cols={30}
                        maxLength={500}
                        onChange={e => setFormData(prevState => ({ ...prevState, notes: e.target.value }))}
                        className={classNames({ 'p-invalid': false }, 'mt-2')}
                        autoComplete="off"
                      />
                      <HtInputHelpText
                        fieldName="notes"
                        helpText="Max 500 characters. Please do not enter contact information into this field."
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 gap-x-8 gap-y-4 border-b border-gray-900/10 py-12 sm:gap-y-10 md:grid-cols-3">
                  <div>
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Business Contact Information</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      Please provide your contact information below.
                    </p>
                    {requiredFieldsNoticeText}
                  </div>
                  <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
                    <div className="sm:col-span-3">
                      <HtInfoTooltip message="The first name of the contact person.">
                        <HtInputLabel htmlFor="first_name" asterisk labelText="First Name" />
                      </HtInfoTooltip>
                      <InputText
                        required
                        value={client?.first_name}
                        name="first_name"
                        id="first_name"
                        autoComplete="off"
                        onChange={handleFormUpdateContact}
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <HtInfoTooltip message="The last name of the contact person.">
                        <HtInputLabel htmlFor="last_name" asterisk labelText="Last Name" />
                      </HtInfoTooltip>
                      <InputText
                        required
                        value={client?.last_name}
                        name="last_name"
                        id="last_name"
                        autoComplete="off"
                        onChange={handleFormUpdateContact}
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <HtInfoTooltip message="The role of the contact person.">
                        <HtInputLabel htmlFor="role" asterisk labelText="Role" />
                      </HtInfoTooltip>
                      <Dropdown
                        required
                        value={formData.contacts[0].role}
                        name="role"
                        id="role"
                        filter
                        options={facilityContactRoles}
                        optionLabel="label"
                        onChange={(e: MultiSelectChangeEvent) => handleFormUpdateContact(e)}
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <HtInfoTooltip message="The phone number of the contact person.">
                        <HtInputLabel htmlFor="phone_number" asterisk labelText="Phone Number" />
                      </HtInfoTooltip>
                      <InputMask
                        required
                        value={client?.phone_number}
                        name="phone_number"
                        id="phone_number"
                        mask="(999) 999-9999"
                        slotChar="x"
                        unmask={true}
                        autoComplete="off"
                        onChange={handleFormUpdateContact}
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <HtInfoTooltip message="The email address of the contact person.">
                        <HtInputLabel htmlFor="email" asterisk labelText="Email" />
                      </HtInfoTooltip>
                      <InputText
                        required
                        value={client?.email}
                        autoComplete="off"
                        name="email"
                        id="email"
                        type="email"
                        onChange={handleFormUpdateContact}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-end gap-x-6">
                  <div>
                    <Button type="submit" label="Submit" loading={isLoading} />
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </form>
  )
}
