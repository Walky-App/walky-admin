import { useState, useEffect } from 'react'

import { Link, useNavigate } from 'react-router-dom'

import { Button } from 'primereact/button'
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup'
import { Image } from 'primereact/image'
import { InputMask, type InputMaskChangeEvent } from 'primereact/inputmask'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { MultiSelect } from 'primereact/multiselect'
import { Rating } from 'primereact/rating'

import { GoogleMapComponent } from '../../../../components/shared/GoogleMap'
import { AddressAutoComplete, type IAddressAutoComplete } from '../../../../components/shared/forms/AddressAutoComplete'
import { HtInputHelpText } from '../../../../components/shared/forms/HtInputHelpText'
import { HtInputLabel } from '../../../../components/shared/forms/HtInputLabel'
import { HtInfoTooltip } from '../../../../components/shared/general/HtInfoTooltip'
import { type ICompanySlim } from '../../../../interfaces/company'
import { type IFacility } from '../../../../interfaces/facility'
import { requestService } from '../../../../services/requestServiceNew'
import { useUtils } from '../../../../store/useUtils'
import { getCurrentUserRole } from '../../../../utils/UserRole'
import { cn } from '../../../../utils/cn'
import { jobTitlesOptions } from '../../../../utils/formOptions'
import { requiredFieldsNoticeText } from '../../../../utils/formUtils'
import { PolygonMap } from './PolygonMap'

export const FacilityDetailsForm = ({
  facility,
  setFacility,
  company,
}: {
  facility: IFacility
  setFacility: React.Dispatch<React.SetStateAction<IFacility | undefined>>
  company: ICompanySlim | undefined
}) => {
  const [moreAddressDetails, setMoreAddressDetails] = useState<IAddressAutoComplete | undefined>(facility)
  const [formData, setFormData] = useState<IFacility>(facility)
  const [locationPolygon, setLocationPolygon] = useState<[number, number][]>(
    facility.location_polygon ? facility.location_polygon : [],
  )

  const navigate = useNavigate()
  const { showToast } = useUtils()

  const role = getCurrentUserRole()

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

    try {
      const response = await requestService({
        path: `facilities/${facility._id}`,
        method: 'PATCH',
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        const data = await response.json()
        setFacility(data)

        showToast({ severity: 'success', summary: 'Success', detail: 'Facility updated successfully' })
      } else {
        const errorData = await response.json()
        console.error('Failed to update the facility.', errorData.message)
        showToast({ severity: 'error', summary: 'Error', detail: 'Error updating facility' })
      }
    } catch (error) {
      console.error('Error occurred while updating facility:', error)
      showToast({ severity: 'error', summary: 'Error', detail: 'Error updating facility' })
    }
  }

  const handleFormUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target as HTMLInputElement
    setFormData(prevState => ({ ...prevState, [name]: value }))
  }

  const handleFormUpdateNumber = (e: InputMaskChangeEvent) => {
    const { name, value } = e.target
    setFormData(prevState => ({ ...prevState, [name]: value }))
  }

  return (
    <form onSubmit={handleForm}>
      <div className="p-fluid space-y-4 md:space-y-12">
        <div className="grid grid-cols-1 gap-x-8 gap-y-4 border-b border-gray-900/10 pb-8 md:grid-cols-3 md:gap-y-10 md:pb-12">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Facility Information</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Please provide information about your business so that we can verify you on the platform.
            </p>
            {requiredFieldsNoticeText}

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
              <HtInfoTooltip message="Primary state or city license number for this facility.">
                <HtInputLabel htmlFor="license_number" labelText="License Number" />
              </HtInfoTooltip>
              <InputText
                value={formData.license_number}
                id="license_number"
                name="license_number"
                onChange={handleFormUpdate}
                autoComplete="off"
                className="w-full"
              />
            </div>

            <div className="sm:col-span-3">
              <HtInfoTooltip message="The name of your first facility. You will be able to add additional facilities after you complete the onboarding process for this facility.">
                <HtInputLabel htmlFor="name" labelText="Company Name" />
              </HtInfoTooltip>
              <Link className="p-4 text-2xl underline hover:text-gray-500" to={`/${role}/companies/${company?._id}`}>
                {company?.company_name}
              </Link>
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
                className="w-full"
              />
            </div>

            <div className="sm:col-span-3">
              <HtInfoTooltip message="The name of your first facility. You will be able to add additional facilities after you complete the onboarding process for this facility.">
                <HtInputLabel htmlFor="name" labelText="Dbas" />
              </HtInfoTooltip>
              <InputText
                name="dbas"
                id="dbas"
                autoComplete="off"
                onChange={e => {
                  setFormData(prevFormData => ({
                    ...prevFormData,
                    facility_dbas: e.target.value.split(', '),
                  }))
                }}
                value={formData.facility_dbas?.join(', ')}
                placeholder="e.g. Another name for the facility"
                className="w-full"
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
                className="w-full"
              />
            </div>

            <div className="sm:col-span-3">
              <HtInfoTooltip message="The square footage of your facility. This is the total area of your facility in square feet.">
                <HtInputLabel htmlFor="sqft" labelText="Facility Square Footage" />
              </HtInfoTooltip>
              <InputText
                name="sqft"
                id="sqft"
                value={formData?.sqft?.toString()}
                onChange={handleFormUpdate}
                keyfilter={/[0-9]/}
                min={0}
                max={1000000}
                className="w-full"
              />
              <HtInputHelpText fieldName="sqft" helpText="Max 1,000,000" />
            </div>

            <div className="sm:col-span-6">
              <HtInfoTooltip message="Any additional notes that you would like to provide about your facility. This information will be verified before application approval.">
                <HtInputLabel htmlFor="notes" labelText="Arrival notes" />
              </HtInfoTooltip>
              <InputTextarea
                name="notes"
                id="notes"
                rows={4}
                cols={30}
                maxLength={500}
                value={formData.notes}
                onChange={e => setFormData(prevState => ({ ...prevState, notes: e.target.value }))}
                className={cn({ 'p-invalid': false }, 'w- mt-2')}
                autoComplete="off"
              />
              <HtInputHelpText
                fieldName="notes"
                helpText="Max 500 characters. Please do not enter contact information into this field."
              />
            </div>

            <div className="sm:col-span-6">
              <HtInfoTooltip message="The services that your facility offers.">
                <HtInputLabel htmlFor="services" asterisk labelText="Services" />
              </HtInfoTooltip>
              <div className="">
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
                  className={cn({ 'p-invalid': false }, 'mt-2 w-full')}
                />
                <HtInputHelpText
                  fieldName="services"
                  helpText="Please select all services that your facility offers."
                />
              </div>
            </div>
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
          <>
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
                        setLocationPolygon={e => {
                          setFormData({ ...formData, location_polygon: e })
                          setLocationPolygon(e)
                        }}
                      />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-4 border-b border-gray-900/10 pb-8 md:grid-cols-3 md:gap-y-10 md:pb-12">
              <div>
                <h2 className="text-base font-semibold leading-7 text-gray-900">Approval Process</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Create a Polygon on the map to set the boundaries of the facility to be used for geofencing, then this
                  will enable the approval process.
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
                      onChange={() => setFormData({ ...formData, active: !formData.active })}
                      className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6">
                      <option value="true">Active</option>
                      <option value="false">Disabled</option>
                    </select>
                  ) : null}
                </div>
              </div>
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
                      onChange={() => setFormData({ ...formData, isApproved: !formData.isApproved })}
                      className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6">
                      <option value="true">Approved</option>
                      <option value="false">Pending</option>
                    </select>
                  ) : null}
                </div>
              </div>
            </div>
          </>
        ) : null}
        <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-4 border-b border-gray-900/10 pb-8 md:grid-cols-1 md:gap-y-10 md:pb-12">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Approval Status: {facility.isApproved ? 'Approved' : 'Pending'}
            </h2>
            {facility.isApproved ? (
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Administrators are reviewing your facility information. You will be notified when your facility is
                approved to start booking jobs.
              </p>
            ) : null}
          </div>
        </div>
        {role === 'admin' ? (
          <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-4 border-b border-gray-900/10 pb-8 md:grid-cols-3 md:gap-y-10 md:pb-12">
            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Feedbacks: {facility?.feedback?.length}
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">Here are all the feedbacks left to this facility</p>
            </div>
            <div className="sm:col-span-1">
              <div className="mt-2">
                {facility.feedback ? (
                  facility.feedback.map((feedback, index) => (
                    <div key={index} className="mt-4 rounded-lg bg-white p-4 shadow">
                      <h3 className="text-lg font-semibold leading-7 text-gray-900">
                        User: {feedback.user_id.first_name} {feedback.user_id.last_name}
                      </h3>
                      <h3 className="text-lg font-semibold leading-7 text-gray-900">Email: {feedback.user_id.email}</h3>
                      <div className="flex items-center">
                        <p className="mr-2 mt-1 text-sm leading-6 text-gray-600">Rating:</p>
                        <Rating value={feedback.rating} readOnly cancel={false} stars={5} />
                      </div>
                      <p className="mt-1 text-sm leading-6 text-gray-600">Comment: {feedback.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="mt-4 text-sm leading-6 text-gray-600">No feedback received yet.</p>
                )}
              </div>
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
        <Button className="text-right" type="submit" label="Update" icon="pi pi-check" />
      </div>
    </form>
  )
}
