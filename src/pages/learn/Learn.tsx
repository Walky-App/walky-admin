import { useEffect, useState } from 'react'

import { useSearchParams } from 'react-router-dom'

import { HeaderComponent } from '../../components/shared/general/HeaderComponent'
import type { Category } from '../../interfaces/category'
import type { FilterInterface } from '../../interfaces/global'
import { RequestService } from '../../services/RequestService'
import { useLearn } from '../../store/useLearn'
import { CategoryCards } from './components/CategoryCards'

export const Learn = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [searchParams] = useSearchParams()
  const [filter, setFilter] = useState<FilterInterface>({ search: '', selected: '' })
  const [categories, setCategories] = useState<Category[]>([])
  const { setRecord } = useLearn()

  const fetchData = async () => {
    const response: Category[] = await RequestService('categories')
    if (response.length !== 0) {
      setCategories(response)
    }
    const responseLms = await RequestService('lms')
    if (responseLms.length !== 0) {
      setRecord(responseLms)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (categories.length === 0) {
      fetchData()
    }
    setFilter({
      search: searchParams.get('search') ?? '',
      selected: '',
    })
  }, [searchParams, categories])

  return (
    <div>
      <div className="w-full sm:overflow-x-hidden">
        <div className="border-1 mb-4 rounded-xl bg-gray-100 pb-2 shadow-md">
          <div>
            <img
              alt=""
              className="border-1 h-28 w-full rounded-t-xl object-cover object-center lg:h-32"
              src="https://www.hemptempsuniversity.com/wp-content/uploads/2019/07/htuniversity1-1-1799x1011.jpg"
            />
          </div>
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
              <div className="flex">
                <img
                  alt=""
                  className="h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32"
                  src="https://www.hemptempsuniversity.com/wp-content/uploads/2016/05/hemptempsuniversitylogo-1-e1465278344770.png"
                />
              </div>
              <div className="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
                <div className="mt-6 min-w-0 flex-1 sm:hidden md:block">
                  <h1 className="truncate text-2xl font-bold text-gray-900">Hemp Temps University</h1>
                </div>
              </div>
            </div>
            <div className="mt-6 hidden min-w-0 flex-1 sm:block md:hidden">
              <h1 className="truncate text-2xl font-bold text-gray-900">Hemp Temps University</h1>
            </div>
          </div>
        </div>

        <HeaderComponent search title="Learn" />

        <div className="mt-4 grid grid-cols-4 gap-6 md:grid-cols-3">
          <div className="order-2 col-span-4 md:order-1 md:col-span-2">
            <CategoryCards category={categories} filter={filter} isLoading={loading} />
          </div>

          {/*right content*/}
          <div className="order-1 col-span-4 md:col-span-1">
            <div className=" h-auto rounded-2xl border border-zinc-100 bg-white">
              <div className="m-3 text-left text-2xl">Explore the courses</div>
              <div className="m-3 pb-2 text-left text-xs">
                Get content recommendations in a specialized course by taking a targeted skills assessment & Increase
                your hourly rate by $2 on completion of the course.
              </div>
              <div className="m-3 grid grid-cols-2 gap-3 text-stone-500">
                <div className="flex h-auto flex-col gap-3 rounded-2xl border border-zinc-100 bg-neutral-100 p-3 text-xs sm:h-32">
                  <span>Courses Completed</span>
                  <span className="text-xl font-semibold text-black ">1</span>
                </div>
                <div className="flex h-auto flex-col gap-3 rounded-2xl border border-zinc-100 bg-neutral-100 p-3 text-xs sm:h-32">
                  <span>Certificate Earns</span>
                  <span className="text-xl font-semibold text-black ">1</span>
                </div>
                <div className="flex h-auto flex-col gap-3 rounded-2xl border border-zinc-100 bg-neutral-100 p-3 text-xs sm:h-32">
                  <span>Course In Progress</span>
                  <span className="text-xl font-semibold text-black ">1</span>
                </div>
                <div className="flex h-auto flex-col gap-3 rounded-2xl border border-zinc-100 bg-neutral-100 p-3 text-xs sm:h-32">
                  <span>Recommend Courses</span>
                  <span className="text-xl font-semibold text-black ">1</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
