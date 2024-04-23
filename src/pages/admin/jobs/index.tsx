/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'

import { useNavigate } from 'react-router-dom'

import { Button } from 'primereact/button'

import { HeaderComponent } from '../../../components/shared/general/HeaderComponent'
import { RequestService } from '../../../services/RequestService'
import { GlobalTable } from '../../../components/shared/GlobalTable'


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
        accessor: (d: any) => (d.is_active ? 'Active' : 'Disabled'),
        sortType: (a: any, b: any) => {
          if (a.original.is_active === b.original.active) return 0
          return a.original.is_active ? -1 : 1
        },
      }, //@ts-ignore
      {
        Header: 'Past/Present',
        accessor: (d: any) => (d.is_completed ? 'Past' : 'Present'),
        sortType: (a: any, b: any) => {
          if (a.original.is_completed === b.original.is_completed) return 0
          return a.original.is_completed ? -1 : 1
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
        accessor: (d: any) => (d.is_full ? 'Full' : 'Open'),
        sortType: (a: any, b: any) => {
          if (a.original.is_full === b.original.is_full) return 0
          return a.original.is_full ? -1 : 1
        },
      },
    ],
    [],
  )

  return (
    <div className="">
      <HeaderComponent title="Jobs" />
      <Button
        label="Add Job"
        onClick={() => {
          navigate('/admin/jobs/new')
        }}
        size="small"
      />
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-green-600" />
        </div>
      ) : (
        <GlobalTable data={memoJobsData} columns={memoJobsColumns} allowClick />
      )}
    </div>
  )
}
