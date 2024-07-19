import { useEffect, useState } from 'react'

import { format, isToday, isYesterday } from 'date-fns'

import { HTLoadingLogo } from '../../../components/shared/HTLoadingLogo'
import { FacilitiesTable } from '../../../components/shared/Tables/FacilitiesTable'
import { type ICompany } from '../../../interfaces/company'
import { type IFacility } from '../../../interfaces/facility'
import { requestService } from '../../../services/requestServiceNew'
import { useUtils } from '../../../store/useUtils'

interface IRow {
  row: { original: IFacility }
  value: string
}

interface IFacilityWithPaymentInfo {
  company_id: ICompany
}

const Avatar = ({ src, alt = 'avatar' }: { src: string; alt?: string }) => (
  <img src={src} alt={alt} className="h-32 w-32  object-cover" />
)

export const AdminFacilities = () => {
  const [facilities, setFacilities] = useState<IFacility[]>([])
  const { showToast } = useUtils()

  useEffect(() => {
    const getFacilities = async () => {
      try {
        const response = await requestService({ path: 'facilities/with-company-info' })

        if (response.ok) {
          const data = await response.json()
          setFacilities(data)
        }
      } catch (error) {
        console.error(error)
        showToast({ severity: 'error', summary: 'Error', detail: 'Error loading facilities' })
      }
    }

    getFacilities()
  }, [showToast])

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
    {
      Header: 'Created',
      width: 200,
      accessor: (a: IFacility) => {
        return isToday(a.createdAt as string)
          ? 'Today'
          : isYesterday(a.createdAt as string)
            ? 'Yesterday'
            : format(a.createdAt as string, 'P')
      },
    },
    { Header: 'Address', accessor: 'address', width: '300px' },
    {
      Header: 'Payment Methods',
      accessor: (row: IFacilityWithPaymentInfo) => row.company_id?.payment_information?.length ?? 0,
      width: '300px',
    },
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
