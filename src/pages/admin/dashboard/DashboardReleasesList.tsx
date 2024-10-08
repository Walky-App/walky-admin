import { Avatar } from 'primereact/avatar'

import { CodeBracketSquareIcon } from '@heroicons/react/20/solid'

const releases = [
  {
    _id: 1,
    status: 'Production',
    name: 'Admin Dashboard 2.0 #364',
    type: 'Feature',
    description:
      'Functional Dashboard with activity and actionable items for Admin to approve facilities and assist with Client/Employee onboarding',
    developer: 'Jonathan',
    date: '5/20/2024',
  },
  {
    _id: 2,
    status: 'Production',
    name: 'Sidebar 2.0 for all users #359',
    type: 'Feature',
    description: 'This allows to have submenus and a more organized sidebar for all users',
    developer: 'Jonathan',
    date: '5/17/2024',
  },
  {
    _id: 3,
    status: 'Production',
    name: 'Settings by State for Admins #359',
    type: 'Feature',
    description: 'This allows for Admins to implement and edit app settings by state',
    developer: 'Jorge',
    date: '5/15/2024',
  },
  {
    _id: 4,
    status: 'Production',
    name: 'Feature/client edit job 24hour restriction #363',
    type: 'Feature',
    description: 'This allows for client not to be able to edit a job 24 prior to the job start time',
    developer: 'Alex',
    date: '5/20/2024',
  },
  {
    _id: 5,
    status: 'Production',
    name: 'chore/ Update AdminAddFacility form #362',
    type: 'Feature',
    description: 'Improved form validation and error handling for Admins to add facilities',
    developer: 'Piotr',
    date: '5/17/2024',
  },
]

export const DashboardReleasesList = () => {
  return (
    <div className="mt-24 px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="flex">
          <CodeBracketSquareIcon className="mr-4 h-7 w-7 flex-shrink-0 text-gray-400" aria-hidden="true" />
          <div>
            <h3 className="text-xl font-semibold leading-6 text-gray-900">{releases.length} Latest Releases</h3>
            <p className="mt-2 text-sm text-gray-700">
              A list of all the releases here &nbsp;
              <a
                href="https://github.com/Hemptemps-com/hemptemps-app/pulls?q=is%3Apr+is%3Aclosed"
                target="_blank"
                rel="noopener noreferrer">
                &rarr; https://github.com/Hemptemps-com/
              </a>
            </p>
          </div>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                    Name / Description
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Release Date
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Developer
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {releases
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map(release => {
                    return (
                      <tr key={release._id}>
                        <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                          <div className="flex items-center">
                            <div className="h-11 w-11 flex-shrink-0">
                              <Avatar
                                label={release?.developer[0]}
                                size="large"
                                shape="circle"
                                pt={{ image: { className: 'object-cover' } }}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">{release.name}</div>
                              <div className="mt-1 text-wrap text-gray-500">{release.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                          <div className="text-gray-900">{release.date}</div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                          <div className="text-gray-900">{release.developer}</div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                          <span className="inline-</td>flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                            {release.status}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
