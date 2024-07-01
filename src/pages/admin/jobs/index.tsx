/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'

import { GlobalTable } from '../../../components/shared/GlobalTable'
import { HTLoadingLogo } from '../../../components/shared/HTLoadingLogo'
import { type IJob } from '../../../interfaces/job'
import { RequestService } from '../../../services/RequestService'

export const AdminJobs = () => {
  const [jobsData, setJobsData] = React.useState<any>([])
  const [isLoading, setIsLoading] = React.useState(true)

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

      { Header: 'Created By', accessor: 'created_by', width: 250 },
      { Header: 'UID', width: '300px', accessor: (d: IJob) => d.uid || 0 },
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
        sortType: (a: any, b: any) => {
          if (a.original.is_active === b.original.active) return 0
          return a.original.is_active ? -1 : 1
        },
      },
      { Header: 'Shifts', accessor: 'vacancy', width: 100 },
      {
        Header: 'Shift Hours',
        accessor: 'total_hours',
        width: 120,
      },

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

  return isLoading ? <HTLoadingLogo /> : <GlobalTable data={memoJobsData} columns={memoJobsColumns} allowClick />
}
