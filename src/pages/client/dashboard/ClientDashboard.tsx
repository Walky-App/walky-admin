import { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { Avatar } from 'primereact/avatar'
import { Button } from 'primereact/button'

import { BuildingOfficeIcon, CheckCircleIcon } from '@heroicons/react/20/solid'

import { DashboardHeader } from '../../../components/shared/dashboard'
import { type IUser } from '../../../interfaces/User'
import { requestService } from '../../../services/requestServiceNew'
import { cn } from '../../../utils/cn'
import { GetTokenInfo } from '../../../utils/tokenUtil'

export type Status = string

export interface ITransaction {
  id: number
  name: string
  href: string
  amount: string
  currency: string
  status: Status
  date: string
  dateTime: string
}

export const ClientDashboard = () => {
  const [user, setUser] = useState<IUser | null>(null)

  const navigate = useNavigate()
  const { _id, onboarding, avatar } = GetTokenInfo()

  useEffect(() => {
    if (!(onboarding?.completed ?? false)) navigate('/client/onboarding')
  }, [navigate, onboarding?.completed])

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
    <div className="min-h-full">
      <main className="flex-1 pb-8">
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
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <CheckCircleIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-green-400" aria-hidden="true" />
                    Verified account
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <CheckCircleIcon
                      className={cn(
                        onboarding?.completed ?? false ? 'text-green-400' : 'text-gray-400',
                        'mr-1.5 h-5 w-5 flex-shrink-0',
                      )}
                    />
                    Onboarding Complete
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <CheckCircleIcon
                      className={cn(
                        user?.is_approved ?? false ? 'text-green-400' : 'text-gray-400',
                        'mr-1.5 h-5 w-5 flex-shrink-0',
                      )}
                    />
                    Profile Approved
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
                onClick={() => navigate('/client/facilities')}
                pt={{ label: { className: 'text-nowrap' } }}
              />
              <Button
                label="My Jobs"
                size="small"
                onClick={() => navigate('/client/jobs')}
                pt={{ label: { className: 'text-nowrap' } }}
              />
            </div>
          </div>
        </DashboardHeader>
      </main>
    </div>
  )
}
