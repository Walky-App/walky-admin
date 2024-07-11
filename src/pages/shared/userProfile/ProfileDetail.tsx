import { useState, useEffect, type Dispatch, type SetStateAction } from 'react'

import classNames from 'classnames'
import { format } from 'date-fns'
import { Button } from 'primereact/button'
import { Checkbox, type CheckboxChangeEvent } from 'primereact/checkbox'
import { InputMask, type InputMaskChangeEvent } from 'primereact/inputmask'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'

import { AddressAutoComplete, type IAddressAutoComplete } from '../../../components/shared/forms/AddressAutoComplete'
import { HtInputHelpText } from '../../../components/shared/forms/HtInputHelpText'
import { HtInputLabel } from '../../../components/shared/forms/HtInputLabel'
import { UploadAvatar } from '../../../components/shared/forms/UploadAvatar'
import { HtInfoTooltip } from '../../../components/shared/general/HtInfoTooltip'
import { type IUserInternalNote, type IUser } from '../../../interfaces/User'
import { requestService } from '../../../services/requestServiceNew'
import { useUtils } from '../../../store/useUtils'
import { type INotificationPreference } from '../../../utils/formOptions'
import { roleChecker, roleTxt } from '../../../utils/roleChecker'
import { GetTokenInfo } from '../../../utils/tokenUtil'

export const ProfileDetail = ({
  formUser,
  setFormUser,
}: {
  formUser: IUser
  setFormUser: Dispatch<SetStateAction<IUser>>
}) => {
  const [moreAddressDetails, setMoreAddressDetails] = useState<IAddressAutoComplete>()
  const [userFound, setUserFound] = useState<IUser>()
  const [internalNotes, setInternalNotes] = useState<IUserInternalNote>()

  const { showToast } = useUtils()
  const role = roleChecker()
  const userId = GetTokenInfo()._id

  useEffect(() => {
    if (moreAddressDetails) {
      setFormUser(prevState => ({
        ...prevState,
        country: moreAddressDetails.country ?? '',
        state: moreAddressDetails.state ?? '',
        zip: moreAddressDetails.zip ?? '',
        city: moreAddressDetails.city ?? '',
        location_pin: moreAddressDetails.location_pin ?? [],
        address: moreAddressDetails.address ?? '',
      }))
    }
  }, [moreAddressDetails, setFormUser, setMoreAddressDetails])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await requestService({ path: `users/${userId}` })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Unknown error occurred')
        }
        const data = await response.json()
        const currentUser = data as IUser
        setUserFound(currentUser)
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    }
    fetchUser()
  }, [userId])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

    const formPayload = {
      ...formUser,
      internal_notes: [...(formUser.internal_notes ?? []), internalNotes],
    }

    try {
      const response = await requestService({
        path: `users/${formUser?._id}`,
        method: 'PATCH',
        body: JSON.stringify(formPayload),
      })
      if (response.ok) {
        const data = await response.json()
        showToast({ severity: 'success', summary: 'Success', detail: 'User updated' })
        setFormUser(data)
      }
    } catch (error) {
      console.error('Error updating user:', error)
    }
  }

  const handlePasswordReset = async () => {
    try {
      const request = await requestService({
        path: '/auth/reset',
        method: 'POST',
        body: JSON.stringify({ email: formUser.email }),
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

  const handleFormUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target as HTMLInputElement
    setFormUser((prevState: IUser) => ({ ...prevState, [name]: value }))
  }

  const handleFormUpdateNumber = (e: InputMaskChangeEvent) => {
    const { name, value } = e.target
    setFormUser(prevState => ({ ...prevState, [name]: value }))
  }

  const handleNotificationPreferenceChange = (e: CheckboxChangeEvent, type: INotificationPreference) => {
    if (e.checked ?? false) {
      setFormUser(prevState => ({
        ...prevState,
        notifications: [...(prevState?.notifications ?? []), type],
      }))
    } else {
      setFormUser(prevState => ({
        ...prevState,
        notifications: prevState?.notifications?.filter(pref => pref !== type),
      }))
    }
  }

  return formUser?.role ? (
    <form onSubmit={handleSubmit}>
      <div className="p-fluid space-y-4 sm:space-y-12">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Avatar</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              This information will be displayed publicly so be careful what you share.
            </p>
          </div>
          <div>
            <UploadAvatar formUser={formUser} setFormUser={setFormUser as Dispatch<SetStateAction<IUser>>} />
          </div>
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

        <div className="grid grid-cols-1 gap-x-8 gap-y-4 border-b border-gray-900/10 py-12 sm:gap-y-10 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Personal Information</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">Use a permanent address where you can receive mail.</p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
            <div className="sm:col-span-3">
              <HtInputLabel htmlFor="first_name" asterisk labelText="First Name" />
              <InputText
                required
                value={formUser?.first_name}
                name="first_name"
                id="first_name"
                autoComplete="off"
                onChange={handleFormUpdate}
              />
            </div>

            <div className="sm:col-span-3">
              <HtInputLabel htmlFor="last_name" asterisk labelText="Last Name" />
              <InputText
                required
                value={formUser?.last_name}
                name="last_name"
                id="last_name"
                autoComplete="off"
                onChange={handleFormUpdate}
              />
            </div>
            <div className="sm:col-span-3">
              <HtInputLabel htmlFor="middle_name" labelText="Middle Name" />
              <InputText
                id="middle_name"
                value={formUser?.middle_name}
                name="middle_name"
                onChange={handleFormUpdate}
              />
            </div>

            <div className="sm:col-span-3">
              <HtInputLabel htmlFor="email" asterisk labelText="Email" />
              <div className="mt-2">
                <InputText disabled value={formUser?.email} name="email" onChange={handleFormUpdate} />
              </div>
            </div>

            <div className="sm:col-span-3">
              <HtInputLabel htmlFor="phone_number" asterisk labelText="Phone Number" />
              <div className="mt-2">
                <InputMask
                  required
                  value={formUser?.phone_number}
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

            <div className="sm:col-span-3">
              <HtInputLabel htmlFor="email" asterisk labelText="Role" />
              <div className="mt-2">
                <InputText disabled value={roleTxt(formUser.role)} name="email" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-4 border-b border-gray-900/10 py-12 sm:gap-y-10 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Address</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Please type in the address and choose from the dropdown to select the correct address.
            </p>
            {/* {requiredFieldsNoticeText} */}
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
            <div className="sm:col-span-6">
              <HtInfoTooltip message="This is the physical address where you get your mail.">
                <HtInputLabel htmlFor="address" asterisk labelText="Address" />
              </HtInfoTooltip>
              <AddressAutoComplete
                controlled
                value={formUser.address}
                setMoreAddressDetails={setMoreAddressDetails}
                currentAddress={formUser.address ?? ''}
                classNames={classNames({ 'p-invalid': false }, 'mt-2')}
                aria-describedby="address-help"
              />
              <HtInputHelpText fieldName="address" helpText="Residential Address ONLY" />
            </div>
          </div>
        </div>

        {role === 'admin' ? (
          <>
            <div className="grid grid-cols-1 gap-x-8 gap-y-4 border-b pb-12 sm:gap-y-10 md:grid-cols-3">
              <div>
                <h2 className="text-base font-semibold leading-7 text-gray-900">User Statuses</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Please provide information about your business so that we can verify you on the platform.
                </p>
              </div>
              <div className="flex items-center justify-between text-center">
                <div>
                  <HtInputLabel htmlFor="active" labelText="Active" />
                  <Checkbox
                    inputId="active"
                    name="active"
                    title="Active"
                    onChange={e => setFormUser({ ...formUser, active: e.checked ?? false })}
                    checked={formUser.active || false}
                  />
                </div>

                <div>
                  <HtInputLabel htmlFor="onboarding_complete" labelText="Onboarding Complete" />
                  <Checkbox
                    inputId="onboarding_complete"
                    name="onboarding_complete"
                    onChange={e =>
                      setFormUser({
                        ...formUser,
                        onboarding: {
                          ...formUser.onboarding,
                          completed: e.checked ?? false,
                          step_number: formUser.onboarding?.step_number ?? 0,
                          description: formUser.onboarding?.description ?? '',
                          type: formUser.onboarding?.type ?? '',
                        },
                      })
                    }
                    checked={formUser.onboarding?.completed ?? false}
                  />
                </div>
                <div>
                  <HtInputLabel htmlFor="is_approved" labelText="Approved / Verified" />
                  <Checkbox
                    inputId="is_approved"
                    name="is_approved"
                    onChange={e =>
                      setFormUser({
                        ...formUser,
                        is_approved: e.checked ?? false,
                      })
                    }
                    checked={formUser.is_approved ?? false}
                  />
                </div>
              </div>
            </div>
            <div>
              <div className="grid grid-cols-1 gap-x-8 gap-y-5 border-gray-900/10 pb-6 md:grid-cols-3 md:gap-y-10">
                <div>
                  <h2 className="text-base font-semibold leading-7 text-gray-900">Internal Notes</h2>
                </div>

                <div className="max-w-2xl md:col-span-2">
                  <HtInputLabel htmlFor="internal_notes" labelText="Note:" />
                  <InputTextarea
                    id="internal_notes"
                    rows={4}
                    cols={30}
                    maxLength={500}
                    onChange={e =>
                      setInternalNotes(prev => ({
                        ...prev,
                        note: e.target.value,
                        createdBy: userFound?.email ?? userId,
                      }))
                    }
                    className={classNames({ 'p-invalid': false }, 'mt-2')}
                    autoComplete="off"
                  />
                  <HtInputHelpText
                    fieldName="internal_notes"
                    helpText="Max 500 characters. Please do not enter contact information into this field."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-x-8 gap-y-5 border-b border-gray-900/10 pb-12 md:grid-cols-3 md:gap-y-10">
                <div>
                  <h2 className="text-base font-semibold leading-7 text-gray-900">Existing Notes</h2>
                  <p className="mt-1 text-sm leading-6 text-gray-600">Previously added notes about this user.</p>
                </div>
                <div className="md:col-span-2">
                  {formUser.internal_notes?.length === 0 ? (
                    <div className="">
                      <h2 className="text-3xl font-semibold text-gray-900">No internal notes found</h2>
                      <p className="mt-1 text-sm text-gray-500">Add a new note to the facility</p>
                    </div>
                  ) : (
                    <div className="w-full">
                      <div className="flow-root">
                        <div className="py-2 align-middle">
                          <table className="w-full divide-y divide-gray-300">
                            <thead>
                              <tr>
                                <th
                                  scope="col"
                                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                  Note
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                  Created By
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                  Created At
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {formUser.internal_notes?.map(singleNote => (
                                <tr key={singleNote._id}>
                                  <td
                                    className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0"
                                    style={{ wordWrap: 'break-word', maxWidth: '250px' }}>
                                    {singleNote.note}
                                  </td>
                                  <td className="px-3 py-4 text-sm text-gray-500">{singleNote.createdBy}</td>
                                  <td className="px-3 py-4 text-sm text-gray-500">
                                    {singleNote.createdAt ? format(singleNote.createdAt, 'Pp') : null}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : null}

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
                    <Checkbox
                      inputId="email_notifications"
                      name="notifications.email"
                      onChange={e => handleNotificationPreferenceChange(e, 'notification_email')}
                      checked={formUser?.notifications?.includes('notification_email') ?? false ? true : false}
                    />
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
                    <Checkbox
                      inputId="sms_notifications"
                      name="notifications.sms"
                      onChange={e => handleNotificationPreferenceChange(e, 'notification_sms')}
                      checked={formUser?.notifications?.includes('notification_sms') ?? false ? true : false}
                    />
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
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <Button type="submit" label="Submit" />
      </div>
    </form>
  ) : null
}
