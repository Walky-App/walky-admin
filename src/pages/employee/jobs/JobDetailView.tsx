import { useCallback, useEffect, useMemo, useState } from 'react'

import { useParams } from 'react-router-dom'

import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { Column } from 'primereact/column'
import { confirmDialog } from 'primereact/confirmdialog'
import { DataTable } from 'primereact/datatable'
import { Skeleton } from 'primereact/skeleton'
import { TabPanel, TabView } from 'primereact/tabview'

import { GoogleMapComponent } from '../../../components/shared/GoogleMap'
import { Feedback } from '../../../components/shared/dialog/Feedback'
import { HeadingComponent } from '../../../components/shared/general/HeadingComponent'
import { HtInfoTooltip } from '../../../components/shared/general/HtInfoTooltip'
import {
  type IPunchPairWithTotalTime,
  getAllPunches,
  sortPunches,
  createPunchPairsWithTotalTime,
} from '../../../components/shared/timesheets/timesheetsUtils'
import { type IJobShiftDay, type IJob } from '../../../interfaces/job'
import { type UserShiftsPopulate, type Shifts } from '../../../interfaces/shifts'
import { type ITimeSheet } from '../../../interfaces/timesheet'
import { RequestService } from '../../../services/RequestService'
import { requestService } from '../../../services/requestServiceNew'
import { useUtils } from '../../../store/useUtils'
import {
  isTodaySameAsTimeStamp,
  formatToDate,
  formatToTime,
  isValidDate,
  formatToLocalTime,
} from '../../../utils/timeUtils'
import { GetTokenInfo } from '../../../utils/tokenUtil'

export const JobDetailView = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isApplyForJobLoading, setIsApplyForJobLoading] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)
  const [hasDateIntersection, setHasDateIntersection] = useState(false)
  const [isClockInOutLoading, setIsClockInOutLoading] = useState(false)
  const [job, setJob] = useState<IJob | null>(null)
  const [shiftId, setShiftId] = useState<{ isTodayShift: boolean; message: Shifts | string } | null>(null)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isClockedIn, setIsClockedIn] = useState(false)
  const [prevIsClockedIn, setPrevIsClockedIn] = useState<boolean | null>(null)
  const [timesheets, setTimesheets] = useState<ITimeSheet[] | null>(null)
  const [lastTimeSheet, setLastTimeSheet] = useState<ITimeSheet | null>(null)
  const [openFeedback, setOpenFeedback] = useState(false)
  const [idFeedback, setIdFeedback] = useState('')
  const { showToast } = useUtils()
  const { id } = useParams()
  const user = GetTokenInfo()
  const userIsOnboarded = user?.onboarding?.completed

  const [latitude, setLatitude] = useState<number>()
  const [longitude, setLongitude] = useState<number>()
  const [error, setError] = useState<string>()

  useEffect(() => {
    let isMounted = true

    const getLocation = () => {
      if (navigator.geolocation == null) {
        setError('Geolocation is not supported by your browser')
        console.error(error)
        return
      }

      navigator.geolocation.getCurrentPosition(
        position => {
          if (isMounted) {
            setLatitude(position.coords.latitude)
            setLongitude(position.coords.longitude)
          }
        },
        error => {
          if (isMounted) {
            setError(error.message)
          }
        },
      )
    }

    getLocation()

    return () => {
      isMounted = false
    }
  }, [error])

  let earliestDate, latestDate

  if (job) {
    const dateTimes = job.job_dates.map(dateString => new Date(dateString).getTime())
    ;[earliestDate, latestDate] = [new Date(Math.min(...dateTimes)), new Date(Math.max(...dateTimes))]
  }

  const startTimer = () => {
    return setInterval(() => {
      setCurrentDate(new Date())
    }, 1000)
  }

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined
    if (job?.applicants[0]?.is_approved === true) {
      timer = startTimer()
    }

    return () => {
      if (timer) {
        clearInterval(timer)
      }
    }
  }, [job?.applicants])

  useEffect(() => {
    const getJob = async () => {
      try {
        const job: IJob = await RequestService(`jobs/${id}`)
        if (job._id) {
          setJob(job)
          getShiftIdForToday(job.job_days)
        } else {
          console.error('Job not found')
        }
      } catch (error) {
        console.error('Failed to fetch job:', error)
      } finally {
        setIsLoading(false)
        setIsApplyForJobLoading(false)
      }
    }

    getJob()
  }, [id])

  const getLatestTimeSheet = (array?: ITimeSheet[] | null) => {
    if (array?.length == null) {
      return null
    }

    const sortedTimesheets = [...array].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    return sortedTimesheets[0]
  }

  const getShiftIdForToday = (jobDays: IJobShiftDay[]): { isTodayShift: boolean; message: string | Shifts } => {
    const today = new Date().toISOString().split('T')[0]

    let upcomingDay: string | null = null
    let pastDay: string | null = null

    jobDays.sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime())

    for (let i = 0; i < jobDays.length; i++) {
      const jobDayDate = new Date(jobDays[i].day).toISOString().split('T')[0]
      if (jobDayDate === today) {
        setShiftId({ isTodayShift: true, message: jobDays[i].shifts_id })
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

  function getUserShiftsLengthByDate(dateString: string): UserShiftsPopulate[] {
    const [month, day, year] = dateString.split('/')
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    const formattedDate = date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
    const result = job?.job_days.find(jobDay => {
      const jobDate = new Date(jobDay.day)
      const formattedJobDate = jobDate.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
      return formattedJobDate === formattedDate
    })
    if (!result) return []
    return result.shifts_id?.user_shifts as UserShiftsPopulate[]
  }

  const getCurrentJobTimeSheets = useCallback(async () => {
    const { access_token } = GetTokenInfo()
    const url = `${process.env.REACT_APP_PUBLIC_API}/timesheets/employee/${user._id}?job_id=${job?._id}`

    const options: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
    }

    const getIdTimeSheetForToday = () => {
      const shift: Shifts = shiftId?.message as Shifts
      const userShift = shift.user_shifts?.find(us => us.user_id._id === user._id)
      return userShift ? (userShift.timesheet_id as string) : null
    }

    try {
      const response = await fetch(url, options)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      if (response.status !== 204) {
        const data: ITimeSheet[] = await response.json()

        const lastTimesheetId = getIdTimeSheetForToday()

        setTimesheets(data)

        if (lastTimesheetId) {
          const lastTimesheet = data.find(timesheet => timesheet._id === lastTimesheetId)
          if (lastTimesheet) {
            setIsClockedIn(
              lastTimesheet.is_clocked_in === true
                ? isTodaySameAsTimeStamp(lastTimesheet?.punches[lastTimesheet?.punches.length - 1]?.time_stamp)
                : false,
            )
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch timesheet:', error)
      setTimesheets(null)
    }
  }, [job?._id, shiftId?.message, user._id])

  const isUserApprovedApplicant = useCallback(() => {
    return job?.applicants.some(applicant => applicant.user._id === user._id && applicant.is_approved)
  }, [job?.applicants, user._id])

  useEffect(() => {
    if (job) {
      if (isUserApprovedApplicant()) {
        getCurrentJobTimeSheets()
      }
    }
  }, [getCurrentJobTimeSheets, isUserApprovedApplicant, job])

  const clockInOut = async (endpoint: string) => {
    setIsClockInOutLoading(true)
    const latestTimesheet = getLatestTimeSheet(timesheets)

    const timesheetId = latestTimesheet?._id ?? null
    try {
      const body = {
        job_id: job?._id,
        timesheet_id: timesheetId,
        location: [latitude, longitude],
      }
      const response: Response = await requestService({
        path: `timesheets/${endpoint}`,
        method: 'POST',
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error('Please enable location sharing in your browser in order to clock in.')
      }

      const timeSheet: ITimeSheet = data
      setLastTimeSheet(timeSheet)

      await getCurrentJobTimeSheets()
      showToast({ severity: 'success', summary: 'Success', detail: 'Clock in/out successful' })

      return timeSheet
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.'
      showToast({ severity: 'error', summary: 'Error', detail: errorMessage })
    } finally {
      setIsClockInOutLoading(false)
    }
  }

  useEffect(() => {
    if (prevIsClockedIn !== isClockedIn && lastTimeSheet) {
      const createdAt = new Date(lastTimeSheet?.punches[lastTimeSheet?.punches.length - 1]?.time_stamp)
      const formattedTime = createdAt.toLocaleTimeString()

      showToast({
        severity: isClockedIn ? 'success' : 'warn',
        summary: `Clocked ${isClockedIn ? 'in' : 'out'} at:`,
        detail: formattedTime,
        life: 3000,
      })
    }
    setPrevIsClockedIn(isClockedIn)
  }, [isClockedIn, showToast, lastTimeSheet, prevIsClockedIn])

  const clockIn = () => clockInOut('clock-in')
  const clockOut = () => clockInOut('clock-out')

  const applyForJob = async (userId: string) => {
    try {
      const applicant = {
        user: userId,
        is_approved: false,
        is_working: false,
      }
      const response = await fetch(`${process.env.REACT_APP_PUBLIC_API}/jobs/${id}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${GetTokenInfo().access_token}`,
        },
        body: JSON.stringify(applicant),
      })

      if (!response.ok) {
        const errorBody = await response.json()
        throw { status: response.status, message: errorBody.message }
      }

      showToast({ severity: 'success', summary: 'Success', detail: 'You have successfully applied for the job' })
      setIsApplyForJobLoading(true)
      setTimeout(() => {
        setIsApplyForJobLoading(false)
      }, 1500)
    } catch (error: unknown) {
      setIsApplyForJobLoading(false)
      if (typeof error === 'object' && error !== null && 'status' in error && 'message' in error) {
        const err = error as { status: number; message: string }
        if (err.status === 400) {
          setHasDateIntersection(true)
          showToast({
            severity: 'error',
            summary: 'Failed',
            detail: err.message,
          })
        }
      }
    }
  }

  const applyForDay = async (e: React.MouseEvent<HTMLButtonElement>, dateString: string) => {
    e.preventDefault()
    try {
      const [month, day, year] = dateString.split('/')
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
      const formattedDate = date.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
      const shift = job?.job_days.find(jobDay => {
        const jobDate = new Date(jobDay.day)
        const formattedJobDate = jobDate.toLocaleDateString('en-US', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
        return formattedJobDate === formattedDate
      })
      if (shift?.shifts_id.user_shifts?.length === job?.vacancy) {
        showToast({
          severity: 'error',
          summary: 'Failed',
          detail: 'This day is already full',
        })
        return
      }

      const response = await requestService({
        path: `shifts/apply-one/${shift?.shifts_id._id}`,
        method: 'PATCH',
        body: JSON.stringify({ userId: user._id, jobId: id }),
      })

      if (response.ok) {
        const data = await response.json()
        setJob(data)
        showToast({ severity: 'success', summary: 'Success', detail: 'You have successfully applied for day' })
        setIsApplyForJobLoading(true)
        setTimeout(() => {
          setIsApplyForJobLoading(false)
        }, 1500)
      }
    } catch (error: unknown) {
      setIsApplyForJobLoading(false)
      if (typeof error === 'object' && error !== null && 'status' in error && 'message' in error) {
        const err = error as { status: number; message: string }
        if (err.status === 400) {
          setHasDateIntersection(true)
          showToast({
            severity: 'error',
            summary: 'Failed',
            detail: err.message,
          })
        }
      }
    }
  }

  const punchPairsAndTotalTime: IPunchPairWithTotalTime[] = useMemo(() => {
    if (!timesheets) {
      return []
    }

    const allPunches = getAllPunches(timesheets)
    const sortedPunches = sortPunches(allPunches)

    return createPunchPairsWithTotalTime(sortedPunches)
  }, [timesheets])

  const handleFeedback = () => {
    setIdFeedback(id as string)
    setOpenFeedback(true)
  }

  const handleJobDropRequest = async (shiftId: string, userShiftId: string) => {
    try {
      const response = await requestService({
        path: `shifts/drop/${shiftId}`,
        method: 'PATCH',
        body: JSON.stringify({ userId: user._id, jobId: id, userShiftId: userShiftId }),
      })

      if (!response.ok) {
        throw new Error('Failed to drop the shift')
      }

      const data = await response.json()
      setJob(data)

      showToast({ severity: 'success', summary: 'Confirmed', detail: 'You have Dropped the Shift', life: 3000 })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.'
      showToast({ severity: 'error', summary: 'Error', detail: errorMessage, life: 3000 })
    }
  }

  const reject = () => {
    showToast({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 })
  }

  const handleJobDrop = (e: React.MouseEvent<HTMLButtonElement>, shiftId: string, userShiftId: string) => {
    e.preventDefault()
    confirmDialog({
      message: () => (
        <>
          <h2 className="text-lg font-medium">If you drop the shift within 24hours of Shift start time</h2>
          <p className="text-lg font-medium">your account will marked down with 1 strike</p>
          <p className="text-lg font-medium">( 2 strikes and your account will be suspended! ☹️ )</p>
        </>
      ),
      header: 'Drop Shift?',
      icon: 'pi pi-info-circle',
      defaultFocus: 'reject',
      acceptClassName: 'p-button-danger',
      accept: () => handleJobDropRequest(shiftId, userShiftId),
      reject,
    })
  }

  const scheduleListTemplate = (job: IJob) => {
    return (
      <table className="min-w-full divide-y divide-gray-300">
        <thead>
          <tr>
            <th scope="col" className="py-3.5 pl-4 pr-3 text-left sm:pl-0">
              Shifts
            </th>
            <th scope="col" className="px-3 py-3.5 text-left">
              Date
            </th>
            <th scope="col" className="py-3.5 pl-4 pr-3 text-left sm:pl-0">
              Day of Week
            </th>

            <th scope="col" className="relative py-3.5 pl-3 pr-4 text-right sm:pr-0">
              Pick up Shifts
              <span className="sr-only">Edit</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {job.job_days.map((eachShift, index) => {
            const dateObj = new Date(eachShift.day)
            const formattedDate = dateObj.toLocaleDateString()
            const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'long' })

            const getUserShiftsIdByUserId = (userId: string) => {
              return eachShift?.shifts_id?.user_shifts?.find(shift => shift.user_id._id === userId)?._id
            }

            return (
              <tr key={eachShift.day.toString()}>
                <td>{index + 1}</td>
                <td className="whitespace-nowrap px-3 py-4 text-lg font-medium">{formattedDate}</td>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-lg font-medium sm:pl-0">
                  <time dateTime={eachShift.day.toString()} className="w-28 flex-none">
                    {dayOfWeek}
                  </time>
                </td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right sm:pr-0">
                  <a href="/">
                    {getUserShiftsLengthByDate(formattedDate).length === job.vacancy ? (
                      <div>
                        {getUserShiftsLengthByDate(formattedDate).some(shift => shift.user_id._id === user._id) ? (
                          <p>Shift Claimed</p>
                        ) : (
                          <p>Vacancy completed</p>
                        )}
                      </div>
                    ) : (
                      <div>
                        {getUserShiftsLengthByDate(formattedDate).some(shift => shift.user_id._id === user._id) ? (
                          <>
                            <p className="flex justify-end text-sm">
                              <HtInfoTooltip
                                className="mr-2"
                                message={`If you drop the shift within 24hours of Shift start time \n your account will marked down with 1 strike \n ( 2 strikes and account will be suspended )`}
                              />
                              Shift Confirmed
                            </p>
                            <Button
                              onClick={e =>
                                handleJobDrop(e, eachShift.shifts_id._id, getUserShiftsIdByUserId(user._id) ?? '')
                              }
                              severity="danger"
                              label="Drop Shift"
                              icon="pi pi-times"
                            />
                          </>
                        ) : (
                          <Button label="Pickup Shift" onClick={e => applyForDay(e, formattedDate)} />
                        )}
                      </div>
                    )}
                  </a>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }

  const timesheetTableTemplate = (punchPairsAndTotalTime: IPunchPairWithTotalTime[]) => {
    return (
      <>
        <h2 className="text-base font-semibold leading-6 text-gray-900">Timesheet</h2>
        <DataTable value={punchPairsAndTotalTime} stripedRows paginator rows={7} rowsPerPageOptions={[7, 14, 30]}>
          <Column
            field="punchIn.time_stamp"
            header="Date"
            body={(rowData: IPunchPairWithTotalTime) =>
              isValidDate(rowData.punchIn.time_stamp) ? formatToDate(rowData.punchIn.time_stamp) : 'No Timestamp'
            }
          />
          <Column header="Time In" body={rowData => formatToTime(rowData.punchIn.time_stamp)} />
          <Column
            header="Time Out"
            body={(rowData: IPunchPairWithTotalTime) =>
              rowData.punchOut
                ? formatToTime(rowData.punchOut.time_stamp)
                : isTodaySameAsTimeStamp(rowData.punchIn.time_stamp)
                  ? 'Clocked In'
                  : 'Clock Out not recorded'
            }
          />
          <Column header="Total Time" body={(rowData: IPunchPairWithTotalTime) => rowData.totalTime ?? ''} />
        </DataTable>
      </>
    )
  }

  const facilityImagesTemplate = (job: IJob) => {
    return (
      <>
        <h2 className="text-base font-semibold leading-6 text-gray-900">Facility Images</h2>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
          {job?.facility?.images?.map(image => (
            <li key={image._id} className="relative">
              <div className="aspect-h-7 aspect-w-10 group block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-green-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
                <img src={image.url} alt="" className="pointer-events-none h-80 object-cover group-hover:opacity-75" />
              </div>
            </li>
          ))}
        </ul>
      </>
    )
  }

  return (
    <div className="">
      {/* <BreadCrumbs/> */}
      <HeadingComponent title="Job Details" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {job ? (
          <>
            {/* Job Card Start*/}
            <div className="col-span-1 md:col-span-3">
              <Card
                className="p-6"
                title={
                  <>
                    <div className="flex items-center">
                      <i className="pi pi-users" />
                      <div className="mb-2 ml-1 mt-2 text-sm text-stone-500">
                        {job.applicants.length} / {job.vacancy} Slots
                      </div>
                    </div>
                    {!isUserApprovedApplicant() ? job.title : null} #{job.uid}
                  </>
                }>
                {/* Job Facility */}
                <div className="mr-8 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex">
                    {isUserApprovedApplicant() && job.facility?.main_image ? (
                      <div className="max-w-screen-xl">
                        <img
                          className="mb-2 mr-8 h-32 w-32 flex-none rounded-lg bg-gray-50 object-cover"
                          src={job.facility?.main_image}
                          alt="Missing Facility"
                        />
                      </div>
                    ) : null}

                    <div className="align-center flex flex-col items-start justify-start gap-1">
                      {isUserApprovedApplicant() ? (
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
                {/* Divider */}
                <hr className="mb-3 mt-3 h-px w-full bg-zinc-100" />
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
                  </div>
                </div>
                {/* Arrival Notes */}
                {isUserApprovedApplicant() && job.facility?.notes ? (
                  <>
                    <hr className="mb-3 mt-3 h-px w-full bg-zinc-100" />
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-start gap-2">
                        <i className="pi pi-info-circle" />
                        <span className="text-base font-medium text-black">
                          Arrival notes: <span className="font-normal">{job.facility.notes}</span>
                        </span>
                      </div>
                    </div>
                  </>
                ) : null}
                {/* Job Tips */}
                {isUserApprovedApplicant() && job.job_tips ? (
                  <>
                    <hr className="mb-3 mt-3 h-px w-full bg-zinc-100" />
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-start gap-2">
                        <i className="pi pi-info-circle" />
                        <span className="text-base font-medium text-black">
                          Job Tips:
                          <ul className="font-normal">
                            {job.job_tips.map((tip, index) => (
                              <li key={index}>{tip}</li>
                            ))}
                          </ul>
                        </span>
                      </div>
                    </div>
                  </>
                ) : null}
                {/* Divider */}
                <hr className="mt-3" />
                <div className="mt-6 flex justify-between text-lg">
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
                <section className="mt-12">{scheduleListTemplate(job)}</section>
              </Card>
            </div>

            {/* Job Card End*/}

            {/* Clock in and Map */}
            {isLoading ? (
              <Skeleton shape="rectangle" height="150px" />
            ) : isUserApprovedApplicant() ? (
              <div className="col-span-1 md:col-span-1">
                <div className="flex flex-col">
                  <div className="flex w-full flex-col items-center justify-center overflow-hidden rounded-md bg-white shadow">
                    <ul className="w-full divide-y divide-gray-200">
                      {shiftId?.isTodayShift ? (
                        <>
                          <li className="flex flex-col items-center justify-center gap-4 gap-y-4 px-6 py-4 md:flex-col">
                            <p className="text-2xl font-semibold">{currentDate.toLocaleTimeString()}</p>
                            <p className="font-medium">
                              {currentDate.toLocaleDateString('en-US', {
                                weekday: 'short',
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </p>
                          </li>
                          {isClockedIn ? (
                            <li className="flex items-center justify-center gap-4 px-6 py-4 md:flex-col">
                              <Button
                                label="Clock Out"
                                severity="warning"
                                onClick={() => clockOut()}
                                loading={isClockInOutLoading}
                                className="w-full"
                              />
                            </li>
                          ) : (
                            <li className="flex items-center justify-center gap-4 px-6 py-4 md:flex-col">
                              <Button
                                label="Clock In"
                                onClick={() => clockIn()}
                                loading={isClockInOutLoading}
                                className="w-full"
                              />
                            </li>
                          )}
                        </>
                      ) : (
                        <li className="flex items-center justify-center gap-4 px-6 py-4 md:flex-col">
                          {getShiftIdForToday(job.job_days).message as string}
                        </li>
                      )}

                      <li className="flex items-center justify-center gap-4 px-6 py-4 md:flex-col">
                        <Button
                          label="Feedback"
                          severity="secondary"
                          style={{ width: '100%', height: '100%' }}
                          onClick={handleFeedback}
                        />
                      </li>
                    </ul>
                  </div>
                  {job?.facility.location_pin[0] && job?.facility.location_pin[1] ? (
                    <div className="col-span-1 mt-2 h-64 md:col-span-1">
                      <div className="flex h-full flex-row md:flex-col">
                        <GoogleMapComponent
                          locationPin={job.facility.location_pin}
                          containerStyle={{ width: '100%', height: '100%' }}
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : (
              <>
                <div className="col-span-1 md:col-span-1">
                  <div className="flew-row flex md:flex-col">
                    <div className="flex w-full flex-col items-center justify-center overflow-hidden rounded-md bg-white shadow">
                      <ul className="w-full divide-y divide-gray-200">
                        <li className="flex items-center justify-center gap-4 px-6 py-4 md:flex-col">
                          {isUserApprovedApplicant() ? (
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
                </div>
                <div className="col-span-1 md:col-span-3">
                  <TabView className="mt-4">
                    <TabPanel header="Timesheet">
                      <section className="mt-4">{timesheetTableTemplate(punchPairsAndTotalTime)}</section>
                    </TabPanel>
                    <TabPanel header="Facility Images">
                      <section className="mt-4">{facilityImagesTemplate(job)}</section>
                    </TabPanel>
                  </TabView>
                </div>
              </>
            )}
          </>
        ) : (
          <Skeleton shape="rectangle" height="150px" />
        )}
      </div>
      <Feedback isOpen={openFeedback} hidden={setOpenFeedback} objectId={idFeedback} job_id={id} />
    </div>
  )
}
