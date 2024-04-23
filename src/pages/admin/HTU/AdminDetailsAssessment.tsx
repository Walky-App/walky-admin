import { useEffect } from 'react'

import { useParams } from 'react-router-dom'

import { HeaderComponent } from '../../../components/shared/general/HeaderComponent'
import { useAdmin } from '../../../contexts/AdminContext'
import { RequestService } from '../../../services/RequestService'
import { FormAssessment } from './components/FormAssessment'

export const AdminDetailsAssessment = () => {
  const { assessment, setAssessment } = useAdmin()
  const params = useParams()

  const fetchData = async () => {
    const response = await RequestService(`units/${params.unitId}/assessment`)
    setAssessment(response)
  }

  useEffect(() => {
    if (!assessment) {
      fetchData()
    }
  })

  return (
    <div className="w-full sm:overflow-x-hidden">
      <HeaderComponent title="Details Assessment" />
      <FormAssessment action="update" />
    </div>
  )
}
