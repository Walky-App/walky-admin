import { useMemo } from 'react'

import { GlobalTable } from '../../../../components/shared/GlobalTable'
import { type IJob } from '../../../../interfaces/job'
import { useJobs } from '../../../../store/useJobs'

export const TableView = () => {
  const { jobs } = useJobs()
  const memoEmployeeJobsColumns = useMemo(
    () => [
      { Header: 'Job Title', accessor: 'title' },
      {
        Header: 'Status',
        accessor: (d: IJob) => (d.is_active ? 'Active' : 'Disabled'),
        sortType: (a: { original: IJob }, b: { original: IJob }) => {
          if (a.original.is_active === b.original.is_active) return 0
          return a.original.is_active ? -1 : 1
        },
      },
      {
        Header: 'Hours per Day',
        accessor: 'total_hours',
      },
      {
        Header: 'Number of Days',
        accessor: (row: { job_dates: string[] }) => row.job_dates.length,
      },
      {
        Header: 'Rate ($/h)',
        accessor: 'hourly_rate',
      },
      {
        Header: 'Lunch (min)',
        accessor: 'lunch_break',
      },

      { Header: 'Vacancy', accessor: 'vacancy' },
      { Header: 'Job ID', accessor: 'uid' },

      {
        Header: 'Availability',
        accessor: (d: IJob) => (d.is_full ? 'Full' : 'Open'),
        sortType: (a: { original: IJob }, b: { original: IJob }) => {
          if (a.original.is_full === b.original.is_full) return 0
          return a.original.is_full ? -1 : 1
        },
      },
    ],
    [],
  )

  return <GlobalTable data={jobs} columns={memoEmployeeJobsColumns} allowClick />
}
