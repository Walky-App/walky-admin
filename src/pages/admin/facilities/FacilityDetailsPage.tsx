import { useState, useEffect } from 'react'

import { useParams } from 'react-router-dom'

import { SubHeader } from '../../../components/shared/SubHeader'
import { type IFacility } from '../../../interfaces/Facility'
import { RequestService } from '../../../services/RequestService'
import { roleChecker } from '../../../utils/roleChecker'
import { clientFacilitiesLink } from '../../client/facilities/clientSubHeaderLinks'
import { adminFacilitiesLinks } from './adminFacilitySubHeaderLinks'
import { FacilityDetailsForm } from './components/FacilityDetailsForm'

export const FacilityDetailsPage = () => {
  const { facilityId } = useParams()
  const [facility, setFacility] = useState<IFacility>()
  const role = roleChecker()

  useEffect(() => {
    const getFacility = async () => {
      try {
        const facilityFound = await RequestService(`facilities/${facilityId}`)
        setFacility(facilityFound)
      } catch (error) {
        console.error('Error fetching facility data:', error)
      }
    }
    getFacility()
  }, [facilityId])

  if (!facility) {
    return <div>Loading...</div>
  } else {
    return (
      <>
        {facility ? (
          <SubHeader data={facility} links={role === 'admin' ? adminFacilitiesLinks : clientFacilitiesLink} />
        ) : null}
        <FacilityDetailsForm facility={facility} setFacility={setFacility} />
      </>
    )
  }
}
