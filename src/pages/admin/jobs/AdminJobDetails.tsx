// import { useState, useEffect } from 'react'
// import { useParams } from 'react-router-dom'
// import { RequestService } from '../../../services/RequestService'

// export default function AdminJobDetails() {
//   const [jobData, setJobState] = useState<any>({})
//   const { id } = useParams()

//   const fetchJob = async () => {
//     const jobData = await RequestService(`jobs/${id}`)
//     setJobState(jobData)
//     console.log(jobData)
//   }

//   useEffect(() => {
//     fetchJob()
//   }, [])

//   return (
//     <h2>
//       Job detail view {id} 
//       {jobData?.title}
//     </h2>
    
//   )
// }


import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { RequestService } from '../../../services/RequestService';
import { CheckCircleIcon } from '@heroicons/react/20/solid';
import TitleComponent from '../../../components/shared/general/TitleComponent';

export default function AdminJobDetails() {
    const { id } = useParams();
    const [formJob, setFormJob] = useState<any>({});
    const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);

    useEffect(() => {
        const getJob = async () => {
            try {
                const jobFound = await RequestService(`jobs/${id}`);
                setFormJob(jobFound);
            } catch (error) {
                console.error("Error fetching job data:", error);
            }
        };
        getJob();
    }, [id]);

    const handleInputChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        const inputValue = type === 'checkbox' ? checked : value;
        setFormJob((prevFormJob: any) => ({
            ...prevFormJob,
            [name]: inputValue,
        }));
    };

    const handleUpdate = async (e: any) => {
        console.log('formJob -->', formJob);
        e.preventDefault();
        try {
            console.log('jobID -->', id)
            const res = await RequestService(`jobs/${id}`, 'PATCH', formJob);
            setFormJob(res);
            console.log('formJob -->', formJob)
            setUpdateSuccess(true);
            console.log('update success -->', updateSuccess)
            setTimeout(() => setUpdateSuccess(false), 5000);
        } catch (error) {
            console.error("Error updating job data:", error);
            setUpdateSuccess(false);
        }
    };

    if (!formJob) {
        return <div>Loading...</div>;
    }
    return (
      <>
        <TitleComponent title={'Job details'} />
  
        <form onSubmit={handleUpdate}>
          <div className="space-y-12">
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
              <div>
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Job Information
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Please provide information about your business so that we can verify you on the
                  platform.{' '}
                </p>
              </div>
  
              <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="job-title"
                    className="block text-sm font-medium leading-6 text-gray-900">
                    Title
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="title"
                      id="job-title"
                      value={formJob.title || ''}
                      onChange={handleInputChange}
                      className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 focus:outline-none sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label
                    htmlFor="company-id"
                    className="block text-sm font-medium leading-6 text-gray-900">
                    Company
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="company"
                      id="company"
                      value={formJob.company || ''}
                      onChange={handleInputChange}
                      className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 focus:outline-none sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label
                    htmlFor="created_by"
                    className="block text-sm font-medium leading-6 text-gray-900">
                    Created By
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="created_by"
                      id="email"
                      value={formJob.created_by || ''}
                      onChange={handleInputChange}
                      className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 focus:outline-none sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label
                    htmlFor="facility-id"
                    className="block text-sm font-medium leading-6 text-gray-900">
                    Facility ID*
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="facility.name"
                      id="facility-id"
                      // value={formJob.facility.name || ''}
                      // onChange={handleInputChange}
                      className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 focus:outline-none sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label
                    htmlFor="salary"
                    className="block text-sm font-medium leading-6 text-gray-900">
                    Salary*
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="salary"
                      id="salary"
                      className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 focus:outline-none sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
  
                <div className="sm:col-span-3">
                  <label
                    htmlFor="employment-type"
                    className="block text-sm font-medium leading-6 text-gray-900">
                    employment_type
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="employment_type"
                      id="employment-type"
                      className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 focus:outline-none sm:text-sm sm:leading-6"
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
                      className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 focus:outline-none sm:text-sm sm:leading-6"
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
                      className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-green-600 focus:outline-none sm:max-w-xs sm:text-sm sm:leading-6"
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
                      className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-green-600 focus:outline-none sm:max-w-xs sm:text-sm sm:leading-6"
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
                      className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-green-600 focus:outline-none sm:max-w-xs sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="col-span-full">
                  <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
                    description
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 focus:outline-none sm:text-sm sm:leading-6"
                      defaultValue={''}
                    />
                  </div>
  
  
                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    Write notes about the Job.
  
                  </p>
                </div>
              </div>
            </div>
  
            {/* section two */}
  
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
              <div>
                <h2 className="text-base font-semibold leading-7 text-gray-900">Job Location</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Please provide the address information below.
                </p>
              </div>
  
              <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium leading-6 text-gray-900">
                    Country
                  </label>
                  <div className="mt-2">
                    <select
                      id="country"
                      name="country"
                      autoComplete="country-name"
                      className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-green-600 focus:outline-none sm:max-w-xs sm:text-sm sm:leading-6">
                      <option>United States</option>
                      <option>Canada</option>
                      <option>Mexico</option>
                    </select>
                  </div>
                </div>
  
                <div className="sm:col-span-3">
                  <label
                    htmlFor="last-name"
                    className="block text-sm font-medium leading-6 text-gray-900">
                    Street Address
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="address"
                      id="address"
                      autoComplete="address-line1"
                      className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 focus:outline-none sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
  
                <div className="sm:col-span-2 sm:col-start-1">
                  <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
                    City
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="city"
                      id="city"
                      autoComplete="address-level2"
                      className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 focus:outline-none sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
  
                <div className="sm:col-span-2">
                  <label htmlFor="region" className="block text-sm font-medium leading-6 text-gray-900">
                    State / Province
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="state"
                      id="state"
                      autoComplete="address-level1"
                      className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 focus:outline-none sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
  
                <div className="sm:col-span-2">
                  <label
                    htmlFor="postal-code"
                    className="block text-sm font-medium leading-6 text-gray-900">
                    ZIP / Postal code
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="zip"
                      id="zip"
                      autoComplete="postal-code"
                      className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 focus:outline-none sm:text-sm sm:leading-6"
                    />
                  </div>
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
                    <p className="text-sm font-medium text-green-800">Job successfully posted</p>
                  </div>
                  <div className="ml-auto pl-3">
                    <div className="-mx-1.5 -my-1.5">
                    </div>
                  </div>
                </div>
              </div>
            )}
            <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
              Cancel
            </button>
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
