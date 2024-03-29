import { useState, useEffect } from 'react'

import { TabPanel, TabView } from 'primereact/tabview'

import { HeaderComponent } from '../../../components/shared/general/HeaderComponent'
import { type IJob } from '../../../interfaces/job'
import { RequestService } from '../../../services/RequestService'
import { GetTokenInfo } from '../../../utils/TokenUtils'
import JobListItem from './JobListItem'

const jobCategoryOptions = [
  { name: 'All Jobs', code: 'all' },
  { name: 'Packager', code: 'Packager' },
  { name: 'Trimmer', code: 'Trimmer' },
]

export const EmployeeMyJobs = () => {
  const [jobs, setJobs] = useState<IJob[]>([])

  const { _id } = GetTokenInfo()

  useEffect(() => {
    const getJobs = async () => {
      const allJobs = await RequestService(`jobs/byemployee/${_id}`)

      if (allJobs) {
        setJobs(allJobs)
      }
    }
    getJobs()
  }, [_id])

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8">
      <HeaderComponent title="My Jobs" search selectedOptions={jobCategoryOptions} />
      <TabView>
        <TabPanel header="Pending">
          <ul className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2 2xl:grid-cols-3">
            {jobs
              ?.filter(
                job =>
                  job.applicants[0].is_approved === false &&
                  job.applicants[0].is_working === false &&
                  job.applicants[0].rejection_reason === '',
              )
              .map((job: IJob) => <JobListItem key={job._id} job={job} />)}
          </ul>
        </TabPanel>
        <TabPanel header="Accepted">
          <ul className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2 2xl:grid-cols-3">
            {jobs
              ?.filter(job => job.applicants[0].is_approved === true)
              .map((job: IJob) => <JobListItem key={job._id} job={job} />)}
          </ul>
        </TabPanel>
        <TabPanel header="Working">
          <ul className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2 2xl:grid-cols-3">
            {jobs
              ?.filter(job => job.applicants[0].is_working === true)
              .map((job: IJob) => <JobListItem key={job._id} job={job} />)}
          </ul>
        </TabPanel>
        <TabPanel header="Rejected">
          <ul className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2 2xl:grid-cols-3">
            {jobs
              ?.filter(job => job.applicants[0].rejection_reason !== '')
              .map((job: IJob) => <JobListItem key={job._id} job={job} />)}
          </ul>
        </TabPanel>
      </TabView>
    </div>
  )
}
