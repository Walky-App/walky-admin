import { useEffect, useState } from 'react'

import { useSearchParams } from 'react-router-dom'

import { BreadCrumbs } from '../../../components/shared/BreadCrumbs'
import { EmptyState } from '../../../components/shared/general/EmptyState'
import { HeadingComponent } from '../../../components/shared/general/HeadingComponent'
import { type Category } from '../../../interfaces/category'
import { type FilterInterface, type SelectedOptionInterface } from '../../../interfaces/global'
import { requestService } from '../../../services/requestServiceNew'
import { CategoryCards } from '../../learn/components/CategoryCards'

export const AdminCategoryLearn = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [filter, setFilter] = useState<FilterInterface>({ search: '', selected: '' })
  const [searchParams] = useSearchParams()

  const selectOption: SelectedOptionInterface[] = [
    {
      name: 'All',
      code: 'all',
    },
    {
      name: 'Active',
      code: 'active',
    },
    {
      name: 'Disabled',
      code: 'disabled',
    },
  ]

  const fetchData = async () => {
    const request = await requestService({ path: 'categories' })
    const response: Category[] = await request.json()
    if (response.length !== 0) {
      setCategories(response)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    if (categories.length === 0) {
      fetchData()
    }

    setFilter({
      search: searchParams.get('search') || '',
      selected: searchParams.get('selected') || 'all',
    })
  }, [searchParams, categories])

  const pages = [
    { name: 'Manage HTU', href: '/admin/learn', current: false },
    { name: 'Manage Categories', href: '#', current: true },
  ]

  return (
    <div className="w-full sm:overflow-x-hidden">
      <BreadCrumbs pages={pages} />
      <HeadingComponent
        actionButton={{
          to: '/admin/learn/categories/new',
          text: 'New Category',
        }}
        search
        selectedOptions={selectOption}
        title="Manage Categories"
      />

      {isLoading ? (
        <div className="flex h-96 flex-col items-center justify-center">
          <div className="text-2xl font-semibold text-black">Loading ...</div>
        </div>
      ) : (
        <>
          {categories.length === 0 && !isLoading ? (
            <EmptyState to="/admin/learn/categories/new" type="category" />
          ) : null}
          {categories.length > 0 && !isLoading ? (
            <div className="w-full">
              <CategoryCards category={categories} filter={filter} isAdmin isLoading={isLoading} />
            </div>
          ) : null}
        </>
      )}
    </div>
  )
}
