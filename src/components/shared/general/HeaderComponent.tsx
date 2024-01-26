import SelectedOption from './SelectedOption'
import Search from './Search'
import { SelectedOptionInterface } from '../../../interfaces/Global'

interface Props {
  title: string
  search?: boolean
  selectedOptions?: SelectedOptionInterface[]
}

export default function HeaderComponent({ title, selectedOptions, search = false }: Props) {
  return (
    <div className="border-b border-gray-200 pb-5 sm:flex sm:items-center sm:justify-between mb-10">
      <h3 className="text-base font-semibold leading-6 text-gray-900">{title}</h3>
      <div className="mt-3 sm:ml-4 sm:mt-0">
        <label htmlFor="search-header" className="sr-only">
          Search
        </label>
        <div className="flex rounded-md shadow-sm">
          {selectedOptions ? (
            <>
              <Search searchQuery="search" roundedOrientation="rounded-l-md" />
              <SelectedOption selectedOptions={selectedOptions} roundedOrientation="rounded-r-md" />
            </>
          ) : (
            search && <Search searchQuery="search" />
          )}
        </div>
      </div>
    </div>
  )
}
