import { useNavigate } from 'react-router-dom'

import { Avatar } from 'primereact/avatar'
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'

import { BuildingOfficeIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

import { type IUser } from '../../../interfaces/User'
import { cn } from '../../../utils/cn'
import { roleTxt } from '../../../utils/roleChecker'

export const DashboardHeader = ({ userData }: { userData: IUser }) => {
  const navigate = useNavigate()
  const role = roleTxt(userData.role)

  return (
    <Card>
      <div className="md:flex md:items-center md:justify-between md:space-x-5">
        <div className="flex items-start space-x-5">
          <div className="flex-shrink-0">
            <div className="relative">
              <Avatar
                label={userData?.first_name[0]}
                image={userData.avatar}
                size="large"
                shape="circle"
                pt={{ image: { className: 'object-cover' } }}
                className="h-16 w-16"
              />
            </div>
          </div>
          <div className="pt-1.5">
            <h1 className="text-2xl font-bold">Welcome Back, {userData?.first_name}</h1>
            <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:gap-x-6">
              <div className="mt-2 flex items-center">
                <BuildingOfficeIcon className="aria-hidden='true' mr-1.5 h-5 w-5 flex-shrink-0" />
                {userData?.email}
              </div>
              <div className="mt-2 flex items-center">
                <CheckCircleIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-green-600" aria-hidden="true" />
                Verified account
              </div>
              <div className="mt-2 flex items-center">
                <CheckCircleIcon
                  className={cn(
                    userData.is_onboarded ?? false ?? 'text-green-600',
                    'mr-1.5 h-5 w-5 flex-shrink-0',
                  )}
                />
                Onboarding Complete
              </div>
              <div className="mt-2 flex items-center">
                <CheckCircleIcon
                  className={cn(userData?.is_active ?? false ?? 'text-green-600', 'mr-1.5 h-5 w-5 flex-shrink-0')}
                />
                Profile Approved
              </div>
            </div>
          </div>
        </div>
        <div className="justify mt-6 flex flex-col-reverse space-y-4 space-y-reverse md:flex-row md:justify-end md:gap-x-3 md:space-y-0 md:space-x-reverse lg:mt-0">
          {role === 'Employee' ? (
            <Button
              label="Training"
              severity="secondary"
              outlined
              size="small"
              onClick={() => navigate('/learn')}
              pt={{ label: { className: 'text-nowrap' } }}
            />
          ) : null}
          {role !== 'Employee' ? (
            <Button
              label="Facilities"
              severity="secondary"
              outlined
              size="small"
              onClick={() => navigate(`/${role}/facilities`)}
              pt={{ label: { className: 'text-nowrap' } }}
            />
          ) : null}
          <Button
            label="Jobs"
            size="small"
            onClick={() => navigate(`/${role}/jobs`)}
            pt={{ label: { className: 'text-nowrap' } }}
          />
        </div>
      </div>
    </Card>
  )
}
