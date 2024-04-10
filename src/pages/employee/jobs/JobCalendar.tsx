import { Fragment, useEffect, useState } from 'react'

import { Link } from 'react-router-dom'

import { Menu, Transition } from '@headlessui/react'
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/20/solid'

import { type IJob } from '../../../interfaces/job'
import { cn } from '../../../utils/cn'

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
  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  const [days, setDays] = useState<IDay[]>([])

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

    // Iterate over all jobs
    for (const job of jobs) {
      // Iterate over all job_dates of the current job
      for (const jobDate of job.job_dates) {
        // Find the day object for the current job_date
        const day = newDays.find(day => day.date === jobDate.split('T')[0])

        // If the day object exists, push the job to its events
        if (day) {
          day.events.push({
            id: job._id,
            name: job.title,
            time: new Date(jobDate).toLocaleTimeString(),
            datetime: jobDate,
          })
        }
      }
    }

    setDays(newDays)
  }, [currentMonth, currentYear, jobs])

  const isToday = (date: string) => {
    const today = currentDate
    const d = new Date(date)

    return (
      d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear()
    )
  }

  const handleToday = () => {
    const today = new Date()
    setCurrentMonth(today.getMonth())
    setCurrentYear(today.getFullYear())
    setCurrentDate(today)
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
    // Find jobs for the current day
    const jobsForDay = jobs.filter(job => job.job_dates.includes(day.date))

    // Map jobs to events
    const jobEvents = jobsForDay.map(job => ({
      id: job._id,
      name: job.title,
      time: job.start_time,
      datetime: job.job_dates[0],
    }))

    // Return the day with the job events added to the events array
    return {
      ...day,
      events: [...day.events, ...jobEvents],
    }
  })

  const selectedDay = daysWithJobs.find(day => day.isSelected)

  return (
    <div className="lg:flex lg:h-full lg:flex-col">
      <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4 lg:flex-none">
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
            <button
              type="button"
              onClick={handleToday}
              className="hidden border-y border-gray-300 px-3.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:relative md:block">
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
          {/* Desktop View */}
          <div className="hidden md:ml-4 md:flex md:items-center">
            <Menu as="div" className="relative">
              <Menu.Button
                type="button"
                className="flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                Month view
                <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95">
                <Menu.Items className="absolute right-0 z-10 mt-3 w-36 origin-top-right overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          type="button"
                          className={cn(
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'block px-4 py-2 text-sm',
                          )}>
                          Day view
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          type="button"
                          className={cn(
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'block px-4 py-2 text-sm',
                          )}>
                          Week view
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          type="button"
                          className={cn(
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'block px-4 py-2 text-sm',
                          )}>
                          Month view
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          type="button"
                          className={cn(
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'block px-4 py-2 text-sm',
                          )}>
                          Year view
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
          {/* Mobile View */}
          <Menu as="div" className="relative ml-6 md:hidden">
            <Menu.Button className="-mx-2 flex items-center rounded-full border border-transparent p-2 text-gray-400 hover:text-gray-500">
              <span className="sr-only">Open menu</span>
              <EllipsisHorizontalIcon className="h-5 w-5" aria-hidden="true" />
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95">
              <Menu.Items className="absolute right-0 z-10 mt-3 w-36 origin-top-right divide-y divide-gray-100 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        type="button"
                        className={cn(
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                          'block px-4 py-2 text-sm',
                        )}>
                        Create event
                      </button>
                    )}
                  </Menu.Item>
                </div>
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        type="button"
                        className={cn(
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                          'block px-4 py-2 text-sm',
                        )}>
                        Go to today
                      </button>
                    )}
                  </Menu.Item>
                </div>
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        type="button"
                        className={cn(
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                          'block px-4 py-2 text-sm',
                        )}>
                        Day view
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        type="button"
                        className={cn(
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                          'block px-4 py-2 text-sm',
                        )}>
                        Week view
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        type="button"
                        className={cn(
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                          'block px-4 py-2 text-sm',
                        )}>
                        Month view
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        type="button"
                        className={cn(
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                          'block px-4 py-2 text-sm',
                        )}>
                        Year view
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </header>
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
        <div className="flex bg-gray-200 text-xs leading-6 text-gray-700 lg:flex-auto">
          {/* Desktop View */}
          <div className="hidden w-full lg:grid lg:grid-cols-7 lg:grid-rows-6 lg:gap-px">
            {daysWithJobs.map(day => (
              <div
                key={day.date}
                className={cn(day.isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-500', 'relative px-3 py-2')}>
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
                          <p className="flex-auto truncate font-medium text-gray-900 group-hover:text-primary">
                            {event.name}
                          </p>
                          <time
                            dateTime={event.datetime}
                            className="ml-3 hidden flex-none text-gray-500 group-hover:text-primary xl:block">
                            {event.time}
                          </time>
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
          <div className="isolate grid w-full grid-cols-7 grid-rows-6 gap-px lg:hidden">
            {daysWithJobs.map(day => (
              <button
                key={day.date}
                type="button"
                className={cn('flex h-14 flex-col px-3 py-2 hover:bg-gray-100 focus:z-10', {
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
      {selectedDay && selectedDay.events.length > 0 ? (
        <div className="px-4 py-10 sm:px-6 lg:hidden">
          <ol className="divide-y divide-gray-100 overflow-hidden rounded-lg bg-white text-sm shadow ring-1 ring-black ring-opacity-5">
            {selectedDay.events.map(event => (
              <li key={event.id} className="group flex p-4 pr-6 focus-within:bg-gray-50 hover:bg-gray-50">
                <div className="flex-auto">
                  <p className="font-semibold text-gray-900">{event.name}</p>
                  <time dateTime={event.datetime} className="mt-2 flex items-center text-gray-700">
                    <ClockIcon className="mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                    {event.time}
                  </time>
                </div>
                {/* <a
                  href={event.href}
                  className="ml-6 flex-none self-center rounded-md bg-white px-3 py-2 font-semibold text-gray-900 opacity-0 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400 focus:opacity-100 group-hover:opacity-100">
                  Edit<span className="sr-only">, {event.name}</span>
                </a> */}
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </div>
  )
}
