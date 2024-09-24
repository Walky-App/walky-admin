import { Suspense, useEffect, useState } from 'react'

import { useParams, useSearchParams } from 'react-router-dom'

import { CheckIcon } from '@heroicons/react/20/solid'

import { BreadCrumbs } from '../../../components/shared/BreadCrumbs'
import { HeadingComponent } from '../../../components/shared/general/HeadingComponent'
import { type Module } from '../../../interfaces/module'
import { RequestService } from '../../../services/RequestService'
import { useLearn } from '../../../store/useLearn'
import { ModuleCards } from '../components/ModuleCards'

export const Modules = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const params = useParams()
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [modules, setModules] = useState<Module[]>([])
  const { setRecord } = useLearn()

  const fetchData = async () => {
    const response = await RequestService(`modules/category/${params.categoryId}`)
    if (response.length !== 0) {
      setModules(response)
    }
    const responseLms = await RequestService('lms')
    if (responseLms.length !== 0) {
      setRecord(responseLms)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (modules.length === 0) {
      fetchData()
    }

    setSearch(searchParams.get('search') || '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, modules])

  const pages = [
    { name: 'Categories', href: '/learn', current: false },
    { name: 'Courses', href: '#', current: true },
  ]

  return (
    <div>
      <BreadCrumbs pages={pages} />
      <div className="w-full sm:overflow-x-hidden">
        <HeadingComponent title="Courses" />

        <div className="mt-4 grid grid-cols-4 gap-6 md:grid-cols-3">
          <div className="order-2 col-span-4 md:order-1 md:col-span-2">
            <Suspense fallback={<div>loading...</div>} key={search + '-module-cards'}>
              <ModuleCards filter={search} isLoading={loading} module={modules} />
            </Suspense>
          </div>

          {/*right content*/}
          <div className="order-1 col-span-4 md:col-span-1">
            <div className="h-auto rounded-2xl border border-zinc-100 p-4">
              <div className="m-3 text-left text-2xl">Evaluate your skills with assessments</div>
              <div className="m-3 pb-2 text-left">
                Get content recommendations in a specialized course by taking a targeted skills assessment.
              </div>
              <div className="m-3 gap-2">
                <div className="flex">
                  <div className="relative mr-2 h-5 w-5">
                    <CheckIcon />
                  </div>
                  <div className="font-medium ">Pick a module</div>
                </div>
                <div className="flex">
                  <div className="relative mr-2 h-5 w-5">
                    <CheckIcon />
                  </div>
                  <div className="font-medium ">Assess your skills</div>
                </div>
                <div className="flex">
                  <div className="relative mr-2 h-5 w-5">
                    <CheckIcon />
                  </div>
                  <div className="font-medium ">Review your results</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
