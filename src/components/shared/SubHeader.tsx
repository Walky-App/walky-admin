import { Fragment } from 'react'

import { NavLink, useLocation } from 'react-router-dom'

import { Menu, Transition } from '@headlessui/react'
import { MapPinIcon, MapIcon, ChevronDownIcon, BriefcaseIcon } from '@heroicons/react/20/solid'

import { cn } from '../../utils/cn'

export interface SubHeaderData {
  _id?: string
  name?: string
  city?: string
  address?: string
  company_name?: string
  company_dbas?: string[] | string
  company_address?: string
  role?: string
}

export interface SubHeaderLink {
  id: number
  name: string
  href: string
  icon?: React.ReactNode
  disabled?: boolean
}

export interface SubHeaderProps {
  data: SubHeaderData
  links: SubHeaderLink[]
}

const getBasePathFromPathname = (pathname: string): string => {
  const segments = pathname.split('/').filter(Boolean)
  const isIdLikeSegment = (segment: string) => segment.length > 10
  let firstIdLikeSegmentIndex = segments.findIndex(isIdLikeSegment)
  if (firstIdLikeSegmentIndex === -1) {
    firstIdLikeSegmentIndex = segments.length
  }
  return segments.slice(0, firstIdLikeSegmentIndex).join('/')
}

export const SubHeader: React.FC<SubHeaderProps> = ({ data, links }) => {
  const { pathname } = useLocation()
  const basePath = getBasePathFromPathname(pathname)

  const { city, address } = data

  const isValid = (value: string | string[] | null | undefined) => value !== null && value !== undefined && value !== ''

  const renderCompanyDbas = isValid(data.company_dbas) ? (
    <div className="flex items-center text-sm text-gray-500">
      <BriefcaseIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
      {Array.isArray(data.company_dbas) ? data.company_dbas.join(', ') : data.company_dbas}
    </div>
  ) : null

  const renderCity = isValid(city) ? (
    <div className="flex items-center text-sm text-gray-500">
      <MapPinIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
      {city}
    </div>
  ) : null

  const renderAddress = isValid(address) ? (
    <div className="flex items-center text-balance text-sm text-gray-500">
      <MapIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
      {address}
    </div>
  ) : null

  const renderCompanyAddress = isValid(data.company_address) ? (
    <div className="flex items-center text-sm text-gray-500">
      <MapIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
      {data.company_address}
    </div>
  ) : null

  const renderNavigationLinks = links.map(link =>
    link.disabled === true ? null : (
      <span key={link.id} className="hidden xs:block">
        <NavLink
          to={`/${basePath}/${data?._id}${link.href}`}
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
    ),
  )

  const renderMobileDropdown = (
    <Menu as="div" className="relative xs:hidden">
      <Menu.Button className="inline-flex w-full items-center justify-between rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400">
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
          {links.map(
            link =>
              link.disabled !== false && (
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
              ),
          )}
        </Menu.Items>
      </Transition>
    </Menu>
  )

  return (
    <div className="mb-10 flex w-full flex-col flex-wrap gap-y-4 border-b border-gray-300 py-4 xl:flex-row xl:items-end xl:justify-between">
      <div className="flex flex-col gap-y-2 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
        {data.name}
        {renderCompanyDbas}
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          {renderCity}
          {renderAddress}
          {renderCompanyAddress}
        </div>
      </div>
      <div className="flex flex-wrap gap-3 2xl:mt-0">
        {renderNavigationLinks}
        {renderMobileDropdown}
      </div>
    </div>
  )
}
