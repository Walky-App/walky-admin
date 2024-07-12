import { useEffect, useMemo, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { Avatar } from 'primereact/avatar'
import { Button } from 'primereact/button'

import { BriefcaseIcon, InformationCircleIcon, UserCircleIcon } from '@heroicons/react/20/solid'
import { BuildingOfficeIcon } from '@heroicons/react/20/solid'

import { HTLoadingLogo } from '../../../components/shared/HTLoadingLogo'
import { type IStatCard, DashboardHeader, StatCards } from '../../../components/shared/dashboard'
import { type IUser } from '../../../interfaces/User'
import { type IFacility } from '../../../interfaces/facility'
import { type IJob } from '../../../interfaces/job'
import { type ILog } from '../../../interfaces/logs'
import { requestService } from '../../../services/requestServiceNew'
import { GetTokenInfo } from '../../../utils/tokenUtil'
import { DashboardActivity } from './DashboardActivity'
import { DashboardFacilityTable } from './DashboardFacilityTable'
import { DashboardReleasesList } from './DashboardReleasesList'
import { DashboardUserTable } from './DashboardUserTable'

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
  const [dashboardData, setDashboardData] = useState<IDashboardData>()
  const [user, setUser] = useState<IUser | null>(null)

  const navigate = useNavigate()
  const userId = GetTokenInfo()._id

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
        const response = await requestService({ path: `users/${userId}` })
        if (response.ok) {
          const data = await response.json()

          setUser(data)
        }
      } catch (error) {
        console.error(error)
      }
    }
    fetchUser()
  }, [userId])

  const statCardsData: IStatCard[] = [
    { name: 'Users', href: '/admin/users', icon: UserCircleIcon, amount: dashboardData?.users_count },
    {
      name: 'Facilities',
      href: '/admin/facilities',
      icon: InformationCircleIcon,
      amount: dashboardData?.facilities_count,
    },
    { name: 'Jobs', href: '/admin/jobs', icon: BriefcaseIcon, amount: dashboardData?.jobs_count },
  ]

  return (
    <main>
      <DashboardHeader>
        <div className="flex w-full items-center justify-between">
          {/* Profile */}
          <div className="flex py-6">
            <Avatar
              label={user?.first_name[0]}
              image={user?.avatar}
              size="large"
              shape="circle"
              pt={{ image: { className: 'object-cover' } }}
            />
            <div>
              <div className="flex items-center">
                <h1 className="ml-3 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:leading-9">
                  Welcome Back, {user?.first_name}
                </h1>
              </div>
              <dl className="mt-6 flex flex-col sm:ml-3 sm:mt-1 sm:flex-row sm:flex-wrap">
                <dt className="sr-only">Company</dt>
                <dd className="flex items-center text-sm font-medium text-gray-500 sm:mr-6">
                  <BuildingOfficeIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                  {user?.email}
                </dd>
              </dl>
            </div>
          </div>
          <div className="space-x-2">
            <Button
              label="Facilities"
              severity="secondary"
              outlined
              size="small"
              onClick={() => navigate('/admin/facilities')}
            />
            <Button label="Jobs" size="small" onClick={() => navigate('/admin/jobs')} />
          </div>
        </div>
      </DashboardHeader>

      {dashboardData ? (
        <div className="mt-8 md:flex">
          <div>
            <DashboardUserTable data={dashboardData?.disabled_users ?? []} />
            <hr />
            <DashboardFacilityTable data={dashboardData?.disabled_facilities ?? []} />
            <hr />
            <DashboardReleasesList />
          </div>
          <div className="mx-auto sm:px-6 lg:px-8">
            <h2 className="text-lg font-medium leading-6 text-gray-900">Active Records</h2>
            <div className="mt-2 grid grid-cols-1">
              <StatCards cards={statCardsData} />
              <DashboardActivity data={dashboardData?.logs ?? []} />
            </div>
          </div>
        </div>
      ) : (
        <HTLoadingLogo />
      )}
    </main>
  )
}
