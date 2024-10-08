import { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { FacilitiesTable } from '../../../components/shared/Tables/FacilitiesTable'
import { type IFacility } from '../../../interfaces/facility'
import { requestService } from '../../../services/requestServiceNew'
import { GetTokenInfo } from '../../../utils/tokenUtil'

interface IRow {
  row: { original: IFacility }
  value: string
}

const Avatar = ({ src, alt = 'avatar' }: { src: string; alt?: string }) => (
  <img src={src} alt={alt} className="h-32 w-32  object-cover" />
)

const clientColumns = [
  {
    Header: 'Image',
    width: '100px',
    height: '100px',
    Cell: ({ row, value }: IRow) => {
      return (
        <div className="flex items-center gap-2">
          {row.original.main_image ? (
            <Avatar src={row.original.main_image} alt={`${value}'s Avatar`} />
          ) : (
            <Avatar src="/assets/photos/no-photo-found.jpg" alt={`${value}'s Avatar`} />
          )}
          <div>{value}</div>
        </div>
      )
    },
  },
  {
    Header: 'Approval Status',
    accessor: (d: IFacility) => (d.isApproved ? 'Approved' : 'Pending'),
  },
  { Header: 'Name', accessor: 'name' },
  { Header: 'Address', accessor: 'address', width: '200px' },
  { Header: 'City', accessor: 'city' },
  { Header: 'State', accessor: 'state', width: '10px' },
  { Header: 'Zip', accessor: 'zip' },
]

export const ClientFacilities = () => {
  const [facilities, setFacilities] = useState<IFacility[]>([])

  useEffect(() => {
    const { _id } = GetTokenInfo()
    const getFacilities = async () => {
      try {
        const response = await requestService({ path: `facilities/user/${_id}` })
        if (response.ok) {
          const allFacilities: IFacility[] = await response.json()
          setFacilities(allFacilities)
        }
      } catch (error) {
        console.error('Error fetching facilities', error)
      }
    }

    getFacilities()
  }, [])
  const navigate = useNavigate()

  return (
    <>
      <button
        type="button"
        onClick={() => navigate('/client/facilities/new')}
        className="mb-4 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
        Add New Facility
      </button>

      {facilities.length === 0 ? (
        <div>No facilities found</div>
      ) : (
        <FacilitiesTable columns={clientColumns} data={facilities} />
      )}
    </>
  )
}
