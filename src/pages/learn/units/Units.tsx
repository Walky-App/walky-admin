import { useEffect, useState } from 'react'

import { useNavigate, useParams } from 'react-router-dom'

import { Badge } from 'primereact/badge'

import { ArrowRightIcon, CheckIcon } from '@heroicons/react/20/solid'
import { BriefcaseIcon, ClockIcon, LockClosedIcon, NewspaperIcon } from '@heroicons/react/24/outline'

import { BreadCrumbs } from '../../../components/shared/BreadCrumbs'
import { useAdmin } from '../../../contexts/AdminContext'
import type { Module } from '../../../interfaces/module'
import type { Unit } from '../../../interfaces/unit'
import { requestService } from '../../../services/requestServiceNew'
import { useLearn } from '../../../store/useLearn'
import { cn } from '../../../utils/cn'
import { secondsToTimeDescription } from '../../../utils/functionUtils'
import { CircularProgressBar } from '../components/CircularProgressBar'

export const Units = () => {
  const { module, setModule, setUnit } = useAdmin()
  const { record, setRecord } = useLearn()
  const [loading, setLoading] = useState<boolean>(true)
  const [unitUnlock, setUnitUnlock] = useState<number>(0)
  const params = useParams()
  const navigate = useNavigate()

  const fetchData = async () => {
    try {
      const response = await requestService({ path: `modules/${params.moduleId}` })
      const moduleData: Module = await response.json()
      if (response.ok) {
        setModule(moduleData)
      }
      const responseLms = await requestService({ path: 'lms' })
      const lmsData = await responseLms.json()
      if (lmsData.length !== 0) {
        setRecord(lmsData)
      }
      unitsCompleted(moduleData._id, moduleData.category._id)
      setLoading(!loading)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    if (!module) {
      fetchData()
    } else {
      unitsCompleted(module._id, module.category._id)
    }
  })

  const handlerUnit = (unit: Unit) => {
    setUnit(unit)
    navigate(`/learn/module/${module?._id}/unit/${unit._id}`)
  }

  const unitsCompleted = (_id: string, idCategory: string) => {
    try {
      const category = record.categories.find(data => data.category === idCategory)
      const module = category?.modules.find(data => data.module === _id)
      setUnitUnlock(module?.units.filter(unit => unit.assessments_completed === true).length ?? 0)
    } catch (error) {
      return 0
    }
  }
  const pages = [
    { name: 'Categories', href: '/learn', current: false },
    { name: 'Courses', href: `/learn/category/${module?.category._id}`, current: false },
    { name: 'Videos', href: '#', current: true },
  ]

  return (
    <div>
      <BreadCrumbs pages={pages} />
      <div className="mb-4 flex h-auto flex-col rounded-2xl border border-zinc-100 bg-white" key={module?._id}>
        <div className="flex max-h-36 flex-row">
          <div className="hidden md:m-3 md:block">
            {module?.image ? (
              <img alt={`Hemp Temp ${module?.title} module`} className="h-full w-36 rounded-xl" src={module?.image} />
            ) : (
              <div className="h-full w-36 rounded-xl bg-neutral-200" />
            )}
          </div>
          <div className="m-3 flex flex-1 flex-row gap-3">
            <div className="flex flex-1 flex-col justify-evenly">
              <div className="flex basis-1/3 flex-wrap">
                <Badge color="gray">
                  <p className="text-xs font-normal text-stone-500">{module?.category?.title}</p>
                </Badge>
              </div>
              <div className="text-xl font-semibold text-black">{module?.title}</div>
              <div className="inline-flex h-5 w-full items-center justify-start gap-2">
                <div className="flex items-center justify-start gap-1">
                  <ClockIcon className="h-5" />
                  <div className="flex h-5 items-center text-xs font-medium text-black">
                    {secondsToTimeDescription(module?.total_time as number)}
                  </div>
                </div>
                <div className="h-1 w-1 rounded-full bg-stone-500" />
                <div className="flex items-center justify-start gap-1">
                  <NewspaperIcon className="h-5" />
                  <div className="flex h-5 items-center text-xs font-medium text-black">
                    {module?.units?.length} Units
                  </div>
                </div>
                <div className="h-1 w-1 rounded-full bg-stone-500" />
                <div className="flex items-center justify-start gap-1">
                  <BriefcaseIcon className="h-5" />
                  <div className="flex h-5 items-center text-xs font-medium text-black">{module?.level}</div>
                </div>
              </div>
            </div>
            <div className="m-3 flex flex-col items-center">
              {module ? (
                <CircularProgressBar
                  progressData={{
                    total: module.units?.length || 0,
                    complete: unitUnlock,
                  }}
                />
              ) : null}
            </div>
          </div>
        </div>
        <div className="m-3 h-auto font-normal text-stone-500">{module?.description}</div>
      </div>
      {module?.units?.map((unit: Unit, index) => (
        <div className="px-4 md:px-6" key={`unit-${index}`}>
          <div
            className={cn('space-y-6 md:h-28', {
              'border-l-2 border-dashed': index !== (module?.units?.length ?? 0) - 1,
            })}>
            <div className="h-full pb-5">
              <div className="relative h-full w-full">
                <div
                  className={cn(
                    'absolute -top-0.5 z-10 -ml-3.5 flex h-7 w-7 items-center justify-center rounded-full border text-blue-500',
                    {
                      'bg-green-500': index < unitUnlock,
                      'bg-white': index === unitUnlock,
                      'bg-gray-300': index > unitUnlock,
                    },
                  )}>
                  {index < unitUnlock ? <CheckIcon className="h-8 w-8" color="#fff" /> : null}
                </div>
                <button
                  disabled={!(unitUnlock >= index)}
                  className={cn('h-full w-full pl-6 md:pr-10', {
                    'cursor-pointer': unitUnlock >= index,
                  })}
                  onClick={() => handlerUnit(unit)}
                  type="button">
                  <div
                    className={cn('flex h-full rounded-2xl border border-zinc-100  bg-gray-300', {
                      'bg-white hover:bg-gray-100': unitUnlock >= index,
                    })}>
                    <div className="flex flex-1 items-center justify-start gap-6 pl-2">
                      <div className="flex items-center justify-center">
                        {unit?.url_image ? (
                          <img
                            alt={`Hemp Temp ${unit.title} module`}
                            className="mt-2 hidden h-20 min-w-20 rounded-xl md:m-0 md:flex "
                            src={unit.url_image}
                          />
                        ) : null}
                      </div>
                      <div>
                        <div className="mt-2 text-start text-base font-semibold text-black">{unit.title}</div>
                        <div className="mb-2 h-auto overflow-hidden text-start font-normal text-stone-500 md:line-clamp-2 md:text-ellipsis">
                          {unit.description}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center px-2">
                      {unitUnlock >= index ? (
                        <ArrowRightIcon className="h-5 w-5" />
                      ) : (
                        <LockClosedIcon className="h-5 w-5" />
                      )}
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
