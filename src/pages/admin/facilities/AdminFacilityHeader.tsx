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
      <div className="mt-5 flex lg:ml-4 lg:mt-0">
        {renderButton('Contacts', <UserCircleIcon className="-ml-0.5 mr-1.5 h-5 w-5 " />)}
        {renderButton('Images', <PhotoIcon className="-ml-0.5 mr-1.5 h-5 w-5 " />)}
        {renderButton('Jobs', <BriefcaseIcon className="-ml-0.5 mr-1.5 h-5 w-5" />)}
        {renderButton('Notes', <PaperClipIcon className="-ml-0.5 mr-1.5 h-5 w-5" />)}
        {renderButton('Licenses', <IdentificationIcon className="-ml-0.5 mr-1.5 h-5 w-5" />)}
        {renderButton('Docs', <DocumentPlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" />)}
      </div>
    </div>
  )
}

const renderButton = (
  label:
    | string
    | number
    | boolean
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | Iterable<React.ReactNode>
    | React.PromiseLikeOfReactNode
    | null
    | undefined,
  icon:
    | string
    | number
    | boolean
    | Iterable<React.ReactNode>
    | React.PromiseLikeOfReactNode
    | JSX.Element
    | null
    | undefined,
) => (
  <span className="ml-3 hidden sm:block">
    <button
      type="button"
      className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
      {icon}
      {label}
    </button>
  </span>
)

export default AdminFacilityHeaderInfo
