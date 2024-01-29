import React from 'react'
import GlobalTable from '../../../components/shared/GlobalTable'
import { RequestService } from '../../../services/RequestService'
import HeaderComponent from '../../../components/shared/general/HeaderComponent'

export default function AdminFacilities() {
  const [facilitiesData, setFacilitiesData] = React.useState<any>([])

  React.useEffect(() => {
    const getFacilities = async () => {
      const allFacilities = await RequestService('facilities')
      setFacilitiesData(allFacilities)
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
    <div className="px-20">
      <HeaderComponent title={'Facilities'} />
      <button
        type="button"
        onClick={() => {
          window.location.href = '/admin/facilities/new'
        }}
        className="mb-4 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
        Add New Facility
      </button>
      <GlobalTable data={facilitiesData} columns={facilitiesColumns} />
    </div>
  )
}
