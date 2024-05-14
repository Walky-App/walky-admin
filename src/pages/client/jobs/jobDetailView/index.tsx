import { useEffect, useState } from 'react'

import { useNavigate, useParams } from 'react-router-dom'

import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { ProgressSpinner } from 'primereact/progressspinner'
import { TabPanel, TabView } from 'primereact/tabview'
import { ToggleButton } from 'primereact/togglebutton'
import { Tooltip } from 'primereact/tooltip'

import { Feedback } from '../../../../components/shared/dialog/Feedback'
import { type IJob } from '../../../../interfaces/job'
import { requestService } from '../../../../services/requestServiceNew'
import { useUtils } from '../../../../store/useUtils'
import { roleChecker } from '../../../../utils/roleChecker'
import { PanelAcceptedContent } from './PanelAcceptedContent'
import { PanelPendingContent } from './PanelPendingContent'
import { PanelRejectedContent } from './PanelRejectedContent'

export const ClientJobDetailView = () => {
  const [checked, setChecked] = useState<boolean>(false)
  const [idFeedback, setIdFeedback] = useState('')
  const [openFeedback, setOpenFeedback] = useState(false)
  const [job, setJob] = useState<IJob>()
  const navigate = useNavigate()
  const role = roleChecker()
  const { showToast } = useUtils()

  const { id } = useParams()

  let earliestDate, latestDate

  if (job?.job_dates) {
    earliestDate = new Date(Math.min(...job.job_dates.map((date: string) => new Date(date).getTime())))
    latestDate = new Date(Math.max(...job.job_dates.map((date: string) => new Date(date).getTime())))
  }

  const convertToStandardTime = (militaryTime: number) => {
    if (militaryTime == null) {
      return 'Time not set'
    }
    const militaryTimeString = militaryTime.toString().padStart(4, '0')
    const hours = Number(militaryTimeString.slice(0, -2))
    const minutes = Number(militaryTimeString.slice(-2))
    const standardHours = ((hours + 11) % 12) + 1
    const amPm = hours >= 12 ? 'pm' : 'am'
    return `${standardHours}:${minutes < 10 ? '0' : ''}${minutes} ${amPm}`
  }

  useEffect(() => {
    const getJob = async () => {
      try {
        const response = await requestService({ path: `jobs/${id}`, method: 'GET' })
        const job = await response.json()

        if (response.status === 200) {
          setJob(job)
        }
      } catch (error) {
        console.error('Error fetching job:', error)
      }
    }
    getJob()
  }, [id])

  const handleJobStatus = async (is_active: boolean, summary: string, detail: string) => {
    try {
      const requestData = { is_active: is_active }
      const response = await requestService({
        path: `jobs/${id}`,
        method: 'PATCH',
        body: JSON.stringify(requestData),
      })

      if (response.ok) {
        const data = await response.json()
        setJob({ ...data })
        showToast({ severity: 'success', summary: summary, detail: detail })
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleAccept = async (userId: string) => {
    try {
      const requestData = { userId }
      const response = await requestService({
        path: `jobs/${id}/accept`,
        method: 'PATCH',
        body: JSON.stringify(requestData),
      })
      if (response !== null && response !== undefined) {
        const updatedJob = await response.json()
        if (job && job._id) {
          setJob({ ...job, applicants: updatedJob.applicants })
        }
        showToast({ severity: 'success', summary: 'Applicant Accepted', detail: 'Applicant has been accepted' })
      }
    } catch (error) {
      console.error(error)
      showToast({ severity: 'error', summary: error as string, detail: 'An error occurred' })
    }
  }

  const handleReject = async (userId: string, rejectionReason: string) => {
    try {
      const requestData = { userId, rejection_reason: rejectionReason }
      const response = await requestService({
        path: `jobs/${id}/reject`,
        method: 'POST',
        body: JSON.stringify(requestData),
      })
      if (response.ok) {
        const updatedJob = await response.json()
        if (job && job._id) {
          setJob({ ...job, applicants: updatedJob.applicants })
        }
        showToast({ severity: 'success', summary: 'Applicant Rejected', detail: 'Applicant has been rejected' })
      }
    } catch (error) {
      console.error(error)
      showToast({ severity: 'error', summary: error as string, detail: 'An error occurred' })
    }
  }

  const handleAcceptAll = async () => {
    try {
      const response = await requestService({ path: `jobs/${id}/acceptAll`, method: 'PATCH' })
      if (response !== null && response !== undefined) {
        const updatedJob = await response.json()
        if (job && job._id) {
          setJob({ ...job, applicants: updatedJob.applicants })
        }

        showToast({
          severity: 'success',
          summary: 'All Applicants Accepted',
          detail: 'All applicants have been accepted',
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  const onSubmit = async (userId: string) => {
    try {
      const requestData = { userId }
      const response = await requestService({
        path: `jobs/${id}/add-applicant`,
        method: 'POST',
        body: JSON.stringify(requestData),
      })
      if (response.ok) {
        const updatedJob = await response.json()
        if (job && job._id) {
          setJob({ ...job, applicants: updatedJob.applicants })
        }
        showToast({ severity: 'success', summary: 'Applicant Added', detail: 'Applicant has been added' })
      }
    } catch (error) {
      console.error(error)
      showToast({ severity: 'error', summary: error as string, detail: 'An error occurred' })
    }
  }

  const handleReinstate = async (user_id: string) => {
    try {
      const requestData = { user_id }
      const response = await requestService({
        path: `jobs/${id}/reinstate`,
        method: 'PATCH',
        body: JSON.stringify(requestData),
      })

      if (response.ok) {
        const updatedJob = await response.json()
        if (job && job._id) {
          setJob({ ...job, applicants: updatedJob.applicants })
        }
        showToast({ severity: 'success', summary: 'Applicant Reinstated', detail: 'Applicant has been reinstated' })
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleFeedback = (userId: string) => {
    setIdFeedback(userId)
    setOpenFeedback(true)
  }

  return (
    <>
      {/* <HeaderComponent title="Job Details" />
       */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="md:col-span-3">
          <div>
            {job && 'start_time' in job && 'end_time' in job && 'job_dates' in job ? (
              <div>
                {/* Job Card Start*/}
                <Card
                  title={
                    <>
                      <div className="flex items-center">
                        <i className="pi pi-users" />
                        <div className="ml-1 text-base font-normal text-stone-500">
                          {job?.applicants.length} / {job?.vacancy} Applicants
                        </div>
                      </div>
                      {job.title}
                    </>
                  }>
                  {/* Job Facility */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-col items-start justify-start gap-1">
                      <div className="flex items-center">
                        <i className="pi pi-building" />
                        <div className="ml-2 text-base font-normal text-black">{job.facility.name}</div>
                      </div>
                      <div className="flex items-center">
                        <i className="pi pi-map-marker" />
                        <div className="ml-2 text-base font-normal text-black">
                          {job.facility.address}, {job.facility.city}, {job.facility.state}, {job.facility.zip}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Divider */}
                  <hr className="mb-3 mt-3 h-px w-full bg-zinc-100" />
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-start gap-2">
                      {job.is_active === true ? <i className="pi pi-check" /> : <i className="pi pi-times-circle" />}
                      <div className="mt-0.5 flex flex-col gap-1">
                        <span className="text-sm font-medium text-black">
                          {job.is_active === true ? 'Active' : 'Disabled'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      {job.is_completed === false ? (
                        <i className="pi pi-calendar" />
                      ) : (
                        <i className="pi pi-calendar-times" />
                      )}
                      <div className="mt-0.5 flex flex-col gap-1">
                        <span className="text-sm font-medium text-black">
                          {job.is_completed === false ? 'Live' : 'Archived'}
                        </span>
                      </div>
                    </div>
                    <div className="mt-0.5 flex items-start gap-2">
                      {job.is_full === false ? <i className="pi pi-briefcase" /> : <i className="pi pi-ban" />}
                      <div className="text-sm font-medium text-black">{job.is_full === false ? 'Open' : 'Full'}</div>
                    </div>
                  </div>
                  {/* Divider */}
                  <hr className="mt-3 h-px w-full bg-zinc-100" />
                  <div className="mt-3 flex flex-wrap items-center justify-start gap-3">
                    <div className="flex flex-col items-start justify-start gap-1 border-l-[1px] border-zinc-100 pl-3">
                      <div className="text-sm font-normal text-stone-500">Job Dates</div>
                      <div className="text-sm font-normal text-black">
                        {earliestDate?.toLocaleDateString()} - {latestDate?.toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex flex-col items-start justify-start gap-1 border-l-[1px] border-zinc-100 pl-3">
                      <div className="text-sm font-normal text-stone-500">Job Time</div>
                      <div className="text-sm font-normal text-black">
                        {convertToStandardTime(job.start_time)} - {convertToStandardTime(job.end_time)}
                      </div>
                    </div>
                    <div className="flex flex-col items-start justify-start gap-1 border-l-[1px] border-zinc-100 pl-3">
                      <div className="text-sm font-normal text-stone-500">Lunch Break</div>
                      <div className="text-sm font-normal text-black">
                        {job.lunch_break === 0 ? 'No' : job.lunch_break + ' Minutes'}
                      </div>
                    </div>
                    <div className="flex flex-col items-start justify-start gap-1 border-l-[1px] border-zinc-100 pl-3">
                      <div className="text-sm font-normal text-stone-500">Total Hours</div>
                      <div className="text-sm font-normal text-black">{job.total_hours} Hours</div>
                    </div>
                    <div className="flex flex-col items-start justify-start gap-1 border-l-[1px] border-zinc-100 pl-3">
                      <div className="text-sm font-normal text-stone-500">Hourly Rate</div>
                      <div className="text-sm font-normal text-black">{job.hourly_rate} USD</div>
                    </div>
                  </div>
                  {/* Job Card Footer */}
                  <div className="mt-5 flex w-full flex-wrap items-center justify-between gap-3 rounded-bl-lg rounded-br-lg bg-neutral-100 px-5 py-4">
                    <div className="flex flex-wrap items-center justify-start gap-1">
                      <div className="text-balance text-sm font-normal text-stone-500">
                        Last update on {new Date(job.createdAt).toLocaleDateString()}
                      </div>
                      <div className="h-1 w-1 rounded-full bg-stone-500" />
                      <div className="text-sm font-normal text-stone-500">#{job.uid}</div>
                    </div>
                  </div>
                </Card>
                {/* Job Card End*/}
                {/* Schedule */}
                {role === 'admin' ? (
                  <div className="mt-4 flex flex-wrap items-center justify-between space-y-4">
                    <ToggleButton
                      checked={checked}
                      onChange={e => setChecked(e.value)}
                      onLabel="Close Schedule"
                      offLabel="Open Schedule"
                      onIcon="pi pi-times"
                      offIcon="pi pi-check"
                    />
                  </div>
                ) : null}

                {checked ? (
                  <section className="mt-12">
                    <h2 className="text-base font-semibold leading-6 text-gray-900">
                      Schedule ({job.job_dates.length} days)
                    </h2>
                    <ol className="mt-2 divide-y divide-gray-200 text-base leading-6 text-gray-500">
                      {job.job_dates.map((date: string, index: number) => {
                        const dateObj = new Date(date)
                        const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'long' })
                        const formattedDate = dateObj.toLocaleDateString()
                        return (
                          <li key={index} className="py-4 sm:flex">
                            <time dateTime={date} className="w-28 flex-none">
                              {dayOfWeek}, {formattedDate}
                            </time>
                            <p className="flex-none sm:ml-6">
                              <time dateTime={date}>{convertToStandardTime(job.start_time)}</time> -
                              <time dateTime={date}>{convertToStandardTime(job.end_time)}</time>
                            </p>
                            <p className="ml-2 mt-2 flex-auto font-semibold text-gray-900 sm:mt-0">
                              Lunch: {job.lunch_break} minutes
                            </p>
                            <p className="text-green-500">Confirmed</p>
                          </li>
                        )
                      })}
                    </ol>
                  </section>
                ) : null}
              </div>
            ) : (
              <ProgressSpinner aria-label="Loading" style={{ color: 'green' }} />
            )}
          </div>
        </div>

        {/* Control Buttons */}
        <Tooltip content="Close this job" />

        <div className="md:col-span-1">
          <div className="flew-row flex md:flex-col">
            <div className="flex w-full flex-col items-center justify-center overflow-hidden rounded-md bg-white shadow">
              <ul className="w-full divide-y divide-gray-200">
                <li className="flex items-center justify-center gap-4 px-6 py-4 md:flex-col">
                  <Button
                    className="w-full"
                    label="Edit Job"
                    onClick={() => navigate(`/${role === 'admin' ? 'admin' : 'client'}/jobs/${id}/edit`)}
                  />
                  {!job?.is_active ? (
                    <Button
                      className="w-full"
                      label="Reopen Job"
                      severity="secondary"
                      onClick={() => handleJobStatus(true, 'Job Reopened', 'Job has been reopened')}
                    />
                  ) : (
                    <Button
                      className="w-full"
                      label="Close Job"
                      severity="secondary"
                      onClick={() => handleJobStatus(false, 'Job Closed', 'Job has been closed')}
                    />
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* Control Buttons end */}
        {/* Applicants and Workers Tab View */}

        <div className="md:col-span-3">
          <TabView>
            <TabPanel header="Pending">
              <PanelPendingContent
                role={role}
                applicants={job?.applicants}
                id={id}
                onSubmit={onSubmit}
                handleAccept={handleAccept}
                handleAcceptAll={handleAcceptAll}
                handleReject={handleReject}
              />
            </TabPanel>

            <TabPanel header="Rejected">
              <PanelRejectedContent applicants={job?.applicants} handleReinstate={handleReinstate} />
            </TabPanel>

            <TabPanel header="Accepted">
              <PanelAcceptedContent
                role={role}
                applicants={job?.applicants}
                applicantsFeedbackIds={job?.applicants_feedback_ids}
                handleFeedback={handleFeedback}
                handleReinstate={handleReinstate}
              />
            </TabPanel>
          </TabView>
        </div>
      </div>
      <Feedback isOpen={openFeedback} hidden={setOpenFeedback} objectId={idFeedback} job_id={id} />
    </>
  )
}
