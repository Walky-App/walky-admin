import { useNavigate } from 'react-router-dom'

import { Badge } from 'flowbite-react'
import { Card } from 'primereact/card'

import { ShieldCheckIcon } from '@heroicons/react/20/solid'

import { useAdmin } from '../../../contexts/AdminContext'
import { type Category } from '../../../interfaces/category'
import { type FilterInterface } from '../../../interfaces/global'
import { useLearn } from '../../../store/useLearn'

interface CategoryCardsProps {
  category: Category[]
  filter?: FilterInterface
  isLoading: boolean
  isAdmin?: boolean
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

  const handlerSetCategory = (category: Category) => {
    if (isAdmin) {
      setCategory(category)
      navigate(`/admin/learn/categories/${category._id}`)
      return
    }
    navigate(`/learn/category/${category._id}`)
  }

  const categoryProgress = (_id: string) => {
    try {
      const category = record.categories.find(data => data.category == _id)
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

  const generateCertification = (category: Category) => () => {
    const action = category
    return action
  }

  return (
    <div>
      {!isLoading ? (
        <div>
          {categoriesFilter().length > 0 ? (
            categoriesFilter().map(category => (
              <Card
                className="cursor-pointer"
                key={category._id}
                onClick={() => handlerSetCategory(category)}
                pt={{
                  body: { className: 'p-0 mb-4 ' },
                  content: { className: 'p-0' },
                }}>
                <div className="flex h-auto sm:h-32  ">
                  <div className="m-3">
                    {category.image ? (
                      <img
                        alt={`Hemp Temp ${category.title} category`}
                        className="h-24 w-24 rounded-xl object-cover object-center"
                        src={category.image}
                      />
                    ) : (
                      <div className="h-24 w-24 rounded-xl bg-neutral-200" />
                    )}
                  </div>
                  <div className="m-3 flex flex-1 flex-col justify-center gap-3">
                    <div className="text-xl font-semibold text-black">{category.title}</div>
                    <div className=" h-12 overflow-hidden text-ellipsis text-xs font-normal text-stone-500">
                      {category.description}
                    </div>
                  </div>
                  {isAdmin ? (
                    <div className="m-3 flex flex-col items-center gap-y-5 p-3">
                      <Badge color={category.is_disabled ? 'red' : 'green'} size="sm">
                        <p className="text-xs font-normal text-stone-500">
                          {category.is_disabled ? 'Disabled' : 'Active'}
                        </p>
                      </Badge>
                    </div>
                  ) : (
                    <div className="m-3 flex flex-col items-center gap-y-5 p-3">
                      <div className="flex items-center justify-start gap-2">
                        <div className="text-right text-xs font-normal text-black">
                          {categoryProgress(category._id) !== 0 && category.modules_number !== 0
                            ? (categoryProgress(category._id) / category.modules_number) * 100
                            : 0}
                          %{' '}
                        </div>
                        <div className="relative h-1 w-10">
                          <div className="absolute left-0 top-0 h-1 w-10 rounded-2xl bg-neutral-100" />
                          <div
                            className={`w-${
                              categoryProgress(category._id) !== 0 && category.modules_number !== 0
                                ? Math.floor((categoryProgress(category._id) / category.modules_number) * 100) / 10
                                : 0
                            } absolute left-0 top-0 h-1 rounded-2xl bg-black`}
                          />
                        </div>
                      </div>
                      {categoryCompleted(category._id) ? (
                        <div className="flex items-center text-center text-xs font-normal">
                          <ShieldCheckIcon
                            className="h-4 w-4 text-green-600"
                            onClick={generateCertification(category)}
                          />
                          <div>Completed</div>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              </Card>
            ))
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
