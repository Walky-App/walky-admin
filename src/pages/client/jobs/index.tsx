import * as React from 'react'

import { RequestService } from '../../../services/RequestService'
import HeaderComponent from '../../../components/shared/general/HeaderComponent'
import GlobalTable from '../../../components/shared/GlobalTable'

export default function Jobs() {
  const [jobs, setJobs] = React.useState<any>([])

  React.useEffect(() => {
    const getJobs = async () => {
      const allJobs = await RequestService('jobs')
      setJobs(allJobs)
    }

    getJobs()
  }, [])

  const jobsColumns = [
    { Header: 'Job Title', accessor: 'title' },
    //@ts-ignore
    { Header: 'Facility', accessor: `row => row.facility.name`, Cell: ({ value }) => value || 'No Facility' },
    { Header: 'Status', accessor: 'status' },
    { Header: 'Salary', accessor: 'salary' },
    //@ts-ignore
    { Header: 'Skills', accessor: 'skills', Cell: ({ value }) => value.join(', ') },
    { Header: 'Employment Type', accessor: 'employment_type' },
  ]

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-10 sm:px-6 lg:px-8">
      <HeaderComponent title={'Jobs'} />

      <div className="flex flex-col gap-4">
        <GlobalTable data={jobs} columns={jobsColumns} />
      </div>
    </div>
  )
}
