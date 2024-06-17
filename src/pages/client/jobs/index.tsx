/*eslint-disable */
import * as React from 'react'

import { useNavigate } from 'react-router-dom'

import { Button } from 'primereact/button'

import { GlobalTable } from '../../../components/shared/GlobalTable'
import { RequestService } from '../../../services/RequestService'
import { GetTokenInfo } from '../../../utils/tokenUtil'

export default function Facilities() {
  const navigate = useNavigate()
  const user = GetTokenInfo()
  const id = user?._id
  const [jobsData, setJobsData] = React.useState<any>([])
  interface Facility {
    _id: string
  }

  React.useMemo(() => {
    const getJobs = async () => {
      try {
        const allJobs = await RequestService(`jobs/client/${id}`)
        setJobsData(allJobs)
      } catch (error) {
        console.error('Error fetching jobs data:', error)
      }
    }
    getJobs()
  }, [])

  const jobsColumns = [
    { Header: 'Start date', accessor: (job: any) => new Date(job.job_dates[0]).toLocaleString(), width: '200px' },
    { Header: 'Job', accessor: 'title' },
    { Header: 'Facility', width: '300px', accessor: 'facility.name' },
    {
      Header: 'Status',
      width: '100px',
      accessor: (d: any) => (d.is_active ? 'Active' : 'Disabled'),
      sortType: (a: any, b: any) => {
        if (a.original.is_active === b.original.active) return 0
        return a.original.is_active ? -1 : 1
      },
    },
    {
      Header: 'old/new',
      accessor: (d: any) => (d.is_completed ? 'Old' : 'Present'),
      sortType: (a: any, b: any) => {
        if (a.original.is_completed === b.original.is_completed) return 0
        return a.original.is_completed ? -1 : 1
      },
    },
    {
      Header: 'Hours',
      width: '100px',
      accessor: (d: any) => d.total_hours || 0,
    },
    { Header: 'Vacancy', accessor: 'vacancy', width: '70px' },
    { Header: 'Rate', width: '70px', accessor: (d: any) => (d.hourly_rate ? `$ ${d.hourly_rate}` : '') },
    {
      Header: 'Full',
      accessor: (d: any) => (d.is_full ? 'yes' : 'no'),
      sortType: (a: any, b: any) => {
        if (a.original.is_full === b.original.is_full) return 0
        return a.original.is_full ? -1 : 1
      },
    },
  ]

  return (
    <div className="mx-auto ">
      <Button
        label="Add Job"
        onClick={() => {
          navigate('/client/jobs/new')
        }}
        size="small"
      />
      <GlobalTable data={jobsData} columns={jobsColumns} allowClick />
    </div>
  )
}
