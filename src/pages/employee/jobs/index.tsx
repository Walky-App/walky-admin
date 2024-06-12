import { useState, useEffect, useMemo } from 'react'

import { useMediaQuery } from 'react-responsive'

import classNames from 'classnames'
// import { set } from 'date-fns'
import { Button } from 'primereact/button'
import { Calendar } from 'primereact/calendar'
import { Checkbox } from 'primereact/checkbox'
import { type CheckboxChangeEvent } from 'primereact/checkbox'
import { Divider } from 'primereact/divider'
import { ScrollPanel } from 'primereact/scrollpanel'
import { SelectButton, type SelectButtonChangeEvent } from 'primereact/selectbutton'
import { Sidebar } from 'primereact/sidebar'
import { Slider } from 'primereact/slider'

import { GlobalTable } from '../../../components/shared/GlobalTable'
import { HTLoadingLogo } from '../../../components/shared/HTLoadingLogo'
import { AddressAutoComplete, type IAddressAutoComplete } from '../../../components/shared/forms/AddressAutoComplete'
import { HtInputLabel } from '../../../components/shared/forms/HtInputLabel'
import { HtInfoTooltip } from '../../../components/shared/general/HtInfoTooltip'
import { HtScrollTop } from '../../../components/shared/general/HtScrollTop'
import { type IJob } from '../../../interfaces/job'
import { requestService } from '../../../services/requestServiceNew'
import { useJobs } from '../../../store/useJobs'
import { useUtils } from '../../../store/useUtils'
// import { isNew } from '../../../utils/timeUtils'
// import { GetTokenInfo } from '../../../utils/tokenUtil'
import { JobCard } from './JobCard'

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

interface ILocation {
  latitude: number
  longitude: number
}

const viewOptions: ViewOption[] = [
  { icon: 'pi pi-bars', value: 'list' },
  { icon: 'pi pi-table', value: 'grid' },
]

export const EmployeeJobs = () => {
  const [location, setLocation] = useState<ILocation>()
  const { jobs, setJobs } = useJobs()
  // const { _id } = GetTokenInfo()
  const [view, setView] = useState<string>('list')

  const { showToast } = useUtils()

  const viewOptionsTemplate = (option: ViewOption) => {
    return <i className={option.icon} />
  }

  const [selectedJobTitles, setSelectedJobTitles] = useState<string[]>([])
  const [dates, setDates] = useState<[Date, Date] | null>(null)
  const [selectedRange, setSelectedRange] = useState<number | null>(50)
  const [isLoading, setIsLoading] = useState(false)
  const [moreAddressDetails, setMoreAddressDetails] = useState<IAddressAutoComplete | undefined>(undefined)
  const [seeMore, setSeeMore] = useState(false)
  const [isNewChecked, setIsNewChecked] = useState(false)
  const [isAppliedChecked, setIsAppliedChecked] = useState(false)
  const [isApprovedChecked, setIsApprovedChecked] = useState(false)
  const [visibleFilterSidebarForMobile, setVisibleFilterSidebarForMobile] = useState(false)

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })

  useEffect(() => {
    setIsLoading(true)
    const getJobs = async () => {
      try {
        const response = await requestService({ path: 'jobs/active' })
        if (response.ok) {
          const allJobs = await response.json()
          setJobs(allJobs)
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Error fetching jobs:', error)
        showToast({ severity: 'error', summary: 'Error', detail: 'Error fetching jobs' })
      }
    }
    getJobs()
  }, [setJobs, showToast])

  const handleUseSelectedAddress = async () => {
    setIsLoading(true)
    if (moreAddressDetails && moreAddressDetails.location_pin) {
      const fromCoordinates = [...moreAddressDetails.location_pin].reverse()

      setLocation({ latitude: moreAddressDetails.location_pin[0], longitude: moreAddressDetails.location_pin[1] })

      try {
        const response = await requestService({
          path: 'jobs/bydistance',
          method: 'POST',
          body: JSON.stringify({ fromCoordinates }),
        })

        if (response.ok) {
          const allJobs = await response.json()
          setJobs(allJobs)
          setIsLoading(false)
        }
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching jobs:', error)
        showToast({ severity: 'error', summary: 'Error', detail: 'Error fetching jobs' })
      }
    }
  }

  const handleUseCurrentLocation = async () => {
    setIsLoading(true)
    try {
      const newResponse = await requestService({ path: 'jobs/bydistance', method: 'POST', body: JSON.stringify({}) })

      if (newResponse.ok) {
        const allJobs = await newResponse.json()
        setJobs(allJobs)
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
      showToast({ severity: 'error', summary: 'Error', detail: 'Error fetching jobs' })
    }
  }

  const handleDateChange = (selectedDates: [Date, Date]) => {
    setDates(selectedDates)

    if (selectedDates) {
      const filteredJobs = jobs.filter(job => {
        return job.job_dates.some(jobDate => {
          const date = new Date(jobDate)
          return date >= selectedDates[0] || date <= selectedDates[1]
        })
      })
      setJobs(filteredJobs)
    }
  }

  // useEffect(() => {
  //   let filteredJobs = [...(jobs || [])]
  //   if (selectedJobTitles.length > 0) {
  //     filteredJobs = filteredJobs.filter(job => selectedJobTitles.includes(job.title))
  //   }
  //   if (dates) {
  //     filteredJobs = filteredJobs.filter(job => {
  //       return job.job_dates.some(jobDate => {
  //         const date = new Date(jobDate)
  //         return date >= dates[0] && date <= dates[1]
  //       })
  //     })
  //   }
  //   if (selectedRange) {
  //     filteredJobs = filteredJobs.filter(job => job.distance <= selectedRange)
  //   }
  //   // if (isNewChecked) {
  //   //   filteredJobs = filteredJobs.filter(job => isNew(job.createdAt))
  //   // }
  //   if (isAppliedChecked) {
  //     filteredJobs = filteredJobs.filter(job =>
  //       job.applicants.some(applicant => applicant.user.toString() === _id && !applicant.is_approved),
  //     )
  //   }
  //   if (isApprovedChecked) {
  //     filteredJobs = filteredJobs.filter(job =>
  //       job.applicants.some(applicant => applicant.user.toString() === _id && applicant.is_approved),
  //     )
  //   }
  //   setJobs(filteredJobs)
  // }, [selectedJobTitles, dates, jobs, selectedRange, isNewChecked, isAppliedChecked, isApprovedChecked, _id, setJobs])

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
          {isLoading ? <HTLoadingLogo /> : jobs.map(job => <JobCard key={job._id} job={job} />)}
        </ul>
      </div>
    )
  }

  const renderFiltersContent = () => {
    const resetAllFilters = () => {
      setSelectedJobTitles([])
      setIsNewChecked(false)
      setIsAppliedChecked(false)
      setIsApprovedChecked(false)
    }

    const resetDistanceRelatedFilters = () => {
      setSelectedRange(50)
    }

    return (
      <>
        <div className="">
          <h2 className="text-xl">Filters</h2>
          <Divider />
          <div className="flex w-full">
            <AddressAutoComplete
              setMoreAddressDetails={setMoreAddressDetails}
              currentAddress="Address, City, State, Zip Code"
              classNames={classNames('rounded-br-none rounded-tr-none')}
            />
            <Button
              icon="pi pi-search"
              className="rounded-bl-none rounded-tl-none"
              aria-label="Set jobs by Selected Address"
              onClick={handleUseSelectedAddress}
            />
            <Button
              icon="pi pi-map-marker"
              className="ml-3"
              outlined
              aria-label="Get Jobs with distance from your current location"
              tooltip="Get Jobs with distance from your current location"
              onClick={handleUseCurrentLocation}
            />
          </div>
        </div>
        {location?.latitude != null && location?.longitude ? (
          <div className="my-5 px-6">
            <div className="mb-2">
              <HtInfoTooltip message="Select a range using slider below to filter jobs by distance from the selected location.">
                <HtInputLabel
                  htmlFor="range"
                  labelText={selectedRange != null ? `${selectedRange} miles away approx` : '0 Miles away approx'}
                  className="text-md"
                />
              </HtInfoTooltip>
            </div>
            <Slider
              value={selectedRange ?? undefined}
              onChange={e => {
                const value = Array.isArray(e.value) ? e.value[0] : e.value
                const filteredJobs = jobs.filter(job => job.distance <= (selectedRange ?? value))
                selectedRange !== null && setSelectedRange(value)

                setJobs(filteredJobs)
              }}
              className="w-full"
              step={5}
              min={rangeOptions[0].code}
              max={rangeOptions[rangeOptions.length - 1].code}
            />
          </div>
        ) : null}
        <div className="flex w-full justify-center">
          {location?.latitude != null && location?.longitude ? (
            <Button
              label="Clear Distance"
              className="align flex flex-row"
              text
              link
              onClick={resetDistanceRelatedFilters}
            />
          ) : null}
        </div>
        <Divider />
        <HtInfoTooltip message="Select a start and end date to filter jobs by date range." className="mb-4">
          <HtInputLabel htmlFor="date_range" labelText="Date Range" className="text-md" />
        </HtInfoTooltip>
        <div className="mb-4 pr-4">
          <Calendar
            value={dates}
            onChange={e => handleDateChange(e.value as [Date, Date])}
            selectionMode="range"
            showButtonBar
            numberOfMonths={1}
            placeholder="by Date"
            readOnlyInput
            className="w-full"
          />
        </div>
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
        <div className="flex w-full justify-end">
          <Button label="Clear Checkboxes" text link onClick={resetAllFilters} />
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
        Header: 'Number of Days',
        accessor: (row: { job_dates: string[] }) => row.job_dates.length,
      },
      {
        Header: 'Rate ($/h)',
        accessor: 'hourly_rate',
      },
      {
        Header: 'Lunch (min)',
        accessor: 'lunch_break',
      },

      { Header: 'Vacancy', accessor: 'vacancy' },
      { Header: 'Job ID', accessor: 'uid' },

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
          {/* {jobs.length > 0 ? ( */}
          <ScrollPanel style={{ width: '20%', height: '100vh' }} className="w-full">
              {renderFiltersContent()}
            </ScrollPanel>
            <ScrollPanel style={{ width: '75%', height: '100vh' }} className="w-full pl-16">
              {renderJobCards()}
              <HtScrollTop className="" />
            </ScrollPanel>
          {/* ) : (
            <h2>No jobs for today or coming up soon! </h2>
          )} */}
        </div>
      )}
    </>
  )
}
