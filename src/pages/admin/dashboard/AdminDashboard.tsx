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
// import { DashboardReleasesList } from './DashboardReleasesList'
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
        <div className="md:flex md:items-center md:justify-between md:space-x-5">
          <div className="flex items-start space-x-5">
            <div className="flex-shrink-0">
              <div className="relative">
                <Avatar
                  label={user?.first_name[0]}
                  image={avatar}
                  size="large"
                  shape="circle"
                  pt={{ image: { className: 'object-cover' } }}
                  className="h-16 w-16"
                />
              </div>
            </div>
            <div className="pt-1.5">
              <h1 className="text-2xl font-bold text-gray-900">Welcome Back, {user?.first_name}</h1>
              <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:gap-x-6">
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <BuildingOfficeIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                  {user?.email}
                </div>
              </div>
            </div>
          </div>
          <div className="justify mt-6 flex flex-col-reverse space-y-4 space-y-reverse md:flex-row md:justify-end md:gap-x-3 md:space-y-0 md:space-x-reverse lg:mt-0">
            <Button
              label="Facilities"
              severity="secondary"
              outlined
              size="small"
              onClick={() => navigate('/admin/facilities')}
              pt={{ label: { className: 'text-nowrap' } }}
            />
            <Button
              label="Jobs"
              size="small"
              onClick={() => navigate('/admin/jobs')}
              pt={{ label: { className: 'text-nowrap' } }}
            />
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
            {/* <DashboardReleasesList /> */}
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
