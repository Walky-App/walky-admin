import { useMemo, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { Button } from 'primereact/button'

import { BriefcaseIcon, InformationCircleIcon, UserCircleIcon } from '@heroicons/react/20/solid'

import { HTLoadingLogo } from '../../../components/shared/HTLoadingLogo'
import { type IStatCard, DashboardHeader, StatCards } from '../../../components/shared/dashboard'
import { type IUser } from '../../../interfaces/User'
import { type IFacility } from '../../../interfaces/facilitys'
import { type IJob } from '../../../interfaces/job'
import { type ILog } from '../../../interfaces/logs'
import { requestService } from '../../../services/requestServiceNew'
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

  const navigate = useNavigate()

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
        <Button
          label="Facilities"
          severity="secondary"
          outlined
          size="small"
          onClick={() => navigate('/admin/facilities')}
        />
        <Button label="Jobs" size="small" onClick={() => navigate('/admin/jobs')} />
      </DashboardHeader>

      {dashboardData ? (
        <div className="mt-8 md:flex">
          <div>
            <DashboardFacilityTable data={dashboardData?.disabled_facilities ?? []} />
            <hr />
            <DashboardUserTable data={dashboardData?.disabled_users ?? []} />
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
