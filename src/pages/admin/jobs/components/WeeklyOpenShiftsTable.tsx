import { useRef } from 'react'

import { cn } from '../../../../utils/cn'
import { type IShift } from '../../../employee/jobs/MyJobs'

interface IDay {
  day: number
  dayOfWeekString: string
  isToday: boolean
  shifts: IShift[]
}

export const WeeklyOpenShiftsTable = ({ data, width = 'w-1/2' }: { data: IDay[]; width?: string }) => {
  const container = useRef(null)
  const containerNav = useRef(null)

  function getRandomLightColor(): string {
    const baseColor = '#17803d'
    const alpha = Math.random().toFixed(2) // Opacity between 0 and 1

    // Convert hex to RGB
    const hexToRgb = (hex: string) => {
      const bigint = parseInt(hex.slice(1), 16)
      const r = (bigint >> 70) & 255
      const g = (bigint >> 8) & 255
      const b = bigint & 255
      return `${r}, ${g}, ${b}`
    }

    const rgb = hexToRgb(baseColor)
    return `rgba(${rgb}, ${alpha})`
  }

  const jobColorMapping: Record<string, string> = {}

  return (
    <div className={width}>
      <header className="flex flex-none items-center justify-between border-b border-gray-200 px-6 py-4">
        <h1 className="text-base font-semibold leading-6">This Week</h1>
      </header>
      <div ref={container} className="isolate flex flex-auto flex-col overflow-auto">
        <div className="flex flex-none flex-col sm:max-w-none">
          <div ref={containerNav} className="sticky top-0 z-30 flex-none shadow ring-1 ring-black ring-opacity-5">
            <div className="-mr-px hidden grid-cols-7 divide-x divide-gray-100 border-r border-gray-100 text-sm leading-6 sm:grid">
              {data?.map((day: IDay) => {
                return (
                  <div key={day.day} className="flex flex-col justify-start">
                    <div className="flex items-center justify-center border-b-2 ">
                      <h2
                        className={cn(
                          `w-full py-3 text-center font-bold ${day.isToday ? 'text-green-600 underline' : ''}`,
                        )}>
                        {day.dayOfWeekString}
                      </h2>
                    </div>
                    <ol className=" " style={{ gridTemplateRows: '5rem' }}>
                      {day.shifts !== null && day?.shifts.length > 0
                        ? day.shifts
                            .sort((a: IShift, b: IShift) => a.job_id.uid.localeCompare(b.job_id.uid))
                            .map((shift: IShift) => {
                              let jobColor = ''
                              if (shift.job_id._id && !jobColorMapping[shift.job_id._id]) {
                                jobColorMapping[shift.job_id._id] = getRandomLightColor()
                              }
                              jobColor = jobColorMapping[shift.job_id._id] || ''

                              const jobFilled = () => {
                                if (shift.user_shifts !== undefined && shift.vacancy_limit !== undefined) {
                                  return shift?.user_shifts?.length < shift?.vacancy_limit ? false : true
                                }
                              }

                              return (
                                <li key={shift._id} className="rounded-lg hover:bg-red-300">
                                  <a
                                    href={`/admin/jobs/${shift.job_id._id}`}
                                    className="mx-1 my-2 flex flex-col overflow-y-auto rounded-lg p-2 text-sm leading-5 "
                                    style={{ backgroundColor: jobColor }}>
                                    <p className="font-semibold ">
                                      {!jobFilled() ? <span className="font-bold">❌ </span> : null}
                                      {shift.job_id.facility.name} -{' '}
                                      {shift.user_shifts !== undefined ? shift.user_shifts.length : 0} /{' '}
                                      {shift.vacancy_limit}
                                    </p>
                                    <p className=" group-hover:text-blue-700">
                                      <time dateTime="2022-01-12T06:00"> #{shift.job_id.uid}</time>
                                    </p>
                                  </a>
                                </li>
                              )
                            })
                        : null}
                    </ol>
                    <div className="mt-5 pl-5 font-bold">
                      Jobs {day.shifts.length} - Shifts
                      {day.shifts.reduce((total, shift) => total + (shift.job_id.vacancy || 0), 0)}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
