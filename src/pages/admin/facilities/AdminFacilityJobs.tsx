/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useMemo } from 'react'

import { useNavigate, useParams } from 'react-router-dom'

import GlobalTable from '../../../components/shared/GlobalTable'
import { SubHeader } from '../../../components/shared/SubHeader'
import { type IFacility } from '../../../interfaces/Facility'
import { RequestService } from '../../../services/RequestService'
import { adminFacilitiesLinks } from './adminFacilitySubHeaderLinks'

export const AdminFacilityJobs = () => {
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
      { Header: 'Status', accessor: 'status' },
      { Header: 'Salary', accessor: 'salary' },
      {
        Header: 'Skills',
        accessor: 'skills',
        Cell: ({ value }: { value: string[] }) => (value ? value.join(', ') : ''),
      },
      { Header: 'Employment Type', accessor: 'employment_type' },
    ],
    [],
  )

  return (
    <>
      {facility ? <SubHeader data={facility} links={adminFacilitiesLinks} /> : null}
      <div>
        <button
          type="button"
          onClick={() => navigate(`/admin/facilities/${facilityId}/jobs/new`)}
          className="mb-4 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
          Add Job
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
