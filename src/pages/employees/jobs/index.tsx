import { useState, useEffect } from 'react'

import JobListItem from './components/JobListItem'
import JobsHeader from './components/JobsHeader'
import { RequestService } from '../../../services/RequestService'

export default function Jobs() {
  const [jobs, setJobs] = useState<any>([])

  const getJobs = async () => {
    const allJobs = await RequestService('jobs')
    setJobs(allJobs)
  }

  useEffect(() => {
    getJobs()
  }, [])

  return (
    <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
      <JobsHeader title={'Find Jobs'} />

      <ul role="list" className="grid mt-10 grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {jobs?.map((job: any) => (
          <a href={`/employee/jobs/${job._id}`}>
            <JobListItem key={job._id} job={job} />
          </a>
        ))}
      </ul>
    </div>
  )
}
