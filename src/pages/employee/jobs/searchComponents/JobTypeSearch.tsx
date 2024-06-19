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
  { name: 'Promo representative', code: 'Promo representative' },
  { name: 'Cleaning', code: 'Cleaning' },
  { name: 'Joint roller', code: 'Joint roller' },
  { name: 'Grow tech', code: 'Grow tech' },
  { name: 'Clone tech', code: 'Clone tech' },
  { name: 'Sign spinner', code: 'Sign spinner' },
]

// const isNew = (date: string) => {
//   const today = new Date()
//   const jobDate = new Date(date)
//   const diff = today.getTime() - jobDate.getTime()
//   const diffDays = diff / (1000 * 3600 * 24)
//   return diffDays <= 3
// }

export const JobTypeSearch = () => {
  const [selectedJobTitles, setSelectedJobTitles] = useState<string[]>([])
  const [seeMore, setSeeMore] = useState(false)
  const { jobs, filteredJobs, setFilteredJobs } = useJobs()

  const onJobTitleChange = (e: CheckboxChangeEvent) => {
    // let jobsFiltered = filteredJobs
    const { value } = e.target
    let updatedSelectedJobTitles = [...selectedJobTitles]
    if (e.checked) {
      updatedSelectedJobTitles.push(value)
    } else {
      updatedSelectedJobTitles = updatedSelectedJobTitles.filter(jobTitle => jobTitle !== value)
    }

    setSelectedJobTitles(updatedSelectedJobTitles)

    const filterResults = filteredJobs.filter(job => {
      return updatedSelectedJobTitles.some(jobTitle => job.title.includes(jobTitle))
    })
    setFilteredJobs(filterResults)

    // if (selectedJobTitles.includes('New')) {

    //   const updatedFilter = filteredJobs.filter(job => isNew(job.createdAt))
    //   jobsFiltered = updatedFilter
    // }

    // if (selectedJobTitles.includes('Applied')) {
    //   jobsFiltered = filteredJobs.filter(job =>
    //     job.applicants.some(applicant => applicant.user.toString() === _id && !applicant.is_approved),
    //   )
    // }
    //   if (isApprovedChecked) {
    //     filteredJobs = filteredJobs.filter(job =>
    //       job.applicants.some(applicant => applicant.user.toString() === _id && applicant.is_approved),
    //     )
    //   }
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
      <div className="flex w-full justify-end">
        <Button label="Clear" className="text-sm underline" text link onClick={handleClearFilters} />
      </div>
    </div>
  )
}
