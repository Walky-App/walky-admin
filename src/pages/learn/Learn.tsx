import { useEffect, useState } from 'react'

import { useSearchParams } from 'react-router-dom'

import { Button } from 'primereact/button'
import { Card } from 'primereact/card'

import { BreadCrumbs } from '../../components/shared/BreadCrumbs'
import { HeadingComponent } from '../../components/shared/general/HeadingComponent'
import type { Category } from '../../interfaces/category'
import type { FilterInterface } from '../../interfaces/global'
import { requestService } from '../../services/requestServiceNew'
import { useLearn } from '../../store/useLearn'
import { CategoryCards } from './components/CategoryCards'

export const Learn = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [searchParams] = useSearchParams()
  const [filter, setFilter] = useState<FilterInterface>({ search: '', selected: '' })
  const [categories, setCategories] = useState<Category[]>([])
  const { setRecord } = useLearn()

  const fetchData = async () => {
    const request = await requestService({ path: 'categories' })
    const response: Category[] = await request.json()
    if (response.length !== 0) {
      setCategories(response)
    }
    const requestLms = await requestService({ path: 'lms' })
    const responseLms = await requestLms.json()
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, categories])

  // const getCategoryCompleted = useMemo(() => {
  //   return record.categories.filter(category => category.is_completed).length
  // }, [record])

  // const getModuleCompleted = useMemo(() => {
  //   return record.categories.map(category => category.modules.filter(module => module.is_completed)).flat().length
  // }, [record])

  // const getModuleInProgress = useMemo(() => {
  //   return record.categories.map(category => category.modules.filter(module => !module.is_completed)).flat().length
  // }, [record])

  // const getCertification = useMemo(() => {
  //   return record.categories.map(category => category.url_certificate).filter(url => url !== '').length
  // }, [record])

  const pages = [{ name: 'Categories', href: '/learn', current: true }]

  return (
    <div>
      <BreadCrumbs pages={pages} />
      <div className="w-full sm:overflow-x-hidden">
        <div className="border-1 mb-4 rounded-xl pb-2 shadow-md">
          <div>
            <img
              alt=""
              className="border-1 h-28 w-full rounded-t-xl object-cover object-top lg:h-64"
              src="/assets/photos/htu-bk.png"
            />
          </div>
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
              <div className="flex">
                <img
                  alt=""
                  className="h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32"
                  src="/assets/logos/htu-logo-200px.png"
                />
              </div>
              <div className="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
                <div className="mt-6 min-w-0 flex-1 sm:hidden md:block">
                  <h1 className="truncate text-2xl font-bold">Hemp Temps University</h1>
                </div>
              </div>
            </div>
            <div className="mt-6 hidden min-w-0 flex-1 sm:block md:hidden">
              <h1 className="truncate text-2xl font-bold">Hemp Temps University</h1>
            </div>
          </div>
        </div>

        <HeadingComponent title="Categories" />

        <div className="mt-4 grid grid-cols-4 gap-12 md:grid-cols-3">
          <div className="order-2 col-span-4 md:order-1 md:col-span-2">
            <CategoryCards category={categories} filter={filter} isLoading={loading} />
          </div>

          {/*right content*/}
          <div className="order-1 col-span-4 md:col-span-1">
            <div className="card justify-content-center flex">
              <Card
                title="Free Training Required (WPS)"
                subTitle="Worker Protection Standard"
                footer={() => (
                  <Button
                    label="Schedule Training"
                    icon="pi pi-check"
                    onClick={() =>
                      window.open('https://calendly.com/shannon-3rvz/wps-free-training?month=2024-06', '_blank')
                    }
                  />
                )}
                header={() => (
                  <img
                    className="h-68 w-full rounded-t-xl object-cover object-top"
                    alt="Card"
                    src="https://greencultured.co/wp-content/uploads/2100/01/Environmental-Protection-Agency-EPA-Worker-Protection-Standard-Training-600x384.jpg"
                  />
                )}
                className="md:w-25rem">
                <p className="mb-2">
                  Training for The Environmental Protection Agency (EPA) Worker Protection Standard (WPS) program, which
                  is a federal regulation designed to protect employees on farms, forests, nurseries, and greenhouses
                  from occupational exposure to agricultural pesticides related to the production of agricultural
                </p>
                <a
                  className="underline"
                  href="https://www.epa.gov/pesticide-worker-safety/agricultural-worker-protection-standard-wps"
                  target="_blank">
                  more info on Agricultural Worker Protection Standard (WPS)
                </a>
              </Card>
            </div>
            {/* <div className="card justify-content-center my-4 flex">
              <Card
                title="Explore the courses"
                subTitle="Get content recommendations in a specialized course by taking a targeted skills assessment"
                className="md:w-25rem">
                <div className="m-3 grid grid-cols-2 gap-3 text-stone-500">
                  <div className="flex h-auto flex-col gap-3 rounded-2xl border border-zinc-100 bg-neutral-100 p-3 sm:h-32">
                    <span>Courses Completed</span>
                    <span className="text-xl font-semibold text-black">{getCategoryCompleted}</span>
                  </div>
                  <div className="flex h-auto flex-col gap-3 rounded-2xl border border-zinc-100 bg-neutral-100 p-3 sm:h-32">
                    <span>Modules Completed</span>
                    <span className="text-xl font-semibold text-black">{getModuleCompleted}</span>
                  </div>
                  <div className="flex h-auto flex-col gap-3 rounded-2xl border border-zinc-100 bg-neutral-100 p-3 sm:h-32">
                    <span>Modules In Progress</span>
                    <span className="text-xl font-semibold text-black">{getModuleInProgress}</span>
                  </div>
                  <div className="flex h-auto flex-col gap-3 rounded-2xl border border-zinc-100 bg-neutral-100 p-3 sm:h-32">
                    <span>Certificate Earns</span>
                    <span className="text-xl font-semibold text-black">{getCertification}</span>
                  </div>
                </div>
              </Card>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}
