import { useEffect, useState } from 'react'

import { Link, useNavigate } from 'react-router-dom'

import { Button } from 'primereact/button'

import { ChevronLeftIcon, ChevronRightIcon, ClockIcon, CalendarIcon } from '@heroicons/react/20/solid'

import { type IJob } from '../../../interfaces/job'
import { cn } from '../../../utils/cn'
import { formatToLocalTime } from '../../../utils/timeUtils'

interface IEvent {
  id: string
  name: string
  time: string
  datetime: string
}

interface IDay {
  date: string
  isCurrentMonth?: boolean
  isToday?: boolean
  isSelected?: boolean
  events: IEvent[]
}

interface Props {
  jobs: IJob[]
}

export const JobCalendar: React.FC<Props> = ({ jobs }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  const [days, setDays] = useState<IDay[]>([])

  const navigate = useNavigate()

  useEffect(() => {
    const firstDay = new Date(currentYear, currentMonth, 1)
    const lastDay = new Date(currentYear, currentMonth + 1, 0)

    const newDays: IDay[] = []
    for (let day = firstDay; day <= lastDay; day.setDate(day.getDate() + 1)) {
      newDays.push({
        date: day.toISOString().split('T')[0],
        isCurrentMonth: true,
        events: [],
      })
    }

    for (const job of jobs) {
      for (const jobDate of job.job_dates) {
        const day = newDays.find(day => day.date === jobDate.split('T')[0])

        if (day) {
          let jobStartTime
          try {
            jobStartTime = formatToLocalTime(job.start_time)
          } catch (error) {
            console.error(error)
            jobStartTime = ''
          }

          day.events.push({
            id: job._id,
            name: job.title,
            time: jobStartTime,
            datetime: jobDate,
          })
        }
      }
    }

    setDays(newDays)
  }, [currentMonth, currentYear, jobs])

  const isToday = (date: string) => {
    const today = new Date()

    const [year, month, day] = date.split('-').map(Number)
    const d = new Date(year, month - 1, day)

    return (
      d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear()
    )
  }

  const handleToday = () => {
    const today = new Date()
    setCurrentMonth(today.getMonth())
    setCurrentYear(today.getFullYear())
  }

  const handlePreviousMonth = () => {
    setCurrentMonth(currentMonth - 1)
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    }
  }

  const handleNextMonth = () => {
    setCurrentMonth(currentMonth + 1)
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    }
  }
  const daysWithJobs = days.map(day => {
    const jobsForDay = jobs.filter(job => job.job_dates.includes(day.date))

    const jobEvents = jobsForDay.map(job => ({
      id: job._id,
      name: job.title,
      time: job.start_time,
      datetime: job.job_dates[0],
    }))

    return {
      ...day,
      events: [...day.events, ...jobEvents],
    }
  })

  const renderEventListItems = () => {
    return daysWithJobs.map(day => {
      const { events } = day

      return events.map(event => {
        const { id, name, datetime } = event
        const date = new Date(datetime)
        const formattedDate = date.toLocaleDateString()

        return (
          <li key={id} className="group flex p-2 focus-within:bg-gray-50 hover:bg-gray-50 sm:p-4">
            <div className="flex-auto">
              <p className="font-semibold text-gray-900">{name}</p>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-y-2 text-gray-700 sm:justify-between">
                <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-2 xs:gap-x-6 sm:justify-around">
                  <time dateTime={datetime} className="flex items-center">
                    <ClockIcon className="mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                    {event.time}
                  </time>
                  <span className="flex items-center">
                    <CalendarIcon className="mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                    {formattedDate}
                  </span>
                </div>
                <Button
                  size="small"
                  link
                  outlined
                  label="View Details"
                  onClick={() => navigate(`/employee/jobs/${event.id}`)}
                />
              </div>
            </div>
          </li>
        )
      })
    })
  }

  return (
    <div className="lg:flex lg:h-full lg:flex-col">
      <header className="flex items-center justify-between border-b border-gray-200 py-4 pl-2 lg:flex-none">
        <h1 className="text-base font-semibold leading-6 text-gray-900">
          <time
            dateTime={`${currentYear}-${currentMonth + 1}`}>{`${new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} ${currentYear}`}</time>
        </h1>
        <div className="flex items-center">
          <div className="relative flex items-center rounded-md bg-white shadow-sm md:items-stretch">
            <button
              type="button"
              onClick={handlePreviousMonth}
              className="flex h-9 w-12 items-center justify-center rounded-l-md border-y border-l border-gray-300 pr-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pr-0 md:hover:bg-gray-50">
              <span className="sr-only">Previous month</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <span className="relative -mx-px h-5 w-px bg-gray-300 md:hidden" />
            <button
              type="button"
              onClick={handleToday}
              className="h-9 border-y border-gray-300 px-3.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:relative md:block">
              Today
            </button>
            <span className="relative -mx-px h-5 w-px bg-gray-300 md:hidden" />
            <button
              type="button"
              onClick={handleNextMonth}
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
          <div className="bg-white py-2">
            S<span className="sr-only sm:not-sr-only">un</span>
          </div>
        </div>

        <div className="flex bg-gray-100 text-xs leading-6 text-gray-700 lg:flex-auto">
          {/*Calendar (Desktop View) */}
          <div className="hidden w-full lg:grid lg:grid-cols-7 lg:grid-rows-5 lg:gap-px">
            {daysWithJobs.map(day => (
              <div
                key={day.date}
                className={cn(
                  day.isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-500',
                  'relative px-3 py-2 lg:min-h-28',
                )}>
                <time
                  dateTime={day.date}
                  className={
                    isToday(day.date)
                      ? 'flex h-6 w-6 items-center justify-center rounded-full bg-primary font-semibold text-white'
                      : undefined
                  }>
                  {day.date.split('-').pop()?.replace(/^0/, '')}
                </time>
                {day.events.length > 0 ? (
                  <ol className="mt-2">
                    {day.events.slice(0, 2).map(event => (
                      <li key={event.id}>
                        <Link to={`/employee/jobs/${event.id}`} className="group flex">
                          <Button size="small" link raised className="flex flex-col 2xl:flex-row">
                            <p className="flex-auto text-nowrap font-medium text-gray-900  group-hover:text-primary group-hover:underline">
                              {event.name}
                            </p>
                            <time
                              dateTime={event.datetime}
                              className="hidden flex-none text-gray-500 lg:block 2xl:ml-3">
                              {event.time}
                            </time>
                          </Button>
                        </Link>
                      </li>
                    ))}
                    {day.events.length > 2 ? <li className="text-gray-500">+ {day.events.length - 2} more</li> : null}
                  </ol>
                ) : null}
              </div>
            ))}
          </div>
          {/* Mobile View */}
          <div className="isolate grid w-full grid-cols-7 grid-rows-5 gap-px lg:hidden">
            {daysWithJobs.map(day => (
              <button
                key={day.date}
                type="button"
                className={cn('flex h-14 flex-col px-3 py-2 focus:z-10', {
                  'bg-white': day.isCurrentMonth,
                  'bg-gray-50': !day.isCurrentMonth,
                  'font-semibold': day.isSelected || day.isToday,
                  'text-white': day.isSelected,
                  'text-indigo-600': !day.isSelected && day.isToday,
                  'text-gray-900': !day.isSelected && day.isCurrentMonth && !day.isToday,
                  'text-gray-500': !day.isSelected && !day.isCurrentMonth && !day.isToday,
                })}>
                <time
                  dateTime={day.date}
                  className={cn('ml-auto', {
                    'flex h-6 w-6 items-center justify-center rounded-full': day.isSelected,
                    'bg-indigo-600': day.isSelected && day.isToday,
                    'bg-gray-900': day.isSelected && !day.isToday,
                  })}>
                  {day.date.split('-').pop()?.replace(/^0/, '')}
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
