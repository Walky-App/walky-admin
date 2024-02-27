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
      console.log('All Facilities:', allFacilities)
      setFacilities(allFacilities)
    }
    getFacilities()
  }, [])

  React.useMemo(() => {
    const getJobs = async () => {
      if (facilities.length > 0) {
        try {
          const jobsRequests = facilities.map((facility: Facility) => RequestService(`jobs/facility/${facility._id}`))
          let jobsResults = await Promise.all(jobsRequests)
          jobsResults = jobsResults.filter(job => job.message !== 'No jobs found')
          const allJobs = jobsResults.flat()
          console.log('All Jobs:', allJobs)
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
    {
      Header: 'Status',
      accessor: (d: any) => (d.isActive ? 'Active' : 'Disabled'),
      sortType: (a: any, b: any) => {
        if (a.original.isActive === b.original.active) return 0
        return a.original.isActive ? -1 : 1
      },
    },    //@ts-ignore
    {
      Header: 'Past/Present',
      accessor: (d: any) => (d.isCompleted ? 'Past' : 'Present'),
      sortType: (a: any, b: any) => {
        if (a.original.isCompleted === b.original.isCompleted) return 0
        return a.original.isCompleted ? -1 : 1
      },
    },    //@ts-ignore
    { Header: 'Skills', accessor: 'skills', Cell: ({ value }) => (Array.isArray(value) ? value.join(', ') : 'N/A') },
    { Header: 'Vacancy', accessor: 'vacancy' },
    {
      Header: 'Availability',
      accessor: (d: any) => (d.isFull ? 'Full' : 'Open'),
      sortType: (a: any, b: any) => {
        if (a.original.isFull === b.original.isFull) return 0
        return a.original.isFull ? -1 : 1
      },
    }  ]

  return (
    <div className="mx-auto max-w-screen-xl px-4  sm:px-6 lg:px-8">
      <TitleComponent title={'Jobs'} />
      <button
        type="button"
        onClick={() => {
          navigate('/client/jobs/new')
        }}
        className="mb-4 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
        Add Job
      </button>
      <GlobalTable data={jobsData} columns={jobsColumns} allowClick />
    </div>
  )
}
