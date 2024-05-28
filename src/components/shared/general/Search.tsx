import { useSearchParams } from 'react-router-dom'

import { useDebouncedCallback } from 'use-debounce'

import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'

interface Props {
  searchQuery: string
  roundedOrientation?: string
}

export const Search = ({ searchQuery, roundedOrientation }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams()

  const handlerSearch = useDebouncedCallback((terms: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (terms) {
      params.set(searchQuery, terms)
    } else {
      params.delete(searchQuery)
    }

    setSearchParams(params)
  }, 500)

  return (
    <div className="relative flex-grow focus-within:z-10">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <MagnifyingGlassIcon aria-hidden="true" className="h-5 w-5 text-gray-400" />
      </div>
      <input
        className={`w-full ${roundedOrientation ? roundedOrientation : 'rounded'} border-0 py-1.5 pl-10 text-sm leading-6 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-800 sm:block`}
        defaultValue={searchParams.get(searchQuery) as string}
        id="search-component"
        name="search-component"
        onChange={event => handlerSearch(event.target.value)}
        placeholder="Search"
        type="text"
      />
    </div>
  )
}
