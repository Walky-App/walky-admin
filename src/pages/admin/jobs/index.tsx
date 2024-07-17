import { useEffect, useMemo, useState } from 'react'

import { format, isToday, isYesterday } from 'date-fns'

import { GlobalTable } from '../../../components/shared/GlobalTable'
import { HTLoadingLogo } from '../../../components/shared/HTLoadingLogo'
import { type IJob } from '../../../interfaces/job'
import { requestService } from '../../../services/requestServiceNew'

export const AdminJobs = () => {
  const [jobsData, setJobsData] = useState<IJob[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getJobs = async () => {
      try {
        const response = await requestService({ path: 'jobs' })

        if (response.ok) {
          const allJobs = await response.json()
          setJobsData(allJobs)
        }
      } catch (error) {
        console.error('Error fetching job data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    getJobs()
  }, [])

  const memoJobsData = useMemo(() => jobsData, [jobsData])

  const memoJobsColumns = useMemo(
    () => [
      { Header: 'ID', width: '100px', accessor: (d: IJob) => `#${d.uid}` || 0 },
      { Header: 'Job Title', accessor: 'title' },
      { Header: 'Facility', accessor: 'facility.name' },
      { Header: 'Created By', accessor: 'created_by', width: 250 },
      {
        Header: 'Created',
        width: 200,
        accessor: (a: IJob) => {
          return isToday(a.createdAt) ? 'Today' : isYesterday(a.createdAt) ? 'Yesterday' : format(a.createdAt, 'P')
        },
      },
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
        sortType: (a: IJob, b: IJob) => {
          if (a.is_active === b.is_active) return 0
          return a.is_active ? -1 : 1
        },
      },
      { Header: 'Shifts', accessor: 'vacancy', width: 100 },
      { Header: 'Temps', width: 100, accessor: (a: IJob) => a.applicants.length || '0 ❌' },
      {
        Header: 'Shift Hours',
        accessor: 'total_hours',
        width: 120,
      },
      {
        Header: 'Availability',
        accessor: (d: IJob) => (d.vacancy === d.applicants.length ? '✅' : 'Open'),
        sortType: (a: IJob, b: IJob) => {
          if (a.is_full === b.is_full) return 0
          return a.is_full ? -1 : 1
        },
      },
    ],
    [],
  )

  return isLoading ? <HTLoadingLogo /> : <GlobalTable data={memoJobsData} columns={memoJobsColumns} allowClick />
}
