import { useEffect, useMemo, useState } from 'react'

import { Link, useNavigate } from 'react-router-dom'

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

import { ChevronLeftIcon, ChevronRightIcon, ClockIcon, CalendarIcon } from '@heroicons/react/20/solid'

import { HTLoadingLogo } from '../../../components/shared/HTLoadingLogo'
import { requestService } from '../../../services/requestServiceNew'
import { cn } from '../../../utils/cn'
import { roleChecker } from '../../../utils/roleChecker'
import { type IShift } from './MyJobs'

interface IEvent {
  id: string
  name: string
  time: string
  datetime: string
}

interface IDayWithDetails {
  formattedDate: string
  isWithinSelectedMonth?: boolean
  isToday?: boolean
  isSelected?: boolean
  events: IEvent[]
}

export const JobCalendar = ({ employeeId }: { employeeId: string }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const [jobs, setJobs] = useState<IShift[]>([])
  const [loading, setLoading] = useState(false)

  const [daysWithDetails, setDaysWithDetails] = useState<IDayWithDetails[]>([])

  const navigate = useNavigate()
  const role = roleChecker()

  const calendarDays = useMemo(() => {
    const firstWeekStart = startOfWeek(startOfMonth(selectedMonth))
    const lastWeekEnd = endOfWeek(endOfMonth(selectedMonth))
    return eachDayOfInterval({ start: firstWeekStart, end: lastWeekEnd })
  }, [selectedMonth])

  useEffect(() => {
    setLoading(true)
    const getJobs = async () => {
      try {
        const response = await requestService({ path: `shifts/by-employee/${employeeId}` })
        if (response.ok) {
          const allJobs = await response.json()
          setJobs(allJobs)
          setLoading(false)
        }
      } catch (error) {
        console.error('Failed to fetch jobs:', error)
      }
    }
    getJobs()
  }, [employeeId])

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

    for (const job of jobs) {
      for (const jobDate of job?.job_id?.job_dates ?? []) {
        const formattedJobDate = format(jobDate, 'yyyy-MM-dd')
        const day = newDays.find(day => day.formattedDate === formattedJobDate)

        if (day) {
          let jobStartTime
          try {
            jobStartTime = `${formatInTimeZone(job.job_id?.start_time, job.job_id?.facility?.timezone, 'hh:mm a')} (${formatTz(new Date(), 'zzz', { timeZone: job.job_id?.facility?.timezone })})`
          } catch (error) {
            console.error(error)
            jobStartTime = ''
          }

          day.events.push({
            id: job?.job_id?._id,
            name: job?.job_id?.title,
            time: jobStartTime,
            datetime: jobDate,
          })
        }
      }
    }

    setDaysWithDetails(newDays)
  }, [calendarDays, jobs, selectedMonth])

  const daysWithJobs = daysWithDetails.map(day => {
    const jobsForDay = jobs.filter(job => job?.job_id?.job_dates.includes(day.formattedDate))

    const jobEvents = jobsForDay.map(job => ({
      id: job?.job_id?._id,
      name: job?.job_id?.title,
      time: job?.job_id?.start_time,
      datetime: job?.job_id?.job_dates[0],
    }))

    return {
      ...day,
      events: [...day.events, ...jobEvents],
    }
  })

  const renderEventListItems = () => {
    return daysWithJobs.map(day => {
      return day.events.map(event => {
        return (
          <li key={event.id} className="group flex p-2 sm:p-4">
            <div className="flex-auto">
              <p className={cn('font-semibold text-gray-900', { 'text-primary': day.isToday })}>{event.name}</p>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-y-2 text-gray-700 sm:justify-between">
                <div className="gap-x-2 gap-y-2 xs:gap-x-6 sm:justify-around">
                  <span className="flex items-center">
                    <CalendarIcon
                      className={cn('mr-2 h-5 w-5 text-gray-400', { 'text-primary': day.isToday })}
                      aria-hidden="true"
                    />
                    {format(event.datetime, 'PPPP')}
                    {day.isToday ? ' (Today)' : ''}
                  </span>
                  <time dateTime={event.datetime} className="flex items-center">
                    <ClockIcon
                      className={cn('mr-2 h-5 w-5 text-gray-400', { 'text-primary': day.isToday })}
                      aria-hidden="true"
                    />
                    {event.time}
                  </time>
                </div>
                <Button
                  size="small"
                  link
                  outlined
                  label="View Details"
                  onClick={() => navigate(`/${role}/jobs/${event.id}`)}
                />
              </div>
            </div>
          </li>
        )
      })
    })
  }

  function formatDate(date: Date, options?: Intl.DateTimeFormatOptions) {
    return new Intl.DateTimeFormat(undefined, options).format(date)
  }

  return loading ? (
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
          <div className="relative flex items-center rounded-md bg-white shadow-sm md:items-stretch">
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
          {/*Calendar (Desktop View) */}
          <div className="hidden w-full lg:grid lg:grid-cols-7 lg:grid-rows-5 lg:gap-px">
            {daysWithJobs.map(day => (
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
                    {day.events.map(event => (
                      <li key={event.id}>
                        <Link to={`/${role}/jobs/${event.id}`} className="group flex">
                          <Button size="small" link raised className="flex w-full flex-col items-start">
                            <p className="flex-auto text-left font-medium text-gray-900  group-hover:text-primary group-hover:underline">
                              {event.name} @ {event.time}
                            </p>
                          </Button>
                        </Link>
                      </li>
                    ))}
                  </ol>
                ) : null}
              </div>
            ))}
          </div>
          {/* Mobile View */}
          <div className="isolate grid w-full grid-cols-7 grid-rows-5 gap-px lg:hidden">
            {daysWithJobs.map(day => (
              <button
                key={day.formattedDate}
                type="button"
                className={cn('flex h-14 flex-col px-3 py-2 focus:z-10', {
                  'bg-white': day.isWithinSelectedMonth,
                  'bg-gray-50': !day.isWithinSelectedMonth,
                  'font-semibold': day.isToday,
                  'text-white': day.isToday,
                  'text-gray-900': day.isWithinSelectedMonth && !day.isToday,
                  'text-gray-500': !day.isWithinSelectedMonth && !day.isToday,
                })}>
                <time
                  dateTime={day.formattedDate}
                  className={cn('ml-auto', {
                    'flex h-6 w-6 items-center justify-center rounded-full': day.isSelected,
                    'bg-primary': day.isSelected && day.isToday,
                  })}>
                  {day.formattedDate.split('-').pop()?.replace(/^0/, '')}
                </time>
                <span className="sr-only">{day.events.length} events</span>
                {day.events.length > 0 ? (
                  <span className="-mx-0.5 mt-auto flex flex-wrap-reverse">
                    {day.events.map(event => (
                      <span key={event.id} className="mx-0.5 mb-1 h-1.5 w-1.5 rounded-full bg-gray-400" />
                    ))}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </div>
      </div>
      {daysWithJobs.length > 0 ? (
        <div className="mx-auto max-w-lg py-10 sm:px-6 lg:hidden">
          <ol className="divide-y divide-gray-100 overflow-hidden rounded-lg bg-white text-sm shadow ring-1 ring-black ring-opacity-5">
            {renderEventListItems()}
          </ol>
        </div>
      ) : null}
    </div>
  )
}
