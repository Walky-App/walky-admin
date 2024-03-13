import { useNavigate } from 'react-router-dom'
import { Category } from '../../../interfaces/category'
import { ShieldCheckIcon } from '@heroicons/react/20/solid'
import { Badge } from 'flowbite-react'
import { FilterInterface } from '../../../interfaces/Global'
import { useAdmin } from '../../../contexts/AdminContext'
import { Card } from 'primereact/card'

interface CategoryCardsProps {
  category: Category[]
  filter?: FilterInterface
  isLoading: boolean
  isAdmin?: boolean
}

export const CategoryCards = ({ category, filter = { search: '', selected: '' }, isLoading = true, isAdmin = false }: CategoryCardsProps) => {
  const { setCategory } = useAdmin()
  const navigate = useNavigate()
  const categoriesFilter = () => {
    if (isAdmin) {
      let categoriesTemp = [...category]
      if (filter.selected !== 'all') {
        categoriesTemp = categoriesTemp.filter(category => filter.selected === 'active' ? !category.is_disabled : category.is_disabled)
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


  return (
    <div>
      {!isLoading ? (
        <div>
          {categoriesFilter().length > 0 ? (categoriesFilter().map(category => (
            <Card className='cursor-pointer' key={category._id} onClick={() => handlerSetCategory(category)} pt={{
              body: { className: 'p-0 mb-4 ' },
              content: { className: 'p-0' },
            }} >
              <div className="flex sm:h-32 h-auto  ">
                <div className="m-3">
                  {category.image ? (
                    <img
                      alt={`Hemp Temp ${category.title} category`}
                      className="h-24 w-24 object-cover object-center rounded-xl"
                      src={category.image}
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-xl bg-neutral-200" />
                  )}
                </div>
                <div className="m-3 flex flex-1 flex-col justify-center gap-3">
                  <div className="text-black text-xl font-semibold">{category.title}</div>
                  <div className=" text-stone-500 text-xs font-normal text-ellipsis overflow-hidden h-12">
                    {category.description}
                  </div>
                </div>
                {
                  isAdmin ?
                    (
                      <div className="m-3 flex gap-y-5 flex-col items-center p-3">
                        <Badge color={category.is_disabled ? "red" : "green"} size="sm">
                          <p className="text-xs font-normal text-stone-500">{category.is_disabled ? "Disabled" : "Active"}</p>
                        </Badge>
                      </div>
                    ) :
                    (
                      <div className="m-3 flex gap-y-5 flex-col items-center p-3">
                        <div className="flex items-center justify-start gap-2">
                          <div className="text-right text-xs font-normal text-black">{category.progress} %</div>
                          <div className="relative h-1 w-10">
                            <div className="w-10 h-1 left-0 top-0 absolute bg-neutral-100 rounded-2xl" />
                            <div
                              className={`w-${Math.floor(
                                category.progress / 10,
                              )} h-1 left-0 top-0 absolute bg-black rounded-2xl`} />
                          </div>
                        </div>
                        {category.progress === 100 ? (
                          <div className="flex text-xs font-normal text-center items-center">
                            <ShieldCheckIcon className="h-4 w-4 text-green-600" />
                            <div>Completed</div>
                          </div>
                        ) : null}
                      </div>
                    )
                }
              </div>
            </Card>
          ))) : (
            <div className="flex flex-col items-center justify-center h-96">
              <div className="text-2xl font-semibold text-black">Your search - did not match any categories</div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-96">
          <div className="text-2xl font-semibold text-black">Loading ...</div>
        </div>
      )}
    </div>
  )
}
