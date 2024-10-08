/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react'

import { useParams } from 'react-router-dom'

import { GlobalTable } from '../../../components/shared/GlobalTable'
import { SubHeader } from '../../../components/shared/SubHeader'
import { type IFacility } from '../../../interfaces/facility'
import { RequestService } from '../../../services/RequestService'
import { roleChecker } from '../../../utils/roleChecker'
import { clientFacilitiesLink } from '../../client/facilities/clientSubHeaderLinks'
import { adminFacilitiesLinks } from './adminFacilitySubHeaderLinks'

export const AdminFacilityActivity = () => {
  const { facilityId } = useParams()
  const [facility, setFacility] = useState<IFacility>()
  const [logs, setLogs] = useState<any>([])
  const role = roleChecker()

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
      {facility ? (
        <SubHeader data={facility} links={role === 'admin' ? adminFacilitiesLinks : clientFacilitiesLink} />
      ) : null}
      <GlobalTable data={logs} columns={memoFacilitiesColumns} />
    </div>
  )
}
