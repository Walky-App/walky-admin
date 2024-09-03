import { useNavigate } from 'react-router-dom'

import { Avatar } from 'primereact/avatar'

import { UserGroupIcon } from '@heroicons/react/20/solid'

import { type IUser } from '../../../interfaces/User'
import { roleTxt } from '../../../utils/roleChecker'

export const DashboardUserTable = ({ data }: { data: IUser[] }) => {
  const navigate = useNavigate()
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="flex">
          <UserGroupIcon className="mr-4 h-7 w-7 flex-shrink-0 text-gray-400" aria-hidden="true" />
          <div>
            <h3 className="text-xl font-semibold leading-6 text-gray-900 dark:text-white">
              {data.length} - Employees / Clients Onboarding
            </h3>
            <p className="mt-2 text-sm text-gray-700">
              A list of all the employees and clients that are currently onboarding.
            </p>
          </div>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => navigate('/admin/users/invite')}
            className="block rounded-md bg-green-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
            Invite User
          </button>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                    Name
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Registered on
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Type
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>

                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {data.map(person => (
                  <tr key={person.email}>
                    <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                      <div className="flex items-center">
                        <div className="h-11 w-11 flex-shrink-0">
                          <Avatar
                            label={person?.first_name[0]}
                            image={person?.avatar}
                            size="large"
                            shape="circle"
                            pt={{ image: { className: 'object-cover' } }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">
                            {person.first_name} {person.last_name}
                          </div>
                          <div className="mt-1 text-gray-500">{person.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                      <div className="text-gray-900">{new Date(person.createdAt).toLocaleString()}</div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                      <div className="text-gray-900">{roleTxt(person.role)}</div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                      <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-green-600/20">
                        Onboarding Step {person?.onboarding?.step_number}
                      </span>
                    </td>
                    {/* <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">{person.role}</td> */}
                    <td className="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <a href={`/admin/users/${person._id}`} className="text-green-600 hover:text-green-900">
                        Edit<span className="sr-only">, {person.first_name}</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
