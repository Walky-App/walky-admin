import { useState, useRef, useEffect, type SetStateAction, type Dispatch } from 'react'

import { Button } from 'primereact/button'
import { Calendar } from 'primereact/calendar'
import { Checkbox } from 'primereact/checkbox'
import { Dropdown } from 'primereact/dropdown'
import { InputMask, InputMaskChangeEvent } from 'primereact/inputmask'
import { InputText } from 'primereact/inputtext'
import { Toast } from 'primereact/toast'
import { classNames } from 'primereact/utils'

import { SubHeader, type SubHeaderData } from '../../../components/shared/SubHeader'
import { AddressAutoComplete, IAddressAutoComplete } from '../../../components/shared/forms/AddressAutoComplete'
import { HtInputHelpText } from '../../../components/shared/forms/HtInputHelpText'
import { HtInputLabel } from '../../../components/shared/forms/HtInputLabel'
import { UploadAvatar } from '../../../components/shared/forms/UploadAvatar'
import { HtInfoTooltip } from '../../../components/shared/general/HtInfoTooltip'
import { useAuth } from '../../../contexts/AuthContext'
import { type IUser } from '../../../interfaces/User'
import { RequestService } from '../../../services/RequestService'
import { requestService } from '../../../services/requestServiceNew'
import { useUtils } from '../../../store/useUtils'
import { requiredFieldsNoticeText } from '../../../utils/formUtils'
import { defaultMoreAddressDetails, tooltipOptions } from '../../client/onboarding/clientOnboardingUtils'
import { adminUserLinks } from './adminUserSubHeaderLinks'

export const UserProfile = () => {
  const [formData, setFormData] = useState<IUser>({
    _id: '',
    access_token: '',
    active: false,
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    gender: '',
    birth_date: new Date(),
    phone_number: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    notifications: [],
    createdAt: '',
    role: '',
    verified: false,
    is_approved: false,
  })
  const [moreAddressDetails, setMoreAddressDetails] = useState<IAddressAutoComplete | undefined>(
    defaultMoreAddressDetails,
  )
  const [checked, setChecked] = useState(true)
  const { user, setUser } = useAuth()
  const { showToast } = useUtils()

  const toast = useRef<Toast>(null)

  useEffect(() => {
    if (!user) return
    const getUser = async () => {
      try {
        const response = await requestService({ path: `users/${user?._id}` })
        if (response.ok) {
          const data = await response.json()

          setFormData(data)
        }
      } catch (error) {
        console.error('Error fetching user:', error)
        showToast({ severity: 'error', summary: 'Error', detail: 'Error fetching user' })
      }
    }
    getUser()
  }, [user, showToast])

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

  // const onSubmit: SubmitHandler = async data => {
  //   try {
  //     const response = await requestService({ path: `users/${user?._id}`, method: 'PATCH', body: JSON.stringify(data) })
  //     if (response.ok) {
  //       const data = await response.json()

  //       setFormData(data)
  //       showToast({ severity: 'success', summary: 'Success', detail: 'User updated' })
  //     }
  //   } catch (error) {
  //     console.error('Error updating user:', error)
  //   }
  // }

  // const onSubmit: SubmitHandler<ICompany> = async (data: ICompany) => {
  //   try {
  //     if (role === 'client') {
  //       data.users = [client_id]
  //     }

  //     const response = await requestService({ path: 'companies', method: 'POST', body: JSON.stringify(data) })
  //     if (!response.ok) {
  //       throw new Error('Failed to add company')
  //     }
  //     showToast({ severity: 'success', summary: 'Company added successfully' })
  //     setTimeout(() => {
  //       navigate('/admin/companies')
  //     }, 2000)
  //   } catch (error) {
  //     console.error('Error adding company: ', error)
  //     showToast({ severity: 'error', summary: 'Failed to add company' })
  //   }
  // }

  const handlePasswordReset = async () => {
    try {
      const request = await requestService({
        path: '/auth/reset',
        method: 'POST',
        body: JSON.stringify({ email: formData.email }),
      })

      if (request.ok) {
        const data = await request.json()
        if (data.message) {
          showToast({ severity: 'success', summary: 'Success', detail: 'Password reset email sent' })
        }
      }
    } catch (error) {
      console.error('Error resetting password:', error)
      showToast({ severity: 'error', summary: 'Error', detail: 'Error resetting password' })
    }
  }

  const genderOptions = [
    { title: 'Male', value: 'Male' },
    { title: 'Female', value: 'Female' },
    { title: 'Other', value: 'Other' },
  ]

  const subheaderUserDetails: SubHeaderData = {
    // _id: selectedUserData?._id,
    // name: `${selectedUserData?.first_name} ${selectedUserData?.last_name}`,
    // city: selectedUserData?.city,
    // address: selectedUserData?.address,
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
    <>
      <SubHeader data={subheaderUserDetails} links={adminUserLinks} />
      {user?.role ? (
        // <form onSubmit={handleSubmit(onSubmit)}>
        <form>
          <div className="space-y-12">
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
              <div>
                <h2 className="text-base font-semibold leading-7 text-gray-900">Avatar</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  This information will be displayed publicly so be careful what you share.
                </p>
              </div>
              <div>{/* <UploadAvatar formUser={user} formUser={formData as Dispatch<SetStateAction<IUser>>} /> */}</div>
            </div>
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
              <div>
                <h2 className="text-base font-semibold leading-7 text-gray-900">Password Reset </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  This information will be displayed publicly so be careful what you share.
                </p>
              </div>
              <div>
                <Button label="Reset Password" severity="secondary" icon="pi pi-lock" onClick={handlePasswordReset} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
              <div>
                <h2 className="text-base font-semibold leading-7 text-gray-900">Personal Information</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Use a permanent address where you can receive mail.
                </p>
              </div>

              <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
                {/* First Name */}
                <div className="sm:col-span-3">
                  <label htmlFor="first_name" className="block text-sm font-medium leading-6 text-gray-900">
                    First name
                  </label>
                  <div className="mt-2">
                    <InputText
                      required
                      value={formData?.first_name}
                      name="first_name"
                      id="first_name"
                      autoComplete="off"
                      onChange={handleFormUpdate}
                    />
                  </div>
                </div>

                {/* Last Name */}
                <div className="sm:col-span-3">
                  <label htmlFor="last_name" className="block text-sm font-medium leading-6 text-gray-900">
                    Last name
                  </label>
                  <div className="mt-2">
                    <InputText
                      required
                      value={formData?.last_name}
                      name="last_name"
                      id="last_name"
                      autoComplete="off"
                      onChange={handleFormUpdate}
                    />
                  </div>
                </div>

                {/* Middle Name */}
                <div className="sm:col-span-3">
                  <label htmlFor="middle_name" className="block text-sm font-medium leading-6 text-gray-900">
                    Middle Name
                  </label>
                  <div className="mt-2">
                    <InputText
                      disabled
                      id="middle_name"
                      value={formData?.middle_name}
                      name="middle_name"
                      onChange={handleFormUpdate}
                    />
                  </div>
                </div>

                {/* Gender */}
                <div className="sm:col-span-3">
                  <label htmlFor="gender" className="block text-sm font-medium leading-6 text-gray-900">
                    Gender
                  </label>
                  <div className="mt-2">
                    <div>
                      <Dropdown
                        id="gender"
                        value={formData.gender}
                        optionLabel="gender"
                        options={genderOptions}
                        // onChange={handleFormUpdate}
                        // focusInputRef={field.ref}
                        // onChange={e => field.onChange(e.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="sm:col-span-3">
                  <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                    Email address
                  </label>
                  <div className="mt-2">
                    <InputText disabled value={formData?.email} name="email" onChange={handleFormUpdate} />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="sm:col-span-3">
                  <label htmlFor="phone_number" className="block text-sm font-medium leading-6 text-gray-900">
                    Phone number
                  </label>
                  <div className="mt-2">
                    <InputMask
                      required
                      value={formData?.phone_number}
                      name="phone_number"
                      id="phone_number"
                      mask="(999) 999-9999"
                      slotChar="x"
                      unmask={true}
                      autoComplete="off"
                      onChange={handleFormUpdateNumber}
                    />
                  </div>
                </div>

                {/* Birthday */}
                <div className="sm:col-span-6 sm:col-start-1">
                  <label htmlFor="birthday" className="block text-sm font-medium leading-6 text-gray-900">
                    Birthday
                  </label>
                  <div className="mt-2">
                    <div>
                      {/* <Calendar
                        maxDate={new Date(2008, 0, 1)}
                        minDate={new Date(1940, 0, 1)}
                        inputId={field.name}
                        value={field.value ? new Date(field.value) : undefined}
                        onChange={field.onChange}
                        dateFormat="mm/dd/yy"
                        className={classNames({ 'p-invalid': fieldState.error }, 'w-full')}
                        showIcon
                      /> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>

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
                  {/* <AddressAutoComplete
                    controlled
                    value={formData.address}
                    disabled={checked}
                    setMoreAddressDetails={setMoreAddressDetails}
                    currentAddress={formData.address}
                    classNames={classNames({ 'p-invalid': false }, 'mt-2')}
                    aria-describedby="address-help"
                  /> */}
                  <HtInputHelpText fieldName="address" helpText="Commercial Address ONLY" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
              <div>
                <h2 className="text-base font-semibold leading-7 text-gray-900">Notifications</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  We'll always let you know about important changes, but you pick what else you want to hear about.
                </p>
              </div>

              <div className="max-w-2xl space-y-10 md:col-span-2">
                <fieldset>
                  <legend className="text-sm font-semibold leading-6 text-gray-900">By Email / SMS</legend>
                  <div className="mt-6 space-y-6">
                    <div className="relative flex gap-x-3">
                      <div className="flex h-6 items-center">
                        {/* <Checkbox
                          inputId="notification_email"
                          checked={field.value?.includes('notification_email') || false}
                          onChange={e => {
                            const value = field.value || [] // Initialize as empty array if undefined
                            if (e.checked) {
                              field.onChange([...value, 'notification_email']) // Use spread operator to add new value
                            } else {
                              field.onChange(value.filter((item: string) => item !== 'notification_email'))
                            }
                          }}
                        /> */}
                      </div>
                      <div className="text-sm leading-6">
                        <label htmlFor="notification_email" className="font-medium text-gray-900">
                          Email Notifications
                        </label>
                        <p className="text-gray-500">Get notified when someones posts a comment on a posting.</p>
                      </div>
                    </div>
                    <div className="relative flex gap-x-3">
                      <div className="flex h-6 items-center">
                        {/* <Checkbox
                          inputId="notification_sms"
                          checked={field.value?.includes('notification_sms') || false}
                          onChange={e => {
                            const value = field.value || [] // Initialize as empty array if undefined
                            if (e.checked) {
                              field.onChange([...value, 'notification_sms']) // Use spread operator to add new value
                            } else {
                              field.onChange(value.filter((item: string) => item !== 'notification_sms'))
                            }
                          }}
                        /> */}
                      </div>
                      <div className="text-sm leading-6">
                        <label htmlFor="notification_sms" className="font-medium text-gray-900">
                          SMS Push Notifications
                        </label>
                        <p className="text-gray-500">Get notified when a candidate applies for a job.</p>
                      </div>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
          </div>
          <Toast ref={toast} />
          <div className="mt-6 flex items-center justify-end gap-x-6">
            <Button type="submit" label="Submit" />
          </div>
        </form>
      ) : null}
    </>
  )
}
