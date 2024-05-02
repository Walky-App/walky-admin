import * as React from 'react'

import { CheckCircleIcon } from '@heroicons/react/20/solid'

import { TitleComponent } from '../../../components/shared/general/TitleComponent'
import { RequestService } from '../../../services/RequestService'

export const AdminAddJob = () => {
  const [updateSuccess, setUpdateSuccess] = React.useState(false)

  const handleForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const target = e.target as typeof e.target & {
      created_by: { value: string }
      facility: { value: string }
      title: { value: string }
      description: { value: string }
      skills: { value: string }
      employment_type: { value: string }
      startTime: { value: number }
      endTime: { value: number }
      job_dates: { value: string }
      isActive: { value: string }
      isCompleted: { value: string }
      isFull: { value: string }
    }

    const formData = {
      created_by: target.created_by.value,
      facility: target.facility.value,
      title: target.title.value,
      description: target.description.value,
      skills: target.skills.value.split(','),
      employment_type: target.employment_type.value,
      startTime: target.startTime.value,
      endTime: target.endTime.value,
      job_dates: target.job_dates.value.split(','),
      isActive: target.isActive.value === 'Active' ? true : false,
      isCompleted: target.isCompleted.value === 'Completed' ? true : false,
      isFull: target.isFull.value === 'Full' ? true : false,
    }

    try {
      const response = await RequestService(`jobs`, 'POST', formData)
      if (response) {
        setUpdateSuccess(true)
        setTimeout(() => setUpdateSuccess(false), 5000) // Hide message after 5 seconds
      } else {
        throw new Error('Job posting failed')
      }
    } catch (error) {
      console.error('Error posting job:', error)
      setUpdateSuccess(false)
    }
  }

  return (
    <>
      <TitleComponent title="Add Job" />

      <form onSubmit={handleForm}>
        <div className="space-y-12">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">Job Information</h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Please provide information about your business so that we can verify you on the platform.{' '}
              </p>
            </div>

            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
              <div className="sm:col-span-3">
                <label htmlFor="job-title" className="block text-sm font-medium leading-6 text-gray-900">
                  Title
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="title"
                    id="job-title"
                    className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="created_by" className="block text-sm font-medium leading-6 text-gray-900">
                  Created By
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="created_by"
                    id="email"
                    className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label htmlFor="facility" className="block text-sm font-medium leading-6 text-gray-900">
                  Facility
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="facility"
                    id="facility"
                    className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="employment-type" className="block text-sm font-medium leading-6 text-gray-900">
                  Employment Type
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="employment_type"
                    id="employment-type"
                    className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label htmlFor="vacancy" className="block text-sm font-medium leading-6 text-gray-900">
                  Vacancies
                </label>
                <div className="mt-2">
                  <input
                    type="number"
                    name="vacancy"
                    id="vacancy"
                    className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              {/* Skills Input */}
              <div className="sm:col-span-3">
                <label htmlFor="skills" className="block text-sm font-medium leading-6 text-gray-900">
                  Skills
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="skills"
                    id="skills"
                    placeholder="Enter skills separated by commas"
                    className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              {/* Status Selectors */}

              <div className="sm:col-span-3">
                <label htmlFor="isCompleted" className="block text-sm font-medium leading-6 text-gray-900">
                  Completion Status
                </label>
                <div className="mt-2">
                  <select
                    id="isCompleted"
                    name="isCompleted"
                    className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6">
                    <option value="true">Completed</option>
                    <option value="false">Ongoing</option>
                  </select>
                </div>
              </div>
              <div className="sm:col-span-3">
                <label htmlFor="isFull" className="block text-sm font-medium leading-6 text-gray-900">
                  Availability Status
                </label>
                <div className="mt-2">
                  <select
                    id="isFull"
                    name="isFull"
                    className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6">
                    <option value="true">Full</option>
                    <option value="false">Available</option>
                  </select>
                </div>
              </div>
              <div className="sm:col-span-3">
                <label htmlFor="isActive" className="block text-sm font-medium leading-6 text-gray-900">
                  Current Status
                </label>
                <div className="mt-2">
                  <select
                    id="isActive"
                    name="isActive"
                    className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6">
                    <option value="true">Active</option>
                    <option value="false">Disabled</option>
                  </select>
                </div>
              </div>

              {/* Shift Times Input */}
              <div className="sm:col-span-3">
                <label htmlFor="startTime" className="block text-sm font-medium leading-6 text-gray-900">
                  Start Time
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="startTime"
                    id="start-time"
                    placeholder="military time, e.g., 0800, 1300"
                    className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label htmlFor="endTime" className="block text-sm font-medium leading-6 text-gray-900">
                  End Time
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="endTime"
                    id="end-time"
                    placeholder="military time, e.g., 0800, 1300"
                    className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="job_dates" className="block text-sm font-medium leading-6 text-gray-900">
                  Job Dates
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="job_dates"
                    id="job-dates"
                    placeholder="e.g., 2024-01-31,2024-02-20"
                    className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="col-span-full">
                <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                  Description
                </label>
                <div className="mt-2">
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                    defaultValue=""
                  />
                </div>

                <p className="mt-3 text-sm leading-6 text-gray-600">Provide the necessary information about the job.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-x-6">
          {updateSuccess ? (
            <div className="rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">Job successfully posted</p>
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
            Save
          </button>
        </div>
      </form>
    </>
  )
}
