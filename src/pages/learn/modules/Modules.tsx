import { Suspense, useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { RequestService } from '../../../services/RequestService'
import { Module } from '../../../interfaces/module'
import { CheckIcon } from '@heroicons/react/20/solid'
import { HeaderComponent } from '../../../components/shared/general/HeaderComponent'
import { ModuleCards } from '../components/ModuleCards'
import { PencilIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline'

export const Modules = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const params = useParams()
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [modules, setModules] = useState<Module[]>([])

  const fecthData = async () => {
    const response = await RequestService(`modules/category/${params.categoryId}`)
    if (response.length !== 0) {
      setModules(response)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (modules.length === 0) {
      fecthData()
    }

    setSearch(searchParams.get('search') || '')
  }, [searchParams, modules])

  return (
    <div>
      <div className="w-full sm:overflow-x-hidden">
        <HeaderComponent search title='Categories' />

        <div className="mt-4 grid grid-cols-4 md:grid-cols-3 gap-6">
          <div className="col-span-4 md:col-span-2 order-2 md:order-1">
            <Suspense fallback={<div>loading...</div>} key={search + '-module-cards'} >
              <ModuleCards filter={search} isLoading={loading} module={modules} />
            </Suspense>
          </div>

          {/*right content*/}
          <div className="order-1 col-span-4 md:col-span-1">
            <div className="h-auto rounded-2xl border border-zinc-100 bg-white">
              <div className="m-3 text-left text-2xl">Evaluate your skills with assessments</div>
              <div className="m-3 pb-2 text-left text-xs">
                Get content recommendations in a specialized course by taking a targeted skills assessment & Increase
                your hourly rate by <strong>$2</strong> on completion of the course.
              </div>
              <div className="m-3 h-20 w-40 flex-col items-start justify-start gap-2">
                <div className="inline-flex items-center justify-start gap-2">
                  <div className="relative h-5 w-5">
                    <CheckIcon />
                  </div>
                  <div className="text-xs font-medium text-black">Pick a module</div>
                </div>
                <div className="inline-flex items-center justify-start gap-2">
                  <div className="relative h-5 w-5">
                    <CheckIcon />
                  </div>
                  <div className="text-xs font-medium text-black">Assess your skills</div>
                </div>
                <div className="inline-flex items-center justify-start gap-2">
                  <div className="relative h-5 w-5">
                    <CheckIcon />
                  </div>
                  <div className="text-xs font-medium text-black">Review your results</div>
                </div>
              </div>
            </div>
            <div className="mt-5 inline-flex h-auto w-full items-center rounded-2xl border border-zinc-100 bg-white p-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100">
                <QuestionMarkCircleIcon className="h-5 w-5" />
              </div>
              <div className="ml-2 text-sm font-normal leading-tight text-black">Get help with this certificate</div>
            </div>
            <div className="mt-5 inline-flex h-auto w-full items-center rounded-2xl border border-zinc-100 bg-white p-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100">
                <PencilIcon className="h-5 w-5" />
              </div>
              <div className="ml-2 text-sm font-normal leading-tight text-black">
                Provide feedback for this certificate
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
