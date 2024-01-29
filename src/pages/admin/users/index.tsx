import { useState, useEffect } from 'react'
import GlobalTable from '../../../components/shared/GlobalTable'
import { RequestService } from '../../../services/RequestService'
import HeaderComponent from '../../../components/shared/general/HeaderComponent'

export default function AdminUsers() {
  const [usersData, setUsersData] = useState<any>([])

  useEffect(() => {
    const getUsers = async () => {
      const allUsers = await RequestService('users')
      setUsersData(allUsers)
    }

    getUsers()
  }, [])

  const usersColumns = [
    { Header: 'First Name', accessor: 'first_name' },
    { Header: 'Last Name', accessor: 'last_name' },
    { Header: 'Role', accessor: 'role' },
    { Header: 'Email', accessor: 'email' },
    { Header: 'Phone Number', accessor: 'phone_number' },
    { Header: 'City', accessor: 'city' },
    { Header: 'State', accessor: 'state' },
    { Header: 'Zip', accessor: 'zip' },
    { Header: 'Country', accessor: 'country' },
  ]

  return (
    <div>
      <HeaderComponent title={'Users'} />
      <button
        type="button"
        onClick={() => {
          window.location.href = '/admin/users/new'
        }}
        className="mb-4 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
        >
        Add New User
      </button>
      <GlobalTable data={usersData} columns={usersColumns} />
    </div>
  )
}
