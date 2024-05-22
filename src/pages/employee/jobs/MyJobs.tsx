import { useState, useEffect } from 'react'

import { SelectButton, type SelectButtonChangeEvent } from 'primereact/selectbutton'
import { TabPanel, TabView } from 'primereact/tabview'

import { type IJob } from '../../../interfaces/job'
import { RequestService } from '../../../services/RequestService'
import { GetTokenInfo } from '../../../utils/tokenUtil'
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

  const handleSaveUnsaveJob = (jobId: string, isSaved: boolean) => {
    setJobs(
      jobs.map(job =>
        job._id === jobId
          ? { ...job, saved_by: isSaved ? [...job.saved_by, _id] : job.saved_by.filter(id => id !== _id) }
          : job,
      ),
    )
  }

  const activeJobs = jobs?.filter(
    job => job.applicants.length > 0 && job.applicants[0].is_approved === true && job.is_completed === false,
  )

  const pendingJobs = jobs?.filter(
    job =>
      job.applicants.length > 0 &&
      job.applicants[0].is_approved === false &&
      job.applicants[0].is_working === false &&
      job.applicants[0].rejection_reason === '',
  )

  const rejectedJobs = jobs?.filter(job => job.applicants.length > 0 && job.applicants[0].rejection_reason !== '')

  const savedJobs = jobs?.filter(job => job.saved_by.length > 0 && job.saved_by.some(userId => userId === _id))

  const pastJobs = jobs?.filter(
    job => job.applicants.length > 0 && job.applicants[0].is_approved === true && job.is_completed === true,
  )

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex w-full justify-end">
        <SelectButton
          value={view}
          onChange={(e: SelectButtonChangeEvent) => setView(e.value)}
          options={viewOptions}
          optionLabel="value"
          itemTemplate={viewOptionsTemplate}
          pt={{ button: { className: 'justify-center' } }}
        />
      </div>
      {view === 'calendar' ? (
        <JobCalendar jobs={activeJobs} />
      ) : (
        <div className="[&>*:last-child]:mt-8">
          <TabView>
            <TabPanel header="Active & Upcoming">
              <ul className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-2 2xl:grid-cols-3">
                {activeJobs?.length > 0 ? (
                  activeJobs.map((job: IJob) => (
                    <JobListItem key={job._id} job={job} handleSaveUnsaveJob={handleSaveUnsaveJob} />
                  ))
                ) : (
                  <div>There are no active or upcoming jobs yet.</div>
                )}
              </ul>
            </TabPanel>
          </TabView>
          <TabView>
            <TabPanel header="Pending">
              <ul className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-2 2xl:grid-cols-3">
                {pendingJobs?.length > 0 ? (
                  pendingJobs.map((job: IJob) => (
                    <JobListItem key={job._id} job={job} handleSaveUnsaveJob={handleSaveUnsaveJob} />
                  ))
                ) : (
                  <div>There are no jobs pending yet.</div>
                )}
              </ul>
            </TabPanel>
            {role === adminRole ? (
              <TabPanel header="Rejected">
                <ul className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-2 2xl:grid-cols-3">
                  {rejectedJobs?.length > 0 ? (
                    rejectedJobs.map((job: IJob) => <JobListItem key={job._id} job={job} />)
                  ) : (
                    <div>There are no jobs with rejections yet.</div>
                  )}
                </ul>
              </TabPanel>
            ) : null}
            <TabPanel header="Saved Jobs">
              <ul className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-2 2xl:grid-cols-3">
                {savedJobs?.length > 0 ? (
                  savedJobs.map((job: IJob) => (
                    <JobListItem key={job._id} job={job} handleSaveUnsaveJob={handleSaveUnsaveJob} />
                  ))
                ) : (
                  <div>There are no jobs saved yet.</div>
                )}
              </ul>
            </TabPanel>
            <TabPanel header="Past Jobs">
              <ul className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-2 2xl:grid-cols-3">
                {pastJobs?.length > 0 ? (
                  pastJobs.map((job: IJob) => (
                    <JobListItem key={job._id} job={job} handleSaveUnsaveJob={handleSaveUnsaveJob} />
                  ))
                ) : (
                  <div>There are no jobs completed in the past yet.</div>
                )}
              </ul>
            </TabPanel>
          </TabView>
        </div>
      )}
    </div>
  )
}
