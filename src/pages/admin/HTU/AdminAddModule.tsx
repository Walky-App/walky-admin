import { useEffect, useState } from 'react'
import { RequestService } from '../../../services/RequestService'
import { SelectedOptionInterface } from '../../../interfaces/Global'


import HeaderComponent from '../../../components/shared/general/HeaderComponent'
import FormModule from './components/FormModule'
import { Category } from '../../../interfaces/Category'

export default function AdminAddModule() {
  const [categories, setCategories] = useState<SelectedOptionInterface[]>([
    {
      name: 'Select',
      code: 'select',
    },
  ])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const fecthData = async () => {
    const response: Category[] = await RequestService('categories')
    if (response.length !== 0) {
      const categoriesMap = response.map(object => {
        return {
          name: object.title,
          code: object._id,
        }
      })
      setCategories([...categories, ...categoriesMap])
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (categories.length === 1) {
      fecthData()
    }
  }, [categories])

  return (
    <div className="w-full sm:overflow-x-hidden">
      <HeaderComponent title={'Create Module'} />
      <FormModule action="add" />
    </div>
  )
}
