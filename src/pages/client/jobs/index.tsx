/*eslint-disable */
import * as React from 'react'

import { useNavigate } from 'react-router-dom'

import { Button } from 'primereact/button'

import GlobalTable from '../../../components/shared/GlobalTable'
import { TitleComponent } from '../../../components/shared/general/TitleComponent'
import { RequestService } from '../../../services/RequestService'
import { GetTokenInfo } from '../../../utils/TokenUtils'

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
        console.log('All Jobs:', allJobs)
        setJobsData(allJobs)
      } catch (error) {
        console.error('Error fetching jobs data:', error)
      }
    }
    getJobs()
  }, [])

  const jobsColumns = [
    { Header: 'Job Title', accessor: 'title' },
    { Header: 'Facility', accessor: 'facility.name' },
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
    }, //@ts-ignore
    {
      Header: 'Total Hours',
      accessor: 'total_hours',
    }, //@ts-ignore
    { Header: 'Vacancy', accessor: 'vacancy' },
    { Header: 'Hourly Rate', accessor: 'hourly_rate' },
    {
      Header: 'Availability',
      accessor: (d: any) => (d.is_full ? 'Full' : 'Open'),
      sortType: (a: any, b: any) => {
        if (a.original.is_full === b.original.is_full) return 0
        return a.original.is_full ? -1 : 1
      },
    },
  ]

  return (
    <div className="mx-auto max-w-screen-xl px-4  sm:px-6 lg:px-8">
      <TitleComponent title={'Jobs'} />
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
