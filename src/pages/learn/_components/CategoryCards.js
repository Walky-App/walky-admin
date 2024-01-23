import { ShieldCheckIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'
import React from 'react'

export default async function CategoryCards({ category, filter = '' }) {
  const categoriesFilter = () => {
    const categoriesTemp = [...category]
    return categoriesTemp.filter(category =>
      category.title.toLowerCase().includes(filter.toLocaleLowerCase()),
    )
  }
  return (
    <>
      {categoriesFilter().map(category => (
        <Link key={category.id} href={`/learn/categories/${category.id}`}>
          <div className="mb-4 flex sm:h-32 h-auto rounded-2xl border border-zinc-100 bg-white">
            <div className="m-3">
              <div className="h-24 w-24 rounded-xl bg-neutral-200"></div>
            </div>
            <div className="m-3 flex flex-1 flex-col justify-center gap-3">
              <div className="text-black text-xl font-semibold">{category.title}</div>
              <div className=" text-stone-500 text-xs font-normal text-ellipsis overflow-hidden h-12">
                {category.description}
              </div>
            </div>
            <div className="m-3 flex gap-y-5 flex-col items-center p-3">
              <div className="flex items-center justify-start gap-2">
                <div className="text-right text-xs font-normal text-black">
                  {category.progress} %
                </div>
                <div className="relative h-1 w-10">
                  <div className="w-10 h-1 left-0 top-0 absolute bg-neutral-100 rounded-2xl"></div>
                  <div
                    className={`w-${
                      category.progress / 10
                    } h-1 left-0 top-0 absolute bg-black rounded-2xl`}></div>
                </div>
              </div>
              {category.progress === 100 ? (
                <div className="flex text-xs font-normal text-center items-center">
                  <ShieldCheckIcon className="h-4 w-4 text-green-600" />
                  <div>Completed</div>
                </div>
              ) : null}
            </div>
          </div>
        </Link>
      ))}
    </>
  )
}
