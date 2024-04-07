import { useCallback, useEffect, useMemo, useState } from 'react'

import { useParams } from 'react-router-dom'

import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Skeleton } from 'primereact/skeleton'
import { TabPanel, TabView } from 'primereact/tabview'
import { ToggleButton } from 'primereact/togglebutton'

import { GoogleMapComponent } from '../../../components/shared/GoogleMap'
import { HeaderComponent } from '../../../components/shared/general/HeaderComponent'
import { type IJob } from '../../../interfaces/job'
import { type ITimeSheet } from '../../../interfaces/timesheet'
import { RequestService } from '../../../services/RequestService'
import { useUtils } from '../../../store/useUtils'
import { GetTokenInfo } from '../../../utils/TokenUtils'

export const JobDetailView = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isApplyForJobLoading, setIsApplyForJobLoading] = useState(false)
  const [isClockInOutLoading, setIsClockInOutLoading] = useState(false)
  const [job, setJob] = useState<IJob | null>(null)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isClockedIn, setIsClockedIn] = useState(false)
  const [timesheet, setTimesheet] = useState<ITimeSheet | null>(null)
  const [checked, setChecked] = useState(true)
  const { showToast } = useUtils()
  const { id } = useParams()
  const user = GetTokenInfo()

  const [latitude, setLatitude] = useState<number>()
  const [longitude, setLongitude] = useState<number>()
  const [error, setError] = useState<string>()

  useEffect(() => {
    let isMounted = true // This flag is used to prevent state updates after unmount

    const getLocation = () => {
      if (!navigator.geolocation) {
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
        const job = await RequestService(`jobs/${id}`)
        if (job) {
          setJob(job)
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

  const getCurrentJobTimeSheet = useCallback(async () => {
    const { access_token } = GetTokenInfo()
    const url = `${process.env.REACT_APP_PUBLIC_API}/timesheets/employee/${user._id}?job_id=${job?._id}`

    const options: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
    }

    try {
      const response = await fetch(url, options)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      if (response.status === 204) {
        setTimesheet(null)
      } else {
        const data = await response.json()
        setTimesheet(data)
        setIsClockedIn(data.is_clocked_in)
      }
    } catch (error) {
      console.error('Failed to fetch timesheet:', error)
      setTimesheet(null)
    }
  }, [job?._id, user._id])

  useEffect(() => {
    if (job?.applicants[0]?.is_approved === true && user._id) {
      getCurrentJobTimeSheet()

      if (timesheet?.is_clocked_in) {
        setIsClockedIn(true)
      }
    }
  }, [user._id, job?.applicants, isClockedIn, getCurrentJobTimeSheet, timesheet?.is_clocked_in])

  const clockInOut = async (endpoint: string, clockedIn: boolean) => {
    setIsClockInOutLoading(true)
    const timesheetId = timesheet?._id || null
    try {
      const body = {
        job_id: job?._id,
        timeSheet_id: timesheetId,
        location: [latitude, longitude],
      }
      const timeSheet: ITimeSheet = await RequestService(`timesheets/${endpoint}`, 'POST', body)
      setIsClockedIn(clockedIn)

      const createdAt = new Date(timeSheet?.punches[timeSheet?.punches.length - 1]?.time_stamp)
      const formattedTime = createdAt.toLocaleTimeString()

      showToast({
        severity: clockedIn ? 'success' : 'warn',
        summary: `Clocked ${clockedIn ? 'in' : 'out'} at:`,
        detail: formattedTime,
        life: 3000,
      })
      setIsClockInOutLoading(false)
    } catch (error) {
      console.error(error)
    }
  }

  const clockIn = () => clockInOut('clock-in', true)
  const clockOut = () => clockInOut('clock-out', false)

  const applyForJob = async (userId: string) => {
    try {
      const applicant = {
        user: userId,
        is_approved: false,
        is_working: false,
      }
      await RequestService(`jobs/${id}/apply`, 'POST', applicant)
      setIsApplyForJobLoading(true)
      showToast({ severity: 'success', summary: 'Success', detail: 'You have successfully applied for the job' })
    } catch (error) {
      console.error(error)
    }
  }

  const isValidDate = (dateString: string): boolean => {
    const date = new Date(dateString)
    return !isNaN(date.getTime())
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }
  function formatTime(timeStamp: string | number) {
    const date = new Date(timeStamp)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
  }

  const formatDuration = (milliseconds: number): string => {
    const hours = Math.floor(milliseconds / 3600000)
    const minutes = Math.floor((milliseconds % 3600000) / 60000)
    const seconds = Math.floor((milliseconds % 60000) / 1000)
    return `${hours}h ${minutes}m ${seconds}s`
  }

  const punchPairsAndTotalTime = useMemo(() => {
    if (!timesheet?.punches) {
      return []
    }

    const sortedPunches = [...timesheet.punches].sort(
      (a, b) => new Date(a.time_stamp).getTime() - new Date(b.time_stamp).getTime(),
    )

    const pairs = []
    let punchIn = null
    for (const punch of sortedPunches) {
      if (punch.punch_in) {
        punchIn = punch
      } else if (punchIn) {
        const totalTime = Date.parse(punch.time_stamp) - Date.parse(punchIn.time_stamp)
        pairs.push({ punchIn, punchOut: punch, totalTime: formatDuration(totalTime) })
        punchIn = null
      }
    }

    if (punchIn) {
      pairs.push({ punchIn, punchOut: null, totalTime: undefined })
    }

    return pairs.reverse()
  }, [timesheet])

  return (
    <div className="mx-auto px-2 sm:px-6 lg:px-2">
      {/* <BreadCrumbs /> */}
      <HeaderComponent title="Job Detail" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {job ? (
          <>
            {/* Job Card Start*/}
            <div className="col-span-1 md:col-span-3">
              <Card
                title={
                  <>
                    <div className="flex items-center">
                      <i className="pi pi-users" />
                      <div className="mb-2 ml-1 mt-2 text-sm font-normal text-stone-500">
                        {job.applicants.length} / {job.vacancy} Applicants
                      </div>
                    </div>
                    {!job?.applicants.some(applicant => applicant.user._id === user._id && applicant.is_approved)
                      ? job.title
                      : null}
                  </>
                }>
                {/* Job Facility */}
                <div className="mr-8 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex">
                    {job?.applicants.some(applicant => applicant.user._id === user._id && applicant.is_approved) &&
                    job.facility?.main_image ? (
                      <div className="max-w-screen-xl">
                        <img
                          className="mb-2 mr-8 h-32 w-32 flex-none rounded-lg bg-gray-50 object-cover"
                          src={job.facility?.main_image}
                          alt="Missing Facility"
                        />
                      </div>
                    ) : null}

                    <div className="align-center flex flex-col items-start justify-start gap-1">
                      {job?.applicants.some(applicant => applicant.user._id === user._id && applicant.is_approved) ? (
                        <>
                          <div className="flex items-center text-2xl font-bold">{job.title}</div>
                          <div className="flex items-center">
                            <i className="pi pi-building" />
                            <div className="ml-2 text-base font-normal text-black">{job.facility.name}</div>
                          </div>

                          <div className="flex items-center">
                            <i className="pi pi-directions" />
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job.facility.address)}`}
                              target="_blank"
                              rel="noopener noreferrer">
                              <div className="ml-2 text-base font-normal text-black">{job.facility.address}</div>
                            </a>{' '}
                          </div>
                        </>
                      ) : null}
                      <div className="flex items-center">
                        <i className="pi pi-map-marker" />
                        <div className="ml-2 text-base font-normal text-black">
                          {job.facility.city}, {job.facility.state}, {job.facility.zip}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Divider */}
                <hr className="mb-3 mt-3 h-px w-full bg-zinc-100" />
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-start gap-2">
                    {job.is_active ? <i className="pi pi-check" /> : <i className="pi pi-times-circle" />}
                    <div className="mt-0.5 flex flex-col gap-1">
                      <span className="text-sm font-medium text-black">{job.is_active ? 'Active' : 'Disabled'}</span>
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
                {/* Arrival Notes */}
                {job?.applicants.some(applicant => applicant.user._id === user._id && applicant.is_approved) &&
                job.facility?.notes ? (
                  <>
                    <hr className="mb-3 mt-3 h-px w-full bg-zinc-100" />
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-start gap-2">
                        <i className="pi pi-info-circle" />
                        <span className="text-base font-medium text-black">Arrival notes: {job.facility.notes}</span>
                      </div>
                    </div>
                  </>
                ) : null}
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
                    <div className="text-sm font-normal text-stone-500">Total Hours per day</div>
                    <div className="text-sm font-normal text-black">{job.total_hours} hours </div>
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
            </div>

            {/* Job Card End*/}

            {/* Clock in and Map */}
            {isLoading ? (
              <Skeleton shape="rectangle" height="150px" />
            ) : job?.applicants[0]?.is_approved === true ? (
              <div className="col-span-1 md:col-span-1">
                <div className="flex flex-col">
                  <div className="flex w-full flex-col items-center justify-center overflow-hidden rounded-md bg-white shadow">
                    <ul className="w-full divide-y divide-gray-200">
                      <li className="flex flex-col items-center justify-center gap-4 gap-y-4 px-6 py-4 md:flex-col">
                        <p className="text-2xl font-semibold">{currentDate.toLocaleTimeString()}</p>
                        <p className="text-sm font-medium">
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
                            severity="danger"
                            onClick={() => clockOut()}
                            loading={isClockInOutLoading}
                            className="w-full"
                          />
                        </li>
                      ) : (
                        <li className="flex items-center justify-center gap-4 px-6 py-4 md:flex-col">
                          <Button
                            label="Clock In"
                            severity="success"
                            onClick={() => clockIn()}
                            loading={isClockInOutLoading}
                            className="w-full"
                          />
                        </li>
                      )}
                    </ul>
                  </div>
                  {job?.facility.location_pin[0] && job?.facility.location_pin[1] ? (
                    <div className="mt-2">
                      <GoogleMapComponent
                        locationPin={job.facility.location_pin}
                        containerStyle={{ width: '380px', height: '380px' }}
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            ) : (
              <div className="col-span-1 md:col-span-1">
                <div className="flew-row flex md:flex-col">
                  <div className="flex w-full flex-col items-center justify-center overflow-hidden rounded-md bg-white shadow">
                    <ul className="w-full divide-y divide-gray-200">
                      <li className="flex items-center justify-center gap-4 px-6 py-4 md:flex-col">
                        {job?.applicants.some(applicant => applicant.user._id === user._id && applicant.is_approved) ? (
                          <p>You have been accepted!</p>
                        ) : job?.applicants.some(
                            applicant => applicant.user._id === user._id && applicant.rejection_reason !== '',
                          ) ? (
                          <p>We are sorry. It was not a match. Please apply later.</p>
                        ) : job?.applicants.some(applicant => applicant.user._id === user._id) ? (
                          <p>Your application is pending. Please wait for response.</p>
                        ) : (
                          <Button
                            label="Apply now"
                            onClick={() => applyForJob(user._id)}
                            style={{ width: '100%', height: '100%' }}
                            loading={isApplyForJobLoading}
                          />
                        )}
                      </li>

                      <li className="flex items-center justify-center gap-4 px-6 py-4 md:flex-col">
                        <p className="py-4 sm:flex">Do you have someone who might be interested in this job?</p>
                        <Button
                          label="Share Opportunity"
                          severity="secondary"
                          style={{ width: '100%', height: '100%' }}
                        />
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Tabs Start */}
            <div className="col-span-1 md:col-span-3">
              <TabView className="mt-4">
                <TabPanel header="Schedule">
                  <ToggleButton
                    checked={checked}
                    onChange={e => setChecked(e.value)}
                    onLabel="Close Schedule"
                    offLabel="Open Schedule"
                    onIcon="pi pi-times"
                    offIcon="pi pi-check"
                    className="w-8rem mt-2"
                  />
                  {checked ? (
                    <section className="mt-12">
                      <h2 className="text-base font-semibold leading-6 text-gray-900">
                        Schedule ({job.job_dates.length} days)
                      </h2>
                      <ol className="mt-2 divide-y divide-gray-200 text-sm leading-6 text-gray-500">
                        {job.job_dates.map((date, index) => {
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
                </TabPanel>
                {job?.applicants.some(applicant => applicant.user._id === user._id && applicant.is_approved) ? (
                  <TabPanel header="Timesheet">
                    <section className="mt-4">
                      <h2 className="text-base font-semibold leading-6 text-gray-900">Timesheet</h2>
                      <DataTable
                        value={punchPairsAndTotalTime}
                        stripedRows
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25, 50]}>
                        <Column
                          field="punchIn.time_stamp"
                          header="Date"
                          body={rowData =>
                            isValidDate(rowData.punchIn.time_stamp)
                              ? formatDate(rowData.punchIn.time_stamp)
                              : 'Invalid Date'
                          }
                        />
                        <Column header="Time In" body={rowData => formatTime(rowData.punchIn.time_stamp)} />
                        <Column
                          header="Time Out"
                          body={rowData => (rowData.punchOut ? formatTime(rowData.punchOut.time_stamp) : 'Clocked In')}
                        />
                        <Column header="Total Time" body={rowData => rowData.totalTime || ''} />
                      </DataTable>
                    </section>
                  </TabPanel>
                ) : null}
                {job?.applicants.some(applicant => applicant.user._id === user._id && applicant.is_approved) ? (
                  <TabPanel header="Facility Images">
                    <section className="mt-4">
                      <h2 className="text-base font-semibold leading-6 text-gray-900">Facility Images</h2>
                      <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
                        {job?.facility?.images?.map(image => (
                          <li key={image._id} className="relative">
                            <div className="aspect-h-7 aspect-w-10 group block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-green-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
                              <img
                                src={image.url}
                                alt=""
                                className="pointer-events-none h-80 object-cover group-hover:opacity-75"
                              />
                            </div>
                          </li>
                        ))}
                      </ul>
                    </section>
                  </TabPanel>
                ) : null}
              </TabView>
            </div>
          </>
        ) : (
          <Skeleton shape="rectangle" height="150px" />
        )}
      </div>
    </div>
  )
}
