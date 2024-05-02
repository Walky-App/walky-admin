import { useState, useEffect } from 'react'

import { Button } from 'primereact/button'
import { Calendar } from 'primereact/calendar'
import { Checkbox } from 'primereact/checkbox'
import { Skeleton } from 'primereact/skeleton'
import { Slider } from 'primereact/slider'

import { AddressAutoComplete, type IAddressAutoComplete } from '../../../components/shared/forms/AddressAutoComplete'
import { type IJob } from '../../../interfaces/job'
import { RequestService } from '../../../services/RequestService'
import { useCoordinates } from '../../../store/useCoordinates'
import { useJobs } from '../../../store/useJobs'
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
  { name: '< 5 miles', code: 5 },
  { name: '< 10 miles', code: 10 },
  { name: '< 15 miles', code: 15 },
  { name: '< 20 miles', code: 20 },
  { name: '< 30 miles', code: 30 },
  { name: '< 50 miles', code: 50 },
]

export const EmployeeJobs = () => {
  const { jobs, setJobs } = useJobs()
  const {
    latitude,
    longitude,
    loading: coordinatesLoading,
    getLatitudeFromLocalStorage,
    getLongitudeFromLocalStorage,
  } = useCoordinates()

  const [selectedJobTitles, setSelectedJobTitles] = useState([])
  const [displayedJobs, setDisplayedJobs] = useState<IJob[]>([])
  const [dates, setDates] = useState<[Date, Date] | null>(null)
  const [selectedRange, setSelectedRange] = useState(rangeOptions[0].code)
  const [isLoading, setIsLoading] = useState(true)
  const [moreAddressDetails, setMoreAddressDetails] = useState<IAddressAutoComplete | undefined>(undefined)
  const [seeMore, setSeeMore] = useState(false)

  const handleUseSelectedAddress = async () => {
    if (moreAddressDetails && moreAddressDetails.location_pin) {
      const fromCoordinates = [...moreAddressDetails.location_pin].reverse()
      const allJobs = await RequestService('jobs/distance', 'POST', { fromCoordinates })
      if (allJobs) {
        setJobs(allJobs)
      }
      setIsLoading(false)
    }
  }

  const handleUseCurrentLocation = async () => {
    if (latitude !== null && longitude !== null) {
      const fromCoordinates = [longitude, latitude]
      const allJobs = await RequestService('jobs/distance', 'POST', { fromCoordinates })
      if (allJobs) {
        setJobs(allJobs)
      }
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (jobs.length) {
      setIsLoading(false)
    }
    if (getLongitudeFromLocalStorage() && getLatitudeFromLocalStorage() && !jobs.length) {
      const getJobs = async () => {
        if (latitude === null || longitude === null) {
          return
        }
        const fromCoordinates = [longitude, latitude]
        const allJobs = await RequestService('jobs/distance', 'POST', { fromCoordinates })
        if (allJobs) {
          setJobs(allJobs)
        }
        setIsLoading(false)
      }
      getJobs()
    }
  }, [
    jobs,
    setJobs,
    coordinatesLoading,
    latitude,
    longitude,
    getLatitudeFromLocalStorage,
    getLongitudeFromLocalStorage,
  ])

  useEffect(() => {
    let filteredJobs = [...(jobs || [])]
    if (selectedJobTitles.length > 0) {
      // @ts-ignore
      filteredJobs = filteredJobs.filter(job => selectedJobTitles.includes(job.title))
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
      filteredJobs = filteredJobs.filter(job => job.distance <= selectedRange)
    }
    setDisplayedJobs(filteredJobs)
  }, [selectedJobTitles, dates, jobs, selectedRange])
  // @ts-ignore
  const onJobTitleChange = (e: CheckboxChangeParams) => {
    const { checked, value } = e
    if (checked) {
      // @ts-ignore
      setSelectedJobTitles(prevJobTitles => [...prevJobTitles, value])
    } else {
      setSelectedJobTitles(prevJobTitles => prevJobTitles.filter(jobTitle => jobTitle !== value))
    }
  }

  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full p-3 md:w-1/4">
        <h2>Filter:</h2>
        <div className="mb-4">
          {jobTitleOptions.slice(0, seeMore ? jobTitleOptions.length : 7).map(jobTitle => {
            return (
              <div key={jobTitle.code} className="flex items-center">
                <Checkbox
                  inputId={jobTitle.code}
                  name="jobTitle"
                  value={jobTitle.code}
                  onChange={onJobTitleChange}
                  // @ts-ignore
                  checked={selectedJobTitles.includes(jobTitle.code)}
                />
                <label htmlFor={jobTitle.code} className="ml-2">
                  {jobTitle.name}
                </label>
              </div>
            )
          })}
          {jobTitleOptions.length > 7 ? (
            <Button
              text
              icon={seeMore ? 'pi pi-chevron-up' : 'pi pi-chevron-down'}
              label={seeMore ? 'See less' : 'See more'}
              size="small"
              onClick={() => setSeeMore(!seeMore)}
            />
          ) : null}{' '}
        </div>
        <div className="mb-4 hidden md:block">
          <Calendar
            value={dates}
            onChange={e => setDates(e.value as [Date, Date] | null)}
            selectionMode="range"
            showButtonBar
            inline={true}
            numberOfMonths={1}
            placeholder="by Date"
            readOnlyInput
            className="w-full"
          />
        </div>
        <div className="mb-4 md:hidden">
          <Calendar
            value={dates}
            onChange={e => setDates(e.value as [Date, Date] | null)}
            selectionMode="range"
            showButtonBar
            inline={false}
            numberOfMonths={1}
            placeholder="by Date"
            readOnlyInput
            className="w-full"
          />
        </div>
        <div className="mb-4 flex items-center">
          <AddressAutoComplete setMoreAddressDetails={setMoreAddressDetails} currentAddress="Type in address" />
          <Button
            className="mx-1"
            icon="pi pi-search"
            aria-label="Set jobs by Selected Address"
            tooltip="Set Jobs with distance from the address location"
            onClick={handleUseSelectedAddress}
          />
          <Button
            icon="pi pi-map-marker"
            rounded
            text
            aria-label="Set jobs by Current Location "
            tooltip="Set Jobs with distance from your current location"
            onClick={handleUseCurrentLocation}
          />
        </div>
        <div className="mb-4">
          <Slider
            value={selectedRange}
            onChange={e => {
              if (Array.isArray(e.value)) {
                setSelectedRange(e.value[0])
              } else {
                setSelectedRange(e.value)
              }
            }}
            className="w-full"
            step={10}
            min={rangeOptions[0].code}
            max={rangeOptions[rangeOptions.length - 1].code}
          />
          <div>Selected Range: {selectedRange} miles</div>
        </div>
      </div>
      <div className="w-full p-3 md:w-3/4">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2 2xl:grid-cols-3">
            {isLoading
              ? jobs.map((_, index) => <Skeleton key={index} width="28rem" height="18rem" />)
              : displayedJobs.map(job => <JobListItem key={job._id} job={job} />)}
          </ul>
        </div>
      </div>
    </div>
  )
}
