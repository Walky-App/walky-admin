import { useState, useEffect } from 'react'

import { useMediaQuery } from 'react-responsive'

import { Button } from 'primereact/button'
import { Divider } from 'primereact/divider'
import { SelectButton, type SelectButtonChangeEvent } from 'primereact/selectbutton'
import { Sidebar } from 'primereact/sidebar'

import { HTLoadingLogo } from '../../../components/shared/HTLoadingLogo'
import { AddressAutoComplete, type IAddressAutoComplete } from '../../../components/shared/forms/AddressAutoComplete'
import { HtInputLabel } from '../../../components/shared/forms/HtInputLabel'
import { HtInfoTooltip } from '../../../components/shared/general/HtInfoTooltip'
import { HtScrollTop } from '../../../components/shared/general/HtScrollTop'
import { type IJob, type IApplicantWithoutPopulate } from '../../../interfaces/job'
import { requestService } from '../../../services/requestServiceNew'
import { useJobs } from '../../../store/useJobs'
import { useUtils } from '../../../store/useUtils'
import { cn } from '../../../utils/cn'
import { JobCard } from './JobCard'
import { DateSearch } from './searchComponents/DateSearch'
import { JobTypeSearch } from './searchComponents/JobTypeSearch'
import { RangeSelector } from './searchComponents/RangeSelector'
import { StatusSearch } from './searchComponents/StatusSearch'
import { TableView } from './searchComponents/TableView'

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
    setJobs,
    filteredJobs,
    setFilteredJobs,
    showRangeSelector,
    handleUseCurrentLocation,
    handleUseSelectedAddress,
  } = useJobs()
  const [view, setView] = useState<string>('list')

  const { showToast } = useUtils()

  const viewOptionsTemplate = (option: ViewOption) => <i className={option.icon} />

  const [isLoading, setIsLoading] = useState(false)
  const [moreAddressDetails, setMoreAddressDetails] = useState<IAddressAutoComplete | undefined>(undefined)
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

  const renderJobCards = () => {
    return (
      <div className="mx-auto mb-10 mt-4 px-4 sm:px-6 lg:px-8">
        <ul className="grid grid-cols-1 gap-6 lg:grid-cols-1 2xl:grid-cols-1">
          {isLoading ? (
            <HTLoadingLogo />
          ) : (
            filteredJobs.map((job: IJob) => {
              const userInJob = job.applicants.some((applicant: IApplicantWithoutPopulate) =>
                typeof applicant.user === 'object' ? applicant.user._id : applicant.user,
              )
              return <JobCard key={job._id} job={job} status={userInJob ? 'active' : ''} />
            })
          )}
        </ul>
      </div>
    )
  }

  const renderFiltersContent = () => {
    return (
      <>
        <div>
          <h2 className="text-xl">Filters for {filteredJobs.length} jobs</h2>
          <Divider />
          <HtInfoTooltip message="Enter address or your current location where you want to search by" className="mb-4">
            <HtInputLabel htmlFor="date_range" labelText="By Location" className="text-xs" />
          </HtInfoTooltip>
          <div className="flex w-full">
            <AddressAutoComplete
              setMoreAddressDetails={setMoreAddressDetails}
              currentAddress="Address, City, State, Zip Code"
              classNames={cn('rounded-br-none rounded-tr-none')}
              inputClasses={{ borderRadius: '5px 0 0 5px ' }}
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
        <DateSearch />
        <JobTypeSearch />
        <StatusSearch />
      </>
    )
  }

  return isMobile ? (
    <div className="flex flex-col items-start md:flex-row">
      <Button label="Filter & Sort" text outlined link onClick={() => setVisibleFilterSidebarForMobile(true)} />
      <Sidebar
        visible={visibleFilterSidebarForMobile}
        onHide={() => setVisibleFilterSidebarForMobile(false)}
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
        <TableView />
      ) : (
        <div className="flex flex-col md:flex-row">
          <div className="relative sticky top-0">{renderFiltersContent()}</div>
          {filteredJobs.length !== 0 ? (
            <div className="w-full pl-16">
              {renderJobCards()}
              <HtScrollTop className="" />
            </div>
          ) : (
            <div className="w-full pl-16">No jobs found</div>
          )}
        </div>
      )}
    </>
  )
}
