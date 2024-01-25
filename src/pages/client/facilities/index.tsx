import * as React from 'react'
import { Link } from 'react-router-dom'

import { PlusIcon } from '@heroicons/react/20/solid'

import { RequestService } from '../../../services/RequestService'
import TitleComponent from '../../../components/shared/general/TitleComponent'
import GlobalTable from '../../../components/shared/GlobalTable'

export default function Facilities() {
  const [facilities, setFacilities] = React.useState<any>([])

  React.useEffect(() => {
    const getFacilities = async () => {
      const allFacilities = await RequestService('facilities')
      setFacilities(allFacilities)
    }

    getFacilities()
  }, []) 

  const facilitiesColumns = [
    { Header: 'Name', accessor: 'name' },
    { Header: 'Address', accessor: 'address' },
    { Header: 'Phone Number', accessor: 'phone_number' },
    { Header: 'City', accessor: 'city' },
    { Header: 'State', accessor: 'state' },
    { Header: 'Zip', accessor: 'zip' },
    { Header: 'Country', accessor: 'country' },
  ];

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-10 sm:px-6 lg:px-8">
      <TitleComponent title={'Facilities'} />


      <div className="flex flex-col gap-4">
      <GlobalTable data={facilities} columns={facilitiesColumns} />
    </div>


      {/* <ul className="grid mt-10 grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {facilities?.map((facility: any) => (
          <Link key={facility._id} to={`/client/facilities/${facility._id}`}>
            <FacilitiesListItem facility={facility} />
          </Link>
        ))}
      </ul> */}
    </div>
  )
}
