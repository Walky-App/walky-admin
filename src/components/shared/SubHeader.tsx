import { Fragment } from 'react'

import { Link, NavLink, useLocation } from 'react-router-dom'

import { Menu, Transition } from '@headlessui/react'
import { MapPinIcon, MapIcon, ChevronDownIcon } from '@heroicons/react/20/solid'

import { cn } from '../../utils/cn'

export interface SubHeaderData {
  _id?: string
  name?: string
  city?: string
  address?: string
}

export interface SubHeaderLink {
  id: number
  name: string
  href: string
  icon?: React.ReactNode
  disabled?: boolean
}

export interface SubHeaderProps {
  links: SubHeaderLink[]
  data?: SubHeaderData
}

export const SubHeader: React.FC<SubHeaderProps> = ({ data, links }) => {
  const { pathname } = useLocation()
  const basePath = pathname.split('/').slice(0, 3).join('/')

  return (
    <div className="mb-10 w-full border-b border-gray-300 p-2 lg:flex lg:items-center lg:justify-between">
      {data ? (
        <div className="min-w-0 flex-1">
          {data._id && data.name ? (
            <Link
              className="text-2xl font-bold leading-7 text-gray-900 hover:text-green-500 sm:truncate sm:text-3xl sm:tracking-tight"
              to={`${basePath}/${data._id}`}>
              {data?.name}
            </Link>
          ) : null}
          <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
            {data.city ? (
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <MapPinIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                {data?.city}
              </div>
            ) : null}
            {data.address ? (
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <MapIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                {data?.address}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
      <div className="mt-5 flex gap-3 lg:ml-4 lg:mt-0 ">
        {links.map(link => {
          return (
            !link.disabled && (
              <span key={link.id} className="hidden md:block">
                <NavLink
                  to={`${basePath}/${data?._id}${link.href}`}
                  end
                  className={({ isActive }) =>
                    cn('p-button p-button-sm', { 'p-button-secondary p-button-outlined': !isActive })
                  }>
                  <span className="-ml-0.5 mr-1.5 h-5 w-5 " aria-hidden="true">
                    {link.icon}
                  </span>
                  {link.name}
                </NavLink>
              </span>
            )
          )
        })}

        {/* Mobile Dropdown */}
        <Menu as="div" className="relative w-full md:hidden">
          <Menu.Button className="inline-flex items-center  rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400">
            More
            <ChevronDownIcon className="-mr-1 ml-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95">
            <Menu.Items className="absolute left-0  z-10 mt-2 w-40 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {links.map(link => {
                return (
                  !link.disabled && (
                    <Menu.Item key={link.id}>
                      {({ active }) => (
                        <NavLink
                          to={`${basePath}/${data?._id}${link.href}`}
                          end
                          className={cn(
                            { 'bg-gray-100': active },
                            'block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100',
                          )}>
                          {link.name}
                        </NavLink>
                      )}
                    </Menu.Item>
                  )
                )
              })}
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  )
}
