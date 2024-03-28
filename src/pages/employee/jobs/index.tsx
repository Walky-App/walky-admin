/* eslint-disable */
import { useState, useEffect } from 'react'

import { Calendar } from 'primereact/calendar'
import { Dropdown } from 'primereact/dropdown'

import { HeaderComponent } from '../../../components/shared/general/HeaderComponent'
import { type IJob } from '../../../interfaces/job'
import { RequestService } from '../../../services/RequestService'
import JobListItem from './JobListItem'

const jobTitleOptions = [
  { name: 'All Jobs', code: 'all' },
  { name: 'Packager', code: 'Packager' },
  { name: 'Trimmer', code: 'Trimmer' },
  { name: 'Harvester', code: 'Harvester' },
  { name: 'Gardener', code: 'Gardener' },
  { name: 'Cultivator', code: 'Cultivator' },
  { name: 'Extractor', code: 'Extractor' },
]

export const EmployeeJobs = () => {
  const [jobs, setJobs] = useState<IJob[]>()
  const [selectedJobTitle, setSelectedJobTitle] = useState<any>(null)
  const [displayedJobs, setDisplayedJobs] = useState<any>([])
  const [dates, setDates] = useState<any>(null)

  useEffect(() => {
    const getJobs = async () => {
      const allJobs = await RequestService('jobs')

      if (allJobs) {
        setJobs(allJobs)
      }
    }
    getJobs()
  }, [])

  useEffect(() => {
    let filteredJobs = [...(jobs || [])] as IJob[]
    if (selectedJobTitle && selectedJobTitle.code !== 'all') {
      filteredJobs = filteredJobs.filter(job => job.title === selectedJobTitle.name)
    }
    if (dates) {
      filteredJobs = filteredJobs.filter(job => {
        return job.job_dates.some((jobDate: any) => {
          const date = new Date(jobDate)
          return date >= dates[0] && date <= dates[1]
        })
      })
    }
    setDisplayedJobs(filteredJobs)
  }, [selectedJobTitle, dates, jobs])

  return (
    <>
      <HeaderComponent title="Jobs" />
      <div className="mb-4 flex flex-col justify-between sm:flex-row">
        <Dropdown
          value={selectedJobTitle}
          onChange={e => setSelectedJobTitle(e.value)}
          options={jobTitleOptions}
          optionLabel="name"
          placeholder="Select Job Title"
          className="md:w-14rem mb-4 w-full sm:mb-0 sm:mr-4"
        />
        <Calendar
          value={dates}
          onChange={e => {
            setDates(e.value)
          }}
          selectionMode="range"
          showButtonBar
          numberOfMonths={2}
          placeholder="Select Date Range"
          readOnlyInput
          className="w-full sm:w-auto"
        />
      </div>
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <ul className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2 2xl:grid-cols-3">
          {displayedJobs.map((job: IJob) => (
            <JobListItem key={job._id} job={job} />
          ))}
        </ul>
      </div>
    </>
  )
}
