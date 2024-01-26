import * as React from 'react'

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
  ]

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-10 sm:px-6 lg:px-8">
      <TitleComponent title={'Facilities'} />

      <div className="flex flex-col gap-4">
        <GlobalTable data={facilities} columns={facilitiesColumns} />
      </div>
    </div>
  )
}
