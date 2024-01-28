import React from 'react';
import GlobalTable from '../../../components/shared/GlobalTable'
import { RequestService } from '../../../services/RequestService'
import HeaderComponent from '../../../components/shared/general/HeaderComponent';

export default function AdminJobs() {
  const [jobsData, setJobsData] = React.useState<any>([])

  React.useEffect(() => {
    const getJobs = async () => {
      const allJobs = await RequestService('jobs')
      setJobsData(allJobs)
    }

    getJobs()
  }, [])

  const jobsColumns = [
    { Header: 'Job Title', accessor: 'title' },
    //@ts-ignore
    { Header: 'Facility', accessor: row => row.facility?.name, Cell: ({ value }) => value || 'No Facility' },
    { Header: 'Status', accessor: 'status' },
    { Header: 'Salary', accessor: 'salary' },
    //@ts-ignore
    { Header: 'Skills', accessor: 'skills', Cell: ({ value }) => value.join(', ') },
    { Header: 'Employment Type', accessor: 'employment_type' },
  ];

  return (
    <div className=" px-20 ">
      <HeaderComponent title={'Jobs'} />
      <button
        type="button"
        onClick={() => {
          window.location.href = '/admin/jobs/new'
        }}
        className="mb-4 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
        Post New Job
      </button>
      <GlobalTable data={jobsData} columns={jobsColumns} />
    </div>
  );
}

