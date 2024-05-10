import { useState, useEffect } from 'react'

import { useMediaQuery } from 'react-responsive'

import { Button } from 'primereact/button'
import { Calendar } from 'primereact/calendar'
import { Checkbox } from 'primereact/checkbox'
import { type CheckboxChangeEvent } from 'primereact/checkbox'
import { Divider } from 'primereact/divider'
import { ScrollPanel } from 'primereact/scrollpanel'
import { Sidebar } from 'primereact/sidebar'
import { Skeleton } from 'primereact/skeleton'
import { Slider } from 'primereact/slider'
import { Tooltip } from 'primereact/tooltip'

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

  const [selectedJobTitles, setSelectedJobTitles] = useState<string[]>([])
  const [displayedJobs, setDisplayedJobs] = useState<IJob[]>([])
  const [dates, setDates] = useState<[Date, Date] | null>(null)
  const [selectedRange, setSelectedRange] = useState(rangeOptions[0].code)
  const [isLoading, setIsLoading] = useState(true)
  const [moreAddressDetails, setMoreAddressDetails] = useState<IAddressAutoComplete | undefined>(undefined)
  const [seeMore, setSeeMore] = useState(false)
  const [visibleFilterSidebarForMobile, setVisibleFilterSidebarForMobile] = useState(false)

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })

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

  const onJobTitleChange = (e: CheckboxChangeEvent) => {
    let _selectedJobTitles = [...selectedJobTitles]

    if (e.checked ?? false) _selectedJobTitles.push(e.value as string)
    else _selectedJobTitles = _selectedJobTitles.filter(jobTitle => jobTitle !== e.value)

    setSelectedJobTitles(_selectedJobTitles)
  }

  const renderJobCards = () => {
    return (
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <ul className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2 2xl:grid-cols-1">
          {isLoading ? (
            jobs.map((_, index) => <Skeleton key={index} width="28rem" height="18rem" />)
          ) : displayedJobs.length > 0 ? (
            displayedJobs.map(job => <JobListItem key={job._id} job={job} />)
          ) : (
            <div>No jobs found for the selected filters.</div>
          )}
        </ul>
      </div>
    )
  }

  return isMobile ? (
    <div className="flex flex-col items-start md:flex-row">
      <Button className="inline-flex" rounded text onClick={() => setVisibleFilterSidebarForMobile(true)}>
        Filter & Sort
      </Button>
      <Sidebar
        visible={visibleFilterSidebarForMobile}
        onHide={() => setVisibleFilterSidebarForMobile(false)}
        fullScreen>
        <ScrollPanel style={{ width: '100%', height: '100vh' }} className="w-full">
          <div className="mb-4 flex flex-col items-center pr-4">
            <Button
              rounded
              text
              aria-label="Set jobs by Current Location"
              tooltip="Set Jobs with distance from your current location"
              onClick={handleUseCurrentLocation}>
              Use Current Location
            </Button>
            <Divider layout="horizontal" align="center" className="my-2">
              <p>or:</p>
            </Divider>
            <div className="flex w-full gap-x-2">
              <AddressAutoComplete
                setMoreAddressDetails={setMoreAddressDetails}
                currentAddress="Select Address"
                className="flex-1"
              />
              <Button
                aria-label="Set jobs by Selected Address"
                tooltip="Set Jobs with distance from the address location"
                onClick={handleUseSelectedAddress}>
                Set Distance
              </Button>
            </div>
          </div>
          <div className="mb-4 mt-6 px-6">
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
            <div className="mt-2">Selected Range: &lt;{selectedRange} miles</div>
          </div>
          <h2>Date range:</h2>
          <Tooltip target=".custom-target-icon" />
          <i
            className="custom-target-icon pi pi-envelope p-text-secondary p-overlay-badge"
            data-pr-tooltip="No notifications"
            data-pr-position="right"
            data-pr-at="right+5 top"
            data-pr-my="left center-2"
            style={{ fontSize: '2rem', cursor: 'pointer' }}
          />

          <div className="mb-4 pr-4 md:block">
            <Calendar value={dates} selectionMode="range" readOnlyInput disabled className="w-full" />
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
          <div className="mb-2 grid grid-cols-3 items-center pr-4">
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
                  <label htmlFor={jobTitle.code} className="ml-2">
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
        </ScrollPanel>
      </Sidebar>
      {renderJobCards()}
    </div>
  ) : (
    <div className="flex flex-col md:flex-row">
      <ScrollPanel style={{ width: '35%', height: '100vh' }} className="w-full">
        <div className="mb-4 flex flex-col items-center pr-4">
          <Button
            rounded
            text
            aria-label="Set jobs by Current Location"
            tooltip="Set Jobs with distance from your current location"
            onClick={handleUseCurrentLocation}>
            Use Current Location
          </Button>
          {/* <p> or: </p> */}
          <Divider layout="horizontal" align="center" className="my-2">
            <p>or:</p>
          </Divider>
          <div className="flex w-full gap-x-2">
            <AddressAutoComplete
              setMoreAddressDetails={setMoreAddressDetails}
              currentAddress="Select Address"
              className="flex-1"
            />
            <Button
              aria-label="Set jobs by Selected Address"
              tooltip="Set Jobs with distance from the address location"
              onClick={handleUseSelectedAddress}>
              Set Distance
            </Button>
          </div>
        </div>
        <div className="mb-4 mt-6 px-6">
          <div className="mb-2">Selected Range: &lt;{selectedRange} miles</div>
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
        </div>
        <Tooltip target=".custom-target-icon" />
        <div className="flex flex-row items-center gap-x-1">
          <i
            className="custom-target-icon pi pi-info-circle p-text-secondary p-overlay-badge"
            data-pr-tooltip="Select a start and end date to filter jobs by date range."
            data-pr-position="right"
            data-pr-at="right+5 top"
            data-pr-my="left center-2"
            style={{ fontSize: '1rem', cursor: 'pointer' }}
          />
          <h2>Date range:</h2>
        </div>
        <div className="mb-4 hidden pr-4 md:block">
          <Calendar value={dates} selectionMode="range" readOnlyInput disabled className="w-full" />
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
        <div className="mb-2 grid grid-cols-3 items-center pr-4">
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
                <label htmlFor={jobTitle.code} className="ml-2">
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
      </ScrollPanel>
      <ScrollPanel style={{ width: '65%', height: '100vh' }} className="w-full">
        {renderJobCards()}
      </ScrollPanel>
    </div>
  )
}
