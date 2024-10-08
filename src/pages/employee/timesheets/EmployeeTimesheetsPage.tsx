import { useEffect, useState } from 'react'

import { type IUser } from '../../../interfaces/User'
import { requestService } from '../../../services/requestServiceNew'
import { GetTokenInfo } from '../../../utils/tokenUtil'
import { EmployeeTimesheetTable } from '../components/EmployeeTimesheetTable'

const currentUserId = GetTokenInfo()._id

export const EmployeeTimesheets = ({ userId = currentUserId }: { userId?: string }) => {
  const [user, setUser] = useState<IUser>()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const request = await requestService({ path: `users/669547e6b8c7978ae57f7f6f` })
        const data = await request.json()
        setUser(data)
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }
    fetchUser()
  }, [userId])

  return user ? <EmployeeTimesheetTable userData={user} /> : null
}
