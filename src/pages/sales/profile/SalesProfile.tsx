/* eslint-disable jsx-a11y/autocomplete-valid */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable react/jsx-no-leaked-render */
import { useMemo, useState } from 'react'

import { CheckCircleIcon } from '@heroicons/react/20/solid'

import { UploadAvatar } from '../../../components/shared/forms/UploadAvatar'
import { RequestService } from '../../../services/RequestService'
import { GetTokenInfo } from '../../../utils/tokenUtil'

export default function SalesProfile() {
  const [formUser, setFormUser] = useState<any>({})
  const [updateSuccess, setUpdateSuccess] = useState(false)

  useMemo(() => {
    const { _id } = GetTokenInfo()

    const getUser = async () => {
      const userFound = await RequestService(`users/${_id}`)
      setFormUser(userFound)
    }
    getUser()
  }, [])

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const target = e.target as any

    const formData = {
      first_name: target.first_name.value,
      last_name: target.last_name.value,
      email: target.email.value,
      gender: target.gender.value,
      birth_date: target.birth_date.value,
      phone_number: target.phone_number.value,
      address: target.address.value,
      city: target.city.value,
      state: target.state.value,
      zip: target.zip.value,
      notifications: [
        target.notification_email?.checked ? target.notification_email.name : '',
        target.notification_sms?.checked ? target.notification_sms.name : '',
      ],
    }

    try {
      const response = await RequestService(`users/${formUser._id}`, 'PATCH', formData)
      if (response && response._id) {
        setFormUser(response)
        setUpdateSuccess(true)
        setTimeout(() => setUpdateSuccess(false), 5000) // Hide message after 5 seconds
      } else {
        throw new Error('Failed to update user')
      }
    } catch (error) {
      console.error('Error updating user:', error)
      setUpdateSuccess(false)
    }
  }

  return (
    <>
      <div className="mb-12 w-full border-b border-gray-200 pb-5">
        <h3 className="text-base font-semibold leading-6 text-gray-900">Your Profile Details</h3>
      </div>

      {formUser.role && (
        <form onSubmit={handleUpdate}>
          <div className="space-y-12">
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
              <div>
                <h2 className="text-base font-semibold leading-7 text-gray-900">Avatar</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  This information will be displayed publicly so be careful what you share.
                </p>
              </div>

              <div className="">
                <UploadAvatar formUser={formUser} setFormUser={setFormUser} />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
              <div>
                <h2 className="text-base font-semibold leading-7 text-gray-900">Personal Information</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Use a permanent address where you can receive mail.
                </p>
              </div>

              <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                <div className="sm:col-span-3">
                  <label htmlFor="first_name" className="block text-sm font-medium leading-6 text-gray-900">
                    First name
                  </label>
                  <div className="mt-2">
                    <input
                      value={formUser.first_name}
                      type="text"
                      disabled
                      name="first_name"
                      id="first_name"
                      autoComplete="given-name"
                      className="block w-full rounded-md border-0 bg-slate-100 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="last_name" className="block text-sm font-medium leading-6 text-gray-900">
                    Last name
                  </label>
                  <div className="mt-2">
                    <input
                      value={formUser.last_name}
                      type="text"
                      disabled
                      name="last_name"
                      id="last_name"
                      autoComplete="family-name"
                      className="block  w-full rounded-md border-0 bg-slate-100 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
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
                      value={formUser.email}
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className="block w-full rounded-md border-0 bg-slate-100 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2 sm:col-start-1">
                  <label htmlFor="birthday" className="block text-sm font-medium leading-6 text-gray-900">
                    Birthday
                  </label>
                  <div className="mt-2">
                    <input
                      type="date"
                      defaultValue={
                        formUser.birth_date ? new Date(formUser.birth_date).toISOString().split('T')[0] : ''
                      }
                      name="birth_date"
                      id="birth_date"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="gender" className="block text-sm font-medium leading-6 text-gray-900">
                    Gender
                  </label>
                  <div className="mt-2">
                    <select
                      defaultValue={formUser.gender}
                      name="gender"
                      id="gender"
                      autoComplete="gender"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6">
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="phone_number" className="block text-sm font-medium leading-6 text-gray-900">
                    Phone number
                  </label>
                  <div className="mt-2">
                    <input
                      defaultValue={formUser.phone_number}
                      type="number"
                      name="phone_number"
                      id="phone_number"
                      autoComplete="phone_number"
                      pattern="\d{10}"
                      placeholder="10-digit phone-number"
                      title="Enter a valid US phone number (e.g. 9876543210)"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
              <div>
                <h2 className="text-base font-semibold leading-7 text-gray-900">Address</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Use a permanent address where you can receive mail.
                </p>
              </div>

              <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                <div className="col-span-full">
                  <label htmlFor="address" className="block text-sm font-medium leading-6 text-gray-900">
                    Street address
                  </label>
                  <div className="mt-2">
                    <input
                      defaultValue={formUser.address}
                      type="text"
                      name="address"
                      id="address"
                      autoComplete="address"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2 sm:col-start-1">
                  <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
                    City
                  </label>
                  <div className="mt-2">
                    <input
                      defaultValue={formUser.city}
                      type="text"
                      name="city"
                      id="city"
                      autoComplete="city"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="state" className="block text-sm font-medium leading-6 text-gray-900">
                    State / Province
                  </label>
                  <div className="mt-2">
                    <input
                      defaultValue={formUser.state}
                      type="text"
                      name="state"
                      id="state"
                      autoComplete="state"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="zip" className="block text-sm font-medium leading-6 text-gray-900">
                    ZIP / Postal code
                  </label>
                  <div className="mt-2">
                    <input
                      defaultValue={formUser.zip}
                      type="text"
                      name="zip"
                      id="zip"
                      autoComplete="zip"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                    />
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
                          defaultChecked={formUser.notifications?.includes('notification_email')}
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
                        <p className="text-gray-500">Get notified when someones posts a comment on a posting.</p>
                      </div>
                    </div>
                    <div className="relative flex gap-x-3">
                      <div className="flex h-6 items-center">
                        <input
                          defaultChecked={formUser.notifications?.includes('notification_sms')}
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
            {updateSuccess && (
              <div className="rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">Profile updated successfully</p>
                  </div>
                  <div className="ml-auto pl-3">
                    <div className="-mx-1.5 -my-1.5" />
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
      )}
    </>
  )
}
