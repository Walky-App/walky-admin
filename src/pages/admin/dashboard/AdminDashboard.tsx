import { useEffect, useMemo, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { Avatar } from 'primereact/avatar'
import { Button } from 'primereact/button'

// import { BriefcaseIcon, InformationCircleIcon, UserCircleIcon } from '@heroicons/react/20/solid'
import { BuildingOfficeIcon } from '@heroicons/react/20/solid'

import { HTLoadingLogo } from '../../../components/shared/HTLoadingLogo'
import { DashboardHeader } from '../../../components/shared/dashboard'
import { type IUser } from '../../../interfaces/User'
import { type IFacility } from '../../../interfaces/facility'
import { type IJob } from '../../../interfaces/job'
import { type ILog } from '../../../interfaces/logs'
import { requestService } from '../../../services/requestServiceNew'
import { GetTokenInfo } from '../../../utils/tokenUtil'
import { type IShift } from '../../employee/jobs/MyJobs'
import { WeeklyOpenShiftsTable } from '../jobs/components/WeeklyOpenShiftsTable'
import { SummaryHeader } from './components/SummaryHeader'

// import { DashboardActivity } from './DashboardActivity'
// import { DashboardFacilityTable } from './DashboardFacilityTable'
// import { DashboardReleasesList } from './DashboardReleasesList'
// import { DashboardUserTable } from './DashboardUserTable'

// import { BarChart } from './components/BarChart'

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
  open_shifts: IShift[]
}

export const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState<IDashboardData>()
  const [user, setUser] = useState<IUser | null>(null)
  const [openShifts, setOpenShifts] = useState([])

  const navigate = useNavigate()
  const { _id, avatar } = GetTokenInfo()

  useMemo(() => {
    const getDashboardData = async () => {
      try {
        const response = await requestService({ path: 'dashboard' })

        if (response.ok) {
          const data = await response.json()
          setDashboardData(data)
        }
      } catch (error) {
        console.error('error', error)
      }
    }

    getDashboardData()
  }, [])

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

  useEffect(() => {
    const fetchOpenShifts = async () => {
      try {
        const response = await requestService({ path: 'shifts/open' })

        if (response.ok) {
          const data = await response.json()
          setOpenShifts(data)
        }
      } catch (error) {
        console.error(error)
      }
    }

    fetchOpenShifts()
  }, [])

  // const statCardsData: IStatCard[] = [
  //   { name: 'Users', href: '/admin/users', icon: UserCircleIcon, amount: dashboardData?.users_count },
  //   {
  //     name: 'Facilities',
  //     href: '/admin/facilities',
  //     icon: InformationCircleIcon,
  //     amount: dashboardData?.facilities_count,
  //   },
  //   { name: 'Jobs', href: '/admin/jobs', icon: BriefcaseIcon, amount: dashboardData?.jobs_count },
  // ]

  return (
    <main className="mb-5">
      {user ? <DashboardHeader userData={user} /> : null}
      
      <SummaryHeader />

      {/* <div className="flex w-full">
        <div className="mx-auto sm:px-6 lg:px-8">
          <h2 className="text-lg font-medium leading-6">Active Records</h2>
          <div className="mt-2 grid grid-cols-1">
            <StatCards cards={statCardsData} />
            <DashboardActivity data={dashboardData?.logs ?? []} />
          </div>
        </div>
      </div> */}
      <WeeklyOpenShiftsTable data={openShifts} width="w-full" />

      {dashboardData ? (
        <div className="mt-8 md:flex">
          <div>
            {/* <DashboardUserTable data={dashboardData?.disabled_users ?? []} /> */}
            <hr />
            {/* <DashboardFacilityTable data={dashboardData?.disabled_facilities ?? []} /> */}
            <hr />
            {/* <DashboardReleasesList /> */}
          </div>
        </div>
      ) : (
        <HTLoadingLogo />
      )}
    </main>
  )
}
