import { useState } from 'react'

import { Button } from 'primereact/button'
import { Checkbox } from 'primereact/checkbox'
import { type CheckboxChangeEvent } from 'primereact/checkbox'
import { Divider } from 'primereact/divider'

import { HtInputLabel } from '../../../../components/shared/forms/HtInputLabel'
import { HtInfoTooltip } from '../../../../components/shared/general/HtInfoTooltip'
import { useJobs } from '../../../../store/useJobs'

const jobTitleOptions = [
  { name: 'Packager', code: 'Packager' },
  { name: 'Trimmer', code: 'Trimmer' },
  { name: 'Harvester', code: 'Harvester' },
  { name: 'Extractor', code: 'Extractor' },
  { name: 'Budtender', code: 'Budtender' },
  { name: 'Front desk', code: 'Front desk' },
  { name: 'Greeter', code: 'Greeter' },
  { name: 'Id checker', code: 'Id checker' },
  { name: 'Inventory', code: 'Inventory' },
  { name: 'Data entry', code: 'Data entry' },
  { name: 'Event staff', code: 'Event staff' },
  { name: 'Promo rep', code: 'Promo rep' },
  { name: 'Cleaning', code: 'Cleaning' },
  { name: 'Joint roller', code: 'Joint roller' },
  { name: 'Grow tech', code: 'Grow tech' },
  { name: 'Clone tech', code: 'Clone tech' },
  { name: 'Sign spinner', code: 'Sign spinner' },
]

export const JobTypeSearch = () => {
  const [selectedJobTitles, setSelectedJobTitles] = useState<string[]>([])
  const [seeMore, setSeeMore] = useState(false)
  const { jobs, setFilteredJobs } = useJobs()

  const onJobTitleChange = (e: CheckboxChangeEvent) => {
    const { value } = e.target
    let updatedSelectedJobTitles = [...selectedJobTitles]
    if (e.checked) {
      updatedSelectedJobTitles.push(value)
    } else {
      updatedSelectedJobTitles = updatedSelectedJobTitles.filter(jobTitle => jobTitle !== value)
    }

    setSelectedJobTitles(updatedSelectedJobTitles)

    if (updatedSelectedJobTitles.length === 0) {
      setFilteredJobs(jobs)
    } else {
      const filterResults = jobs.filter(job => {
        return updatedSelectedJobTitles.some(jobTitle => job.title.includes(jobTitle))
      })
      setFilteredJobs(filterResults)
    }
  }

  const handleClearFilters = () => {
    setSelectedJobTitles([])
    setFilteredJobs(jobs)
  }

  return (
    <div>
      <Divider />
      <HtInfoTooltip message="Filter jobs by type of jobs available" className="mb-4">
        <HtInputLabel htmlFor="date_range" labelText="By Job Type" className="text-xs" />
      </HtInfoTooltip>
      <div className="mb-2 grid grid-cols-2 items-center pr-4">
        {jobTitleOptions.slice(0, seeMore ? jobTitleOptions.length : 9).map(jobTitle => {
          return (
            <div key={jobTitle.code} className="flex items-center">
              <Checkbox
                inputId={jobTitle.code}
                name="jobTitle"
                value={jobTitle.code}
                onChange={onJobTitleChange}
                checked={selectedJobTitles.includes(jobTitle.code as never)}
              />
              <label htmlFor={jobTitle.code} className="ml-1">
                {jobTitle.name}
              </label>
            </div>
          )
        })}
      </div>
      {jobTitleOptions.length > 9 ? (
        <Button
          text
          icon={seeMore ? 'pi pi-chevron-up' : 'pi pi-chevron-down'}
          label={seeMore ? 'See less' : 'See more'}
          size="small"
          onClick={() => setSeeMore(!seeMore)}
        />
      ) : null}
      {selectedJobTitles.length > 0 ? (
        <div className="flex w-full justify-end">
          <Button label="Clear" className="text-sm underline" text link onClick={handleClearFilters} />
        </div>
      ) : null}
    </div>
  )
}
