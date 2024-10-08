/* eslint-disable */
import * as React from 'react'

import { CheckCircleIcon } from '@heroicons/react/20/solid'

import { HeadingComponent } from '../../../components/shared/general/HeadingComponent'
import { RequestService } from '../../../services/RequestService'
import { GetTokenInfo } from '../../../utils/tokenUtil'

export default function ClientAddFacility() {
  const user = GetTokenInfo()
  const user_id = user._id
  const [updateSuccess, setUpdateSuccess] = React.useState(false)

  const handleForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const target = e.target as typeof e.target & {
      name: { value: string }
      country: { value: string }
      address: { value: string }
      city: { value: string }
      state: { value: string }
      zip: { value: string }
      tax_id: { value: string }
      phone_number: { value: string }
      notes: { value: string }
      active: { value: string }
      sqft: { value: number }
      corp_name: { value: string }
      company_dbas: { value: string }
      services: [{ value: string }]
    }

    const formData = {
      user_id: user_id,
      name: target.name.value,
      country: target.country.value,
      address: target.address.value,
      city: target.city.value,
      state: target.state.value,
      zip: target.zip.value,
      tax_id: target.tax_id.value,
      phone_number: target.phone_number.value,
      notes: target.notes.value,
      active: target.active.value === 'true' ? true : false,
      sqft: target.sqft.value,
      corp_name: target.corp_name.value,
      company_dbas: target.company_dbas.value.split(',').map(dba => dba.trim()),
      services: Array.from(document.querySelectorAll('input[name="services"]:checked'))
        //@ts-ignore
        .map(input => input.value),
    }

    try {
      const response = await RequestService(`facilities`, 'POST', formData)
      if (response) {
        setUpdateSuccess(true)
        setTimeout(() => setUpdateSuccess(false), 5000) // Hide message after 5 seconds
      } else {
        throw new Error('Failed to add facility')
      }
    } catch (error) {
      console.error('Error adding facility:', error)
      setUpdateSuccess(false)
    }
  }

  return (
    <form onSubmit={handleForm}>
      <div className="space-y-12">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Business Information</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">Please provide information about the facility. </p>
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
                  className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="sm:col-span-3">
              <label htmlFor="corp_name" className="block text-sm font-medium leading-6 text-gray-900">
                Corporate Name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="corp_name"
                  id="corp-name"
                  className="block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
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
                  className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="sm:col-span-3">
              <label htmlFor="tax-id" className="block text-sm font-medium leading-6 text-gray-900">
                Facility Name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="sm:col-span-3">
              <label htmlFor="status" className="block text-sm font-medium leading-6 text-gray-900">
                Status
              </label>
              <div className="mt-2">
                <select
                  id="status"
                  name="active"
                  className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6">
                  <option value="true">Active</option>
                  <option value="false">Disabled</option>
                </select>
              </div>
            </div>
            <div className="sm:col-span-3">
              <label htmlFor="phone-number" className="block text-sm font-medium leading-6 text-gray-900">
                Facility Phone Number*
              </label>
              <div className="mt-2">
                <input
                  type="tel"
                  name="phone_number"
                  id="phone-number"
                  autoComplete="tel"
                  className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                  pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                  placeholder="123-456-7890"
                  title="Phone number should be in the format: 123-456-7890"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="sqft" className="block text-sm font-medium leading-6 text-gray-900">
                Facility Square Footage
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  name="sqft"
                  id="sqft"
                  min="0"
                  autoComplete="sqft"
                  className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="notes" className="block text-sm font-medium leading-6 text-gray-900">
                Arrival Notes
              </label>
              <div className="mt-2">
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                  defaultValue={''}
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
                      id="trimming"
                      name="services"
                      type="checkbox"
                      value="Trimming"
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
                      id="harvesting"
                      name="services"
                      type="checkbox"
                      value="Harvesting"
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
                      id="packaging"
                      name="services"
                      type="checkbox"
                      value="Packaging"
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
                      id="budtending"
                      name="services"
                      type="checkbox"
                      value="Budtending"
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
                      id="gardening"
                      name="services"
                      type="checkbox"
                      value="Gardening"
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
                      id="general-labor"
                      name="services"
                      type="checkbox"
                      value="General Labor"
                      className="h-4 w-4 rounded border-gray-300 text-green-600 focus:outline-none focus:ring-green-600"
                    />
                  </div>
                  <div className="text-sm leading-6">
                    <label htmlFor="general-labor" className="font-medium text-gray-900">
                      General Labor
                    </label>
                  </div>
                </div>
                <div className="relative flex gap-x-3">
                  <div className="flex h-6 items-center">
                    <input
                      id="other"
                      name="services"
                      type="checkbox"
                      value="Other"
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
              Please provide the business address information below.
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
            <div className="sm:col-span-3">
              <label htmlFor="country" className="block text-sm font-medium leading-6 text-gray-900">
                Country
              </label>
              <div className="mt-2">
                <select
                  id="country"
                  name="country"
                  autoComplete="country-name"
                  className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-600 sm:max-w-xs sm:text-sm sm:leading-6">
                  <option>USA</option>
                  <option>Canada</option>
                  <option>Mexico</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                Street Address
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="address"
                  id="address"
                  autoComplete="address-line1"
                  className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2 sm:col-start-1">
              <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
                City
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="city"
                  id="city"
                  autoComplete="address-level2"
                  className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="region" className="block text-sm font-medium leading-6 text-gray-900">
                State / Province
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="state"
                  id="state"
                  autoComplete="address-level1"
                  className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="postal-code" className="block text-sm font-medium leading-6 text-gray-900">
                ZIP / Postal code
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="zip"
                  id="zip"
                  autoComplete="postal-code"
                  className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                  pattern="\d*"
                  title="Please enter a numeric ZIP code"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        {updateSuccess && (
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">Facility successfully added</p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5"></div>
              </div>
            </div>
          </div>
        )}
        <button
          type="submit"
          className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
          Submit
        </button>
      </div>
    </form>
  )
}
