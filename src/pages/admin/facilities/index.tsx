import { useMemo, useState } from 'react'

import { HTLoadingLogo } from '../../../components/shared/HTLoadingLogo'
import { FacilitiesTable } from '../../../components/shared/Tables/FacilitiesTable'
import { type IFacility } from '../../../interfaces/facility'
import { RequestService } from '../../../services/RequestService'

interface IRow {
  row: { original: IFacility }
  value: string
}

const Avatar = ({ src, alt = 'avatar' }: { src: string; alt?: string }) => (
  <img src={src} alt={alt} className="h-32 w-32  object-cover" />
)

export const AdminFacilities = () => {
  const [facilities, setFacilities] = useState<IFacility[]>([])

  useMemo(() => {
    const getFacilities = async () => {
      const allFacilities = await RequestService('facilities/active')
      setFacilities(allFacilities)
    }

    getFacilities()
  }, [])

  const adminColumns = [
    {
      Header: 'Image',
      width: '200px',
      height: '200px',
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
    { Header: 'Name', accessor: 'name', width: '200px' },
    { Header: 'DBAs', accessor: 'company_dbas' },
    { Header: 'Address', accessor: 'address', width: '300px' },
    { Header: 'State', accessor: 'state', width: '10px' },
    {
      Header: 'Polygon',
      accessor: (a: IFacility) => (a.location_polygon?.length ?? 0 > 0 ? 'Yes' : 'No'),
      width: '10px',
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
    { Header: 'Images', width: '10px', accessor: (a: IFacility) => (a.images ?? []).length },
    { Header: 'Licenses', width: '10px', accessor: (a: IFacility) => (a.licenses ?? []).length },
  ]

  return facilities.length === 0 ? <HTLoadingLogo /> : <FacilitiesTable columns={adminColumns} data={facilities} />
}
