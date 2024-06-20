import { useState } from 'react'

import { Button } from 'primereact/button'
import { Calendar } from 'primereact/calendar'
import { Divider } from 'primereact/divider'

import { HtInputLabel } from '../../../../components/shared/forms/HtInputLabel'
import { HtInfoTooltip } from '../../../../components/shared/general/HtInfoTooltip'
import { useJobs } from '../../../../store/useJobs'

export const DateSearch = () => {
  const [dates, setDates] = useState<[Date, Date] | null>(null)

  const { jobs, setFilteredJobs } = useJobs()

  const handleDateChange = (selectedDates: [Date, Date]) => {
    setDates(selectedDates)

    const filterResults = jobs.filter(job => {
      return job.job_dates.some(jobDate => {
        const date = new Date(jobDate)
        return date >= selectedDates[0] && date <= selectedDates[1]
      })
    })
    setFilteredJobs(filterResults)
  }

  const handleClearFilters = () => {
    setDates(null)
    setFilteredJobs(jobs)
  }

  return (
    <div>
      <Divider />
      <HtInfoTooltip message="Filter by Date Range." className="mb-4">
        <HtInputLabel htmlFor="date_range" labelText="By Date" className="text-xs" />
      </HtInfoTooltip>
      <div className="">
        <Calendar
          value={dates}
          onChange={e => handleDateChange(e.value as [Date, Date])}
          selectionMode="range"
          numberOfMonths={2}
          placeholder="Select Date Range"
          readOnlyInput
          className="w-full"
          minDate={new Date()}
          showIcon
          showMinMaxRange
          inputClassName="text-sm"
          icon="pi pi-calendar"
        />
      </div>
      {dates ? (
        <div className="flex w-full justify-end">
          <Button label="Clear" className="text-sm underline" text link onClick={handleClearFilters} />
        </div>
      ) : null}
    </div>
  )
}
