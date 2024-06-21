import * as React from 'react'

import { GlobalTable } from '../../../components/shared/GlobalTable'
import { HTLoadingLogo } from '../../../components/shared/HTLoadingLogo'
import { type IJob } from '../../../interfaces/job'
import { RequestService } from '../../../services/RequestService'
import { GetTokenInfo } from '../../../utils/tokenUtil'

export const ClientJobs = () => {
  const user = GetTokenInfo()
  const id = user?._id
  const [jobsData, setJobsData] = React.useState<IJob[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useMemo(() => {
    const getJobs = async () => {
      try {
        const allJobs = await RequestService(`jobs/client/${id}`)
        setJobsData(allJobs)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching jobs data:', error)
      }
    }
    getJobs()
  }, [id])

  const jobsColumns = [
    {
      Header: 'Start date',
      accessor: (job: IJob) => new Date(job.job_dates[0]).toLocaleString(),
      width: '200px',
    },
    { Header: 'Job', accessor: 'title' },
    { Header: 'Facility', width: '300px', accessor: 'facility.name' },
    {
      Header: 'Status',
      width: '100px',
      accessor: (d: IJob) => (d.is_active ? 'Active' : 'Disabled'),
      sortType: (a: { original: IJob }, b: { original: IJob }) => {
        if (a.original.is_active === b.original.is_active) return 0
        return a.original.is_active ? -1 : 1
      },
    },
    {
      Header: 'old/new',
      accessor: (d: IJob) => (d.is_completed ? 'Old' : 'Present'),
      sortType: (a: { original: IJob }, b: { original: IJob }) => {
        if (a.original.is_completed === b.original.is_completed) return 0
        return a.original.is_completed ? -1 : 1
      },
    },
    {
      Header: 'Hours',
      width: '100px',
      accessor: (d: IJob) => d.total_hours || 0,
    },
    { Header: 'Vacancy', accessor: 'vacancy', width: '70px' },
    {
      Header: 'Rate',
      width: '70px',
      accessor: (d: IJob) => (d.hourly_rate ? `$ ${d.hourly_rate}` : ''),
    },
    {
      Header: 'Full',
      accessor: (d: IJob) => (d.is_full ? 'yes' : 'no'),
      sortType: (a: { original: IJob }, b: { original: IJob }) => {
        if (a.original.is_full === b.original.is_full) return 0
        return a.original.is_full ? -1 : 1
      },
    },
  ]

  return (
    <div className="mx-auto ">
      {isLoading ? (
        <HTLoadingLogo />
      ) : jobsData.length > 0 ? (
        <GlobalTable data={jobsData} columns={jobsColumns} allowClick />
      ) : (
        <div className="mt-4">No jobs have been posted yet.</div>
      )}
    </div>
  )
}
