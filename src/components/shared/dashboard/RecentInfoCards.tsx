import { Fragment } from 'react'

import { Menu, Transition } from '@headlessui/react'
import { EllipsisHorizontalIcon, PhotoIcon } from '@heroicons/react/20/solid'

import { cn } from '../../../utils/cn'

const statusStyles = {
  Approved: 'text-green-700 bg-green-50 ring-green-600/20',
  Pending: 'text-gray-600 bg-gray-50 ring-gray-500/10',
}

export interface IRecentInfoCard {
  id: number
  name: string
  imageUrl?: string
  data: {
    date: string
    dateTime: string
    address: string
    status: string
  }
}

interface Props {
  items: IRecentInfoCard[]
}

export const RecentInfoCards: React.FC<Props> = ({ items }) => {
  return (
    <ul className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8">
      {items.map(item => (
        <li key={item.id} className="overflow-hidden rounded-xl border border-gray-200">
          <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.name}
                className="max-h-12 min-w-12 max-w-20 flex-none rounded-lg bg-white object-cover ring-1 ring-gray-900/10"
              />
            ) : (
              <PhotoIcon
                className="h-12 w-12 flex-none rounded-lg bg-white object-cover text-gray-300 ring-1 ring-gray-900/10"
                aria-hidden="true"
              />
            )}
            <div className="text-sm font-medium leading-6 text-gray-900">{item.name}</div>
            <Menu as="div" className="relative ml-auto">
              <Menu.Button className="-m-2.5 block p-2.5 text-gray-400 hover:text-gray-500">
                <span className="sr-only">Open options</span>
                <EllipsisHorizontalIcon className="h-5 w-5" aria-hidden="true" />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95">
                <Menu.Items className="absolute right-0 z-10 mt-0.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        type="button"
                        className={cn(
                          active ? 'bg-gray-50' : '',
                          'block px-3 py-1 text-sm leading-6 text-gray-900',
                        )}>
                        View
                      </button>
                    )}
                  </Menu.Item>
                  {/* <Menu.Item>
                    {({ active }) => (
                      <button
                        type="button"
                        className={classNames(
                          active ? 'bg-gray-50' : '',
                          'block px-3 py-1 text-sm leading-6 text-gray-900',
                        )}>
                        {`View, ${item.name}`}
                      </button>
                    )}
                  </Menu.Item> */}
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
          <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
            <div className="flex justify-between gap-x-4 py-3">
              <dt className="text-gray-500">Last added</dt>
              <dd className="text-gray-700">
                <time dateTime={item.data.dateTime}>{item.data.date}</time>
              </dd>
            </div>
            <div className="flex justify-between gap-x-4 py-3">
              <dt className="text-gray-500">Address</dt>
              <dd className="flex items-start gap-x-2">
                <div className="font-medium text-gray-900">{item.data.address}</div>
              </dd>
            </div>
            <div className="flex justify-between gap-x-4 py-3">
              <dt className="text-gray-500">Status</dt>
              <dd className="flex items-start gap-x-2">
                <div
                  className={cn(
                    statusStyles[item.data.status as keyof typeof statusStyles], // Add type assertion to keyof typeof statuses
                    'rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset',
                  )}>
                  {item.data.status}
                </div>
              </dd>
            </div>
          </dl>
        </li>
      ))}
    </ul>
  )
}
