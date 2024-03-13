import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { RequestService } from '../../../services/RequestService'
import { SubHeader } from '../../../components/shared/SubHeader'
import { adminFacilitiesLinks } from './adminFacilitySubHeaderLinks'
import GlobalTable from '../../../components/shared/GlobalTable'

export default function AdminFacilityActivity() {
  const { facilityId } = useParams()
  const [facility, setFacility] = useState<any>({})
  const [logs, setLogs] = useState<any>([])

  useEffect(() => {
    const getFacility = async () => {
      try {
        const all_logs = await RequestService(`logs/facility/${facilityId}`)
        setLogs(all_logs)
        
        const facilityFound = await RequestService(`facilities/${facilityId}`)
        setFacility(facilityFound)
      } catch (error) {
        console.error('Error fetching facility data:', error)
      }
    }
    getFacility()
  }, [facilityId])

  const memoFacilitiesColumns = React.useMemo(
    () => [
      { Header: 'User', accessor: 'user_id' },
      { Header: 'Event Type', accessor: 'event_type' },
      { Header: 'Created At', accessor: 'createdAt' },
      {
        Header: 'Status',
        accessor: (d: any) => (d.active ? 'Active' : 'Disabled'),
        sortType: (a: any, b: any) => {
          if (a.original.active === b.original.active) return 0
          return a.original.active ? -1 : 1
        },
      },
    ],
    [],
  )



  return (
    <div>
      <SubHeader data={facility} links={adminFacilitiesLinks} />
      <GlobalTable data={logs} columns={memoFacilitiesColumns} />
    </div>
  )
}