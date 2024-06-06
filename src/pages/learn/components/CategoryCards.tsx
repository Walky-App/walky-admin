import { useNavigate } from 'react-router-dom'

import { Badge } from 'primereact/badge'
import { Card } from 'primereact/card'

import { ShieldCheckIcon } from '@heroicons/react/20/solid'
import { ArrowTrendingUpIcon, BookOpenIcon, ClockIcon, LockClosedIcon } from '@heroicons/react/24/outline'

import { useAdmin } from '../../../contexts/AdminContext'
import { type Category } from '../../../interfaces/category'
import { type FilterInterface } from '../../../interfaces/global'
import { useLearn } from '../../../store/useLearn'
import { cn } from '../../../utils/cn'

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

  const handlerSetCategory = (category: Category, isDisabled: boolean) => {
    if (isAdmin) {
      setCategory(category)
      navigate(`/admin/learn/categories/${category._id}`)
      return
    }
    if (isDisabled) return
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
      const category = record.categories.find(data => data.category === _id)
      return category ? category.is_completed : false
    } catch (error) {
      return false
    }
  }

  const handlerCertification = async (category: Category) => {
    setCategory(category)
    if (categoryCompleted(category._id)) {
      navigate(`/admin/learn/category/${category._id}/certification`)
    } else {
      navigate(`/learn/category/${category._id}`)
    }
  }

  const completionMap: CompletedInfo = record.categories.reduce((acc: CompletedInfo, category: CategoryRecords) => {
    acc[category.category] = category.is_completed
    return acc
  }, {})

  const isCategoryDisabled = (index: number) => {
    if (index === 0) return false
    return !completionMap[categoriesFilter()[index - 1]._id]
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
                    'bg-gray-300 opacity-50': isDisabled,
                    'cursor-pointer transition-shadow duration-300 ease-in-out hover:shadow-lg': !isDisabled,
                  })}
                  key={category._id}
                  pt={{
                    body: { className: 'p-0 mb-4 ' },
                    content: { className: 'p-0' },
                  }}>
                  <div className="h-auto sm:h-32 md:flex  ">
                    <div className="md:m-3" onClick={() => handlerSetCategory(category, isDisabled)} aria-hidden="true">
                      {category.image ? (
                        <img
                          alt={`Hemp Temp ${category.title} category`}
                          className="h-96 w-full object-cover object-center  md:h-24 md:w-24 md:rounded-xl"
                          src={category.image}
                        />
                      ) : (
                        <div className="h-24 w-24 rounded-xl bg-neutral-200" />
                      )}
                    </div>
                    <div
                      className="m-3 flex flex-1 flex-col justify-center gap-3"
                      onClick={() => handlerSetCategory(category, isDisabled)}
                      aria-hidden="true">
                      <div className="text-xl font-semibold text-black">{category.title}</div>
                      <div className=" h-12 overflow-hidden text-ellipsis  text-stone-500">{category.description}</div>
                    </div>
                    {isAdmin ? (
                      <div className="m-3 flex flex-col items-center gap-y-5 p-3">
                        <Badge color={category.is_disabled ? 'red' : 'green'}>
                          <p className="font-normal text-stone-500">{category.is_disabled ? 'Disabled' : 'Active'}</p>
                        </Badge>
                      </div>
                    ) : (
                      <div>
                        <div className="flex flex-row justify-around md:gap-2 md:pr-3 md:pt-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <ArrowTrendingUpIcon className="h-10 w-10 md:h-6 md:w-6" />
                              <span className="text-base md:text-sm">{category.modules_number}</span>
                            </div>
                            <p className="text-center text-lg font-medium md:text-sm">Modules</p>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <BookOpenIcon className="h-10 w-10 md:h-6 md:w-6" />
                              <span className="text-base md:text-sm">{category.total_units}</span>
                            </div>
                            <p className="text-center text-lg font-medium md:text-sm">Units</p>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <ClockIcon className="h-10 w-10 md:h-6 md:w-6" />
                              <span className="text-base md:text-sm">{category.total_time / 60}</span>
                            </div>
                            <p className="text-center text-lg font-medium md:text-sm">Minutes</p>
                          </div>
                        </div>
                        {isDisabled ? (
                          <div className="mt-5 flex items-center justify-center">
                            <LockClosedIcon className="h-8 w-8" />
                          </div>
                        ) : (
                          <button
                            className="m-3 flex flex-col items-center gap-y-5 p-3"
                            onClick={() => handlerCertification(category)}
                            type="button">
                            <div className="flex items-center justify-start gap-2">
                              <div className="pr-2  text-right text-black">
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
                            {categoryCompleted(category._id) ? (
                              <div className="flex items-center text-center ">
                                <ShieldCheckIcon className="h-4 w-4 text-green-600" />
                                <div>Completed</div>
                              </div>
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
              <div className="text-2xl font-semibold text-black">Your search - did not match any categories</div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex h-96 flex-col items-center justify-center">
          <div className="text-2xl font-semibold text-black">Loading ...</div>
        </div>
      )}
    </div>
  )
}
