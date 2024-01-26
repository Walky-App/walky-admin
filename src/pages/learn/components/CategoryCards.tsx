import { Link } from 'react-router-dom'
import { Category } from '../../../interfaces/Category'

interface CategoryCardsProps {
  category: Category[],
  filter?: string
}

export default function CategoryCards({ category, filter = '' }: CategoryCardsProps) {
  const categoriesFilter = () => {
    const categoriesTemp = [...category]
    return categoriesTemp.filter(category =>
      category.title.toLowerCase().includes(filter.toLocaleLowerCase()),
    )
  }
  return (
    <>
      {categoriesFilter().map(category => (
        <Link key={category._id} to={`/learn/categories/${category._id}`}>
          <div className="mb-4 flex sm:h-32 h-auto rounded-2xl border border-zinc-100 bg-white">
            <div className="m-3">
              {
                category.image ?
                  <img alt={`Hemp Temp ${category.title} category`} src={category.image} className="h-24 w-24 rounded-xl" />
                  :
                  <div className="h-24 w-24 rounded-xl bg-neutral-200" />
              }
            </div>
            <div className="m-3 flex flex-1 flex-col justify-center gap-3">
              <div className="text-black text-xl font-semibold">{category.title}</div>
              <div className=" text-stone-500 text-xs font-normal text-ellipsis overflow-hidden h-12">
                {category.description}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </>
  )
}
