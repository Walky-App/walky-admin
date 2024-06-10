/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useMemo } from 'react'

import { useNavigate, useParams } from 'react-router-dom'

import { GlobalTable } from '../../../components/shared/GlobalTable'
import { SubHeader } from '../../../components/shared/SubHeader'
import { type IFacility } from '../../../interfaces/facility'
import { RequestService } from '../../../services/RequestService'
import { GetTokenInfo } from '../../../utils/tokenUtil'
import { adminFacilitiesLinks } from './adminFacilitySubHeaderLinks'

const admin_role = process.env.REACT_APP_ADMIN_ROLE as string
const client_role = process.env.REACT_APP_CLIENT_ROLE as string
const sales_role = process.env.REACT_APP_SALES_ROLE as string

export const AdminFacilityJobs = () => {
  const userRole = GetTokenInfo().role
  const { facilityId } = useParams()
  const [facility, setFacility] = useState<IFacility>()
  const [facilityJobs, setFacilityJobs] = useState<any>([])
  const [isLoading, setIsLoading] = useState(true)

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
      { Header: 'Job Title', accessor: 'title' },
      {
        Header: 'Status',
        accessor: (d: any) => (d.is_active ? 'Active' : 'Disabled'),
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
        Header: 'Facility',
        accessor: 'facility.name',
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
        accessor: (d: any) => (d.is_full ? 'Full' : 'Open'),
        sortType: (a: any, b: any) => {
          if (a.original.is_full === b.original.is_full) return 0
          return a.original.is_full ? -1 : 1
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
      {facility ? <SubHeader data={facility} links={adminFacilitiesLinks} /> : null}
      <div>
        <button
          type="button"
          onClick={() => navigate(roleBasedPath)}
          className="mb-4 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
          ss
        </button>
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-green-600" />
          </div>
        ) : facilityJobs.length > 0 ? (
          <GlobalTable data={facilityJobs} columns={memoFacilityJobsColumns} allowClick />
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
