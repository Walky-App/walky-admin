import { Avatar } from 'primereact/avatar'

import { BuildingOfficeIcon, CheckCircleIcon } from '@heroicons/react/20/solid'

import { useAuth } from '../../../contexts/AuthContext'

interface DashboardHeaderProps {
  children?: React.ReactNode
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ children }) => {
  const { user } = useAuth()

  return (
    <div className="bg-white px-4 shadow sm:px-6 lg:mx-auto  lg:px-8">
      <div className="py-6 md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          {/* Profile */}
          <div className="flex">
            <Avatar label={user?.first_name[0]} image={user?.avatar} size="large" shape="circle" />
            <div>
              <div className="flex items-center">
                <h1 className="ml-3 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:leading-9">
                  Welcome Back, {user?.first_name}
                </h1>
              </div>
              <dl className="mt-6 flex flex-col sm:ml-3 sm:mt-1 sm:flex-row sm:flex-wrap">
                <dt className="sr-only">Company</dt>
                <dd className="flex items-center text-sm font-medium capitalize text-gray-500 sm:mr-6">
                  <BuildingOfficeIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                  {user?.email}
                </dd>
                <dt className="sr-only">Account status</dt>
                <dd className="mt-3 flex items-center text-sm font-medium capitalize text-gray-500 sm:mr-6 sm:mt-0">
                  <CheckCircleIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-green-400" aria-hidden="true" />
                  Verified account
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="mt-6 flex space-x-3 md:ml-4 md:mt-0">{children}</div>
      </div>
    </div>
  )
}
