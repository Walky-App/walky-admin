import React, {useState, useEffect, useMemo} from "react"
import { useParams, useNavigate } from "react-router-dom"
import GlobalTable from "../../../components/shared/GlobalTable"
import { RequestService } from "../../../services/RequestService"
import HeaderComponent from "../../../components/shared/general/HeaderComponent"
import AdminFacilityHeaderInfo from "./AdminFacilityHeader"

export default function AdminFacilityJobs() {
    const { facilityId } = useParams()
    const [facilityJobs, setFacilityJobs] = React.useState<any>([])
    const [isLoading, setIsLoading] = React.useState(true)
    const navigate = useNavigate()
  
    React.useEffect(() => {
      const getFacilityJobs = async () => {
        try {
          const facilityJobs = await RequestService(`jobs/facility/${facilityId}`)
          console.log('jobs by facility ---> ', facilityJobs)
          setFacilityJobs(facilityJobs)
        } catch (error) {
          console.error('Error fetching facility jobs data:', error)
        } finally {
          setIsLoading(false)
        }
      }
  
      getFacilityJobs()
    }, [])
    

    const memoFacilityJobs = useMemo(() => facilityJobs, [facilityJobs])

    const memoFacilityJobsColumns = React.useMemo(
        () => [
          { Header: 'Job Title', accessor: 'title' },
          //@ts-ignore
          { Header: 'Status', accessor: 'status' },
          { Header: 'Salary', accessor: 'salary' },
          //@ts-ignore
          { Header: 'Skills', accessor: 'skills', Cell: ({ value }) => value.join(', ') },
          { Header: 'Employment Type', accessor: 'employment_type' },
        ],
        [],
      )
  
    return (
        <>
        {/* <AdminFacilityHeaderInfo facilityId={facilityId} /> */}
      <div>
        <button
          type="button"
          onClick={() => {
            navigate(`/admin/facilities/${facilityId}/jobs/new`)
          }}
          className="mb-4 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
          Add New Job
        </button>
  
        {isLoading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <GlobalTable data={memoFacilityJobs} columns={memoFacilityJobsColumns} />
        )}
      </div>
      </>
    )
  }