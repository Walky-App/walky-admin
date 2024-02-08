import { useEffect, useState } from 'react'
import EmptyState from '../../../components/shared/general/EmptyState'
import HeaderComponent from '../../../components/shared/general/HeaderComponent'
import { Category } from '../../../interfaces/Category'
import { FilterInterface, SelectedOptionInterface } from '../../../interfaces/Global'
import { RequestService } from '../../../services/RequestService'
import { useSearchParams } from 'react-router-dom'
import CategoryCards from '../../learn/components/CategoryCards'

export default function AdminCategoryLearn() {
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

  const fecthData = async () => {
    const response: Category[] = await RequestService('categories')
    if (response.length !== 0) {
      setCategories(response)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    if (categories.length === 0) {
      fecthData()
    }

    setFilter({
      search: searchParams.get('search') || '',
      selected: searchParams.get('selected') || 'all'
    })
  }, [searchParams, categories])

  return (
    <div className="w-full sm:overflow-x-hidden">
      <HeaderComponent
        title={'Manage Categories'}
        search
        selectedOptions={selectOption}
        actionButton={{
          to: '/admin/learn/categories/new',
          text: 'New Category',
        }}
      />
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-96">
          <div className="text-2xl font-semibold text-black">Loading ...</div>
        </div>
      ) : (
        <>
          {categories.length === 0 && !isLoading && <EmptyState type="category" to="/admin/learn/categories/new" />}
          {categories.length > 0 && !isLoading && (
            <div className="w-full">
              <CategoryCards category={categories} filter={filter} isLoading={isLoading} isAdmin />
            </div>
          )}
        </>
      )}
    </div>
  )
}
