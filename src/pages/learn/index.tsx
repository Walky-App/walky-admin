import { Suspense, useEffect, useState } from 'react'
import CategoryCards from './components/CategoryCards'
import { Category } from '../../interfaces/Category'
import { RequestService } from '../../services/RequestService'
import { useSearchParams } from 'react-router-dom'
import HeaderComponent from '../../components/shared/general/HeaderComponent'

export default function Learn() {
  const [loading, setLoading] = useState<boolean>(true)
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [categories, setCategories] = useState<Category[]>([])

  const fecthData = async () => {
    const response: Category[] = await RequestService('categories')
    if (response.length !== 0) {
      setCategories(response)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (categories.length === 0) {
      fecthData()
    }
    setSearch(searchParams.get('search') || '')
  }, [searchParams, categories])

  return (
    <>
      <div className="w-full sm:overflow-x-hidden">
        <HeaderComponent title={'Learn'} search />

        <div className="mt-4 grid grid-cols-4 md:grid-cols-3 gap-6">
          <div className="col-span-4 md:col-span-2 order-2 md:order-1">
            <Suspense key={search + '-category-cards'} fallback={<div>loading...</div>}>
              <CategoryCards category={categories} filter={search} isLoading={loading} />
            </Suspense>
          </div>

          {/*right content*/}
          <div className="col-span-4 md:col-span-1 order-1">
            <div className=" h-auto rounded-2xl border border-zinc-100 bg-white">
              <div className="m-3 text-2xl text-left">Explore the courses</div>
              <div className="m-3 text-xs text-left pb-2">
                Get content recommendations in a specialized course by taking a targeted skills assessment & Increase
                your hourly rate by $2 on completion of the course.
              </div>
              <div className="grid grid-cols-2 gap-3 m-3 text-stone-500">
                <div className="sm:h-32 h-auto rounded-2xl border border-zinc-100 bg-neutral-100 p-3 text-xs flex flex-col gap-3">
                  <span>Courses Completed</span>
                  <span className="text-black text-xl font-semibold ">1</span>
                </div>
                <div className="sm:h-32 h-auto rounded-2xl border border-zinc-100 bg-neutral-100 p-3 text-xs flex flex-col gap-3">
                  <span>Certificate Earns</span>
                  <span className="text-black text-xl font-semibold ">1</span>
                </div>
                <div className="sm:h-32 h-auto rounded-2xl border border-zinc-100 bg-neutral-100 p-3 text-xs flex flex-col gap-3">
                  <span>Course In Progress</span>
                  <span className="text-black text-xl font-semibold ">1</span>
                </div>
                <div className="sm:h-32 h-auto rounded-2xl border border-zinc-100 bg-neutral-100 p-3 text-xs flex flex-col gap-3">
                  <span>Recommend Courses</span>
                  <span className="text-black text-xl font-semibold ">1</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
