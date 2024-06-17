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
import { RangeSelector } from './searchComponents/RangeSelector'

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

interface ViewOption {
  icon: string
  value: string
}

const viewOptions: ViewOption[] = [
  { icon: 'pi pi-bars', value: 'list' },
  { icon: 'pi pi-table', value: 'grid' },
]

export const EmployeeJobs = () => {
  const {
    jobs,
    setJobs,
    filteredJobs,
    setFilteredJobs,
    showRangeSelector,
    handleUseCurrentLocation,
    handleUseSelectedAddress,
  } = useJobs()
  // const { _id } = GetTokenInfo()
  const [view, setView] = useState<string>('list')

  const { showToast } = useUtils()

  const viewOptionsTemplate = (option: ViewOption) => {
    return <i className={option.icon} />
  }

  const [selectedJobTitles, setSelectedJobTitles] = useState<string[]>([])
  const [dates, setDates] = useState<[Date, Date] | null>(null)
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
          setFilteredJobs(allJobs)
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Error fetching jobs:', error)
        showToast({ severity: 'error', summary: 'Error', detail: 'Error fetching jobs' })
      }
    }
    getJobs()
  }, [setFilteredJobs, setJobs, showToast])

  const handleDateChange = (selectedDates: [Date, Date]) => {
    setDates(selectedDates)

    const filteredJobs = jobs.filter(job => {
      return job.job_dates.some(jobDate => {
        const date = new Date(jobDate)
        return date >= selectedDates[0] || date <= selectedDates[1]
      })
    })
    setJobs(filteredJobs)
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
          {isLoading ? <HTLoadingLogo /> : filteredJobs.map(job => <JobCard key={job._id} job={job} />)}
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

    return (
      <>
        <div className="">
          <h2 className="text-xl">Filters for {filteredJobs.length} jobs</h2>
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
              onClick={() =>
                handleUseSelectedAddress({
                  latitude: moreAddressDetails?.location_pin?.[0] ?? 0,
                  longitude: moreAddressDetails?.location_pin?.[1] ?? 0,
                })
              }
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

        {showRangeSelector ? <RangeSelector /> : null}

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
      <div className="mb-3 flex w-full justify-end">
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
