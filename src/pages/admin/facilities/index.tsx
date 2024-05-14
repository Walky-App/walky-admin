import { useMemo, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { FacilitiesTable } from '../../../components/shared/Tables/FacilitiesTable'
import { HeaderComponent } from '../../../components/shared/general/HeaderComponent'
import { type IFacility } from '../../../interfaces/Facility'
import { RequestService } from '../../../services/RequestService'
import { LoadingLogo } from '../../../utils/LoadingLogo'

interface IRow {
  row: { original: IFacility }
  value: string
}

const Avatar = ({ src, alt = 'avatar' }: { src: string; alt?: string }) => (
  <img src={src} alt={alt} className="h-32 w-32  object-cover" />
)

export const AdminFacilities = () => {
  const [facilities, setFacilities] = useState<IFacility[]>([])

  const handleDisabledFacilities = async () => {
    const disabledFacilities = await RequestService('facilities/inactive')
    setFacilities(disabledFacilities)
  }

  const handleAllFacilities = async () => {
    const disabledFacilities = await RequestService('facilities')
    setFacilities(disabledFacilities)
  }
  const handleActiveFacilities = async () => {
    const allFacilities = await RequestService('facilities/active')
    setFacilities(allFacilities)
  }
  const handleNolocationFacilities = async () => {
    const allFacilities = await RequestService('facilities/nolocation')
    setFacilities(allFacilities)
  }
  const handleMissingImages = async () => {
    const allFacilities = await RequestService('facilities/noimages')
    setFacilities(allFacilities)
  }

  useMemo(() => {
    const getFacilities = async () => {
      const allFacilities = await RequestService('facilities/active')
      setFacilities(allFacilities)
    }

    getFacilities()
  }, [])

  const navigate = useNavigate()

  const adminColumns = [
    {
      Header: 'Image',
      width: '100px',
      height: '100px',
      Cell: ({ row, value }: IRow) => {
        return (
          <div className="flex items-center gap-2">
            {Array.isArray(row.original.images) && row.original.images.length > 0 ? (
              <Avatar src={row.original.images[0].url} alt={`${value}'s Avatar`} />
            ) : (
              <Avatar src="/assets/photos/no-photo-found.jpg" alt={`${value}'s Avatar`} />
            )}
            <div>{value}</div>
          </div>
        )
      },
    },
    {
      Header: 'Status',
      width: '10px',
      accessor: (d: IFacility) => (d.active ? 'Active' : 'Disabled'),
    },
    {
      Header: 'Approved',
      accessor: (d: IFacility) => (d.isApproved ? 'Approved' : 'Pending'),
      width: '40px',
    },
    { Header: 'Name', accessor: 'name' },
    { Header: 'DBAs', accessor: 'company_dbas' },
    { Header: 'Address', accessor: 'address', width: '300px' },
    { Header: 'City', accessor: 'city' },
    { Header: 'State', accessor: 'state', width: '10px' },
    { Header: 'Zip', accessor: 'zip' },
  ]

  return (
    <>
      <HeaderComponent title="Facilities" />
      {facilities.length === 0 ? (
        <LoadingLogo />
      ) : (
        <>
          <button
            type="button"
            onClick={() => navigate('/admin/facilities/new')}
            className="mb-4 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
            Add New Facility
          </button>

          <button
            type="button"
            onClick={handleDisabledFacilities}
            className="mb-4 ml-3 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
            Disabled
          </button>

          <button
            type="button"
            onClick={handleActiveFacilities}
            className="mb-4 ml-3 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
            Active
          </button>
          <button
            type="button"
            onClick={handleNolocationFacilities}
            className="mb-4 ml-3 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
            No Coordinates
          </button>
          <button
            type="button"
            onClick={handleMissingImages}
            className="mb-4 ml-3 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
            No Images
          </button>

          <button
            type="button"
            onClick={handleAllFacilities}
            className="mb-4 ml-3 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
            All
          </button>

          <FacilitiesTable columns={adminColumns} data={facilities} />
        </>
      )}
    </>
  )
}
