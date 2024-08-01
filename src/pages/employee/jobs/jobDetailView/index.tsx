import { useEffect, useState } from 'react'

import { useParams } from 'react-router-dom'

import { Card } from 'primereact/card'
import { Divider } from 'primereact/divider'
import { Skeleton } from 'primereact/skeleton'

import { HeadingComponent } from '../../../../components/shared/general/HeadingComponent'
import { type IJob, type IJobShiftDay } from '../../../../interfaces/job'
import { type Shifts } from '../../../../interfaces/shifts'
import { type ITimeSheet } from '../../../../interfaces/timesheet'
import { requestService } from '../../../../services/requestServiceNew'
import { useUtils } from '../../../../store/useUtils'
import { roleChecker } from '../../../../utils/roleChecker'
import { formatToLocalTime } from '../../../../utils/timeUtils'
import { GetTokenInfo } from '../../../../utils/tokenUtil'
import { JobDetailBottomComponents } from './BottomComponents'
import { ShiftsTable } from './ShiftsTable'
import { SideRightCard } from './SideRightCard'

export const JobDetailView = () => {
  const [job, setJob] = useState<IJob | null>(null)
  const [userWorkingInThisJob, setUserWorkingInThisJob] = useState<boolean>(false)
  const [, setIsLoading] = useState(true)
  const [, setHasDateIntersection] = useState(false)
  const [jobHasEnded, setJobHasEnded] = useState(false)
  const [timesheets, setTimesheets] = useState<ITimeSheet[] | null>(null)
  const [employeeActive, setEmployeeActive] = useState<boolean>(true)

  const { id } = useParams()
  const user = GetTokenInfo()
  const { showToast } = useUtils()
  const role = roleChecker()

  let earliestDate, latestDate

  if (job) {
    const dateTimes = job.job_dates.map(dateString => new Date(dateString).getTime())
    ;[earliestDate, latestDate] = [new Date(Math.min(...dateTimes)), new Date(Math.max(...dateTimes))]
  }

  useEffect(() => {
    const getJob = async () => {
      try {
        const response = await requestService({ path: `jobs/${id}` })

        if (response.ok) {
          const job = await response.json()
          const handleIsUserWorkingThisJob = () => {
            return job?.job_days.some((day: IJobShiftDay) =>
              day?.shifts_id?.user_shifts?.some(shift => shift.user_id._id === user._id),
            )
          }
          getShiftIdForToday(job.job_days)
          setUserWorkingInThisJob(handleIsUserWorkingThisJob() || false)
          setJob(job)

          const user_active = await requestService({ path: `users/${user._id}` })
          if (user_active.ok) {
            const user_data = await user_active.json()

            if (user_data.active && user_data.is_approved === false) {
              setEmployeeActive(false)
            } else {
              setEmployeeActive(true)
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch job:', error)
        showToast({ severity: 'error', summary: 'Error', detail: 'Failed to fetch job' })
      } finally {
        //@ts-ignore
        setIsLoading(false)
      }
    }

    getJob()
  }, [id, showToast, user._id])

  const getShiftIdForToday = (jobDays: IJobShiftDay[]): { isTodayShift: boolean; message: string | Shifts } => {
    const today = new Date().toISOString().split('T')[0]

    let upcomingDay: string | null = null
    let pastDay: string | null = null

    jobDays.sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime())

    for (let i = 0; i < jobDays.length; i++) {
      const jobDayDate = new Date(jobDays[i].day).toISOString().split('T')[0]
      if (jobDayDate === today) {
        // setShiftId({ isTodayShift: true, message: jobDays[i].shifts_id })
        return { isTodayShift: true, message: jobDays[i].shifts_id }
      } else if (jobDayDate > today) {
        if (!upcomingDay || jobDayDate < upcomingDay) {
          upcomingDay = jobDayDate
        }
        if (i > 0) {
          const previousDayDate = new Date(jobDays[i - 1].day).toISOString().split('T')[0]
          if (previousDayDate < today && jobDayDate > today) {
            return { isTodayShift: false, message: `There is no work today. The next shift is on ${jobDayDate}.` }
          }
        }
      } else if (jobDayDate < today) {
        if (!pastDay || jobDayDate > pastDay) {
          pastDay = jobDayDate
        }
      }
    }
    if (upcomingDay) {
      return { isTodayShift: false, message: `There are still days left until your job starts on ${upcomingDay}.` }
    }
    if (pastDay) {
      return { isTodayShift: false, message: `The job has already ended.` }
    }
    return { isTodayShift: false, message: 'No shifts available.' }
  }

  return (
    <div>
      {/* <BreadCrumbs/> */}
      <HeadingComponent title="Job Details" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {job ? (
          <>
            <div className="order-2 col-span-1 md:order-1 md:col-span-3">
              <Card
                className="md:p-6"
                title={
                  <>
                    <div className="flex items-center">
                      <i className="pi pi-users" />
                      <div className="mb-2 ml-1 mt-2 text-sm text-stone-500">
                        {job.job_days.length * job.vacancy} Shifts
                      </div>
                    </div>
                    {userWorkingInThisJob || role === 'admin' ? job.title : null} #{job.uid}
                  </>
                }>
                {/* Job Facility */}
                <div className="mr-8 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex">
                    {userWorkingInThisJob || (role === 'admin' && job.facility?.main_image) ? (
                      <div className="max-w-screen-xl">
                        <img
                          className="mb-2 mr-8 h-32 w-32 flex-none rounded-lg bg-gray-50 object-cover"
                          src={job.facility?.main_image}
                          alt="Missing Facility"
                        />
                      </div>
                    ) : null}

                    <div className="align-center flex flex-col items-start justify-start gap-1">
                      {userWorkingInThisJob || role === 'admin' ? (
                        <>
                          <div className="flex items-center text-2xl font-bold">{job.title}</div>
                          <div className="flex items-center">
                            <i className="pi pi-building" />
                            <h2 className="ml-2 text-xl ">{job.facility.name}</h2>
                          </div>

                          <div className="flex items-center">
                            <i className="pi pi-directions" />
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job.facility.address)}`}
                              target="_blank"
                              rel="noopener noreferrer">
                              <div className="ml-2 text-xl underline">{job.facility.address}</div>
                            </a>
                          </div>
                        </>
                      ) : null}
                      <div className="flex items-center">
                        <i className="pi pi-map-marker" />
                        <div className="ml-2 text-xl">
                          {job.facility.city}, {job.facility.state}, {job.facility.zip}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <Divider />
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    {job.is_active ? <i className="pi pi-check" /> : <i className="pi pi-times-circle" />}
                    <div className="mt-0.5 flex flex-col gap-1">
                      <span className="font-medium text-black">{job.is_active ? 'Active' : 'Disabled'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {job.is_completed === false ? (
                      <i className="pi pi-calendar" />
                    ) : (
                      <i className="pi pi-calendar-times" />
                    )}
                    <div className="mt-0.5 flex flex-col gap-1">
                      <span className="font-medium text-black">{job.is_completed === false ? 'Live' : 'Archived'}</span>
                    </div>
                  </div>
                  <div className="mt-0.5 flex items-center gap-2">
                    {job.is_full === false ? <i className="pi pi-briefcase" /> : <i className="pi pi-ban" />}
                    <div className="font-medium text-black">{job.is_full === false ? 'Open' : 'Full'}</div>
                    {userWorkingInThisJob || (role === 'admin' && job.facility?.notes) ? (
                      <>
                        <i className="pi pi-info-circle" />
                        <span className="text-base font-medium text-black">
                          Arrival notes: <span className="font-normal">{job.facility.notes}</span>
                        </span>
                      </>
                    ) : null}
                    {userWorkingInThisJob || (role === 'admin' && job.job_tips.length > 0) ? (
                      <>
                        <i className="pi pi-info-circle" />
                        <span className="text-base font-medium text-black">Job Tips:</span>
                        {job.job_tips.map((tip, index) => (
                          <span key={index}>{tip}</span>
                        ))}
                      </>
                    ) : null}
                  </div>
                </div>

                <Divider />
                <div className="mt-6 justify-between text-lg md:flex">
                  <div className="flex flex-col items-start justify-start gap-1 border-l-[1px] border-zinc-100 pl-3">
                    <div className="text-stone-500">Job Dates</div>
                    <div className="flex items-center">
                      <i className="pi pi-calendar-times" />
                      {earliestDate?.toLocaleDateString()} &nbsp; - &nbsp; {latestDate?.toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex flex-col items-start justify-start gap-1 border-l-[1px] border-zinc-100 pl-3">
                    <div className="text-stone-500">Job Start / End Time</div>
                    {formatToLocalTime(job.start_time)} &nbsp; - &nbsp; {formatToLocalTime(job.end_time)}
                  </div>
                  <div className="flex flex-col items-start justify-start gap-1 border-l-[1px] border-zinc-100 pl-3">
                    <div className="text-stone-500">Lunch Breaks</div>
                    <div>{job.lunch_break === 0 ? 'No' : job.lunch_break + ' Minutes'}</div>
                  </div>
                  <div className="flex flex-col items-start justify-start gap-1 border-l-[1px] border-zinc-100 pl-3">
                    <div className="text-stone-500">Total Hours</div>
                    <div>{job.total_hours * job.job_dates.length} approx</div>
                  </div>
                  <div className="flex flex-col items-start justify-start gap-1 border-l-[1px] border-zinc-100 pl-3">
                    <div className="text-stone-500">Rate</div>
                    <strong>{job.hourly_rate || 0} USD / hour</strong>
                  </div>
                </div>
                <ShiftsTable
                  job={job}
                  setJob={setJob}
                  user={user}
                  setHasDateIntersection={setHasDateIntersection}
                  jobHasEnded={jobHasEnded}
                  setUserWorkingInThisJob={setUserWorkingInThisJob}
                  employeeActive={employeeActive}
                />
              </Card>
              <JobDetailBottomComponents timesheets={timesheets} job={job} />
            </div>
            <SideRightCard
              role={role}
              user={user}
              timesheets={timesheets}
              setTimesheets={setTimesheets}
              job={job}
              jobHasEnded={jobHasEnded}
              setJobHasEnded={setJobHasEnded}
              userWorkingInThisJob={userWorkingInThisJob}
            />

            {/* <div className="col-span-1 md:col-span-1">
              <div className="flew-row flex md:flex-col">
                <div className="flex w-full flex-col items-center justify-center overflow-hidden rounded-md bg-white shadow">
                  <ul className="w-full divide-y divide-gray-200">
                    <li className="flex items-center justify-center gap-4 px-6 py-4 md:flex-col">
                      {userWorkingInThisJob ? (
                        <p>You have been accepted!</p>
                      ) : job?.applicants.some(
                          applicant => applicant.user._id === user._id && applicant.rejection_reason !== '',
                        ) ? (
                        <p>We are sorry. It was not a match. Please apply later.</p>
                      ) : job?.applicants.some(applicant => applicant.user._id === user._id) ? (
                        <p>Your application is pending. Please wait for response.</p>
                      ) : (
                        <Button
                          label={
                            !userIsOnboarded
                              ? 'Apply now'
                              : hasApplied && !hasDateIntersection
                                ? 'Application sent'
                                : !hasDateIntersection
                                  ? 'Apply now'
                                  : 'You are already booked for another job that overlaps with this one.'
                          }
                          disabled={!userIsOnboarded || hasApplied}
                          onClick={() => {
                            applyForJob(user._id)
                            setHasApplied(true)
                          }}
                          style={{ width: '100%', height: '100%' }}
                          loading={isApplyForJobLoading}
                        />
                      )}
                    </li>
                  </ul>
                </div>
              </div>
            </div> */}
          </>
        ) : (
          <Skeleton shape="rectangle" height="150px" />
        )}
      </div>
    </div>
  )
}
