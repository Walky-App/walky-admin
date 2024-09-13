import { useCallback, useEffect, useState } from 'react'

import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { Chip } from 'primereact/chip'
import { Divider } from 'primereact/divider'

import { GoogleMapComponent } from '../../../../components/shared/GoogleMap'
import { Feedback } from '../../../../components/shared/dialog/Feedback'
import { HtInfoTooltip } from '../../../../components/shared/general/HtInfoTooltip'
import { type ITimesheetWithJobAndShiftDetails } from '../../../../components/shared/timesheets/timesheetsUtils'
import { type IJobShiftDay, type IJob } from '../../../../interfaces/job'
import { type ITokenInfo } from '../../../../interfaces/services'
import { type Shifts } from '../../../../interfaces/shifts'
import { type ITimeSheet } from '../../../../interfaces/timesheet'
import { requestService } from '../../../../services/requestServiceNew'
import { useUtils } from '../../../../store/useUtils'
import { isTodaySameAsTimeStamp } from '../../../../utils/timeUtils'
import { GetTokenInfo } from '../../../../utils/tokenUtil'

export const SideRightCard = ({
  role,
  user,
  timesheets,
  setTimesheets,
  job,
  jobHasEnded,
  setJobHasEnded,
  userWorkingInThisJob,
}: {
  role: string
  user: ITokenInfo
  timesheets: ITimesheetWithJobAndShiftDetails[] | null
  setTimesheets: (timesheets: ITimesheetWithJobAndShiftDetails[] | null) => void
  job: IJob
  jobHasEnded: boolean
  setJobHasEnded: (hasEnded: boolean) => void
  userWorkingInThisJob: boolean
}) => {
  // const [currentDate, setCurrentDate] = useState(new Date())
  const [lastTimeSheet, setLastTimeSheet] = useState<ITimeSheet | null>(null)
  const [shiftId, setShiftId] = useState<{ isTodayShift: boolean; message: Shifts | string } | null>({
    isTodayShift: false,
    message: '',
  })
  const [idFeedback, setIdFeedback] = useState('')
  const [openFeedback, setOpenFeedback] = useState(false)
  const [isClockInOutLoading, setIsClockInOutLoading] = useState(false)
  const [isClockedIn, setIsClockedIn] = useState(false)
  const [prevIsClockedIn, setPrevIsClockedIn] = useState<boolean | null>(null)
  const [latitude, setLatitude] = useState<number>()
  const [longitude, setLongitude] = useState<number>()

  const { showToast } = useUtils()

  // const startTimer = () => {
  //   return setInterval(() => {
  //     setCurrentDate(new Date())
  //   }, 1000)
  // }

  useEffect(() => {
    const getLocation = () => {
      try {
        if (navigator.geolocation == null) {
          showToast({ severity: 'error', summary: 'Error', detail: 'Geolocation is not enabled on your browser' })
          return
        }
        navigator.geolocation.getCurrentPosition(position => {
          setLatitude(position.coords.latitude)
          setLongitude(position.coords.longitude)
        })
      } catch (error) {
        console.error(error)
      }
    }
    getLocation()
  }, [showToast])

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

  // useEffect(() => {
  //   let timer: NodeJS.Timeout | undefined

  //   if (userWorkingInThisJob) {
  //     timer = startTimer()
  //   }

  //   return () => {
  //     if (timer) {
  //       clearInterval(timer)
  //     }
  //   }
  // }, [job.applicants, userWorkingInThisJob])

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
        const data: ITimesheetWithJobAndShiftDetails[] = await response.json()

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
  }, [job?._id, setTimesheets, shiftId?.message, user._id])

  useEffect(() => {
    if (job) {
      // if (isUserApprovedApplicant()) {
      getCurrentJobTimeSheets()
      // }
    }
  }, [getCurrentJobTimeSheets, job])

  const getLatestTimeSheet = (array?: ITimeSheet[] | null) => {
    if (array?.length == null) {
      return null
    }

    const sortedTimesheets = [...array].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    return sortedTimesheets[0]
  }

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
        throw new Error(data.message)
      }

      const timeSheet: ITimeSheet = data
      setLastTimeSheet(timeSheet)

      if (
        !latestTimesheet ||
        !isTodaySameAsTimeStamp(latestTimesheet?.punches[latestTimesheet?.punches.length - 1]?.time_stamp)
      ) {
        setIsClockedIn(endpoint === 'clock-in')
      }

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
      setJobHasEnded(true)
      return { isTodayShift: false, message: `The job has already ended.` }
    }
    return { isTodayShift: false, message: 'No shifts available.' }
  }

  const handleFeedback = () => {
    setIdFeedback(job._id as string)
    setOpenFeedback(true)
  }

  return (
    <>
      <Card className="order-1 col-span-1">
        <div className="flex flex-col">
          <ul className="w-full divide-y divide-gray-200">
            {shiftId?.isTodayShift !== null && shiftId?.isTodayShift ? (
              <>
                {/* <li className="flex flex-col items-center justify-center gap-4 gap-y-4 px-6 py-4 md:flex-col">
                  <p className="text-2xl font-semibold">{currentDate.toLocaleTimeString()}</p>
                  <p className="font-medium">
                    {currentDate.toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </li> */}
                {userWorkingInThisJob ? (
                  isClockedIn ? (
                    <li className="flex items-center justify-center gap-4 px-6 py-4 md:flex-col">
                      <Button
                        label="Clock Out"
                        severity="warning"
                        onClick={() => clockInOut('clock-out')}
                        loading={isClockInOutLoading}
                        className="w-full"
                      />
                    </li>
                  ) : (
                    <li className="flex items-center justify-center gap-4 px-6 py-4 md:flex-col">
                      <Button
                        label="Clock In"
                        onClick={() => clockInOut('clock-in')}
                        loading={isClockInOutLoading}
                        className="w-full"
                      />
                    </li>
                  )
                ) : null}
              </>
            ) : (
              <li className="flex items-center justify-center gap-4 px-6 py-4 md:flex-col">
                {getShiftIdForToday(job.job_days).message as string}
              </li>
            )}
            {jobHasEnded ? (
              <li className="flex items-center justify-center gap-4 px-6 py-4 md:flex-col">
                <Button
                  label="Feedback"
                  severity="secondary"
                  style={{ width: '100%', height: '100%' }}
                  onClick={handleFeedback}
                />
              </li>
            ) : null}
          </ul>
          {userWorkingInThisJob || (role === 'admin' && job?.facility?.location_pin?.length > 0) ? (
            <div className="col-span-1 mt-2 h-64 md:col-span-1">
              <div className="flex h-full flex-row md:flex-col">
                <GoogleMapComponent
                  locationPin={job?.facility?.location_pin || []}
                  containerStyle={{ width: '100%', height: '100%' }}
                />
              </div>
            </div>
          ) : null}
          {userWorkingInThisJob ? (
            <div className="mt-6 flex flex-col md:flex-col">
              <div className="grid grid-cols-3">
                <div className="flex flex-col items-center justify-center gap-2">
                  {job.is_active ? <i className="pi pi-check" /> : <i className="pi pi-times-circle" />}
                  <div className="mt-0.5 flex flex-col gap-1">
                    <Chip
                      template={<span className="font-medium text-black">{job.is_active ? 'Active' : 'Disabled'}</span>}
                    />
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center gap-2">
                  {job.is_completed === false ? (
                    <i className="pi pi-calendar" />
                  ) : (
                    <i className="pi pi-calendar-times" />
                  )}
                  <div className="mt-0.5 flex flex-col gap-1">
                    <Chip
                      template={
                        <span className="font-medium text-black">
                          {job.is_completed === false ? 'Live' : 'Archived'}
                        </span>
                      }
                    />
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center gap-2">
                  {job.is_full === false ? <i className="pi pi-briefcase" /> : <i className="pi pi-ban" />}
                  <div className="mt-0.5 flex flex-col gap-1">
                    <Chip
                      template={
                        <span className="font-medium text-black">{job.is_full === false ? 'Open' : 'Full'}</span>
                      }
                    />
                  </div>
                </div>
              </div>
              <Divider />
              <div className="flex flex-col">
                <div className="flex flex-col">
                  {userWorkingInThisJob || (role === 'admin' && job.facility?.notes) ? (
                    <div className="flex flex-col space-y-2">
                      <HtInfoTooltip message="These notes will help you find your destination faster.">
                        <span className="text-base font-medium text-black">Arrival notes:</span>
                      </HtInfoTooltip>
                      <p>{job.facility.notes}</p>
                    </div>
                  ) : null}
                </div>
                <Divider />
                <div className="flex flex-col">
                  {userWorkingInThisJob || (role === 'admin' && job.job_tips.length > 0) ? (
                    <div className="flex flex-col space-y-2">
                      <HtInfoTooltip message="These tips will help you better prepare for the job">
                        <span className="text-base font-medium text-black">Job Tips:</span>
                      </HtInfoTooltip>
                      <ul>
                        {job.job_tips.map(tip => (
                          <li key={tip} className="list-inside list-disc">
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </Card>
      <Feedback isOpen={openFeedback} hidden={setOpenFeedback} objectId={idFeedback} jobId={job._id} />
    </>
  )
}
