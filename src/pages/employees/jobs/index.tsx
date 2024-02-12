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
    <div className="mx-auto px-4 sm:px-6 lg:px-8">
      <HeaderComponent title="Jobs" search selectedOptions={categorysOptions} />
      <ul className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2 2xl:grid-cols-3">
        {jobs?.map((job: any) => <JobListItem key={job._id} job={job} />)}
      </ul>
    </div>
  )
}
