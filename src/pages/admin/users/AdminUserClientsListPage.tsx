import { useEffect, useMemo, useState } from 'react'

import { GlobalTable } from '../../../components/shared/GlobalTable'
import { HTLoadingLogo } from '../../../components/shared/HTLoadingLogo'
import { type IUser } from '../../../interfaces/User'
import { requestService } from '../../../services/requestServiceNew'
import { roleTxt } from '../../../utils/roleChecker'

export const AdminUserClientsListPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [usersData, setUsersData] = useState<IUser[]>([])

  useEffect(() => {
    setIsLoading(true)
    const getActiveClients = async () => {
      try {
        const response = await requestService({ path: 'users/clients' })
        const data = await response.json()

        if (!response.ok) throw new Error(data.message ?? 'Failed to fetch users')

        setUsersData(data as IUser[])
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    getActiveClients()
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
      { Header: 'Phone', accessor: 'phone_number' },
      { Header: 'City', accessor: 'city' },
      { Header: 'State', accessor: 'state' },
      { Header: 'Zip', accessor: 'zip' },
      { Header: 'Country', accessor: 'country' },
    ],
    [],
  )

  return isLoading ? (
    <HTLoadingLogo />
  ) : (
    <>
      <div className="text-right" />
      <GlobalTable data={memoUsersData} columns={memoUsersColumns} allowClick />
    </>
  )
}
