import { useState, useEffect, useMemo } from 'react'

import { useNavigate, useParams } from 'react-router-dom'

import { format, isToday, isYesterday } from 'date-fns'

import { GlobalTable } from '../../../components/shared/GlobalTable'
import { SubHeader } from '../../../components/shared/SubHeader'
import { type IFacility } from '../../../interfaces/facility'
import { type IJob } from '../../../interfaces/job'
import { RequestService } from '../../../services/RequestService'
import { roleChecker } from '../../../utils/roleChecker'
import { GetTokenInfo } from '../../../utils/tokenUtil'
import { clientFacilitiesLink } from '../../client/facilities/clientSubHeaderLinks'
import { adminFacilitiesLinks } from './adminFacilitySubHeaderLinks'

const admin_role = process.env.REACT_APP_ADMIN_ROLE as string
const client_role = process.env.REACT_APP_CLIENT_ROLE as string
const sales_role = process.env.REACT_APP_SALES_ROLE as string

export const AdminFacilityJobs = () => {
  const userRole = GetTokenInfo().role
  const { facilityId } = useParams()
  const [facility, setFacility] = useState<IFacility>()
  const [facilityJobs, setFacilityJobs] = useState<IJob[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const role = roleChecker()

  const navigate = useNavigate()

  useEffect(() => {
    const getFacility = async () => {
      try {
        const facility = await RequestService(`facilities/${facilityId}`)
        if (facility) {
          setFacility(facility)
        }
      } catch (error) {
        console.error('Error fetching facility data:', error)
      }
    }
    const getFacilityJobs = async () => {
      try {
        const facilityJobs = await RequestService(`jobs/facility/${facilityId}`)
        if (facilityJobs && Array.isArray(facilityJobs)) {
          setFacilityJobs(facilityJobs)
        } else {
          setFacilityJobs([])
        }
      } catch (error) {
        console.error('Error fetching facility jobs data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    getFacility()
    getFacilityJobs()
  }, [facilityId]) // Ensure useEffect is run whenever facilityId changes

  const memoFacilityJobsColumns = useMemo(
    () => [
      { Header: 'ID', width: '100px', accessor: (d: IJob) => `#${d.uid}` || 0 },
      { Header: 'Job Title', accessor: 'title' },
      { Header: 'Facility', accessor: 'facility.name' },
      { Header: 'Created By', accessor: 'created_by', width: 250 },
      {
        Header: 'Created',
        width: 200,
        accessor: (a: IJob) => {
          return isToday(a.createdAt) ? 'Today' : isYesterday(a.createdAt) ? 'Yesterday' : format(a.createdAt, 'P')
        },
      },
      { Header: 'Job Starts', width: 120, accessor: (item: IJob) => new Date(item.job_dates[0]).toLocaleDateString() },
      {
        Header: 'Job Ends',
        width: 100,
        accessor: (item: IJob) => new Date(item.job_dates[item.job_dates.length - 1]).toLocaleDateString(),
      },
      {
        Header: 'Status',
        width: 100,
        accessor: (d: IJob) => (d.is_active ? 'Active' : 'Disabled'),
        sortType: (a: IJob, b: IJob) => {
          if (a.is_active === b.is_active) return 0
          return a.is_active ? -1 : 1
        },
      },
      { Header: 'Shifts', accessor: 'vacancy', width: 100 },
      { Header: 'Temps', width: 100, accessor: (a: IJob) => a.applicants.length || '0 ❌' },
      {
        Header: 'Shift Hours',
        accessor: 'total_hours',
        width: 120,
      },
      {
        Header: 'Availability',
        accessor: (d: IJob) => (d.vacancy === d.applicants.length ? '✅' : 'Open'),
        sortType: (a: IJob, b: IJob) => {
          if (a.is_full === b.is_full) return 0
          return a.is_full ? -1 : 1
        },
      },
    ],
    [],
  )

  let roleBasedPath = ''

  if (userRole === admin_role) {
    roleBasedPath = `/admin/jobs/new`
  } else if (userRole === client_role) {
    roleBasedPath = `/client/jobs/new`
  } else if (userRole === sales_role) {
    roleBasedPath = `/sales/facilities/${facilityId}/jobs/new`
  }

  return (
    <>
      {facility ? (
        <SubHeader data={facility} links={role === 'admin' ? adminFacilitiesLinks : clientFacilitiesLink} />
      ) : null}
      <div>
        <button
          type="button"
          onClick={() => navigate(roleBasedPath)}
          className="mb-4 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
          Add Job
        </button>
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-green-600" />
          </div>
        ) : facilityJobs.length > 0 ? (
          role === 'admin' ? (
            <GlobalTable data={facilityJobs} columns={memoFacilityJobsColumns} allowClick />
          ) : (
            <GlobalTable data={facilityJobs} columns={memoFacilityJobsColumns} />
          )
        ) : (
          <div className="text-left">
            <h2 className="text-3xl font-semibold text-gray-900">No jobs found for this facility</h2>
            <p className="mt-1 text-sm text-gray-500">Please add a new job</p>
          </div>
        )}
      </div>
    </>
  )
}
