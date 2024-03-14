import React, { useState, useEffect } from 'react'

import { useParams } from 'react-router-dom'

import { AutoComplete } from 'primereact/autocomplete'

import { CheckCircleIcon } from '@heroicons/react/20/solid'

import { SubHeader } from '../../../components/shared/SubHeader'
import { type IFacility } from '../../../interfaces/Facility'
import { RequestService } from '../../../services/RequestService'
import { adminFacilitiesLinks } from './adminFacilitySubHeaderLinks'

interface IAddress {
  description: string
  id: string

  matched_substrings: unknown[]
  place_id: string
  reference: string
  structured_formatting: {
    main_text: string
    main_text_matched_substrings: unknown[]
    secondary_text: string
  }
  terms: unknown[]
  types: string[]
  unformatted_address: string
}

export const AdminFacilityDetails = () => {
  const { facilityId } = useParams()
  const [facility, setFacility] = useState<IFacility>()
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false)
  const [selectedAddresses, setSelectedAddresses] = useState(null)
  const [filteredAddresses, setFilteredAddresses] = useState<IAddress[]>([])

  useEffect(() => {
    const getFacility = async () => {
      try {
        const facilityFound = await RequestService(`facilities/${facilityId}`)
        setFacility(facilityFound)
      } catch (error) {
        console.error('Error fetching facility data:', error)
      }
    }
    getFacility()
  }, [facilityId])

  const searchAddress = async (event: { query: string }) => {
    try {
      const response = await RequestService(`geo?address=${event.query}`)
      setFilteredAddresses(response.map((item: IAddress) => item.description))
    } catch (error) {
      console.error('Error fetching address predictions:', error)
    }
  }

  const handleForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const target = e.target as typeof e.target & {
      tax_id: { value: string }
      corp_name: { value: string }
      name: { value: string }
      active: { value: boolean }
      isApproved: { value: boolean }
      phone_number: { value: string }
      sqft: { value: number }
      notes: { value: string }
      country: { value: string }
      address: { value: string }
      city: { value: string }
      state: { value: string }
      zip: { value: number }
      company_dbas: { value: string }
    }

    const services = Array.from(e.currentTarget.services)
      .filter((input: unknown): input is HTMLInputElement => (input as HTMLInputElement).checked)
      .map((input: HTMLInputElement) => input.value)

    const companyDbas = target.company_dbas.value
      .split(',')
      .map(dba => dba.trim())
      .filter(dba => dba)

    const formValues = {
      tax_id: target.tax_id.value,
      corp_name: target.corp_name.value,
      name: target.name.value,
      active: target.active.value,
      isApproved: target.isApproved.value,
      phone_number: target.phone_number.value,
      sqft: target.sqft.value,
      notes: target.notes.value,
      country: target.country.value,
      address: target.address.value,
      company_dbas: companyDbas,
      services,
    }

    try {
      const response = await RequestService(`/facilities/${facilityId}`, 'PATCH', formValues)
      if (response) {
        setUpdateSuccess(true)
        setTimeout(() => setUpdateSuccess(false), 5000)
      } else {
        setUpdateSuccess(false)
        console.error('Failed to update the facility.')
      }
    } catch (error) {
      setUpdateSuccess(false)
      console.error('Error occurred while updating facility:', error)
    }
  }

  if (!facility) return <div>Loading...</div>
  return (
    <>
      <SubHeader data={facility} links={adminFacilitiesLinks} />

      <form onSubmit={handleForm}>
        <div className="space-y-12">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">Facility Information</h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Please see the information about this particular facility.
              </p>

              {facility?.main_image ? (
                <div className="mx-auto max-w-screen-xl px-4 py-10 sm:px-6 lg:px-8">
                  <img
                    className="mb-4 h-64 w-64 flex-none rounded-lg bg-gray-50 object-cover"
                    src={facility?.main_image}
                    alt="Missing Facility"
                  />
                </div>
              ) : null}
            </div>

            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
              <div className="sm:col-span-3">
                <label htmlFor="tax-id" className="block text-sm font-medium leading-6 text-gray-900">
                  Tax ID
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="tax_id"
                    id="tax-id"
                    defaultValue={facility.tax_id || ''}
                    className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                  Corporate Name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="corp_name"
                    id="corp-name"
                    defaultValue={facility.corp_name || ''}
                    className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label htmlFor="company-dbas" className="block text-sm font-medium leading-6 text-gray-900">
                  Company DBAs
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="company_dbas"
                    id="company-dbas"
                    placeholder="Enter company DBAs separated by comma"
                    defaultValue={facility.company_dbas ? facility.company_dbas.join(', ') : ''}
                    className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                  Facility Name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    defaultValue={facility.name || ''}
                    className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="status" className="block text-sm font-medium leading-6 text-gray-900">
                  Status
                </label>
                <div className="mt-2">
                  {facility ? (
                    <select
                      key={facility.active ? 'Active' : 'Disabled'}
                      id="status"
                      name="active"
                      defaultValue={facility.active ? 'true' : 'false'}
                      className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6">
                      <option value="true">Active</option>
                      <option value="false">Disabled</option>
                    </select>
                  ) : null}
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="approval_status" className="block text-sm font-medium leading-6 text-gray-900">
                  Approval Status
                </label>
                <div className="mt-2">
                  {facility ? (
                    <select
                      key={facility.isApproved ? 'Approved' : 'Pending'}
                      id="approval_status"
                      name="isApproved"
                      defaultValue={facility.isApproved ? 'true' : 'false'}
                      className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6">
                      <option value="true">Approved</option>
                      <option value="false">Pending</option>
                    </select>
                  ) : null}
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="phone-number" className="block text-sm font-medium leading-6 text-gray-900">
                  Facility Phone Number
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="phone_number"
                    id="phone-number"
                    defaultValue={facility.phone_number || ''}
                    className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                  Facility Square Footage
                </label>
                <div className="mt-2">
                  <input
                    type="number"
                    name="sqft"
                    id="sqft"
                    min="0"
                    defaultValue={facility.sqft || ''}
                    className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label htmlFor="ext-notes" className="block text-sm font-medium leading-6 text-gray-900">
                  Arrival Notes
                </label>
                <div className="mt-2">
                  <textarea
                    id="ext-notes"
                    name="notes"
                    rows={5}
                    defaultValue={facility.notes || ''}
                    className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-600">Write notes about the facility.</p>
              </div>
              <fieldset>
                <legend className="text-sm font-semibold leading-6 text-gray-900">Services</legend>
                <div className="mt-6 space-y-6">
                  <div className="relative flex gap-x-3">
                    <div className="flex h-6 items-center">
                      <input
                        id="services"
                        name="services"
                        type="checkbox"
                        value="Trimming"
                        defaultChecked={facility.services?.includes('Trimming')}
                        className="h-4 w-4 rounded border-gray-300 text-green-600 focus:outline-none focus:ring-green-600"
                      />
                    </div>
                    <div className="text-sm leading-6">
                      <label htmlFor="trimming" className="font-medium text-gray-900">
                        Trimming
                      </label>
                    </div>
                  </div>
                  <div className="relative flex gap-x-3">
                    <div className="flex h-6 items-center">
                      <input
                        id="services"
                        name="services"
                        type="checkbox"
                        value="Harvesting"
                        defaultChecked={facility.services?.includes('Harvesting')}
                        className="h-4 w-4 rounded border-gray-300 text-green-600 focus:outline-none focus:ring-green-600"
                      />
                    </div>
                    <div className="text-sm leading-6">
                      <label htmlFor="harvesting" className="font-medium text-gray-900">
                        Harvesting
                      </label>
                    </div>
                  </div>
                  <div className="relative flex gap-x-3">
                    <div className="flex h-6 items-center">
                      <input
                        id="services"
                        name="services"
                        type="checkbox"
                        value="Packaging"
                        defaultChecked={facility.services?.includes('Packaging')}
                        className="h-4 w-4 rounded border-gray-300 text-green-600 focus:outline-none focus:ring-green-600"
                      />
                    </div>
                    <div className="text-sm leading-6">
                      <label htmlFor="packaging" className="font-medium text-gray-900">
                        Packaging
                      </label>
                    </div>
                  </div>
                  <div className="relative flex gap-x-3">
                    <div className="flex h-6 items-center">
                      <input
                        id="services"
                        name="services"
                        type="checkbox"
                        value="Budtending"
                        defaultChecked={facility.services?.includes('Budtending')}
                        className="h-4 w-4 rounded border-gray-300 text-green-600 focus:outline-none focus:ring-green-600"
                      />
                    </div>
                    <div className="text-sm leading-6">
                      <label htmlFor="budtending" className="font-medium text-gray-900">
                        Budtending
                      </label>
                    </div>
                  </div>
                  <div className="relative flex gap-x-3">
                    <div className="flex h-6 items-center">
                      <input
                        id="services"
                        name="services"
                        type="checkbox"
                        value="Gardening"
                        defaultChecked={facility.services?.includes('Gardening')}
                        className="h-4 w-4 rounded border-gray-300 text-green-600 focus:outline-none focus:ring-green-600"
                      />
                    </div>
                    <div className="text-sm leading-6">
                      <label htmlFor="gardening" className="font-medium text-gray-900">
                        Gardening
                      </label>
                    </div>
                  </div>
                  <div className="relative flex gap-x-3">
                    <div className="flex h-6 items-center">
                      <input
                        id="services"
                        name="services"
                        type="checkbox"
                        value="General Labor"
                        defaultChecked={facility.services?.includes('General Labor')}
                        className="h-4 w-4 rounded border-gray-300 text-green-600 focus:outline-none focus:ring-green-600"
                      />
                    </div>
                    <div className="text-sm leading-6">
                      <label htmlFor="packaging" className="font-medium text-gray-900">
                        General Labor
                      </label>
                    </div>
                  </div>
                  <div className="relative flex gap-x-3">
                    <div className="flex h-6 items-center">
                      <input
                        id="services"
                        name="services"
                        type="checkbox"
                        value="Other"
                        defaultChecked={facility.services?.includes('Other')}
                        className="h-4 w-4 rounded border-gray-300 text-green-600 focus:outline-none focus:ring-green-600"
                      />
                    </div>
                    <div className="text-sm leading-6">
                      <label htmlFor="other" className="font-medium text-gray-900">
                        Other
                      </label>
                    </div>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>

          {/* section two */}

          <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">Business Location</h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Business address information of this particular facility.
              </p>
            </div>

            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
              <div className="sm:col-span-3">
                <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                  Street Address
                </label>
                <div className="mt-2">
                  <span className="p-fluid">
                    <AutoComplete
                      name="address"
                      value={selectedAddresses}
                      suggestions={filteredAddresses}
                      completeMethod={searchAddress}
                      onChange={e => setSelectedAddresses(e.value)}
                      forceSelection
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          {updateSuccess ? (
            <div className="rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">Facility successfully updated</p>
                </div>
              </div>
            </div>
          ) : null}
          <button
            type="submit"
            className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
            Update
          </button>
        </div>
      </form>
    </>
  )
}
