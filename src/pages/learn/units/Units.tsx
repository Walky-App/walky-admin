import { useEffect, useState } from 'react'

import { useNavigate, useParams } from 'react-router-dom'

import { Badge } from 'flowbite-react'

import { ArrowRightIcon, CheckIcon } from '@heroicons/react/20/solid'
import { BriefcaseIcon, ClockIcon, LockClosedIcon, NewspaperIcon } from '@heroicons/react/24/outline'

import { useAdmin } from '../../../contexts/AdminContext'
import type { Module } from '../../../interfaces/module'
import type { Unit } from '../../../interfaces/unit'
import { RequestService } from '../../../services/RequestService'
import { useLearn } from '../../../store/useLearn'
import { secondsToTimeDescription } from '../../../utils/FunctionUtils'
import { cn } from '../../../utils/cn'
import { CircularProgressBar } from '../components/CircularProgressBar'

export const Units = () => {
  const { module, setModule, setUnit } = useAdmin()
  const { record, setRecord } = useLearn()
  const [loading, setLoading] = useState<boolean>(true)
  const [unitUnlock, setUnitUnlock] = useState<number>(0)
  const params = useParams()
  const navigate = useNavigate()

  const fetchData = async () => {
    const response: Module = await RequestService(`modules/${params.moduleId}`)
    if (response) {
      setModule(response)
    }
    const responseLms = await RequestService('lms')
    if (responseLms.length !== 0) {
      setRecord(responseLms)
    }
    unitsCompleted(response._id, response.category._id)
    setLoading(!loading)
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
      const category = record.categories.find(data => data.category == idCategory)
      const module = category?.modules.find(data => data.module == _id)
      setUnitUnlock(module?.units.filter(unit => unit.assessments_completed == true).length ?? 0)
    } catch (error) {
      return 0
    }
  }

  return (
    <div>
      <div className="mb-4 flex h-auto flex-col rounded-2xl border border-zinc-100 bg-white" key={module?._id}>
        <div className="flex max-h-36 flex-row">
          <div className="m-3">
            {module?.image ? (
              <img alt={`Hemp Temp ${module?.title} module`} className="h-full w-36 rounded-xl" src={module?.image} />
            ) : (
              <div className="h-full w-36 rounded-xl bg-neutral-200" />
            )}
          </div>
          <div className="m-3 flex flex-1 flex-row gap-3">
            <div className="flex flex-1 flex-col justify-evenly">
              <div className="flex basis-1/3 flex-wrap ">
                <Badge color="gray" size="sm">
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
        <div className="m-3 h-auto text-xs font-normal text-stone-500">{module?.description}</div>
      </div>
      {module?.units?.map((unit: Unit, index) => (
        <div className="flex flex-1 items-center justify-center bg-white pl-6" key={`unit-${index}`}>
          <div
            className={cn('space-y-6 pb-6', {
              'border-l-2 border-dashed': index !== (module?.units?.length ?? 0) - 1,
            })}>
            <div className="relative w-full">
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
                className={cn('ml-6 h-24 max-h-24 min-h-24 text-left', {
                  'cursor-pointer': unitUnlock >= index,
                })}
                onClick={() => handlerUnit(unit)}
                type="button">
                <div
                  className={cn('flex h-auto flex-row rounded-2xl border border-zinc-100  bg-gray-300', {
                    'bg-white hover:bg-gray-100': unitUnlock >= index,
                  })}>
                  <div>
                    <div className="m-2 flex flex-1 flex-row gap-3">
                      <div className="flex flex-1 flex-col justify-evenly">
                        <div className="text-base font-semibold text-black">{unit.title}</div>
                      </div>
                    </div>
                    <div className="mx-2 mb-2 h-auto text-xs font-normal text-stone-500">{unit.description}</div>
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
      ))}
    </div>
  )
}
