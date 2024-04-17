import { useEffect, useState } from 'react'

import { type ITimeSheet } from '../../../../interfaces/timesheet'
import { GetTokenInfo } from '../../../../utils/TokenUtils'
import { useAdminUserContext } from '../AdminUserPage'

export const AdminUserTimeSheets = () => {
  const [timeSheets, setTimeSheets] = useState<ITimeSheet[] | null>(null)

  const { selectedUserId } = useAdminUserContext()

  useEffect(() => {
    const fetchTimeSheets = async () => {
      if (!selectedUserId) {
        console.error('selectedUserId is undefined')
        return
      }
      const { access_token } = GetTokenInfo()
      const url = `${process.env.REACT_APP_PUBLIC_API}/timesheets/employee/${selectedUserId}/all`

      const options: RequestInit = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      }

      try {
        const response = await fetch(url, options)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        if (response.status === 204) {
          setTimeSheets(null)
        } else {
          const data: ITimeSheet[] = await response.json()
          setTimeSheets(data)
        }
      } catch (error) {
        console.error('Failed to fetch timesheet:', error)
        setTimeSheets(null)
      }
    }
    fetchTimeSheets()
  }, [selectedUserId])

  return (
    <div className="flex flex-col gap-4">
      <h1>AdminUserTimeSheets</h1>
      {timeSheets !== null ? <pre>{JSON.stringify(timeSheets[0], null, 3)}</pre> : null}
    </div>
  )
}
