import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { RequestService } from '../../../services/RequestService'
import { CheckCircleIcon, ChevronDownIcon, PhotoIcon } from '@heroicons/react/20/solid'
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { classNames } from '../../../utils/Tailwind'
import AdminFacilityHeaderInfo from './AdminFacilityHeader'

export default function AdminFacilityDetails() {
  const { facilityId } = useParams()
  const [facility, setFacility] = useState<any>({})
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false)

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

  const handleForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const target = e.target as typeof e.target & {
      tax_id: { value: string }
      corp_name: { value: string }
      name: { value: string }
      active: { value: boolean }
      phone_number: { value: string }
      sqft: { value: number }
      notes: { value: string }
      country: { value: string }
      address: { value: string }
      city: { value: string }
      state: { value: string }
      zip: { value: string }
    }

    const formValues = {
      tax_id: target.tax_id.value,
      corp_name: target.corp_name.value,
      name: target.name.value,
      active: target.active.value,
      phone_number: target.phone_number.value,
      sqft: target.sqft.value,
      notes: target.notes.value,
      country: target.country.value,
      address: target.address.value,
      city: target.city.value,
      state: target.state.value,
      zip: target.zip.value,
      // company_dba: target.dba.value,
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
      <form onSubmit={handleForm}>
        <div className="space-y-12">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">Business Information</h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Please see the information about this particular facility.{' '}
              </p>
              <div className="mx-auto max-w-screen-xl px-4 py-10 sm:px-6 lg:px-8">
                {facility?.main_image && (
                  <img
                    className="h-64 w-64 flex-none rounded-lg object-cover bg-gray-50 mb-4"
                    src={facility?.main_image}
                    alt=" Missing Facility Image "
                  />
                )}
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold text-gray-900">Facility: {facility?.name}</h1>
                  <h2 className="text-xl text-gray-700">{facility?.address}</h2>
                  <h2 className="text-lg text-gray-600">{facility?.city}</h2>
                  <h3 className="text-md text-gray-500">{facility?.zip}</h3>
                </div>
              </div>
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
                    autoComplete="tax-id"
                    defaultValue={facility.tax_id || ''}
                    className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:outline-none focus:ring-green-600 sm:text-sm sm:leading-6"
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
                    className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:outline-none focus:ring-green-600 sm:text-sm sm:leading-6"
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
                    className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:outline-none focus:ring-green-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="status" className="block text-sm font-medium leading-6 text-gray-900">
                  Status
                </label>
                <div className="mt-2">
                  {facility && (
                    <select
                      key={facility.active ? 'Active' : 'Disabled'}
                      id="status"
                      name="active"
                      defaultValue={facility.active ? 'true' : 'false'}
                      className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:outline-none focus:ring-green-600 sm:text-sm sm:leading-6">
                      <option value="true">Active</option>
                      <option value="false">Disabled</option>
                    </select>
                  )}
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="phone-number" className="block text-sm font-medium leading-6 text-gray-900">
                  Business Contact Mobile Number*
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="phone_number"
                    id="phone-number"
                    autoComplete="phone-number"
                    defaultValue={facility.phone_number || ''}
                    className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:outline-none focus:ring-green-600 sm:text-sm sm:leading-6"
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
                    autoComplete="sqft"
                    defaultValue={facility.sqft || ''}
                    className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:outline-none focus:ring-green-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              {/* Section 2 */}

              <div className="col-span-full">
                <label htmlFor="ext-notes" className="block text-sm font-medium leading-6 text-gray-900">
                  Notes
                </label>
                <div className="mt-2">
                  <textarea
                    id="ext-notes"
                    name="notes"
                    rows={5}
                    defaultValue={facility.notes || ''}
                    className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:outline-none focus:ring-green-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-600">Write notes about the facility.</p>
              </div>

              <div className="col-span-full">
                <label htmlFor="facility-photo" className="block text-sm font-medium leading-6 text-gray-900">
                  Facility photo
                </label>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                  <div className="text-center">
                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-green-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-green-600 focus-within:ring-offset-2 hover:text-green-500">
                        <span>Upload a file</span>
                        <input id="file-upload" name="main_image" type="file" className="sr-only" />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              </div>
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
                <label htmlFor="country" className="block text-sm font-medium leading-6 text-gray-900">
                  Country
                </label>
                <div className="mt-2">
                  <select
                    key={facility.country || 'United States'}
                    id="country"
                    name="country"
                    autoComplete="country-name"
                    defaultValue={facility.country || 'United States'}
                    className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:outline-none focus:ring-green-600 sm:max-w-xs sm:text-sm sm:leading-6">
                    <option>United States</option>
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
                    defaultValue={facility.address || ''}
                    autoComplete="address"
                    className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:outline-none focus:ring-green-600 sm:text-sm sm:leading-6"
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
                    defaultValue={facility.city || ''}
                    autoComplete="address-level2"
                    className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:outline-none focus:ring-green-600 sm:text-sm sm:leading-6"
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
                    defaultValue={facility.state || ''}
                    autoComplete="address-level1"
                    className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:outline-none focus:ring-green-600 sm:text-sm sm:leading-6"
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
                    defaultValue={facility.zip || ''}
                    autoComplete="postal-code"
                    className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:outline-none focus:ring-green-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">Business License Document</h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Please upload business license documents. Please make sure your upload is clear without any warped or
                blur portions and shows all relevant information.{' '}
              </p>
            </div>

            {/* section 3 */}

            <div className="max-w-2xl space-y-10 md:col-span-2">
              <fieldset>
                <legend className="text-sm font-semibold leading-6 text-gray-900">
                  Upload State License Document*
                </legend>
                <div className="col-span-full">
                  <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                    State License
                  </label>
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="text-center">
                      <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                      <div className="mt-4 flex text-sm leading-6 text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md bg-white font-semibold text-green-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-green-600 focus-within:ring-offset-2 hover:text-green-500">
                          <span>Upload a file</span>
                          <input id="state_license" name="state_license" type="file" className="sr-only" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                </div>
                <legend className="text-sm font-semibold leading-6 text-gray-900">Upload City License Document*</legend>
                <div className="col-span-full">
                  <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                    City License
                  </label>
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="text-center">
                      <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                      <div className="mt-4 flex text-sm leading-6 text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md bg-white font-semibold text-green-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-green-600 focus-within:ring-offset-2 hover:text-green-500">
                          <span>Upload a file</span>
                          <input id="city_license" name="city_license" type="file" className="sr-only" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                </div>
              </fieldset>
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
                  <p className="text-sm font-medium text-green-800">Facility successfully updated</p>
                </div>
              </div>
            </div>
          )}
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
