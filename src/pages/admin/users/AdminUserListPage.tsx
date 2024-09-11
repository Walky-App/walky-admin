import { useEffect, useState } from 'react'

import { HTLoadingLogo } from '../../../components/shared/HTLoadingLogo'
import { type IUser } from '../../../interfaces/User'
import { RequestService } from '../../../services/RequestService'
import { UserListTable } from './components/UserListTable'

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

  return isLoading ? <HTLoadingLogo /> : <UserListTable data={usersData} userType="All Users" />
}
