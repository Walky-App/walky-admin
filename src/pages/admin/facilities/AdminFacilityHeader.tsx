import React, { Fragment } from 'react'
import {
  MapPinIcon,
  MapIcon,
  UserCircleIcon,
  PhotoIcon,
  BriefcaseIcon,
  PaperClipIcon,
  IdentificationIcon,
  DocumentPlusIcon,
  ChevronDownIcon,
  HashtagIcon,
} from '@heroicons/react/20/solid'
import { Menu, Transition } from '@headlessui/react'
import { classNames } from '../../../utils/Tailwind'
import { Link, useLocation } from 'react-router-dom'

const AdminFacilityHeaderInfo = ({ facility }: { facility: any }) => {
  const location = useLocation()

  return (
    <div className="lg:flex lg:items-center lg:justify-between border-b border-gray-300 mb-20 w-full ">
      <div className="min-w-0 flex-1">
        <div className="min-w-0 flex-1 ">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            {facility?.name}
          </h2>
          <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <MapPinIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
              {facility?.city}
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <MapIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
              {facility?.address}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5 flex lg:ml-4 lg:mt-0 ">
        <span className=" ml-3 hidden lg:inline-block">
          <Link
            to={`/admin/facilities/${facility._id}/contacts`}
            className={` flex items-center p-2 rounded-md  px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 group 
            ${location.pathname.includes('/contacts') ? 'bg-green-500 text-white hover:bg-green-400' : ''}`}>
            <UserCircleIcon className="-ml-0.5 mr-1.5 h-5 w-5 " aria-hidden="true" />
            Contacts
          </Link>
        </span>

        <span className="ml-3 hidden lg:inline-block">
          <Link
            to={`/admin/facilities/${facility._id}/images`}
            className={` flex items-center p-2 rounded-md  px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 group 
            ${location.pathname.includes('/images') ? 'bg-green-500 text-white hover:bg-green-400' : ''}`}>
            <PhotoIcon className="-ml-0.5 mr-1.5 h-5 w-5 " aria-hidden="true" />
            Images
          </Link>
        </span>

        <span className=" ml-3 hidden lg:inline-block">
          <Link
            to={`/admin/facilities/${facility._id}/jobs`}
            className={` flex items-center p-2 rounded-md  px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 group 
            ${location.pathname.includes('/jobs') ? 'bg-green-500 text-white hover:bg-green-400' : ''}`}>
            <BriefcaseIcon className="-ml-0.5 mr-1.5 h-5 w-5 " aria-hidden="true" />
            Jobs
          </Link>
        </span>
        <span className="ml-3 hidden lg:inline-block">
          <Link
            to={`/admin/facilities/${facility._id}/internal_notes`}
            className={`flex items-center p-2 rounded-md  px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 group 
            ${location.pathname.includes('/internal_notes') ? 'bg-green-500 text-white hover:bg-green-400' : ''}`}>
            <PaperClipIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Notes
          </Link>
        </span>
        <span className=" ml-3 hidden lg:inline-block">
          <Link
            to={`/admin/facilities/${facility._id}/contacts`}
            className={` flex items-center p-2 rounded-md  px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 group 
            ${location.pathname.includes('/contacts') ? 'bg-green-500 text-white hover:bg-green-400' : ''}`}>
            <IdentificationIcon className="-ml-0.5 mr-1.5 h-5 w-5 " aria-hidden="true" />
            Licenses
          </Link>
        </span>
        <span className=" ml-3 hidden lg:inline-block">
          <Link
            to={`/admin/facilities/${facility._id}/contacts`}
            className={` flex items-center p-2 rounded-md  px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 group 
            ${location.pathname.includes('/contacts') ? 'bg-green-500 text-white hover:bg-green-400' : ''}`}>
            <DocumentPlusIcon className="-ml-0.5 mr-1.5 h-5 w-5 " aria-hidden="true" />
            Docs
          </Link>
        </span>
        {/* Dropdown */}
        <Menu as="div" className="relative ml-3 lg:hidden  w-full">
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
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}>
                    Contacts
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}>
                    Images
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}>
                    Jobs
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}>
                    Notes
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}>
                    Licenses
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}>
                    Docs
                  </a>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  )
}

export default AdminFacilityHeaderInfo
