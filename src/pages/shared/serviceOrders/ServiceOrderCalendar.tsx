import { useEffect, useMemo, useState } from 'react'

import { Link } from 'react-router-dom'

import {
  startOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  endOfWeek,
  subMonths,
  addMonths,
  isToday,
  getMonth,
  format,
} from 'date-fns'
import { formatInTimeZone, format as formatTz } from 'date-fns-tz'
import { Button } from 'primereact/button'

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'

import { HTLoadingLogo } from '../../../components/shared/HTLoadingLogo'
import { type IFacility } from '../../../interfaces/facility'
import { type IServiceOrder } from '../../../interfaces/serviceOrder'
import { cn } from '../../../utils/cn'

interface IEvent {
  id: string
  name: string
  time: string
  datetime: string
  uid: string
  color: string
  facility_id: IFacility
  status: string
  service_order_id: string
}

interface IDayWithDetails {
  formattedDate: string
  isWithinSelectedMonth?: boolean
  isToday?: boolean
  isSelected?: boolean
  events: IEvent[]
}

export const ServiceOrderCalendar = ({ serviceOrders }: { serviceOrders: IServiceOrder[] }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const [daysWithDetails, setDaysWithDetails] = useState<IDayWithDetails[]>([])

  const calendarDays = useMemo(() => {
    const firstWeekStart = startOfWeek(startOfMonth(selectedMonth))
    const lastWeekEnd = endOfWeek(endOfMonth(selectedMonth))
    return eachDayOfInterval({ start: firstWeekStart, end: lastWeekEnd })
  }, [selectedMonth])

  function getRandomLightColor(): string {
    const hue = Math.floor(Math.random() * 36) * 10 // Step size of 10 degrees
    const saturation = Math.floor(Math.random() * 20) + 80 // 80% to 100%
    const lightness = Math.floor(Math.random() * 20) + 70 // 70% to 90%
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`
  }

  useEffect(() => {
    const newDays: IDayWithDetails[] = calendarDays.map(day => {
      return {
        formattedDate: format(day, 'yyyy-MM-dd'),
        isWithinSelectedMonth: getMonth(day) === getMonth(selectedMonth),
        isToday: isToday(day),
        isSelected: true,
        events: [],
      }
    })
    const jobColorMapping: Record<string, string> = {}

    for (const job of serviceOrders) {
      for (const jobDate of job?.job_id?.job_dates ?? []) {
        const formattedJobDate = format(jobDate, 'yyyy-MM-dd')
        const day = newDays.find(day => day.formattedDate === formattedJobDate)

        if (day) {
          let jobStartTime
          let jobColor
          try {
            jobStartTime = `${formatInTimeZone(job.job_id?.start_time, job.job_id?.facility?.timezone, 'hh:mm a')} (${formatTz(new Date(), 'zzz', { timeZone: job.job_id?.facility?.timezone })})`
            const jobId = job?.job_id?._id
            if (jobId && !jobColorMapping[jobId]) {
              jobColorMapping[jobId] = getRandomLightColor()
            }
            jobColor = jobColorMapping[jobId] || ''
          } catch (error) {
            console.error(error)
            jobStartTime = ''
            jobColor = ''
          }

          day.events.push({
            id: job?.job_id?._id,
            name: job?.job_id?.title,
            time: jobStartTime,
            datetime: jobDate,
            uid: job?.job_id?.uid,
            color: jobColor,
            facility_id: job?.facility_id,
            status: job?.status,
            service_order_id: job?._id,
          })
        }
      }
    }

    setDaysWithDetails(newDays)
  }, [calendarDays, serviceOrders, selectedMonth])

  const daysWithJobs = daysWithDetails.map(day => {
    const jobsForDay = serviceOrders.filter(job => job?.job_id?.job_dates.includes(day.formattedDate))

    const jobEvents = jobsForDay.map(job => {
      return {
        id: job?.job_id?._id,
        name: job?.job_id?.title,
        time: job?.job_id?.start_time,
        datetime: job?.job_id?.job_dates[0],
        uid: job?.job_id?.uid,
        color: '',
        facility_id: job?.facility_id,
        status: job?.status,
        service_order_id: job?._id,
      }
    })

    return {
      ...day,
      events: [...day.events, ...jobEvents],
    }
  })

  function formatDate(date: Date, options?: Intl.DateTimeFormatOptions) {
    return new Intl.DateTimeFormat(undefined, options).format(date)
  }

  return serviceOrders.length === 0 ? (
    <HTLoadingLogo />
  ) : (
    <div className="lg:flex lg:h-full lg:flex-col">
      <header className="flex items-center justify-between border-b border-gray-200 py-4 pl-2 lg:flex-none">
        <h1 className="text-base font-semibold leading-6 text-gray-900">
          <time
            dateTime={formatDate(selectedMonth, {
              month: 'long',
              year: 'numeric',
            })}>
            {formatDate(selectedMonth, { month: 'long', year: 'numeric' })}
          </time>
        </h1>
        <div className="flex items-center">
          <div className="relative flex items-center rounded-md shadow-sm md:items-stretch">
            <button
              type="button"
              onClick={() => {
                setSelectedMonth(m => subMonths(m, 1))
              }}
              className="flex h-9 w-12 items-center justify-center rounded-l-md border-y border-l border-gray-300 pr-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pr-0 md:hover:bg-gray-50">
              <span className="sr-only">Previous month</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <span className="relative -mx-px h-5 w-px bg-gray-300 md:hidden" />
            <button
              type="button"
              onClick={() => setSelectedMonth(new Date())}
              className="h-9 border-y border-gray-300 px-3.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:relative md:block">
              Today
            </button>
            <span className="relative -mx-px h-5 w-px bg-gray-300 md:hidden" />
            <button
              type="button"
              onClick={() => {
                setSelectedMonth(m => addMonths(m, 1))
              }}
              className="flex h-9 w-12 items-center justify-center rounded-r-md border-y border-r border-gray-300 pl-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pl-0 md:hover:bg-gray-50">
              <span className="sr-only">Next month</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Day column headings */}
      <div className="shadow ring-1 ring-black ring-opacity-5 lg:flex lg:flex-auto lg:flex-col">
        <div className="grid grid-cols-7 gap-px border-b border-gray-300 bg-gray-200 text-center text-xs font-semibold leading-6 text-gray-700 lg:flex-none">
          <div className="bg-white py-2">
            S<span className="sr-only sm:not-sr-only">un</span>
          </div>
          <div className="bg-white py-2">
            M<span className="sr-only sm:not-sr-only">on</span>
          </div>
          <div className="bg-white py-2">
            T<span className="sr-only sm:not-sr-only">ue</span>
          </div>
          <div className="bg-white py-2">
            W<span className="sr-only sm:not-sr-only">ed</span>
          </div>
          <div className="bg-white py-2">
            T<span className="sr-only sm:not-sr-only">hu</span>
          </div>
          <div className="bg-white py-2">
            F<span className="sr-only sm:not-sr-only">ri</span>
          </div>
          <div className="bg-white py-2">
            S<span className="sr-only sm:not-sr-only">at</span>
          </div>
        </div>

        <div className="flex bg-gray-100 text-xs leading-6 text-gray-700 lg:flex-auto">
          <div className="hidden w-full lg:grid lg:grid-cols-7 lg:grid-rows-5 lg:gap-px">
            {daysWithJobs.map(day => {
              return (
                <div
                  key={day.formattedDate}
                  className={cn(
                    day.isWithinSelectedMonth ? 'bg-white' : 'bg-gray-50 text-gray-500',
                    'relative px-3 py-2 lg:min-h-28',
                  )}>
                  <time
                    dateTime={day.formattedDate}
                    className={
                      day.isToday
                        ? 'flex h-6 w-6 items-center justify-center rounded-full bg-primary font-semibold text-white'
                        : undefined
                    }>
                    {day.formattedDate.split('-').pop()?.replace(/^0/, '')}
                  </time>
                  {day.events.length > 0 ? (
                    <ol className="mt-2">
                      {day.events.map(event => {
                        return (
                          <li
                            key={event.id}
                            style={{ backgroundColor: event.status === 'authorized' ? event.color : '#93939363' }}>
                            <Link to={`${event.service_order_id}`} className="group flex">
                              <Button size="small" link raised className="flex w-full flex-col items-start">
                                <p className="text-left text-gray-900   group-hover:underline">
                                  <p className="mb-2 border-b-2 border-gray-900/10 font-bold">JOB #{event.uid}</p>
                                  <p>{event.facility_id?.name}</p>
                                  <p className="flex items-center">
                                    <i className="pi pi-briefcase mr-2" /> <span>{event.name}</span>{' '}
                                  </p>
                                  <p className="flex items-center">
                                    <i className="pi pi-clock mr-2" /> <span>{event.time} </span>
                                  </p>
                                  {event.status !== 'authorized' ? (
                                    <span className="font-bold">Not Authorized</span>
                                  ) : null}
                                </p>
                              </Button>
                            </Link>
                          </li>
                        )
                      })}
                    </ol>
                  ) : null}
                </div>
              )
            })}
          </div>
        </div>
      </div>
      {daysWithJobs.length > 0 ? (
        <div className="mx-auto max-w-lg py-10 sm:px-6 lg:hidden">this view is only available on desktop</div>
      ) : null}
    </div>
  )
}
