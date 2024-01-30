import * as React from 'react'

import { RequestService } from '../../../services/RequestService'
import TitleComponent from '../../../components/shared/general/TitleComponent'
import GlobalTable from '../../../components/shared/GlobalTable'
import { GetTokenInfo } from '../../../utils/TokenUtils'

export default function Facilities() {
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
    <div className="flex flex-col gap-4">
      <TitleComponent title={'Jobs'} />
      <GlobalTable data={jobsData} columns={jobsColumns} />
    </div>
  )
}
