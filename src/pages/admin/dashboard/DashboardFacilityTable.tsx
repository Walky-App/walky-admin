import { Avatar } from 'primereact/avatar'

import { BuildingLibraryIcon } from '@heroicons/react/20/solid'

import { type IFacility } from '../../../interfaces/facility'

export const DashboardFacilityTable = ({ data }: { data: IFacility[] }) => {
  return (
    <div className="mt-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="flex">
          <BuildingLibraryIcon className="mr-4 h-7 w-7 flex-shrink-0 text-gray-400" aria-hidden="true" />
          <div>
            <h3 className="text-xl font-semibold leading-6">{data.length} - Facilities Pending Approval</h3>
            <p className="mt-2 text-sm">A list of all the facilities that are currently pending approval.</p>
          </div>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-0">
                    Name
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                    Registered on
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                    Jobs
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                    Licenses
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                    Status
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.map(facility => (
                  <tr key={facility._id}>
                    <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                      <div className="flex items-center">
                        <div className="h-11 w-11 flex-shrink-0">
                          <Avatar
                            label={facility?.name[0]}
                            image={facility?.main_image}
                            size="large"
                            shape="circle"
                            pt={{ image: { className: 'object-cover' } }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium">{facility.name}</div>
                          <div className="mt-1 text-gray-500">{facility.address}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                      <div>{new Date(facility?.createdAt ?? '').toLocaleString()}</div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                      <div>{facility.jobs ? facility.jobs.length : 0}</div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                      <div>{facility.licenses ? facility.licenses.length : 0}</div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                      <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-green-600/20">
                        Pending
                      </span>
                    </td>
                    {/* <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">{facility.role}</td> */}
                    <td className="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <a href={`/admin/facilities/${facility._id}`} className="text-green-600 hover:text-green-900">
                        Edit<span className="sr-only">, {facility.name}</span>
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
