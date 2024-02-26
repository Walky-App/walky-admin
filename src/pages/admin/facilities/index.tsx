import React from 'react'
import GlobalTable from '../../../components/shared/GlobalTable'
import { RequestService } from '../../../services/RequestService'
import HeaderComponent from '../../../components/shared/general/HeaderComponent'
import { useNavigate } from 'react-router-dom'

export default function AdminFacilities() {
  const [facilitiesData, setFacilitiesData] = React.useState<any>([])
  const [isLoading, setIsLoading] = React.useState(true)

  const navigate = useNavigate()

  React.useEffect(() => {
    const getFacilities = async () => {
      try {
        const allFacilities = await RequestService('facilities')
        setFacilitiesData(allFacilities)
      } catch (error) {
        console.error('Error fetching facility data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    getFacilities()
  }, [])

  const memoFacilitiesData = React.useMemo(() => facilitiesData, [facilitiesData])

  const memoFacilitiesColumns = React.useMemo(
    () => [
      { Header: 'Name', accessor: 'name' },
      { Header: 'Address', accessor: 'address' },
      { Header: 'Phone Number', accessor: 'phone_number' },
      {
        Header: 'Status',
        accessor: (d: any) => (d.active ? 'Active' : 'Disabled'),
        sortType: (a: any, b: any) => {
          if (a.original.active === b.original.active) return 0
          return a.original.active ? -1 : 1
        },
      },
      { Header: 'City', accessor: 'city' },
      { Header: 'State', accessor: 'state' },
      { Header: 'Zip', accessor: 'zip' },
      { Header: 'Country', accessor: 'country' },
    ],
    [],
  )

  return (
    <div className="">
      <HeaderComponent title={'Facilities'} />
      <button
        type="button"
        onClick={() => {
          navigate('/admin/facilities/new')
        }}
        className="mb-4 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
        Add New Facility
      </button>

      {isLoading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
        </div>
      ) : (
        <GlobalTable data={memoFacilitiesData} columns={memoFacilitiesColumns} />
      )}
    </div>
  )
}
