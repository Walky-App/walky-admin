import { useState, useEffect } from 'react'

import { Calendar } from 'primereact/calendar'
import { Dropdown } from 'primereact/dropdown'
import { ProgressSpinner } from 'primereact/progressspinner'

import { HeaderComponent } from '../../../components/shared/general/HeaderComponent'
import { type IJob } from '../../../interfaces/job'
import { RequestService } from '../../../services/RequestService'
import { JobListItem } from './JobListItem'

const jobTitleOptions = [
  { name: 'All Jobs', code: 'all' },
  { name: 'Packager', code: 'Packager' },
  { name: 'Trimmer', code: 'Trimmer' },
  { name: 'Harvester', code: 'Harvester' },
  { name: 'Gardener', code: 'Gardener' },
  { name: 'Cultivator', code: 'Cultivator' },
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

const rangeOptions = [
  { name: '5 miles', code: 5 },
  { name: '10 miles', code: 10 },
  { name: '15 miles', code: 15 },
  { name: '20 miles', code: 20 },
  { name: '30 miles', code: 30 },
  { name: '50 miles', code: 50 },
]

export const EmployeeJobs = () => {
  const [jobs, setJobs] = useState<IJob[]>([])
  const [selectedJobTitle, setSelectedJobTitle] = useState<{ name: string; code: string } | null>(null)
  const [displayedJobs, setDisplayedJobs] = useState<IJob[]>([])
  const [dates, setDates] = useState<[Date, Date] | null>(null)
  const [latitude, setLatitude] = useState<number | undefined>(undefined)
  const [longitude, setLongitude] = useState<number | undefined>(undefined)
  const [selectedRange, setSelectedRange] = useState<{ name: string; code: number } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getLocation = () => {
      navigator.geolocation.getCurrentPosition(position => {
        setLatitude(position.coords.latitude)
        setLongitude(position.coords.longitude)
      })
    }

    getLocation()
  }, [])

  useEffect(() => {
    const getJobs = async () => {
      if (typeof longitude !== 'number' || typeof latitude !== 'number' || isNaN(longitude) || isNaN(latitude)) {
        console.error('Invalid coordinates: ', { longitude, latitude })
        return
      }
      const fromCoordinates = [longitude, latitude]
      const allJobs = await RequestService('jobs/distance', 'POST', { fromCoordinates })
      if (allJobs) {
        setJobs(allJobs)
      }
      setLoading(false)
    }
    getJobs()
  }, [latitude, longitude])

  useEffect(() => {
    let filteredJobs = [...(jobs || [])]
    if (selectedJobTitle && selectedJobTitle.code !== 'all') {
      filteredJobs = filteredJobs.filter(job => job.title === selectedJobTitle.name)
    }
    if (dates) {
      filteredJobs = filteredJobs.filter(job => {
        return job.job_dates.some(jobDate => {
          const date = new Date(jobDate)
          return date >= dates[0] && date <= dates[1]
        })
      })
    }
    if (selectedRange) {
      filteredJobs = filteredJobs.filter(job => job.distance <= selectedRange.code)
    }
    setDisplayedJobs(filteredJobs)
  }, [selectedJobTitle, dates, jobs, selectedRange])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <ProgressSpinner />
      </div>
    )
  }

  return (
    <>
      <HeaderComponent title="Jobs" />
      <div className="-mx-3 flex flex-wrap">
        <div className="mb-4 w-full px-3 md:mb-0 md:w-1/3">
          <Dropdown
            value={selectedJobTitle}
            onChange={e => setSelectedJobTitle(e.value)}
            filter
            options={jobTitleOptions}
            optionLabel="name"
            placeholder="Select Job Title"
            className="w-full"
          />
        </div>
        <div className="mb-4 w-full px-3 md:mb-0 md:w-1/3">
          <Calendar
            value={dates}
            onChange={e => setDates(e.value as [Date, Date] | null)}
            selectionMode="range"
            showButtonBar
            numberOfMonths={2}
            placeholder="Select Date Range"
            readOnlyInput
            className="w-full"
          />
        </div>
        <div className="mb-4 w-full px-3 md:mb-0 md:w-1/3">
          <Dropdown
            value={selectedRange}
            onChange={e => setSelectedRange(e.value)}
            options={rangeOptions}
            optionLabel="name"
            placeholder="Select Range"
            className="w-full"
          />
        </div>
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
