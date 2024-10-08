import { useState, useEffect, type Dispatch, type SetStateAction } from 'react'

import { Button } from 'primereact/button'
import { Checkbox, type CheckboxChangeEvent } from 'primereact/checkbox'
import { InputMask, type InputMaskChangeEvent } from 'primereact/inputmask'
import { InputText } from 'primereact/inputtext'
import { OrganizationChart } from 'primereact/organizationchart'

import { AddressAutoComplete, type IAddressAutoComplete } from '../../../components/shared/forms/AddressAutoComplete'
import { HtInputHelpText } from '../../../components/shared/forms/HtInputHelpText'
import { HtInputLabel } from '../../../components/shared/forms/HtInputLabel'
import { UploadAvatar } from '../../../components/shared/forms/UploadAvatar'
import { HtInfoTooltip } from '../../../components/shared/general/HtInfoTooltip'
import { type IUserPopulated, type IUser } from '../../../interfaces/User'
import { requestService } from '../../../services/requestServiceNew'
import { useUtils } from '../../../store/useUtils'
import { cn } from '../../../utils/cn'
import { type INotificationPreference } from '../../../utils/formOptions'
import { roleChecker, roleTxt } from '../../../utils/roleChecker'

export const ProfileDetail = ({
  formUser,
  setFormUser,
  updateUser,
}: {
  formUser: IUserPopulated
  setFormUser: Dispatch<SetStateAction<IUserPopulated>>
  updateUser: React.FormEventHandler<HTMLFormElement>
}) => {
  const [moreAddressDetails, setMoreAddressDetails] = useState<IAddressAutoComplete>()

  const { showToast } = useUtils()
  const role = roleChecker()

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

  const handlePasswordReset = async () => {
    try {
      const request = await requestService({
        path: 'auth/reset',
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
    setFormUser(prevState => ({ ...prevState, [name]: value }))
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
    <form onSubmit={updateUser}>
      <div className="p-fluid space-y-4 sm:space-y-12">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex">
                <h2 className="mr-2 font-semibold leading-7">Avatar</h2>
                <HtInfoTooltip message="This is the image that will be displayed on your profile." />
              </div>
              <div>
                <p className="mt-1 text-sm leading-6">
                  This image will be displayed publicly so be mindful of what you share.
                </p>
              </div>
            </div>

            <div>
              <Button
                label="Reset Password"
                className="w-44 font-normal"
                severity="secondary"
                icon="pi pi-lock"
                onClick={handlePasswordReset}
              />
              <p className="mt-1 text-sm">
                You will get an email with <br /> instructions on how to reset your password.
              </p>
            </div>
          </div>
          <div>
            <UploadAvatar formUser={formUser} setFormUser={setFormUser as Dispatch<SetStateAction<IUser>>} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-4 border-b border-gray-900/10 py-12 sm:gap-y-10 md:grid-cols-3">
          <div>
            <h2 className=" font-semibold leading-7">Personal Information</h2>
            <p className="mt-1 text-sm leading-6">Use a permanent address where you can receive mail.</p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
            <div className="sm:col-span-3">
              <HtInputLabel htmlFor="first_name" asterisk labelText="First Name" />
              <div className="mt-2">
                <InputText
                  required
                  value={formUser?.first_name}
                  name="first_name"
                  id="first_name"
                  autoComplete="off"
                  onChange={handleFormUpdate}
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <HtInputLabel htmlFor="last_name" asterisk labelText="Last Name" />
              <div className="mt-2">
                <InputText
                  required
                  value={formUser?.last_name}
                  name="last_name"
                  id="last_name"
                  autoComplete="off"
                  onChange={handleFormUpdate}
                />
              </div>
            </div>
            <div className="sm:col-span-3">
              <HtInputLabel htmlFor="middle_name" labelText="Middle Name" />
              <div className="mt-2">
                <InputText
                  id="middle_name"
                  value={formUser?.middle_name}
                  name="middle_name"
                  onChange={handleFormUpdate}
                />
              </div>
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

        <div className="grid grid-cols-1 gap-x-8 gap-y-4 border-b border-gray-900/10 pb-12 sm:gap-y-10 md:grid-cols-3">
          <div>
            <h2 className=" font-semibold leading-7">Address</h2>
            <p className="mt-1 text-sm leading-6">
              Please type in the address and choose from the dropdown to select the correct address.
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
            <div className="sm:col-span-6">
              <HtInfoTooltip message="This is the physical address where you get your mail.">
                <HtInputLabel htmlFor="address" labelText="Address" />
              </HtInfoTooltip>
              <AddressAutoComplete
                controlled
                value={formUser.address}
                setMoreAddressDetails={setMoreAddressDetails}
                currentAddress={formUser.address ?? ''}
                classNames={cn({ 'p-invalid': false }, 'mt-2')}
                aria-describedby="address-help"
              />
              <HtInputHelpText fieldName="address" helpText="Residential Address ONLY" />
              <div className="mt-4">
                <p className="mt-1 text-sm leading-6">
                  <strong>State:</strong> {formUser.state}
                </p>
                <p className="mt-1 text-sm leading-6">
                  <strong>Zip:</strong> {formUser.zip}
                </p>
                <p className="mt-1 text-sm leading-6">
                  <strong>City:</strong> {formUser.city}
                </p>
                <p className="mt-1 text-sm leading-6">
                  <strong>Address:</strong> {formUser.address}
                </p>
              </div>
            </div>
          </div>
        </div>

        {role === 'admin' ? (
          <>
            <div className="grid grid-cols-1 gap-x-8 gap-y-4 border-b pb-12 sm:gap-y-10 md:grid-cols-3">
              <div>
                <h2 className=" font-semibold leading-7">User Statuses</h2>
                <p className="mt-1 text-sm leading-6">
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
            {(roleTxt(formUser.role) === 'Client' && formUser?.companies?.length) ?? 0 > 0 ? (
              <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
                <div>
                  <h2 className=" font-semibold leading-7">Organizational Structure</h2>
                  <p className="mt-1 text-sm leading-6">Company / Facilities that Client is associated with.</p>
                </div>

                <div className="max-w-2xl space-y-10 md:col-span-2">
                  <fieldset>
                    <div className="mt-6 space-y-6">
                      {typeof formUser.companies === 'object' ? (
                        <OrganizationChart
                          value={formUser?.companies?.map(company => {
                            return {
                              label: company?.company_name,
                              expanded: true,
                              children: company?.facilities?.map(facility => {
                                return {
                                  label: facility?.name,
                                }
                              }),
                            }
                          })}
                        />
                      ) : null}
                    </div>
                  </fieldset>
                </div>
              </div>
            ) : null}
          </>
        ) : null}

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
          <div>
            <h2 className=" font-semibold leading-7">Notifications</h2>
            <p className="mt-1 text-sm leading-6">
              We'll always let you know about important changes, but you pick what else you want to hear about.
            </p>
          </div>

          <div className="max-w-2xl space-y-10 md:col-span-2">
            <fieldset>
              <legend className="text-sm font-semibold leading-6">By Email / SMS</legend>
              <div className="mt-6 space-y-6">
                <div className="relative flex gap-x-3">
                  <div className="flex h-6 items-center">
                    <Checkbox
                      inputId="notification_email"
                      name="notifications.email"
                      onChange={e => handleNotificationPreferenceChange(e, 'notification_email')}
                      checked={formUser?.notifications?.includes('notification_email') ?? false ? true : false}
                    />
                  </div>
                  <div className="text-sm leading-6">
                    <label htmlFor="notification_email" className="font-medium">
                      Email Notifications
                    </label>
                    <p>Get notified when someones posts a comment on a posting.</p>
                  </div>
                </div>
                <div className="relative flex gap-x-3">
                  <div className="flex h-6 items-center">
                    <Checkbox
                      inputId="notification_sms"
                      name="notifications.sms"
                      onChange={e => handleNotificationPreferenceChange(e, 'notification_sms')}
                      checked={formUser?.notifications?.includes('notification_sms') ?? false ? true : false}
                    />
                  </div>
                  <div className="text-sm leading-6">
                    <label htmlFor="notification_sms" className="font-medium">
                      SMS Push Notifications
                    </label>
                    <p>Get notified when a candidate applies for a job.</p>
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
