import * as React from 'react'
import { CheckCircleIcon } from '@heroicons/react/20/solid'
import { RequestService } from '../../../services/RequestService'

export default function AdminInviteUser() {
  const [updateSuccess, setUpdateSuccess] = React.useState(false)

  const handleForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget

    const target = e.target as typeof e.target & {
      email: { value: string }
      role: { value: string }
    }

    const formData = {
      email: target.email.value,
      role: target.role.value,
    }

    try {
      const response = await RequestService(`auth/invite`, 'POST', formData)
      if (response) {
        setUpdateSuccess(true)
        form.reset()
        setTimeout(() => setUpdateSuccess(false), 5000) // Hide message after 5 seconds
      } else {
        throw new Error('Failed to invite user')
      }
    } catch (error) {
      console.error('Error inviting user:', error)
      setUpdateSuccess(false)
    }
  }

  return (
    <>
      <div className="mb-12 w-full border-b border-gray-200 pb-5 ">
        <h3 className="text-base font-semibold leading-6 text-gray-900">Invite New User</h3>
      </div>

      <form onSubmit={handleForm}>
        <div className="space-y-12">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
              <div className="sm:col-span-4">
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                  Email*
                </label>
                <div className="mt-2">
                  <input
                    required
                    type="text"
                    id="email"
                    name="email"
                    autoComplete="email"
                    className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="role" className="block text-sm font-medium leading-6 text-gray-900">
                  Select User's Role*
                </label>
                <div className="mt-2">
                  <select
                    required
                    id="role"
                    name="role"
                    className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-600 sm:max-w-xs sm:text-sm sm:leading-6">
                    <option>admin</option>
                    <option>employee</option>
                    <option>client</option>
                  </select>
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
                  <p className="text-sm font-medium text-green-800">Invitation sent successfully</p>
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
    </>
  )
}
