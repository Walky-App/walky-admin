import { useEffect, useRef } from 'react'

import { startOfWeek, subWeeks, endOfWeek, eachDayOfInterval, format } from 'date-fns'

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, EllipsisHorizontalIcon } from '@heroicons/react/20/solid'

export const DashboardOpenShifts = ({ openShifts }: { openShifts: any }) => {
  const container = useRef(null)
  const containerNav = useRef(null)
  const containerOffset = useRef(null)

  // useEffect(() => {
  //   // Set the container scroll position based on the current time.
  //   const currentMinute = new Date().getHours() * 60
  //   container.current.scrollTop =
  //     ((container.current.scrollHeight - containerNav.current.offsetHeight - containerOffset.current.offsetHeight) *
  //       currentMinute) /
  //     1440
  // }, [])

  const firstDayOfWeek = startOfWeek(new Date(), { weekStartsOn: 0 })
  const lastDayOfWeek = endOfWeek(new Date(), { weekStartsOn: 0 })
  const daysOfWeek = eachDayOfInterval({ start: firstDayOfWeek, end: lastDayOfWeek })
  const formattedDaysOfWeek = daysOfWeek.map(day => ({
    dayNumber: format(day, 'd'),
    dayOfWeek: format(day, 'EEE'),
  }))

  console.log('formattedDaysOfWeek', formattedDaysOfWeek)

  return (
    <div className="flex h-full flex-col">
      <header className="flex flex-none items-center justify-between border-b border-gray-200 px-6 py-4">
        <h1 className="text-base font-semibold leading-6 text-gray-900">
          <time dateTime="2022-01">January 2022</time>
        </h1>
      </header>
      <div ref={container} className="isolate flex flex-auto flex-col overflow-auto bg-white">
        <div style={{ width: '165%' }} className="flex max-w-full flex-none flex-col sm:max-w-none md:max-w-full">
          <div
            ref={containerNav}
            className="sticky top-0 z-30 flex-none bg-white shadow ring-1 ring-black ring-opacity-5 sm:pr-8">
            <div className="-mr-px hidden grid-cols-7 divide-x divide-gray-100 border-r border-gray-100 text-sm leading-6 text-gray-500 bg-purple-400 sm:grid">
              <div className="col-end-1 w-14" />
              {formattedDaysOfWeek.map((day, index) => {
                return (
                  <div key={day.toString()} className="flex items-center justify-center py-3">
                    <span>
                      {day.dayOfWeek} {''}
                      <span className="items-center justify-center font-semibold text-gray-900"> {day.dayNumber}</span>
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="flex flex-auto">
            <div className="sticky left-0 z-10 w-14 flex-none bg-white ring-1 ring-gray-100" />
            <div className="grid flex-auto grid-cols-1 grid-rows-1">
              {/* Horizontal lines */}
              <div
                className="col-start-1 col-end-2 row-start-1 grid divide-y divide-gray-100"
                // style={{ gridTemplateRows: 'repeat(3, minmax(3.5rem, 1fr))' }}
              >
                <div ref={containerOffset} className="row-end-1 h-1/2 bg-red-300"></div>

                <div>
                  <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    6AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    7AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    8AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    9AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    10AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    11AM
                  </div>
                </div>
                <div />
              </div>

              {/* Vertical lines */}
              <div className="col-start-1 col-end-2 row-start-1 hidden grid-cols-7 grid-rows-1 divide-x divide-gray-100 sm:grid sm:grid-cols-7 bg-green-400 h-[400px]">
                <div className="col-start-1 row-span-full" />
                <div className="col-start-2 row-span-full" />
                <div className="col-start-3 row-span-full" />
                <div className="col-start-4 row-span-full" />
                <div className="col-start-5 row-span-full" />
                <div className="col-start-6 row-span-full" />
                <div className="col-start-7 row-span-full" />
                <div className="col-start-8 row-span-full w-8" />
              </div>

              {/* Events */}
              <ol
                className="col-start-1 col-end-2 row-start-1 grid grid-cols-1 sm:grid-cols-7 sm:pr-8"
                style={{ gridTemplateRows: '1.75rem repeat(288, minmax(0, 1fr)) auto' }}>
                {openShifts.map((shift: any) => {
                  console.log('shift', shift)
                  return (
                    <li
                      key={shift._id}
                      className="relative mt-px flex sm:col-start-4"
                      style={{ gridRow: '74 / span 12' }}>
                      <a
                        href="/"
                        className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-green-50 p-2 text-xs leading-5 hover:bg-green-100">
                        <p className="order-1 font-semibold text-green-700">Breakfast</p>
                        <p className="text-green-500 group-hover:text-green-700">
                          <time dateTime={shift.shift_day}>{shift.shift_day}</time>
                        </p>
                      </a>
                    </li>
                  )
                })}

                {/* <li className="relative mt-px flex sm:col-start-3" style={{ gridRow: '92 / span 12' }}>
                  <a
                    href="/"
                    className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-pink-50 p-2 text-xs leading-5 hover:bg-pink-100">
                    <p className="order-1 font-semibold text-pink-700">Flight to Paris</p>
                    <p className="text-pink-500 group-hover:text-pink-700">
                      <time dateTime="2022-01-12T07:30">7:30 AM</time>
                    </p>
                  </a>
                </li> */}
                {/* <li className="relative mt-px hidden sm:col-start-6 sm:flex" style={{ gridRow: '122 / span 24' }}>
                  <a
                    href="/"
                    className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-gray-100 p-2 text-xs leading-5 hover:bg-gray-200">
                    <p className="order-1 font-semibold text-gray-700">Meeting with design team at Disney</p>
                    <p className="text-gray-500 group-hover:text-gray-700">
                      <time dateTime="2022-01-15T10:00">10:00 AM</time>
                    </p>
                  </a>
                </li> */}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
