'use client'
import * as React from 'react'
import {
  BriefcaseIcon,
  PhoneIcon,
  MapPinIcon,
  CreditCardIcon,
  BookmarkIcon,
  ChevronRightIcon,
} from '@heroicons/react/20/solid'

export default function FacilitiesListItem({ facility }) {
  return (
    <>
      <li
        key={facility._id}
        className="relative flex justify-between gap-x-6 py-5 shadow-md border-gray-300 hover:bg-gray-50 hover:shadow-lg  ">
        <div className="flex min-w-0 gap-x-4">
          <img
            className="h-12 w-12 flex-none square-full bg-gray-50"
            src={facility.main_image}
            alt=""
          />
          <div className="min-w-0 flex-auto">
            <p className="text-sm font-semibold leading-6 text-gray-900"></p>
            <p className="mt-1 flex text-xs leading-5 text-gray-500">
              <a href={`mailto:${facility.email}`} className="relative truncate hover:underline">
                {facility.email}
              </a>
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-x-4">
          <div className="hidden sm:flex sm:flex-col sm:items-end">
            <p className="text-sm font-semibold leading-6 text-gray-900">
              <a href={facility.href}>
                <span className="absolute inset-x-0 -top-px bottom-0" />
                {facility.name}
              </a>
            </p>
            <p className="text-sm leading-6 text-gray-900">{facility.address}</p>

            <p className="text-xs leading-5 text-gray-500">{facility.city}</p>
          </div>
          <ChevronRightIcon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
        </div>
      </li>
    </>
  )
}
