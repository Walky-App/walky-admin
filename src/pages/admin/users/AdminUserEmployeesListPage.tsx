import { useEffect, useMemo, useState } from 'react'

import { format, isToday, isYesterday } from 'date-fns'

import { GlobalTable } from '../../../components/shared/GlobalTable'
import { HTLoadingLogo } from '../../../components/shared/HTLoadingLogo'
import { type IUser } from '../../../interfaces/User'
import { requestService } from '../../../services/requestServiceNew'
import { roleTxt } from '../../../utils/roleChecker'

interface IRow {
  row: { original: IUser }
  value: string
}

const Avatar = ({ src, alt = 'avatar' }: { src: string; alt?: string }) => (
  <img src={src} alt={alt} className="h-32 w-32 object-cover" />
)

export const AdminUserEmployeesListPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [usersData, setUsersData] = useState<IUser[]>([])

  useEffect(() => {
    setIsLoading(true)
    const getActiveEmployees = async () => {
      try {
        const response = await requestService({ path: 'users/employees' })
        const data = await response.json()

        if (!response.ok) throw new Error(data.message ?? 'Failed to fetch users')

        setUsersData(data as IUser[])
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    getActiveEmployees()
  }, [])

  const memoUsersData = useMemo(() => usersData, [usersData])

  const memoUsersColumns = useMemo(
    () => [
      {
        Header: 'Profile Picture',
        width: '200px',
        height: '200px',
        Cell: ({ row, value }: IRow) => {
          const avatarUrl = row.original.avatar ?? ''
          return (
            <div className="flex items-center gap-2">
              {avatarUrl ? (
                <Avatar src={avatarUrl} alt={`${value}'s Avatar`} />
              ) : (
                <Avatar src="/assets/photos/no-photo-found.jpg" alt={`${value}'s Avatar`} />
              )}
              <div>{value}</div>
            </div>
          )
        },
      },
      { Header: 'First Name', accessor: 'first_name', width: 200 },
      { Header: 'Last Name', accessor: 'last_name', width: 200 },
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
        Header: 'Docs',
        width: 100,
        accessor: (d: IUser) => d.documents?.length,
      },
      {
        Header: 'Supervisor',
        width: 100,
        accessor: (d: IUser) => (d.is_shift_supervisor ? '✅' : '❌'),
      },
      {
        Header: 'Joined',
        width: 100,
        accessor: (a: IUser): string => {
          return isToday(a.createdAt) || isYesterday(a.createdAt) ? 'New ⭐️' : format(a.createdAt, 'P')
        },
      },
      { Header: 'Email', accessor: 'email', width: 400 },
      { Header: 'Phone', accessor: 'phone_number' },
      { Header: 'City', accessor: 'city' },
      { Header: 'State', accessor: 'state', width: 20 },
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
