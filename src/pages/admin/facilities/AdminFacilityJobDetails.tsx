import * as React from 'react'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { RequestService } from '../../../services/RequestService'
import { CheckCircleIcon } from '@heroicons/react/20/solid'
import { SubHeader } from '../../../components/shared/SubHeader'
import { adminFacilitiesLinks } from './adminFacilitySubHeaderLinks'

export default function AdminFacilityJobDetails() {
  const { facilityId, jobId } = useParams()
  const [updateSuccess, setUpdateSuccess] = React.useState(false)
  const [facility, setFacility] = React.useState<any>({})
  const [job, setJob] = React.useState<any>({})

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const facility = await RequestService(`facilities/${facilityId}`)
        if (facility) {
          setFacility(facility)
        } else {
          console.log('No facility found or unexpected data structure received, setting default value.')
          setFacility({})
        }
      } catch (error) {
        console.error('Error fetching facility data:', error)
      }

      try {
        console.log('Job ID:', jobId)
        const job = await RequestService(`jobs/${jobId}`)
        if (job) {
          setJob(job)
        } else {
          console.log('No job found or unexpected data structure received.')
          setJob({})
        }
      } catch (error) {
        console.error('Error fetching job data:', error)
      }
    }

    fetchResources()
  }, [])

  const handleForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const target = e.target as typeof e.target & {
      created_by: { value: string }
      facility_id: { value: string }
      title: { value: string }
      salary: { value: string }
      description: { value: string }
      skills: { value: string }
      employment_type: { value: string }
      shift_days: { value: string }
      shift_times: { value: string }
      shift_dates: { value: string }
    }
    const skills = target.skills.value
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill)

    const formData = {
      created_by: target.created_by.value,
      facility_id: facilityId,
      title: target.title.value,
      salary: target.salary.value,
      description: target.description.value,
      skills: skills,
      employment_type: target.employment_type.value,
      shift_days: target.shift_days.value.split(',').map(Number),
      shift_times: target.shift_times.value.split(','),
      shift_dates: target.shift_dates.value.split(','),
      status: 'active',
    }

    RequestService(`/jobs/${jobId}`, 'PATCH', formData)
      .then(response => {
        if (response) {
          setUpdateSuccess(true)
          setTimeout(() => setUpdateSuccess(false), 5000)
        } else {
          console.error('Update was not successful')
          setUpdateSuccess(false)
        }
      })
      .catch(error => {
        console.error('Error updating job:', error)
        setUpdateSuccess(false)
      })
  }

  return (
    <>
      <SubHeader facility={facility} links={adminFacilitiesLinks} />
      <form onSubmit={handleForm}>
        <div className="space-y-12">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">Job Information</h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">Please provide information about the new job. </p>
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
                    defaultValue={job.title}
                    className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
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
                    defaultValue={job.created_by}
                    className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label htmlFor="salary" className="block text-sm font-medium leading-6 text-gray-900">
                  Salary*
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="salary"
                    id="salary"
                    defaultValue={job.salary}
                    className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="employment-type" className="block text-sm font-medium leading-6 text-gray-900">
                  employment_type
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="employment_type"
                    id="employment-type"
                    defaultValue={job.employment_type}
                    className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              {/* Skills Input */}
              <div className="sm:col-span-3">
                <label htmlFor="skills" className="block text-sm font-medium leading-6 text-gray-900">
                  Skills*
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="skills"
                    id="skills"
                    placeholder="Enter skills separated by commas"
                    defaultValue={job.skills}
                    className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              {/* Shift Days Input */}
              <div className="sm:col-span-3">
                <label htmlFor="shift_days" className="block text-sm font-medium leading-6 text-gray-900">
                  Shift Days
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="shift_days"
                    id="shift-days"
                    placeholder="e.g., 1,4"
                    defaultValue={job.shift_days}
                    className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              {/* Shift Times Input */}
              <div className="sm:col-span-3">
                <label htmlFor="shift_times" className="block text-sm font-medium leading-6 text-gray-900">
                  Shift Times
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="shift_times"
                    id="shift-times"
                    placeholder="e.g., 8:00,19:00"
                    defaultValue={job.shift_times}
                    className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="shift_dates" className="block text-sm font-medium leading-6 text-gray-900">
                  Shift Dates
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="shift_dates"
                    id="shift-dates"
                    placeholder="e.g., 2024-01-31,2024-02-20"
                    defaultValue={job.shift_dates}
                    className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="col-span-full">
                <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
                  Description
                </label>
                <div className="mt-2">
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                    defaultValue={job.description}
                  />
                </div>

                <p className="mt-3 text-sm leading-6 text-gray-600">Write notes about the Job.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-x-6">
          {updateSuccess && (
            <div className="rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">Job successfully updated</p>
                </div>
                <div className="ml-auto pl-3">
                  <div className="-mx-1.5 -my-1.5"></div>
                </div>
              </div>
            </div>
          )}
          {/* <button
            type="submit"
            className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
            Save
          </button> */}
        </div>
      </form>
    </>
  )
}
