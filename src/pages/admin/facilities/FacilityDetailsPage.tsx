import { useState, useEffect } from 'react'

import { useParams } from 'react-router-dom'

import { SubHeader } from '../../../components/shared/SubHeader'
import { type ICompanySlim } from '../../../interfaces/company'
import { type IFacility } from '../../../interfaces/facility'
import { RequestService } from '../../../services/RequestService'
import { roleChecker } from '../../../utils/roleChecker'
import { clientFacilitiesLink } from '../../client/facilities/clientSubHeaderLinks'
import { adminFacilitiesLinks } from './adminFacilitySubHeaderLinks'
import { FacilityDetailsForm } from './components/FacilityDetailsForm'

export const FacilityDetailsPage = () => {
  const { facilityId } = useParams()
  const [facility, setFacility] = useState<IFacility>()
  const [company, setCompany] = useState<ICompanySlim>()
  const role = roleChecker()

  useEffect(() => {
    const getFacility = async () => {
      try {
        const facilityFound = await RequestService(`facilities/withcompany/${facilityId}`)
        setFacility(facilityFound)
        setCompany(facilityFound.company_id as ICompanySlim)
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
        <SubHeader data={facility} links={role === 'admin' ? adminFacilitiesLinks : clientFacilitiesLink} />
        <FacilityDetailsForm facility={facility} setFacility={setFacility} company={company} />
      </>
    )
  }
}
