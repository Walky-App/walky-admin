import { useEffect, useState } from 'react'

import { HTLoadingLogo } from '../../../components/shared/HTLoadingLogo'
import { type IUser } from '../../../interfaces/User'
import { requestService } from '../../../services/requestServiceNew'
import { UserListTable } from './components/UserListTable'

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

  return isLoading ? <HTLoadingLogo /> : <UserListTable data={usersData} userType="Employees" />
}
