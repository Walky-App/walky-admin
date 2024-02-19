import * as React from 'react'

import { RequestService } from '../../../services/RequestService'
import TitleComponent from '../../../components/shared/general/TitleComponent'
import GlobalTable from '../../../components/shared/GlobalTable'
import { GetTokenInfo } from '../../../utils/TokenUtils'
import { useNavigate } from 'react-router-dom'

export default function Facilities() {
  const navigate = useNavigate()
  const [facilities, setFacilities] = React.useState<any>([])
  const user = GetTokenInfo()
  const id = user?._id

  React.useEffect(() => {
    const getFacilities = async () => {
      const allFacilities = await RequestService(`facilities/byclient/${id}`)
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
    <div className="mx-auto max-w-screen-xl px-4  sm:px-6 lg:px-8">
      <TitleComponent title={'Facilities'} />
      <button
        type="button"
        onClick={() => {
          navigate('/client/facilities/new')
        }}
        className="mb-4 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
        Add Facility
      </button>

      <div className="flex flex-col gap-4">
        {facilities.length > 0 ? (
          <GlobalTable data={facilities} columns={facilitiesColumns} allowClick />
        ) : (
          <div>No facilities available.</div>
        )}
      </div>
    </div>
  )
}
