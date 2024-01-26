import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { RequestService } from '../../../services/RequestService'

export default function AdminFacilityDetails() {
  const [facilityData, setFacilityState] = useState<any>({})
  const { id } = useParams()

  const fetchFacility = async () => {
    const facilityData = await RequestService(`facilities/${id}`)
    setFacilityState(facilityData)
    console.log(facilityData)
  }

  useEffect(() => {
    fetchFacility()
  }, [])

  return (
    <h2>
      Facility detail view {id} {facilityData.name}
    </h2>
  )
}
