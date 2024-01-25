import * as React from 'react'
import { Link } from 'react-router-dom'

import { PlusIcon } from '@heroicons/react/20/solid'

import { RequestService } from '../../../services/RequestService'
import TitleComponent from '../../../components/shared/general/TitleComponent'
import FacilitiesListItem from './components/FacilitiesListItem'

export default function Facilities() {
  const [facilities, setFacilities] = React.useState<any>([])

  React.useEffect(() => {
    const getFacilities = async () => {
      const allFacilities = await RequestService('facilities')
      setFacilities(allFacilities)
    }

    getFacilities()
  }, []) 

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-10 sm:px-6 lg:px-8">
      <TitleComponent title={'Facilities'} />
      <button
            type="button"
            className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
            <a href="http://localhost:3000/client/facilities/new" className="flex items-center gap-x-1.5">
              <PlusIcon className="-ml-0.5 h-5 w-5 text-gray-400" aria-hidden="true" />
              Add Facility
            </a>
          </button>

      <ul className="grid mt-10 grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {facilities?.map((facility: any) => (
          <Link key={facility._id} to={`/client/facilities/${facility._id}`}>
            <FacilitiesListItem facility={facility} />
          </Link>
        ))}
      </ul>
    </div>
  )
}
