import { useEffect } from 'react'

import { useNavigate } from 'react-router-dom'

import { HeadingComponent } from '../../../components/shared/general/HeadingComponent'
import { useAdmin } from '../../../contexts/AdminContext'
import { type DisableButtonInterface, type NavigationButtonInterface } from '../../../interfaces/global'
import { FormModule } from './components/FormModule'

export const AdminDetailsModule = () => {
  const { module, categoryOptions } = useAdmin()
  const navigate = useNavigate()

  const disableButtonData: DisableButtonInterface = {
    path: `modules/disable/${module?._id}`,
    status: module?.is_disabled as boolean,
    redirect: '/admin/learn/modules',
  }

  const actionButton: NavigationButtonInterface = {
    text: 'Units',
    to: `/admin/learn/modules/${module?._id}/units`,
    disbalePlusIcon: true,
  }

  useEffect(() => {
    if (!module || categoryOptions.length <= 1) {
      navigate('/admin/learn/modules')
    }
  })

  return (
    <div className="w-full sm:overflow-x-hidden">
      <HeadingComponent actionButton={actionButton} disableButton={disableButtonData} title="Update Module" />
      <FormModule action="edit" module={module} />
    </div>
  )
}
