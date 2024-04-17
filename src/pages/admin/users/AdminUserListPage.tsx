/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from 'react'

import { Link } from 'react-router-dom'

import { Skeleton } from 'primereact/skeleton'

import GlobalTable from '../../../components/shared/GlobalTable'
import { HeaderComponent } from '../../../components/shared/general/HeaderComponent'
import { type IUser } from '../../../interfaces/User'
import { RequestService } from '../../../services/RequestService'

export const AdminUserListPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [usersData, setUsersData] = useState<IUser[]>([])

  useEffect(() => {
    setIsLoading(true)
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

  const memoUsersData = useMemo(() => usersData, [usersData])

  const memoUsersColumns = useMemo(
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

  if (isLoading) {
    return <Skeleton width="100%" height="100%" />
  }

  return (
    <>
      <HeaderComponent title="Users" />
      <div className="text-right">
        <Link to="/admin/users/invite" className="p-button mb-4 font-bold">
          Invite User
        </Link>
      </div>
      <GlobalTable data={memoUsersData} columns={memoUsersColumns} allowClick />
    </>
  )
}
