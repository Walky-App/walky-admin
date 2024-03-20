import { useState, useEffect } from 'react'

import { useParams } from 'react-router-dom'

import { SubHeader } from '../../../components/shared/SubHeader'
import { type IFacility } from '../../../interfaces/Facility'
import { RequestService } from '../../../services/RequestService'
import { adminFacilitiesLinks } from './adminFacilitySubHeaderLinks'
import { FacilityDetailsForm } from './components/FacilityDetailsForm'

export const AdminFacilityDetails = () => {
  const { facilityId } = useParams()
  const [facility, setFacility] = useState<IFacility>()

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

  if (!facility) return <div>Loading...</div>
  return (
    <>
      <SubHeader data={facility} links={adminFacilitiesLinks} />

      <FacilityDetailsForm facility={facility} setFacility={setFacility} />
    </>
  )
}
