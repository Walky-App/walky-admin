import React, { useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { Button } from 'primereact/button'
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup'
import { Image } from 'primereact/image'

import { CheckCircleIcon } from '@heroicons/react/20/solid'

import { GoogleMapComponent } from '../../../../components/shared/GoogleMap'
import { AddressAutoComplete, type IAddressAutoComplete } from '../../../../components/shared/forms/AddressAutoComplete'
import { type IFacility } from '../../../../interfaces/facility2'
import { requestService } from '../../../../services/requestServiceNew'
import { useUtils } from '../../../../store/useUtils'
import { getCurrentUserRole } from '../../../../utils/UserRole'
import { PolygonMap } from './PolygonMap'

export const FacilityDetailsForm = ({
  facility,
  setFacility,
}: {
  facility: IFacility
  setFacility: React.Dispatch<React.SetStateAction<IFacility | undefined>>
}) => {
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false)
  const [moreAddressDetails, setMoreAddressDetails] = useState<IAddressAutoComplete | undefined>(facility)
  const [locationPolygon, setLocationPolygon] = useState<[number, number][]>(
    facility.location_polygon ? facility.location_polygon : [],
  )

  const navigate = useNavigate()
  const { showToast } = useUtils()

  const role = getCurrentUserRole()

  const { zip, state, city, location_pin, address } = moreAddressDetails || {
    zip: undefined,
    state: undefined,
    city: undefined,
    location_pin: undefined,
    address: undefined,
  }

  const accept = async () => {
    try {
      const response = await requestService({ path: `facilities/${facility._id}`, method: 'DELETE' })
      if (response.ok) {
        const data = await response.json()
        showToast({ severity: 'success', summary: 'Success', detail: data.message })
        navigate('/admin/facilities')
      }
    } catch (error) {
      console.error(error)
      showToast({ severity: 'error', summary: 'Error', detail: 'Error deleting facility' })
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
        'If you delete this facility, all associated jobs, licenses, images and company association will be removed. Are you sure you want to proceed?',
      icon: 'pi pi-info-circle',
      defaultFocus: 'reject',
      acceptClassName: 'p-button-danger',
      accept,
      reject,
    })
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
      address: address,
      city: city,
      state: state,
      zip: zip,
      company_dbas: companyDbas,
      location_pin: location_pin,
      location_polygon: locationPolygon,
      services: services,
    }

    try {
      const response = await requestService({
        path: `facilities/${facility._id}`,
        method: 'PATCH',
        body: JSON.stringify(formValues),
      })
      if (response.ok) {
        const data = await response.json()
        setFacility(data)
        setUpdateSuccess(true)
        setTimeout(() => setUpdateSuccess(false), 5000)
        showToast({ severity: 'success', summary: 'Success', detail: 'Facility updated successfully' })
      } else {
        setUpdateSuccess(false)
        console.error('Failed to update the facility.')
        showToast({ severity: 'error', summary: 'Error', detail: 'Error updating facility' })
      }
    } catch (error) {
      setUpdateSuccess(false)
      console.error('Error occurred while updating facility:', error)
      showToast({ severity: 'error', summary: 'Error', detail: 'Error updating facility' })
    }
  }

  return (
    <form onSubmit={handleForm}>
      <div className="space-y-4 md:space-y-12">
        <div className="grid grid-cols-1 gap-x-8 gap-y-4 border-b border-gray-900/10 pb-8 md:grid-cols-3 md:gap-y-10 md:pb-12">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Facility Information</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Please see the information about this particular facility.
            </p>
            <div className="relative mt-6">
              <div className="flex md:justify-center">
                <Image
                  src={facility.main_image}
                  alt="facility"
                  preview
                  pt={{
                    image: {
                      className:
                        'aspect-[4/3] w-3/4 sm:w-1/2 md:w-full 2xl:w-3/4 object-cover rounded-lg cursor-pointer',
                    },
                    button: {
                      className: 'w-3/4 sm:w-1/2 md:w-full 2xl:w-3/4 rounded-lg',
                    },
                  }}
                />
              </div>
            </div>

            {facility.location_pin[0] && facility.location_pin[1] ? (
              <div className="col-span-1 mt-8 hidden h-64 md:col-span-1 md:block">
                <div className="flex h-full flex-row md:flex-col 2xl:w-3/4">
                  <GoogleMapComponent
                    locationPin={facility.location_pin}
                    containerStyle={{ width: '100%', height: '100%' }}
                  />
                </div>
              </div>
            ) : null}
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
            <div className="sm:col-span-3">
              <label htmlFor="tax-id" className="block text-sm font-medium leading-6 text-gray-900">
                {facility.tax_id ? 'Facility Tax ID' : 'Company Tax ID'}
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="tax_id"
                  id="tax-id"
                  defaultValue={facility.tax_id ? facility.tax_id : facility.company?.company_tax_id}
                  className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="sm:col-span-3">
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                Company Name
              </label>
              <div className="mt-2">
                <input
                  disabled
                  type="text"
                  name="corp_name"
                  id="corp-name"
                  defaultValue={facility?.company?.company_name}
                  className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-400 shadow-sm ring-1 ring-inset ring-gray-300 "
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
                  defaultValue={facility.company?.company_dbas?.join(', ')}
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
              <div className=" flex items-center">
                <div className="mr-3 flex items-center">
                  <input
                    id="services"
                    name="services"
                    type="checkbox"
                    value="Trimming"
                    defaultChecked={facility.services?.includes('Trimming')}
                    className="mr-1 rounded border-gray-300 text-green-600 focus:outline-none focus:ring-green-600"
                  />
                  <label htmlFor="trimming" className="text-sm">
                    Trimming
                  </label>
                </div>
                <div className="mr-3 flex items-center">
                  <input
                    id="services"
                    name="services"
                    type="checkbox"
                    value="Harvesting"
                    defaultChecked={facility.services?.includes('Harvesting')}
                    className="mr-1 rounded border-gray-300 text-green-600 focus:outline-none focus:ring-green-600"
                  />
                  <label htmlFor="harvesting" className="text-sm">
                    Harvesting
                  </label>
                </div>

                <div className="mr-3 flex items-center">
                  <input
                    id="services"
                    name="services"
                    type="checkbox"
                    value="Packaging"
                    defaultChecked={facility.services?.includes('Packaging')}
                    className="mr-1 rounded border-gray-300 text-green-600 focus:outline-none focus:ring-green-600"
                  />
                  <label htmlFor="packaging" className="text-sm">
                    Packaging
                  </label>
                </div>

                <div className="mr-3 flex items-center">
                  <input
                    id="services"
                    name="services"
                    type="checkbox"
                    value="Budtending"
                    defaultChecked={facility.services?.includes('Budtending')}
                    className="mr-1 rounded border-gray-300 text-green-600 focus:outline-none focus:ring-green-600"
                  />
                  <label htmlFor="budtending" className="text-sm">
                    Budtending
                  </label>
                </div>

                <div className="mr-3 flex items-center">
                  <input
                    id="services"
                    name="services"
                    type="checkbox"
                    value="Gardening"
                    defaultChecked={facility.services?.includes('Gardening')}
                    className="mr-1 rounded border-gray-300 text-green-600 focus:outline-none focus:ring-green-600"
                  />
                  <label htmlFor="gardening" className="text-sm">
                    Gardening
                  </label>
                </div>

                <div className="mr-3 flex items-center">
                  <input
                    id="services"
                    name="services"
                    type="checkbox"
                    value="General Labor"
                    defaultChecked={facility.services?.includes('General Labor')}
                    className="mr-1 rounded border-gray-300 text-green-600 focus:outline-none focus:ring-green-600"
                  />

                  <label htmlFor="packaging" className="whitespace-nowrap text-sm">
                    General Labor
                  </label>
                </div>

                <div className="mr-3 flex items-center">
                  <input
                    id="services"
                    name="services"
                    type="checkbox"
                    value="Other"
                    defaultChecked={facility.services?.includes('Other')}
                    className="mr-1 rounded border-gray-300 text-green-600 focus:outline-none focus:ring-green-600"
                  />

                  <label htmlFor="other" className="text-sm">
                    Other
                  </label>
                </div>
              </div>
            </fieldset>
          </div>
        </div>

        {/* Facility Address */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-4 border-b border-gray-900/10 pb-8 md:grid-cols-3 md:gap-y-10 md:pb-12">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Facility Address</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">Business address of this particular facility:</p>
            {facility?.address ? <h2>{facility.address}</h2> : null}
            {facility.location_pin[0] && facility.location_pin[1] ? (
              <div className="col-span-1 mt-4 h-64 sm:hidden md:col-span-1">
                <div className="flex h-full flex-row md:flex-col">
                  <GoogleMapComponent
                    locationPin={facility.location_pin}
                    containerStyle={{ width: '100%', height: '100%' }}
                  />
                </div>
              </div>
            ) : null}
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
            <div className="sm:col-span-5">
              <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                Street Address
              </label>
              <div className="mt-2">
                <span className="p-fluid">
                  <AddressAutoComplete
                    setMoreAddressDetails={setMoreAddressDetails}
                    currentAddress={facility.address || ''}
                  />
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Geo Fencing */}
        {facility.location_pin.length && role === 'admin' ? (
          <div className="grid grid-cols-1 gap-x-8 gap-y-4 border-b border-gray-900/10 pb-8 md:grid-cols-3 md:gap-y-10 md:pb-12">
            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">Geo Fencing</h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Please update the facility boundaries by dragging the polygon on the map.
              </p>
            </div>

            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
              <div className="sm:col-span-5">
                <div className="mt-2">
                  <span className="p-fluid">
                    <PolygonMap
                      locationPolygon={locationPolygon}
                      locationPin={facility.location_pin}
                      containerStyle={{ width: '100%', height: '450px' }}
                      setLocationPolygon={setLocationPolygon}
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
      <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-4 border-b border-gray-900/10 pb-8 md:grid-cols-3 md:gap-y-10 md:pb-12">
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">Approval Process</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Create a Polygon on the map to set the boundaries of the facility to be used for geofencing, then this will
            enable the approval process.
          </p>
        </div>
        <div className="sm:col-span-1">
          <label htmlFor="status" className="block text-sm font-medium leading-6 text-gray-900">
            Status
          </label>
          <div className="mt-2">
            {facility ? (
              <select
                disabled={locationPolygon.length === 0}
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

        {role === 'admin' ? (
          <div className="sm:col-span-1">
            <label htmlFor="approval_status" className="block text-sm font-medium leading-6 text-gray-900">
              Approval Status
            </label>
            <div className="mt-2">
              {facility ? (
                <select
                  disabled={locationPolygon.length === 0}
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
        ) : null}
      </div>
      <div className="mt-6 flex items-center justify-between gap-x-6">
        {role === 'admin' ? (
          <div className="items-center">
            <ConfirmPopup />
            <Button
              onClick={handleDeleteConfirm}
              icon="pi pi-times"
              label="Delete Facility"
              className="p-button-danger"
            />
          </div>
        ) : null}
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
        <Button type="submit" label="Update" icon="pi pi-check" />
      </div>
    </form>
  )
}
