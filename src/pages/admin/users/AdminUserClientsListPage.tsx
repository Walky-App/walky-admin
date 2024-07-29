import { useEffect, useMemo, useState } from 'react'

import { format, isToday, isYesterday } from 'date-fns'

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
      {
        Header: 'Approved',
        width: 100,
        accessor: (d: IUser) => (d.is_approved ? '✅' : '❌') ?? 'N/A',
      },
      {
        Header: 'Onboarded',
        width: 100,
        accessor: (d: IUser) => (d.onboarding?.completed ? '✅' : '❌'),
      },
      {
        Header: 'Joined',
        width: 200,
        accessor: (a: IUser) => {
          return isToday(a.createdAt as string)
            ? 'Today ⭐️'
            : isYesterday(a.createdAt as string)
              ? 'Yesterday'
              : format(a.createdAt as string, 'P')
        },
      },
      { Header: 'Email', accessor: 'email', width: 250 },
      {
        Header: 'Companies',
        accessor: (client: IUser) => {
          if (!client?.companies?.length) return 'n/a'
          return client?.companies?.map(company => (typeof company === 'object' ? company.company_name : '')).join(', ')
        },
        width: 250,
      },
      { Header: 'State', accessor: 'state' },
      { Header: 'Role', accessor: (user: IUser) => roleTxt(user.role) },
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
