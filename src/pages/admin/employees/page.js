import GlobalTable from '@/components/shared/GlobalTable'
import { RequestService } from '@/services/RequestService'

const fetchEmployeeData = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API}/users`)
  const EmployeeData = await response.json()
  return EmployeeData
}

export default async function EmployeePage() {
  const employeeData = await RequestService('users')
  // const employeeData = await fetchEmployeeData();

  const employeeColumns = [
    {
      Header: 'First Name',
      accessor: 'first_name',
    },
    {
      Header: 'Last Name',
      accessor: 'last_name',
    },
    {
      Header: 'Email',
      accessor: 'email',
    },
    {
      Header: 'Phone Number',
      accessor: 'phone_number',
    },
    {
      Header: 'City',
      accessor: 'city',
    },
    {
      Header: 'State',
      accessor: 'state',
    },
    {
      Header: 'Zip',
      accessor: 'zip',
    },
    {
      Header: 'Country',
      accessor: 'country',
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <GlobalTable data={employeeData} columns={employeeColumns} />
    </div>
  )
}
