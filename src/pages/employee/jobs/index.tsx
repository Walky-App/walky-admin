import { useState, useEffect, useMemo } from 'react'

import { useMediaQuery } from 'react-responsive'

import { Button } from 'primereact/button'
import { Calendar } from 'primereact/calendar'
import { Checkbox } from 'primereact/checkbox'
import { type CheckboxChangeEvent } from 'primereact/checkbox'
import { Divider } from 'primereact/divider'
import { ScrollPanel } from 'primereact/scrollpanel'
import { SelectButton, type SelectButtonChangeEvent } from 'primereact/selectbutton'
import { Sidebar } from 'primereact/sidebar'
import { Skeleton } from 'primereact/skeleton'
import { Slider } from 'primereact/slider'

import { GlobalTable } from '../../../components/shared/GlobalTable'
import { AddressAutoComplete, type IAddressAutoComplete } from '../../../components/shared/forms/AddressAutoComplete'
import { HtInputLabel } from '../../../components/shared/forms/HtInputLabel'
import { HtInfoTooltip } from '../../../components/shared/general/HtInfoTooltip'
import { HtScrollTop } from '../../../components/shared/general/HtScrollTop'
import { type IJob } from '../../../interfaces/job'
import { RequestService } from '../../../services/RequestService'
import { useCoordinates } from '../../../store/useCoordinates'
import { useJobs } from '../../../store/useJobs'
import { isNew } from '../../../utils/timeUtils'
import { GetTokenInfo } from '../../../utils/tokenUtil'
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

interface ViewOption {
  icon: string
  value: string
}

const viewOptions: ViewOption[] = [
  { icon: 'pi pi-bars', value: 'list' },
  { icon: 'pi pi-table', value: 'grid' },
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
  const { _id } = GetTokenInfo()
  const [view, setView] = useState<string>('list')

  const viewOptionsTemplate = (option: ViewOption) => {
    return <i className={option.icon} />
  }

  const [selectedJobTitles, setSelectedJobTitles] = useState<string[]>([])
  const [displayedJobs, setDisplayedJobs] = useState<IJob[]>([])
  const [dates, setDates] = useState<[Date, Date] | null>(null)
  const [selectedRange, setSelectedRange] = useState(rangeOptions[0].code)
  const [isLoading, setIsLoading] = useState(true)
  const [moreAddressDetails, setMoreAddressDetails] = useState<IAddressAutoComplete | undefined>(undefined)
  const [seeMore, setSeeMore] = useState(false)
  const [isNewChecked, setIsNewChecked] = useState(false)
  const [isAppliedChecked, setIsAppliedChecked] = useState(false)
  const [isApprovedChecked, setIsApprovedChecked] = useState(false)
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
    if (isNewChecked) {
      filteredJobs = filteredJobs.filter(job => isNew(job.createdAt))
    }
    if (isAppliedChecked) {
      filteredJobs = filteredJobs.filter(job =>
        job.applicants.some(applicant => applicant.user.toString() === _id && !applicant.is_approved),
      )
    }
    if (isApprovedChecked) {
      filteredJobs = filteredJobs.filter(job =>
        job.applicants.some(applicant => applicant.user.toString() === _id && applicant.is_approved),
      )
    }
    setDisplayedJobs(filteredJobs)
  }, [selectedJobTitles, dates, jobs, selectedRange, isNewChecked, isAppliedChecked, isApprovedChecked, _id])

  const onJobTitleChange = (e: CheckboxChangeEvent) => {
    let _selectedJobTitles = [...selectedJobTitles]

    if (e.checked ?? false) _selectedJobTitles.push(e.value as string)
    else _selectedJobTitles = _selectedJobTitles.filter(jobTitle => jobTitle !== e.value)

    setSelectedJobTitles(_selectedJobTitles)
  }

  const renderJobCards = () => {
    return (
      <div className="mx-auto mb-10 mt-4 px-4 sm:px-6 lg:px-8">
        <ul className="grid grid-cols-1 gap-6 lg:grid-cols-1 2xl:grid-cols-1">
          {isLoading ? (
            jobs.map((_, index) => <Skeleton key={index} width="28rem" height="18rem" />)
          ) : displayedJobs.length > 0 ? (
            [...displayedJobs]
              .sort((a, b) => (isNew(b.createdAt) ? 1 : -1))
              .map(job => <JobListItem key={job._id} job={job} />)
          ) : (
            <div>No jobs found for the selected filters.</div>
          )}
        </ul>
      </div>
    )
  }

  const renderFiltersContent = () => {
    return (
      <>
        <div className="mb-4 flex flex-col items-center pr-4">
          <Button
            label="Use Current Location"
            text
            outlined
            link
            aria-label="Set jobs by Current Location"
            tooltip="Set Jobs with distance from your current location"
            onClick={handleUseCurrentLocation}
          />
          <Divider layout="horizontal" align="center" className="my-2">
            or
          </Divider>
          <div className="flex w-full gap-x-2">
            <AddressAutoComplete
              setMoreAddressDetails={setMoreAddressDetails}
              currentAddress="Select Address"
              className="flex-1"
            />
            <Button aria-label="Set jobs by Selected Address" onClick={handleUseSelectedAddress}>
              Set Distance
            </Button>
          </div>
        </div>
        <div className="mb-4 mt-6">
          <div className="mb-2">
            <HtInfoTooltip message="Select a range to filter jobs by distance from your location.">
              <HtInputLabel
                htmlFor="range"
                labelText={`Distance Range:  <${selectedRange} miles`}
                className="text-md"
              />
            </HtInfoTooltip>
          </div>
          <Slider
            value={selectedRange}
            onChange={e => {
              if (Array.isArray(e.value)) {
                setSelectedRange(e.value[0])
              } else {
                setSelectedRange(e.value)
              }
            }}
            className="mx-2 w-full"
            step={10}
            min={rangeOptions[0].code}
            max={rangeOptions[rangeOptions.length - 1].code}
          />
        </div>
        <HtInfoTooltip message="Select a start and end date to filter jobs by date range.">
          <HtInputLabel htmlFor="date_range" labelText="Date Range" className="text-md" />
        </HtInfoTooltip>
        <div className="mb-4 pr-4">
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
        <div className="mb-2 grid grid-cols-3 items-center pr-4">
          <div className="flex items-center">
            <Checkbox
              inputId="new"
              name="new"
              onChange={e => setIsNewChecked(e.checked || false)}
              checked={isNewChecked || false}
            />
            <label htmlFor="new" className="ml-2">
              New
            </label>
          </div>

          <div className="flex items-center">
            <Checkbox
              inputId="applied"
              name="applied"
              onChange={e => setIsAppliedChecked(e.checked || false)}
              checked={isAppliedChecked}
            />
            <label htmlFor="applied" className="ml-2">
              Applied
            </label>
          </div>

          <div className="flex items-center">
            <Checkbox
              inputId="approved"
              name="approved"
              onChange={e => setIsApprovedChecked(e.checked || false)}
              checked={isApprovedChecked}
            />
            <label htmlFor="approved" className="ml-2">
              Approved
            </label>
          </div>
        </div>
      </>
    )
  }

  const memoEmployeeJobsColumns = useMemo(
    () => [
      { Header: 'Job Title', accessor: 'title' },
      {
        Header: 'Status',
        accessor: (d: IJob) => (d.is_active ? 'Active' : 'Disabled'),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        sortType: (a: any, b: any) => {
          if (a.original.is_active === b.original.active) return 0
          return a.original.is_active ? -1 : 1
        },
      },
      {
        Header: 'Hours per Day',
        accessor: 'total_hours',
      },
      {
        Header: 'Hourly Rate ($)',
        accessor: 'hourly_rate',
      },
      { Header: 'Vacancy', accessor: 'vacancy' },

      {
        Header: 'Availability',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        accessor: (d: any) => (d.is_full ? 'Full' : 'Open'),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        sortType: (a: any, b: any) => {
          if (a.original.is_full === b.original.is_full) return 0
          return a.original.is_full ? -1 : 1
        },
      },
    ],
    [],
  )

  return isMobile ? (
    <div className="flex flex-col items-start md:flex-row">
      <Button label="Filter & Sort" text outlined link onClick={() => setVisibleFilterSidebarForMobile(true)} />
      <Sidebar
        visible={visibleFilterSidebarForMobile}
        onHide={() => setVisibleFilterSidebarForMobile(false)}
        blockScroll={true}
        fullScreen={true}>
        {renderFiltersContent()}
      </Sidebar>
      {renderJobCards()}
    </div>
  ) : (
    <>
      <div className="flex w-full justify-end">
        <SelectButton
          value={view}
          onChange={(e: SelectButtonChangeEvent) => setView(e.value)}
          options={viewOptions}
          optionLabel="value"
          itemTemplate={viewOptionsTemplate}
          pt={{ button: { className: 'justify-center' } }}
        />
      </div>
      {view === 'grid' ? (
        <GlobalTable data={jobs} columns={memoEmployeeJobsColumns} allowClick />
      ) : (
        <div className="flex flex-col md:flex-row">
          <ScrollPanel style={{ width: '35%', height: '100vh' }} className="w-full">
            {renderFiltersContent()}
          </ScrollPanel>
          <ScrollPanel style={{ width: '65%', height: '100vh' }} className="w-full">
            {renderJobCards()}
            <HtScrollTop className="" />
          </ScrollPanel>
        </div>
      )}
    </>
  )
}
