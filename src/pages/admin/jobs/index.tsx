import React from 'react'
import GlobalTable from '../../../components/shared/GlobalTable'
import { RequestService } from '../../../services/RequestService'
import HeaderComponent from '../../../components/shared/general/HeaderComponent'
import { useNavigate } from 'react-router-dom'

export default function AdminJobs() {
  const [jobsData, setJobsData] = React.useState<any>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const navigate = useNavigate()

  React.useEffect(() => {
    const getJobs = async () => {
      try {
        const allJobs = await RequestService('jobs')
        setJobsData(allJobs);
      } catch (error) {
        console.error('Error fetching job data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getJobs()
  }, [])

  const memoJobsData = React.useMemo(() => jobsData, [jobsData])

  const memoJobsColumns = React.useMemo(() => [
    { Header: 'Job Title', accessor: 'title' },
    //@ts-ignore
    { Header: 'Facility', accessor: row => row.facility?.name, Cell: ({ value }) => value || 'No Facility' },
    { Header: 'Status', accessor: 'status' },
    { Header: 'Salary', accessor: 'salary' },
    //@ts-ignore
    { Header: 'Skills', accessor: 'skills', Cell: ({ value }) => value.join(', ') },
    { Header: 'Employment Type', accessor: 'employment_type' },
  ], [])

  return (
    <div className="">
      <HeaderComponent title={'Jobs'} />
      <button
        type="button"
        onClick={() => {
          navigate ('/admin/jobs/new')
        }}
        className="mb-4 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
        Post New Job
      </button>
      {isLoading ? (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
      </div>
    ) : (
      <GlobalTable data={memoJobsData} columns={memoJobsColumns} />
    )}
  </div>
  )
}
