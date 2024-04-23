/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { HeaderComponent } from '../../../components/shared/general/HeaderComponent'
import { RequestService } from '../../../services/RequestService'
import GlobalTable from '../../../components/shared/GlobalTable'

export default function AdminUsers() {
  const [usersData, setUsersData] = useState<any>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const navigate = useNavigate()

  React.useEffect(() => {
    const getUsers = async () => {
      try {
        const allUsers = await RequestService('users')
        setUsersData(allUsers)
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    getUsers()
  }, [])

  const memoUsersData = React.useMemo(() => usersData, [usersData])

  const memoUsersColumns = React.useMemo(
    () => [
      { Header: 'First Name', accessor: 'first_name' },
      { Header: 'Last Name', accessor: 'last_name' },
      { Header: 'Role', accessor: 'role' },
      {
        Header: 'Status',
        accessor: (d: any) => (d.active ? 'Active' : 'Disabled'),
        sortType: (a: any, b: any) => {
          if (a.original.active === b.original.active) return 0
          return a.original.active ? -1 : 1
        },
      },
      { Header: 'Email', accessor: 'email' },
      { Header: 'Phone Number', accessor: 'phone_number' },
      { Header: 'City', accessor: 'city' },
      { Header: 'State', accessor: 'state' },
      { Header: 'Zip', accessor: 'zip' },
      { Header: 'Country', accessor: 'country' },
    ],
    [],
  )

  return (
    <div>
      <HeaderComponent title="Users" />
      <button
        type="button"
        onClick={() => {
          navigate('/admin/users/invite')
        }}
        className="mb-4 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
        Invite User
      </button>
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-green-600" />
        </div>
      ) : (
        <GlobalTable data={memoUsersData} columns={memoUsersColumns} allowClick />
      )}
    </div>
  )
}
