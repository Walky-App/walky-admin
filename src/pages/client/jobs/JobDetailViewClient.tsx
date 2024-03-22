import { useEffect, useState } from 'react'

import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Rating } from 'primereact/rating'
import { TabPanel, TabView } from 'primereact/tabview'
import { Tag } from 'primereact/tag'
import { Tooltip } from 'primereact/tooltip'

import { HeaderComponent } from '../../../components/shared/general/HeaderComponent'
import { RequestService } from '../../../services/RequestService'
import { useUtils } from '../../../store/useUtils'

export default function JobDetailViewClient() {
  const [job, setJob] = useState<any>({})
  const navigate = useNavigate()
  const params = useParams()
  const id = params.id
  const location = useLocation()
  const isAdmin = location.pathname.includes('/admin')
  const { showToast } = useUtils()
  const [acceptCount, setAcceptCount] = useState(0);

  function convertToStandardTime(militaryTime: number) {
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
        const job = await RequestService(`jobs/${params.id}`)
        if (job) {
          setJob(job)
        }
      } catch (error) {
        console.error('Error fetching job:', error)
      }
    }

    getJob()
  }, [job.is_active, job.is_completed, params.id, acceptCount ])

  let earliestDate, latestDate

  if (job && job.job_dates) {
    earliestDate = new Date(Math.min(...job.job_dates.map((date: string) => new Date(date))))
    latestDate = new Date(Math.max(...job.job_dates.map((date: string) => new Date(date))))
  }

  const handleAccept = async (user_id: string) => {
    try {
      const requestData = { user_id }
      const response = await RequestService(`jobs/${id}/accept`, 'PATCH', requestData)
      if (response) {
        const updatedApplicants = job.applicants.map((applicant: any) => {
          if (applicant.id === user_id) {
            return { ...applicant, is_approved: true }
          }
          return applicant
        })
        setJob((prevJob: any) => ({ ...prevJob, applicants: updatedApplicants }))
        showToast({ severity: 'success', summary: 'Applicant Accepted', detail: 'Applicant has been accepted' })
        setAcceptCount(prevCount => prevCount + 1);
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleReject = async (user_id: string) => {
    try {
      const requestData = { user_id }
      const response = await RequestService(`jobs/${id}/reject`, 'PATCH', requestData)
      if (response) {
        const updatedApplicants = job.applicants.map((applicant: any) => {
          if (applicant.id === user_id) {
            return { ...applicant, is_approved: false }
          }
          return applicant
        })
        setJob((prevJob: any) => ({ ...prevJob, applicants: updatedApplicants }))
        showToast({ severity: 'success', summary: 'Applicant Rejected', detail: 'Applicant has been rejected' })
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <HeaderComponent title="Job Details" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="md:col-span-3">
          <div>
            {job && 'start_time' in job && 'end_time' in job && 'job_dates' in job ? (
              <div>
                {/* Job Card Start*/}
                <Card
                  title={
                    <>
                      <div className="flex items-center justify-between">
                        <div className="mb-2 text-xs font-normal text-stone-500"> N / {job.vacancy} Applicants </div>
                      </div>
                      {job.title}
                    </>
                  }>
                  {/* Job Facility */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-col items-start justify-start gap-1">
                      <div className="flex items-center">
                        <i className="pi pi-building"></i>
                        <div className="ml-2 text-base font-normal text-black">{job.facility.name}</div>
                      </div>
                      <div className="flex items-center">
                        <i className="pi pi-map-marker"></i>
                        <div className="ml-2 text-sm font-normal text-black">
                          {job.facility.address}, {job.facility.city}, {job.facility.state}, {job.facility.zip}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Divider */}
                  <hr className="mb-3 mt-3 h-px w-full bg-zinc-100" />
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-start gap-2">
                      {job.is_active === true ? (
                        <i className="pi pi-check"></i>
                      ) : (
                        <i className="pi pi-times-circle"></i>
                      )}
                      <div className="mt-0.5 flex flex-col gap-1">
                        <span className="text-xs font-medium text-black">
                          {job.is_active === true ? 'Active' : 'Disabled'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      {job.is_completed === false ? (
                        <i className="pi pi-calendar"></i>
                      ) : (
                        <i className="pi pi-calendar-times"></i>
                      )}
                      <div className="mt-0.5 flex flex-col gap-1">
                        <span className="text-xs font-medium text-black">
                          {job.is_completed === false ? 'Live' : 'Archived'}
                        </span>
                      </div>
                    </div>
                    <div className="mt-0.5 flex items-start gap-2">
                      {job.is_full === false ? <i className="pi pi-briefcase"></i> : <i className="pi pi-ban"></i>}
                      <div className="text-xs font-medium text-black">{job.is_full === false ? 'Open' : 'Full'}</div>
                    </div>
                  </div>
                  {/* Divider */}
                  <hr className="mt-3 h-px w-full bg-zinc-100" />
                  <div className="mt-3 flex flex-wrap items-center justify-start gap-3">
                    <div className="flex flex-col items-start justify-start gap-1 border-l-[1px] border-zinc-100 pl-3">
                      <div className="text-xs font-normal text-stone-500">Job Dates</div>
                      <div className="text-xs font-normal text-black">
                        {earliestDate?.toLocaleDateString()} - {latestDate?.toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex flex-col items-start justify-start gap-1 border-l-[1px] border-zinc-100 pl-3">
                      <div className="text-xs font-normal text-stone-500">Job Time</div>
                      <div className="text-xs font-normal text-black">
                        {convertToStandardTime(job.start_time)} - {convertToStandardTime(job.end_time)}
                      </div>
                    </div>
                    <div className="flex flex-col items-start justify-start gap-1 border-l-[1px] border-zinc-100 pl-3">
                      <div className="text-xs font-normal text-stone-500">Lunch Break</div>
                      <div className="text-xs font-normal text-black">
                        {job.lunch_break === 0 ? 'No' : job.lunch_break + ' Minutes'}
                      </div>
                    </div>
                    <div className="flex flex-col items-start justify-start gap-1 border-l-[1px] border-zinc-100 pl-3">
                      <div className="text-xs font-normal text-stone-500">Total Hours</div>
                      <div className="text-xs font-normal text-black">{job.total_hours} Hours</div>
                    </div>
                  </div>
                  {/* Job Card Footer */}
                  <div className="mt-5 flex w-full flex-wrap items-center justify-between gap-3 rounded-bl-lg rounded-br-lg bg-neutral-100 px-5 py-4">
                    <div className="flex flex-wrap items-center justify-start gap-1">
                      <div className="text-balance text-xs font-normal text-stone-500">
                        Last update on {new Date(job.createdAt).toLocaleDateString()}
                      </div>
                      <div className="h-1 w-1 rounded-full bg-stone-500" />
                      <div className="text-xs font-normal text-stone-500">#{job.uid}</div>
                    </div>
                  </div>
                </Card>
                {/* Job Card End*/}
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
                    onClick={() => navigate(`/${isAdmin ? 'admin' : 'client'}/jobs/${id}/edit`)}
                  />{' '}
                  {!job.is_active ? (
                    <Button
                      className="w-full"
                      label="Reopen Job"
                      severity="secondary"
                      onClick={async () => {
                        try {
                          const requestData = { is_active: true }
                          const response = await RequestService(`jobs/${id}`, 'PATCH', requestData)
                          if (response) {
                            setJob((prevJob: any) => ({ ...prevJob, is_active: true }))
                            showToast({ severity: 'success', summary: 'Job Reopened', detail: 'Job has been reopened' })
                          }
                        } catch (error) {
                          console.error(error)
                        }
                      }}
                    />
                  ) : (
                    <Button
                      className="w-full"
                      label="Close Job"
                      severity="secondary"
                      onClick={async () => {
                        try {
                          const requestData = { is_active: false }
                          const response = await RequestService(`jobs/${id}`, 'PATCH', requestData)
                          if (response) {
                            setJob((prevJob: any) => ({ ...prevJob, is_active: false }))
                            showToast({ severity: 'success', summary: 'Job Closed', detail: 'Job has been closed' })
                          }
                        } catch (error) {
                          console.error(error)
                        }
                      }}
                    />
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* Control Buttons end */}
        <div className="md:col-span-3">
          {/* Applicants and Workers Tab View */}
          <TabView>
            <TabPanel header="Pending">
              <div className="mt-4 border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
                {job?.applicants && job.applicants.length > 0 ? (
                  <div className="-ml-4 -mt-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
                    <div className="ml-4">
                      <p className="mt-1 text-sm text-gray-500">
                        You can reject the workers within X hours of the worker accepted the job. If no reject is done
                        in X hours then worker is automatically accepted and then the contract is created automatically.
                        you and applicant both are notified about the contract.
                      </p>
                    </div>
                    <div className="ml-4 mt-4 flex-shrink-0">
                      <Button label="Accept All" size="small" />
                    </div>
                  </div>
                ) : null}
                <ul className="divide-y divide-gray-100">
                  {job?.applicants && job.applicants.length > 0 ? (
                    job.applicants
                      .filter((applicant: any) => applicant.is_approved === false)
                      .map((applicant: any) => {
                        return (
                          <li key={applicant.user._id} className="relative flex flex-col justify-between gap-x-6 py-5 sm:flex-row">
                          <div className="flex min-w-0 gap-x-4">
                              <img
                                className="h-12 w-12 flex-none rounded-full bg-gray-50"
                                src={applicant.user.avatar}
                                alt=""
                              />
                              <div className="min-w-0 flex-auto">
                                <p className="text-sm font-semibold leading-6 text-gray-900">
                                  <span className="absolute inset-x-0 -top-px bottom-0" />
                                  {applicant.user.first_name} {applicant.user.last_name[0]}.
                                </p>
                                  <Rating value={3} readOnly cancel={false} />
                                <p className="mt-1 flex text-xs leading-5 text-gray-500"></p>
                              </div>
                            </div>
                            <div className="mt-4 flex shrink-0 flex-col items-center gap-x-4 sm:mt-0 sm:flex-row">
                              <div className="flex flex-row items-end">
                                <Button size="small" label="Accept" onClick={() => {handleAccept(applicant.user._id)}}/>
                                <Button size="small" label="Reject" severity="secondary" className="ml-2"  onClick={() => {handleReject(applicant.user._id)}}/>
                              </div>
                            </div>
                          </li>
                        )
                      })
                  ) : (
                    <p>There are no new applicants for this job.</p>
                  )}
                </ul>
              </div>
            </TabPanel>
            <TabPanel header="Accepted">
              <div className="mt-4 border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
                <div className="-ml-4 -mt-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
                  <div className="ml-4 mt-4">
                    <p className="mt-1 text-sm text-gray-500">
                      This is the list of all workers who have been accepted for this job.
                    </p>
                  </div>
                  <div className="ml-4 mt-4 flex-shrink-0"></div>
                </div>
                <ul className="divide-y divide-gray-100">
                  {job?.applicants ? (
                    job.applicants
                      .filter((applicant: any) => applicant.is_approved === true)
                      .map((applicant?: any) => {
                        return (
                          <li key={applicant.user._id} className="relative flex flex-col justify-between gap-x-6 py-5 sm:flex-row">
                          <div className="flex min-w-0 gap-x-4">
                              <img
                                className="h-12 w-12 flex-none rounded-full bg-gray-50"
                                src={applicant.user.avatar}
                                alt=""
                              />
                              <div className="min-w-0 flex-auto">
                                <p className="text-sm font-semibold leading-6 text-gray-900">
                                  <span className="absolute inset-x-0 -top-px bottom-0" />
                                  {applicant.user.first_name} {applicant.user.last_name[0]}.
                                  <Rating value={3} readOnly cancel={false} />
                                </p>
                                <p className="mt-1 flex text-xs leading-5 text-gray-500"></p>
                              </div>
                            </div>
                            <div className="mt-4 flex shrink-0 flex-col items-center gap-x-4 sm:mt-0 sm:flex-row">
                              <div className="flex flex-row items-end">
                                <Tag value="Accepted" severity="success" />
                              </div>
                            </div>
                          </li>
                        )
                      })
                  ) : (
                    <p>There are no new applicants for this job.</p>
                  )}
                </ul>
              </div>
            </TabPanel>
          </TabView>
        </div>
      </div>
    </>
  )
}
