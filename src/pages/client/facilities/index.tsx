import * as React from 'react'

import { useNavigate } from 'react-router-dom'

import { FacilitiesTable } from '../../../components/shared/Tables/FacilitiesTable'
import { HeaderComponent } from '../../../components/shared/general/HeaderComponent'
import { GetTokenInfo } from '../../../utils/TokenUtils'

export const ClientFacilities = () => {
  const navigate = useNavigate()

  const { _id } = GetTokenInfo()

  return (
    <>
      <HeaderComponent title="Facilities" />
      <button
        type="button"
        onClick={() => navigate('/admin/facilities/new')}
        className="mb-4 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
        Add New Facility
      </button>
      <FacilitiesTable clientId={_id} />
    </>
  )
}
