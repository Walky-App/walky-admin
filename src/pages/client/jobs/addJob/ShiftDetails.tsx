import React from 'react'
import { Calendar } from 'primereact/calendar'
import { useState } from 'react'
import { Nullable } from 'primereact/ts-helpers'

export default function ShiftDetails() {
  const [dates, setDates] = useState<Nullable<Date[]>>(null)
  return (
    <>
      {/* Shift Times Input */}
      <div className="sm:col-span-3">
        <label htmlFor="shift_times" className="block text-sm font-medium leading-6 text-gray-900">
          Shift Times
        </label>
        <div className="mt-2">
          <input
            type="time"
            name="shift_times"
            id="shift-times"
            placeholder="e.g., 8:00,19:00"
            className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      <div className="sm:col-span-3">
        <label htmlFor="shift_dates" className="block text-sm font-medium leading-6 text-gray-900">
          Shift Dates
        </label>

        {/* Calendar Input */}
        <div className="card justify-content-center flex">
          <Calendar value={dates} onChange={e => setDates(e.value)} selectionMode="multiple" readOnlyInput />
        </div>
      </div>
      <div className="mt-6 flex items-center justify-center gap-x-6">
        <button
          type="submit"
          className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          Save
        </button>
      </div>
    </>
  )
}
