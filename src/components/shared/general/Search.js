'use client'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import React from 'react'

export default function Search({ searchQuery, roundedOrientation }) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const handlerSearch = terms => {
    const params = new URLSearchParams(searchParams)
    if (terms) {
      params.set(searchQuery, terms)
    } else {
      params.delete(searchQuery)
    }
    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="relative flex-grow focus-within:z-10">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
      </div>
      <input
        onChange={event => handlerSearch(event.target.value)}
        type="text"
        name="search-component"
        id="search-component"
        className={`hidden w-full ${
          roundedOrientation ? roundedOrientation : 'rounded'
        } border-0 py-1.5 pl-10 text-sm leading-6 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-800 sm:block`}
        placeholder="Search"
        defaultValue={searchParams.get(searchQuery)}
      />
    </div>
  )
}
