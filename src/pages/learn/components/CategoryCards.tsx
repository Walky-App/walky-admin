import { useNavigate } from 'react-router-dom'

import { Badge } from 'primereact/badge'
import { Card } from 'primereact/card'
import { Tag } from 'primereact/tag'

import { LockClosedIcon } from '@heroicons/react/24/outline'

import { HTLoadingLogo } from '../../../components/shared/HTLoadingLogo'
import { useAdmin } from '../../../contexts/AdminContext'
import { type Category } from '../../../interfaces/category'
import { type FilterInterface } from '../../../interfaces/global'
import { useLearn } from '../../../store/useLearn'
import { cn } from '../../../utils/cn'
import { Certification } from '../../admin/HTU/components/Certification'

interface CategoryCardsProps {
  category: Category[]
  filter?: FilterInterface
  isLoading: boolean
  isAdmin?: boolean
}

type CompletedInfo = Record<string, boolean>

interface CategoryRecords {
  category: Category['_id']
  is_completed: boolean
}

export const CategoryCards = ({
  category,
  filter = { search: '', selected: '' },
  isLoading = true,
  isAdmin = false,
}: CategoryCardsProps) => {
  const { setCategory } = useAdmin()
  const { record } = useLearn()
  const navigate = useNavigate()
  const categoriesFilter = () => {
    if (isAdmin) {
      let categoriesTemp = [...category]
      if (filter.selected !== 'all') {
        categoriesTemp = categoriesTemp.filter(category =>
          filter.selected === 'active' ? !category.is_disabled : category.is_disabled,
        )
      }
      return categoriesTemp.filter(category => category.title.toLowerCase().includes(filter.search.toLocaleLowerCase()))
    }
    const categoriesTemp = [...category]
    return categoriesTemp.filter(category => category.title.toLowerCase().includes(filter.search.toLocaleLowerCase()))
  }

  const handlerSetCategory = (category: Category, disabled: boolean) => {
    if (isAdmin) {
      setCategory(category)
      navigate(`/admin/learn/categories/${category._id}`)
      return
    }
    if (disabled) return
    navigate(`/learn/category/${category._id}`)
  }

  const categoryProgress = (_id: string) => {
    try {
      const category = record.categories.find(data => data.category === _id)
      return category ? category.modules.filter(module => module.is_completed).length : 0
    } catch (error) {
      return 0
    }
  }

  const categoryCompleted = (_id: string) => {
    try {
      const categoryCompletedLength = record.categories.find(data => data.category === _id)?.modules.length
      const categoryCurrentLength = category.find(data => data._id === _id)?.modules_number
      const categoryTemp = record.categories.find(data => data.category === _id)
      if (categoryTemp?.is_completed && categoryCompletedLength === categoryCurrentLength) {
        return true
      } else {
        return false
      }
    } catch (error) {
      return false
    }
  }

  const completionMap: CompletedInfo = Array.isArray(record.categories)
    ? record.categories.reduce((acc: CompletedInfo, category: CategoryRecords) => {
        acc[category.category] = category.is_completed
        return acc
      }, {})
    : {}

  const isCategoryDisabled = (index: number) => {
    if (index === 0) return false
    const category_id = categoriesFilter()[index - 1]._id
    const categoryCompletedLength = record.categories.find(data => data.category === category_id)?.modules.length
    const categoryCurrentLength = category.find(data => data._id === category_id)?.modules_number
    if (categoryCompletedLength === categoryCurrentLength && completionMap[category_id]) {
      return false
    } else {
      return true
    }
  }

  const filterCurrentCategory = (categoryId: string): string | undefined => {
    return record.categories.find(data => data.category === categoryId)?.url_certificate
  }

  return (
    <div>
      {!isLoading ? (
        <div>
          {categoriesFilter().length > 0 ? (
            categoriesFilter().map((category, index) => {
              const isDisabled = isCategoryDisabled(index)
              return (
                <Card
                  className={cn({
                    ' opacity-50': isDisabled,
                    'cursor-pointer transition-shadow duration-300 ease-in-out hover:shadow-lg': !isDisabled,
                  })}
                  key={category._id}
                  pt={{
                    body: { className: 'p-0 mb-4 ' },
                    content: { className: 'p-0' },
                  }}>
                  <div className="p-6 md:flex">
                    <div onClick={() => handlerSetCategory(category, isDisabled)} aria-hidden="true">
                      {category.image ? (
                        <img
                          alt={`Hemp Temp ${category.title} category`}
                          className="h-48 w-full rounded-xl object-cover object-center md:h-24 md:w-24"
                          src={category.image}
                        />
                      ) : (
                        <div className="h-24 w-24 rounded-xl " />
                      )}
                    </div>
                    <div
                      className="flex-1 md:mx-8"
                      onClick={() => handlerSetCategory(category, isDisabled)}
                      aria-hidden="true">
                      <h3 className="mt-3 text-xl font-semibold md:mt-0">{category.title}</h3>
                      <p className="text-ellipsis text-stone-500">{category.description}</p>
                    </div>
                    {isAdmin ? (
                      <div className="m-3 flex flex-col items-center gap-y-5 p-3">
                        <Badge color={category.is_disabled ? 'red' : 'green'}>
                          <p className="font-normal text-stone-500">{category.is_disabled ? 'Disabled' : 'Active'}</p>
                        </Badge>
                      </div>
                    ) : (
                      <div className="flex items-center justify-evenly md:h-36 md:flex-col  md:items-end">
                        <Tag icon="pi pi-folder" value={`${category.modules_number} Courses`} />
                        <Tag icon="pi pi-play" value={`${category.total_units} Videos`} />
                        <Tag icon="pi pi-clock" value={`${category.total_time / 60} Minutes`} />

                        {isDisabled ? (
                          <div className="mt-5 flex items-center justify-center">
                            <LockClosedIcon className="h-8 w-8" />
                          </div>
                        ) : (
                          <button type="button">
                            {categoryProgress(category._id) !== 0 &&
                            category.modules_number !== 0 &&
                            (categoryProgress(category._id) / category.modules_number) * 100 !== 100 ? (
                              <div className="flex items-center justify-start gap-2">
                                <div className="pr-2 text-right">
                                  {categoryProgress(category._id) !== 0 && category.modules_number !== 0
                                    ? (categoryProgress(category._id) / category.modules_number) * 100
                                    : 0}
                                  %
                                </div>
                                <div className="relative h-1 w-10">
                                  <div className="absolute left-0 top-0 h-1 w-10 rounded-2xl bg-neutral-100" />
                                  <div
                                    className={`w-${
                                      categoryProgress(category._id) !== 0 && category.modules_number !== 0
                                        ? Math.floor((categoryProgress(category._id) / category.modules_number) * 100) /
                                          10
                                        : 0
                                    } absolute left-0 top-0 h-1 rounded-2xl bg-black`}
                                  />
                                </div>
                              </div>
                            ) : null}
                            {categoryCompleted(category._id) ? (
                              <Certification urlCertificate={filterCurrentCategory(category._id)} category={category} />
                            ) : null}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              )
            })
          ) : (
            <div className="flex h-96 flex-col items-center justify-center">
              <div className="text-2xl font-semibold">Your search - did not match any categories</div>
            </div>
          )}
        </div>
      ) : (
        <HTLoadingLogo />
      )}
    </div>
  )
}
