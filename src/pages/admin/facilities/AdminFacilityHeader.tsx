import React from 'react'
import {
  MapPinIcon,
  MapIcon,
  UserCircleIcon,
  PhotoIcon,
  BriefcaseIcon,
  PaperClipIcon,
  IdentificationIcon,
  DocumentPlusIcon,
} from '@heroicons/react/20/solid'
import { JSX } from 'react/jsx-runtime'

const AdminFacilityHeaderInfo = ({ formFacility }: { formFacility: any }) => {
  return (
    <div className="lg:flex lg:items-center lg:justify-between border-b border-gray-300 mb-20 w-full">
      <div className="min-w-0 flex-1">
        <div className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          {formFacility?.name}
          <div className="flex items-center gap-x-2">
            <MapPinIcon className="h-10 w-5 text-gray-400" aria-hidden="true" />
            <h2 className="text-sm font-light text-gray-500">{formFacility?.city}</h2>
            <MapIcon className="h-10 w-5 text-gray-400" aria-hidden="true" />
            <h2 className="text-sm font-light text-gray-500">{formFacility?.address}</h2>
            <span className="text-xl text-gray-700"></span>
          </div>
        </div>
      </div>
      <div className="mt-5 flex lg:ml-4 lg:mt-0 ">
        <span className="hidden sm:block">
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
            <UserCircleIcon className="-ml-0.5 mr-1.5 h-5 w-5 " aria-hidden="true" />
            Contacts
          </button>
        </span>

        <span className="ml-3 hidden sm:block">
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
            <PhotoIcon className="-ml-0.5 mr-1.5 h-5 w-5 " aria-hidden="true" />
            Images
          </button>
        </span>

        <span className="ml-3 hidden sm:block">
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
            <BriefcaseIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Jobs
          </button>
        </span>
        <span className="ml-3 hidden sm:block">
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
            <PaperClipIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Notes
          </button>
        </span>
        <span className="ml-3 hidden sm:block">
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
            <IdentificationIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Licenses
          </button>
        </span>
        <span className="ml-3 hidden sm:block">
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
            <DocumentPlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Docs
          </button>
        </span>
      </div>
    </div>
  )
}

export default AdminFacilityHeaderInfo
