import { type ChangeEventHandler, useEffect, useState } from 'react'

import { CheckCircleIcon } from '@heroicons/react/20/solid'

import { type IUser } from '../../../../interfaces/User'
import { RequestService } from '../../../../services/RequestService'
import { roleTxt } from '../../../../utils/roleChecker'
import { useAdminUserContext } from '../AdminUserPage'

export const AdminUserDetails = () => {
  const [formUser, setFormUser] = useState<IUser>()
  const [updateSuccess, setUpdateSuccess] = useState(false)

  const { selectedUserData } = useAdminUserContext()

  useEffect(() => {
    if (selectedUserData) {
      setFormUser(selectedUserData)
    }
  }, [selectedUserData])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    const inputValue = type === 'checkbox' ? checked : value
    setFormUser(prevFormUser => ({
      ...prevFormUser!,
      [name]: inputValue,
    }))
  }
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, notificationType: string) => {
    const isChecked = e.target.checked

    setFormUser((prevFormUser: IUser | undefined): IUser | undefined => {
      const notificationsSet = new Set(prevFormUser?.notifications)
      if (isChecked) {
        notificationsSet.add(notificationType)
      } else {
        notificationsSet.delete(notificationType)
      }
      return { ...prevFormUser!, notifications: Array.from(notificationsSet) }
    })
  }

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const response = await RequestService(`users/${formUser?._id}`, 'PATCH', formUser)
      setFormUser(response)
      setUpdateSuccess(true)
      setTimeout(() => setUpdateSuccess(false), 5000)
    } catch (error) {
      console.error('Error updating user data:', error)
      setUpdateSuccess(false)
    }
  }

  if (!formUser) {
    return null
  }

  return (
    <form onSubmit={handleUpdate}>
      <div className="space-y-12">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Personal Information</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">Use a permanent address where you can receive mail.</p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
            <div className="sm:col-span-3">
              <label htmlFor="first_name" className="block text-sm font-medium leading-6 text-gray-900">
                First name
              </label>
              <div className="mt-2">
                <input
                  value={formUser.first_name || ''}
                  onChange={handleInputChange}
                  type="text"
                  disabled
                  name="first_name"
                  id="first_name"
                  autoComplete="given-name"
                  className="block w-full rounded-md border-0 bg-slate-100 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="last_name" className="block text-sm font-medium leading-6 text-gray-900">
                Last name
              </label>
              <div className="mt-2">
                <input
                  value={formUser.last_name || ''}
                  onChange={handleInputChange}
                  type="text"
                  disabled
                  name="last_name"
                  id="last_name"
                  autoComplete="family-name"
                  className="block  w-full rounded-md border-0 bg-slate-100 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  disabled
                  value={formUser.email || ''}
                  onChange={handleInputChange}
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="block w-full rounded-md border-0 bg-slate-100 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            {roleTxt(formUser.role) !== 'Admin' ? (
              <div className="sm:col-span-3">
                <label htmlFor="status" className="block text-sm font-medium leading-6 text-gray-900">
                  Onboarding Status
                </label>
                <div className="mt-2">
                  <select
                    id="status"
                    name="active"
                    value={formUser.isOnboarded?.toString() ?? 'false'}
                    onChange={handleInputChange as unknown as React.ChangeEventHandler<HTMLSelectElement>}
                    className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6">
                    <option value="true">Approved</option>
                    <option value="false">Pending</option>
                  </select>
                </div>
              </div>
            ) : null}

            <div className="sm:col-span-3">
              <label htmlFor="status" className="block text-sm font-medium leading-6 text-gray-900">
                Status
              </label>
              <div className="mt-2">
                <select
                  id="status"
                  name="active"
                  value={formUser.active.toString()}
                  onChange={handleInputChange as unknown as React.ChangeEventHandler<HTMLSelectElement>}
                  className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6">
                  <option value="true">Active</option>
                  <option value="false">Disabled</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-2 sm:col-start-1">
              <label htmlFor="birth_date" className="block text-sm font-medium leading-6 text-gray-900">
                Birthday
              </label>
              <div className="mt-2">
                <input
                  type="date"
                  defaultValue={formUser.birth_date ? new Date(formUser.birth_date).toISOString().split('T')[0] : ''}
                  onChange={handleInputChange}
                  name="birth_date"
                  id="birth_date"
                  className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="gender" className="block text-sm font-medium leading-6 text-gray-900">
                Gender
              </label>
              <div className="mt-2">
                <select
                  value={formUser.gender || ''}
                  onChange={handleInputChange as unknown as React.ChangeEventHandler<HTMLSelectElement>}
                  name="gender"
                  id="gender"
                  autoComplete="gender"
                  className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="phone_number" className="block text-sm font-medium leading-6 text-gray-900">
                Phone Number
              </label>
              <div className="mt-2">
                <input
                  value={formUser.phone_number || ''}
                  onChange={handleInputChange}
                  type="tel"
                  name="phone_number"
                  id="phone_number"
                  pattern="\d{10}"
                  title="Phone number should be 10 digits"
                  className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="role" className="block text-sm font-medium leading-6 text-gray-900">
                Role
              </label>
              <div className="mt-2">
                <input
                  value={roleTxt(formUser.role)}
                  onChange={handleInputChange}
                  type="text"
                  disabled
                  name="role"
                  id="role"
                  className="block w-full rounded-md border-0 bg-slate-100 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Address</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">Use a permanent address where you can receive mail.</p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
            <div className="col-span-full">
              <label htmlFor="address" className="block text-sm font-medium leading-6 text-gray-900">
                Street address
              </label>
              <div className="mt-2">
                <input
                  value={formUser.address || ''}
                  onChange={handleInputChange}
                  type="text"
                  name="address"
                  id="address"
                  className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2 sm:col-start-1">
              <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
                City
              </label>
              <div className="mt-2">
                <input
                  value={formUser.city || ''}
                  onChange={handleInputChange}
                  type="text"
                  name="city"
                  id="city"
                  className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="state" className="block text-sm font-medium leading-6 text-gray-900">
                State / Province
              </label>
              <div className="mt-2">
                <input
                  value={formUser.state || ''}
                  onChange={handleInputChange}
                  type="text"
                  name="state"
                  id="state"
                  className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="zip" className="block text-sm font-medium leading-6 text-gray-900">
                ZIP / Postal code
              </label>
              <div className="mt-2">
                <input
                  value={formUser.zip || ''}
                  onChange={handleInputChange}
                  type="text"
                  name="zip"
                  id="zip"
                  className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Experience</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">Define the experience level of the user.</p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
            <div className="sm:col-span-2 sm:col-start-1">
              <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
                Experience
              </label>
              <div className="mt-2">
                <select
                  value={formUser.experience_level || ''}
                  onChange={handleInputChange as unknown as ChangeEventHandler<HTMLSelectElement>}
                  name="experience_level"
                  id="experience_level"
                  autoComplete="experience_level"
                  className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6">
                  {!formUser.experience_level ? <option value="">Select experience level</option> : null}
                  <option value="junior">Junior</option>
                  <option value="beginner">Beginner</option>
                  <option value="medium">Medium</option>
                  <option value="senior">Senior</option>
                  <option value="supervisor">Supervisor</option>
                </select>
              </div>
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
                    <input
                      checked={formUser.notifications?.includes('notification_email')}
                      onChange={e => handleCheckboxChange(e, 'notification_email')}
                      id="notification_email"
                      name="notification_email"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-green-600 focus:outline-none focus:ring-green-600"
                    />
                  </div>
                  <div className="text-sm leading-6">
                    <label htmlFor="notification_email" className="font-medium text-gray-900">
                      Email Notifications
                    </label>
                    <p className="text-gray-500">Get notified when someone posts a comment on a posting.</p>
                  </div>
                </div>
                <div className="relative flex gap-x-3">
                  <div className="flex h-6 items-center">
                    <input
                      checked={formUser.notifications?.includes('notification_sms')}
                      onChange={e => handleCheckboxChange(e, 'notification_sms')}
                      id="notification_sms"
                      name="notification_sms"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-green-600 focus:outline-none focus:ring-green-600"
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
        {updateSuccess ? (
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">User successfully updated</p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5" />
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
  )
}
