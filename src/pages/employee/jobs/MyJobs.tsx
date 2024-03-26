import { useState, useEffect } from 'react'

import { HeaderComponent } from '../../../components/shared/general/HeaderComponent'
import { type IJob } from '../../../interfaces/job'
import { RequestService } from '../../../services/RequestService'
import JobListItem from './JobListItem'

const categorysOptions = [
  { name: 'All Jobs', code: 'all' },
  { name: 'Packager', code: 'Packager' },
  { name: 'Trimmer', code: 'Trimmer' },
]

export const EmployeeMyJobs = () => {
  const [jobs, setJobs] = useState([])

  useEffect(() => {
    const getJobs = async () => {
      const allJobs = await RequestService('jobs/byemployee')

      if (allJobs) {
        setJobs(allJobs)
      }
    }
    getJobs()
  }, [])

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8">
      <HeaderComponent title="Jobs" search selectedOptions={categorysOptions} />
      <ul className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2 2xl:grid-cols-3">
        {jobs?.map((job: IJob) => <JobListItem key={job._id} job={job} />)}
      </ul>
    </div>
  )
}
