import { useEffect, useMemo, useState } from 'react'

import { HTLoadingLogo } from '../../../components/shared/HTLoadingLogo'
import { DashboardHeader } from '../../../components/shared/dashboard'
import { type IUser } from '../../../interfaces/User'
import { type IFacility } from '../../../interfaces/facility'
import { type IJob } from '../../../interfaces/job'
import { type ILog } from '../../../interfaces/logs'
import { requestService } from '../../../services/requestServiceNew'
import { GetTokenInfo } from '../../../utils/tokenUtil'
import { SummaryHeader } from './components/SummaryHeader'

export interface ITransaction {
  id: number
  name: string
  href: string
  amount: string
  currency: string
  status: string
  date: string
  dateTime: string
}

interface IDashboardData {
  logs: ILog[]
  facilities_count: string
  jobs_count: string
  users_count: string
  disabled_users: IUser[]
  disabled_facilities: IFacility[]
  disabled_jobs: IJob[]
}

export const AdminDashboard = () => {
  // const [dashboardData, setDashboardData] = useState<IDashboardData>()
  const [user, setUser] = useState<IUser | null>(null)

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

  return (
    <main className="mb-5">
      {/* {user ? <DashboardHeader userData={user} /> : null} */}

      <SummaryHeader />

      {/* {dashboardData ? <div className="mt-8 md:flex"></div> : <HTLoadingLogo />} */}
    </main>
  )
}
