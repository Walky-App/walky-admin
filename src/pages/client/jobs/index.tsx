import * as React from 'react'


import { Link } from 'react-router-dom'
import { RequestService } from '../../../services/RequestService'
import { PlusIcon } from '@heroicons/react/20/solid'
import JobListItem from '../../employees/jobs/components/JobListItem'
import HeaderComponent from '../../../components/shared/general/HeaderComponent'

export default function Jobs() {
  const [jobs, setJobs] = React.useState<any>([])

  React.useEffect(() => {
    const getJobs = async () => {
      const allJobs = await RequestService('jobs')
      setJobs(allJobs)
    }

    getJobs()
  }, []) 


  return (
    <div className="mx-auto max-w-screen-xl px-4 py-10 sm:px-6 lg:px-8">
      <HeaderComponent title={'Jobs'} />
      <button
            type="button"
            className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
            <a href="http://localhost:3000/client/jobs/new" className="flex items-center gap-x-1.5">
              <PlusIcon className="-ml-0.5 h-5 w-5 text-gray-400" aria-hidden="true" />
              Add Job
            </a>
          </button>
          <div className="mx-auto max-w-screen-xl px-4 py-10 sm:px-6 lg:px-8">

      <ul role="list" className="grid mt-10 grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {jobs?.map((job: any) => (
          <Link key={job._id} to={`/employee/jobs/${job._id}`} >
            <JobListItem key={job._id} job={job} />
          </Link>
        ))}
      </ul>
    </div>
    </div>
  )
}
