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
    { Header: 'Facility', accessor: `row => row.facility.name`, Cell: ({ value }) => value || 'No Facility'},
    { Header: 'Status', accessor: 'status' },
    { Header: 'Salary', accessor: 'salary' },
    //@ts-ignore
    { Header: 'Skills', accessor: 'skills', Cell: ({ value }) => value.join(', ') },
    { Header: 'Employment Type', accessor: 'employment_type' },
  ];

  return (
    <div className="flex flex-col gap-4">
      <HeaderComponent title={'Jobs'} />
      <GlobalTable data={jobsData} columns={jobsColumns} />
    </div>
  );
}

