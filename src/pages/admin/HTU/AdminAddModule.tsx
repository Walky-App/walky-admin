import { useEffect, useState } from 'react'

import { HeadingComponent } from '../../../components/shared/general/HeadingComponent'
import { type Category } from '../../../interfaces/category'
import { type SelectedOptionInterface } from '../../../interfaces/global'
import { requestService } from '../../../services/requestServiceNew'
import { FormModule } from './components/FormModule'

export const AdminAddModule = () => {
  const [categories, setCategories] = useState<SelectedOptionInterface[]>([
    {
      name: 'Select',
      code: 'select',
    },
  ])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchData = async () => {
      const request = await requestService({ path: 'categories' })
      const response: Category[] = await request.json()
      if (response.length !== 0) {
        const categoriesMap = response.map(object => {
          return {
            name: object.title,
            code: object._id,
          }
        })
        setCategories([...categories, ...categoriesMap])
        setIsLoading(!isLoading)
      }
    }

    if (categories.length === 1) {
      fetchData()
    }
  }, [categories, isLoading])

  return (
    <div className="w-full sm:overflow-x-hidden">
      <HeadingComponent title="Create Module" />
      <FormModule action="add" />
    </div>
  )
}
