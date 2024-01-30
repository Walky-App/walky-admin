import * as React from 'react'
import { useNavigate } from 'react-router-dom'

import { RequestService } from '../../../services/RequestService'
import TitleComponent from '../../../components/shared/general/TitleComponent'
import GlobalTable from '../../../components/shared/GlobalTable'
import { GetTokenInfo } from '../../../utils/TokenUtils'

export default function Facilities() {
  const navigate = useNavigate()
  const user = GetTokenInfo()
  const id = user?._id
  const [facilities, setFacilities] = React.useState<any>([])
  const [jobsData, setJobsData] = React.useState<any>([])
  interface Facility {
    _id: string
  }

  React.useEffect(() => {
    const getFacilities = async () => {
      const allFacilities = await RequestService(`facilities/byclient/${id}`)
      setFacilities(allFacilities)
    }
    getFacilities()
  }, [])

  React.useEffect(() => {
    const getJobs = async () => {
      if (facilities.length > 0) {
        try {
          const jobsRequests = facilities.map((facility: Facility) => RequestService(`jobs/facility/${facility._id}`))
          const jobsResults = await Promise.all(jobsRequests)
          const allJobs = jobsResults.flat() // Flatten the array of arrays
          setJobsData(allJobs)
        } catch (error) {
          console.error('Error fetching jobs data:', error)
        }
      }
    }
    getJobs()
  }, [facilities])

  const jobsColumns = [
    { Header: 'Job Title', accessor: 'title' },
    //@ts-ignore
    { Header: 'Facility', accessor: row => row.facility?.name, Cell: ({ value }) => value || 'No Facility' },
    { Header: 'Status', accessor: 'status' },
    { Header: 'Salary', accessor: 'salary' },
    //@ts-ignore
    { Header: 'Skills', accessor: 'skills', Cell: ({ value }) => (Array.isArray(value) ? value.join(', ') : 'N/A') },
    { Header: 'Employment Type', accessor: 'employment_type' },
  ]

  return (
    <div className="mx-auto max-w-screen-xl px-4  sm:px-6 lg:px-8">
      <TitleComponent title={'Jobs'} />
      <button
        type="button"
        onClick={() => {
         // window.location.href = '/client/jobs/new'
         navigate('/client/jobs/new')
        }}
        className="mb-4 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
        Add Job
      </button>
      <GlobalTable data={jobsData} columns={jobsColumns} />
    </div>
  )
}
