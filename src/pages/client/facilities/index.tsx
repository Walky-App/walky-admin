import * as React from 'react'

import FacilitiesHeader from './components/FacilitiesHeader'
import FacilitiesListItem from './components/FacilitiesListItem'
import { RequestService } from '../../../services/RequestService'
import { Link } from 'react-router-dom'

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
      <FacilitiesHeader title={'Facilities'} />

      <ul role="list" className="grid mt-10 grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {facilities?.map((facility: any) => (
          <Link key={facility._id} to={`/client/facilities/${facility._id}`}>
            <FacilitiesListItem facility={facility} />
          </Link>
        ))}
      </ul>
    </div>
  )
}
