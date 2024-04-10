import { useState, useEffect } from 'react'

import { SelectButton, type SelectButtonChangeEvent } from 'primereact/selectbutton'
import { TabPanel, TabView } from 'primereact/tabview'

import { HeaderComponent } from '../../../components/shared/general/HeaderComponent'
import { type IJob } from '../../../interfaces/job'
import { RequestService } from '../../../services/RequestService'
import { GetTokenInfo } from '../../../utils/TokenUtils'
import { JobCalendar } from './JobCalendar'
import { JobListItem } from './JobListItem'

const adminRole = process.env.REACT_APP_ADMIN_ROLE

interface ViewOption {
  icon: string
  value: string
}

const viewOptions: ViewOption[] = [
  { icon: 'pi pi-bars', value: 'list' },
  { icon: 'pi pi-calendar', value: 'calendar' },
]

const jobCategoryOptions = [
  { name: 'All Jobs', code: 'all' },
  { name: 'Packager', code: 'Packager' },
  { name: 'Trimmer', code: 'Trimmer' },
]

export const EmployeeMyJobs = () => {
  const [jobs, setJobs] = useState<IJob[]>([])
  const [view, setView] = useState<string>('list')

  const viewOptionsTemplate = (option: ViewOption) => {
    return <i className={option.icon} />
  }

  const { _id, role } = GetTokenInfo()

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
      <div className="flex w-full justify-end">
        <SelectButton
          value={view}
          onChange={(e: SelectButtonChangeEvent) => setView(e.value)}
          options={viewOptions}
          optionLabel="value"
          itemTemplate={viewOptionsTemplate}
        />
      </div>
      {view === 'calendar' ? (
        <JobCalendar jobs={jobs} />
      ) : (
        <TabView>
          <TabPanel header="Active">
            <ul className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2 2xl:grid-cols-3">
              {jobs
                ?.filter(job => job.applicants.length > 0 && job.applicants[0].is_working === true)
                .map((job: IJob) => <JobListItem key={job._id} job={job} />)}
            </ul>
          </TabPanel>
          <TabPanel header="Accepted">
            <ul className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2 2xl:grid-cols-3">
              {jobs
                ?.filter(job => job.applicants.length > 0 && job.applicants[0].is_approved === true)
                .map((job: IJob) => <JobListItem key={job._id} job={job} />)}
            </ul>
          </TabPanel>
          <TabPanel header="Pending">
            <ul className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2 2xl:grid-cols-3">
              {jobs
                ?.filter(
                  job =>
                    job.applicants.length > 0 &&
                    job.applicants[0].is_approved === false &&
                    job.applicants[0].is_working === false &&
                    job.applicants[0].rejection_reason === '',
                )
                .map((job: IJob) => <JobListItem key={job._id} job={job} />)}
            </ul>
          </TabPanel>
          {role === adminRole ? (
            <TabPanel header="Rejected">
              <ul className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2 2xl:grid-cols-3">
                {jobs
                  ?.filter(job => job.applicants.length > 0 && job.applicants[0].rejection_reason !== '')
                  .map((job: IJob) => <JobListItem key={job._id} job={job} />)}
              </ul>
            </TabPanel>
          ) : null}
          <TabPanel header="Saved Jobs">
            <ul className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2 2xl:grid-cols-3">
              {jobs
                ?.filter(job => job.saved_by.length > 0 && job.saved_by.some(userId => userId === _id))
                .map((job: IJob) => <JobListItem key={job._id} job={job} />)}
            </ul>
          </TabPanel>
          <TabPanel header="Past Jobs">
            <ul className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2 2xl:grid-cols-3">
              {jobs
                ?.filter(
                  job =>
                    job.applicants.length > 0 && job.applicants[0].is_approved === true && job.is_completed === true,
                )
                .map((job: IJob) => <JobListItem key={job._id} job={job} />)}
            </ul>
          </TabPanel>
        </TabView>
      )}
    </div>
  )
}
