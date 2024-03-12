import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from 'primereact/button'

import { TitleComponent } from '../../../components/shared/general/TitleComponent'
import GlobalTable from '../../../components/shared/GlobalTable'
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
    }, //@ts-ignore
    {
      Header: 'Total Hours',
      accessor: 'total_hours',
    }, //@ts-ignore
    { Header: 'Vacancy', accessor: 'vacancy' },
    {
      Header: 'Availability',
      accessor: (d: any) => (d.isFull ? 'Full' : 'Open'),
      sortType: (a: any, b: any) => {
        if (a.original.isFull === b.original.isFull) return 0
        return a.original.isFull ? -1 : 1
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
        size='small'
      />
      <GlobalTable data={jobsData} columns={jobsColumns} allowClick />
    </div>
  )
}
