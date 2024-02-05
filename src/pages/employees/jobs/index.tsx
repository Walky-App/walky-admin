import { useState, useEffect } from 'react'

import { RequestService } from '../../../services/RequestService'

import JobListItem from './JobListItem'
import HeaderComponent from '../../../components/shared/general/HeaderComponent'

const categorysOptions = [
  { name: 'All Skills', code: 'all' },
  { name: 'Trimming', code: 'trimming' },
  { name: 'Packaging', code: 'packaging' },
]

export default function Jobs() {
  const [jobs, setJobs] = useState<any>([])

  useEffect(() => {
    const getJobs = async () => {
      const allJobs = await RequestService('jobs')

      if (allJobs) {
        setJobs(allJobs)
      } else {
        console.log('No jobs')
      }
    }
    getJobs()
  }, [])

  return (
    <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
      <HeaderComponent title="Jobs" search selectedOptions={categorysOptions} />

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
