import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from 'primereact/button'

import { HeaderComponent } from '../../../components/shared/general/HeaderComponent'
import GlobalTable from '../../../components/shared/GlobalTable'
import { RequestService } from '../../../services/RequestService'

export default function AdminJobs() {
  const [jobsData, setJobsData] = React.useState<any>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const navigate = useNavigate()

  React.useEffect(() => {
    const getJobs = async () => {
      try {
        const allJobs = await RequestService('jobs')
        setJobsData(allJobs)
      } catch (error) {
        console.error('Error fetching job data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    getJobs()
  }, [])

  const memoJobsData = React.useMemo(() => jobsData, [jobsData])

  const memoJobsColumns = React.useMemo(
    () => [
      { Header: 'Job Title', accessor: 'title' },
      { Header: 'Facility', accessor: 'facility.name' },
      { Header: 'Created By', accessor: 'created_by' },
      //@ts-ignore
      {
        Header: 'Status',
        accessor: (d: any) => (d.isActive ? 'Active' : 'Disabled'),
        sortType: (a: any, b: any) => {
          if (a.original.isActive === b.original.active) return 0
          return a.original.isActive ? -1 : 1
        },
      }, //@ts-ignore
      {
        Header: 'Past/Present',
        accessor: (d: any) => (d.isCompleted ? 'Past' : 'Present'),
        sortType: (a: any, b: any) => {
          if (a.original.isCompleted === b.original.isCompleted) return 0
          return a.original.isCompleted ? -1 : 1
        },
      },
      {
        Header: 'Total Hours',
        accessor: 'total_hours',
      },
      //@ts-ignore
      { Header: 'Vacancy', accessor: 'vacancy' },
      {
        Header: 'Availability',
        accessor: (d: any) => (d.isFull ? 'Full' : 'Open'),
        sortType: (a: any, b: any) => {
          if (a.original.isFull === b.original.isFull) return 0
          return a.original.isFull ? -1 : 1
        },
      },
    ],
    [],
  )

  return (
    <div className="">
      <HeaderComponent title={'Jobs'} />
      <Button
        label="Add Job"
        onClick={() => {
          navigate('/admin/jobs/new')
        }}
        size="small"
      />
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-green-600"></div>
        </div>
      ) : (
        <GlobalTable data={memoJobsData} columns={memoJobsColumns} allowClick />
      )}
    </div>
  )
}
