import { useState } from 'react'

import { Button } from 'primereact/button'
import { Slider } from 'primereact/slider'

import { HtInputLabel } from '../../../../components/shared/forms/HtInputLabel'
import { HtInfoTooltip } from '../../../../components/shared/general/HtInfoTooltip'
import { type IJob } from '../../../../interfaces/job'
import { useJobs } from '../../../../store/useJobs'

const rangeOptions = [
  { name: '< 0 miles', code: 0 },
  { name: '< 5 miles', code: 5 },
  { name: '< 10 miles', code: 10 },
  { name: '< 15 miles', code: 15 },
  { name: '< 20 miles', code: 20 },
  { name: '< 30 miles', code: 30 },
  { name: '< 50 miles', code: 50 },
]

export const RangeSelector = () => {
  const [selectedRange, setSelectedRange] = useState<number | [number, number]>(50)
  const { setShowRangeSelector, jobs, filteredJobs, setFilteredJobs } = useJobs()

  const handleRangeClear = () => {
    setSelectedRange(50)
    setShowRangeSelector(false)
    setFilteredJobs(jobs)
  }

  const showRangeClear = () => {
    if (typeof selectedRange === 'number' && selectedRange !== 50)
      return <Button label="> 50 miles" className="text-sm underline" text link onClick={handleRangeClear} />
  }

  return (
    <div className="my-5 px-4 text-right">
      <div className="mb-2">
        <HtInfoTooltip message="Select a range using slider below to filter jobs by distance from the selected location.">
          <HtInputLabel
            htmlFor="range"
            labelText={selectedRange != null ? `< ${selectedRange as number} miles away` : '< 0 Miles away'}
            className="text-md"
          />
        </HtInfoTooltip>
      </div>
      <Slider
        value={selectedRange}
        defaultValue={50}
        onChange={e => {
          setSelectedRange(e.value)
          const range = typeof e.value === 'number' ? e.value : e.value[0]
          const updatedJobs = filteredJobs.filter((job: IJob) => Number(job.distance) <= range)
          setFilteredJobs(updatedJobs)
        }}
        className="w-full"
        step={5}
        min={rangeOptions[0].code}
        max={rangeOptions[rangeOptions.length - 1].code}
      />
      {showRangeClear()}
    </div>
  )
}
