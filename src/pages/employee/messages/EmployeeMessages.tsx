import { useEffect, useState } from 'react'

import { Chat } from '../../../components/shared/messages/Chat'
import { type IUser } from '../../../interfaces/User'
import { requestService } from '../../../services/requestServiceNew'
import { GetTokenInfo } from '../../../utils/tokenUtil'

export const EmployeeMessages = () => {
  const [user, setUser] = useState<IUser>()
  const { _id } = GetTokenInfo()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await requestService({ path: `users/${_id}` })
        if (response.ok) {
          const data = await response.json()

          setUser(data)
        }
      } catch (error) {
        console.error(error)
      }
    }

    fetchUser()
  }, [_id])

  return <Chat formUser={user} />
}
