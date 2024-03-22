import { useState, useMemo } from 'react'

import { ProgressSpinner } from 'primereact/progressspinner'

import { type IFacility } from '../../../interfaces/Facility'
import { RequestService } from '../../../services/RequestService'
import GlobalTable from '../GlobalTable'

interface IRow {
  row: { original: IFacility }
  value: string
}

const Avatar = ({ src, alt = 'avatar' }: { src: string; alt?: string }) => (
  <img src={src} alt={alt} className="h-32 w-32  object-cover" />
)

export const FacilitiesTable = ({ clientId }: { clientId?: string }) => {
  const [facilities, setFacilities] = useState<IFacility[]>([])

  useMemo(() => {
    const getFacilities = async () => {
      const allFacilities = clientId
        ? await RequestService(`facilities/byclient/${clientId}`)
        : await RequestService('facilities')
      setFacilities(allFacilities)
    }

    getFacilities()
  }, [])

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
      Header: 'Approval Status',
      accessor: (d: IFacility) => (d.isApproved ? 'Approved' : 'Pending'),
    },
    { Header: 'Name', accessor: 'name' },
    { Header: 'Address', accessor: 'address', width: '200px' },
    { Header: 'City', accessor: 'city' },
    { Header: 'State', accessor: 'state', width: '10px' },
    { Header: 'Zip', accessor: 'zip' },
  ]

  const clientColumns = [
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
      Header: 'Approval Status',
      accessor: (d: IFacility) => (d.isApproved ? 'Approved' : 'Pending'),
    },
    { Header: 'Name', accessor: 'name' },
    { Header: 'Address', accessor: 'address', width: '200px' },
    { Header: 'City', accessor: 'city' },
    { Header: 'State', accessor: 'state', width: '10px' },
    { Header: 'Zip', accessor: 'zip' },
  ]

  return !facilities ? (
    <div className="flex items-center justify-center">
      <ProgressSpinner aria-label="Loading" style={{ color: 'green' }} />
    </div>
  ) : (
    <>
      <h2 className="prose text-gray-500"> Total Items {facilities.length}</h2>
      {clientId != null ? (
        <GlobalTable data={facilities} columns={clientColumns} allowClick />
      ) : (
        <GlobalTable data={facilities} columns={adminColumns} allowClick />
      )}
    </>
  )
}
