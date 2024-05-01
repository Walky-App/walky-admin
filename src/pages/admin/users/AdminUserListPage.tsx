import { useEffect, useMemo, useState } from 'react'

import { Link } from 'react-router-dom'

import { Skeleton } from 'primereact/skeleton'

import { GlobalTable } from '../../../components/shared/GlobalTable'
import { HeaderComponent } from '../../../components/shared/general/HeaderComponent'
import { type IUser } from '../../../interfaces/User'
import { RequestService } from '../../../services/RequestService'
import { roleTxt } from '../../../utils/roleChecker'

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
      { Header: 'Role', accessor: (user: IUser) => roleTxt(user.role) },
      {
        Header: 'Status',
        accessor: (d: IUser) => (d.active ? 'Active' : 'Disabled'),
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
