import { useEffect } from 'react'

import { useNavigate } from 'react-router-dom'

import { HeadingComponent } from '../../../components/shared/general/HeadingComponent'
import { useAdmin } from '../../../contexts/AdminContext'
import { type DisableButtonInterface } from '../../../interfaces/global'
import { FormCategory } from './components/FormCategory'

export const AdminDetailsCategory = () => {
  const { category } = useAdmin()
  const navigate = useNavigate()

  const disableButtonData: DisableButtonInterface = {
    path: `categories/disable/${category?._id}`,
    status: category?.is_disabled as boolean,
    redirect: '/admin/learn/categories',
  }

  useEffect(() => {
    if (!category) {
      navigate('/admin/learn/categories')
    }
  })

  return (
    <div className="w-full sm:overflow-x-hidden">
      <HeadingComponent disableButton={disableButtonData} title="Update Category" />
      <FormCategory action="edit" category={category} />
    </div>
  )
}
