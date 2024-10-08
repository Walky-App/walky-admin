import { useEffect, useRef, useState } from 'react'

import { FaClipboardCheck, FaClock } from 'react-icons/fa'
import { FaFileLines } from 'react-icons/fa6'
import { useNavigate, useParams } from 'react-router-dom'

import { Badge } from 'primereact/badge'
import { TabPanel, TabView } from 'primereact/tabview'

import { Bars2Icon, PlusIcon } from '@heroicons/react/20/solid'
import { BriefcaseIcon, ClockIcon, NewspaperIcon } from '@heroicons/react/24/outline'

import { useAdmin } from '../../../contexts/AdminContext'
import type { CategoryTitle } from '../../../interfaces/category'
import type { Module } from '../../../interfaces/module'
import type { Unit } from '../../../interfaces/unit'
import { RequestService } from '../../../services/RequestService'
import { cn } from '../../../utils/cn'
import { secondsToTimeDescription } from '../../../utils/functionUtils'
import { UnitDetailsCard } from '../../learn/components/UnitDetailsCard'

export const AdminUnitsLearn = () => {
  const tabRef = useRef<TabView>(null)
  const { module, setModule, setUnit, unit, setAssessment } = useAdmin()
  const [category, setCategory] = useState<CategoryTitle>()
  const params = useParams()
  const navigate = useNavigate()

  const fetchData = async () => {
    const responseModule: Module = await RequestService(`modules/${params.moduleId}`)
    if (responseModule) {
      setModule(responseModule)
      setCategory(responseModule.category as unknown as CategoryTitle)
      setUnit(responseModule.units?.[0])
    }
  }

  const handlerCreateUnit = () => {
    navigate(`/admin/learn/modules/${module?._id}/units/new`)
  }

  const handlerSelectUnit = (unit: Unit) => {
    tabRef.current?.reset()
    setUnit(unit)
  }

  useEffect(() => {
    if (!module) {
      fetchData()
    }
  })

  const handleEditAssessment = () => {
    setAssessment(unit?.assessments)
    navigate(`/admin/learn/modules/${params.moduleId}/units/${unit?._id}/assessment/${unit?.assessments._id}`)
  }

  const handleNewAssessment = () => {
    setAssessment(undefined)
    navigate(`/admin/learn/modules/${params.moduleId}/units/${unit?._id}/assessment`)
  }

  return (
    <div>
      <div className="mb-4 flex h-auto flex-col rounded-2xl border border-zinc-100 bg-white p-6" key={module?._id}>
        <div className="flex flex-row">
          <div className="m-3">
            {module?.image ? (
              <img alt={`Hemp Temp ${module?.title} module`} className="h-full w-36 rounded-xl" src={module?.image} />
            ) : (
              <div className="h-full w-36 rounded-xl bg-neutral-200" />
            )}
          </div>
          <div className="m-6 flex flex-1 flex-col justify-center gap-3">
            <div className="flex basis-1/3 flex-wrap">
              <Badge color="gray">
                <p className="font-normal text-stone-500">{category?.title}</p>
              </Badge>
            </div>
            <div className="text-xl font-semibold text-black">{module?.title}</div>
            <div className="inline-flex h-5 w-full items-center justify-start gap-2">
              <div className="flex items-center justify-start gap-1">
                <ClockIcon className="h-5" />
                <div className="flex h-5 items-center font-medium text-black">
                  {secondsToTimeDescription(module?.total_time as number)}
                </div>
              </div>
              <div className="h-1 w-1 rounded-full bg-stone-500" />
              <div className="flex items-center justify-start gap-1">
                <NewspaperIcon className="h-5" />
                <div className="flex h-5 items-center font-medium text-black">{module?.units?.length} Units</div>
              </div>
              <div className="h-1 w-1 rounded-full bg-stone-500" />
              <div className="flex items-center justify-start gap-1">
                <BriefcaseIcon className="h-5" />
                <div className="flex h-5 items-center font-medium text-black">{module?.level}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="m-3 h-auto font-normal text-stone-500">{module?.description}</div>
      </div>

      <div className="mt-4 grid grid-cols-5 gap-6">
        <div className="col-span-2">
          <div className="flex h-auto flex-col rounded-2xl border border-zinc-100 bg-white">
            <button
              className="flex flex-row justify-center rounded-t-2xl border bg-gray-300 p-3 hover:bg-gray-200 hover:shadow-md"
              onClick={handlerCreateUnit}
              type="button">
              <PlusIcon className=" mr-1.5 h-8 w-8" />
              <h3 className="text-2xl">Create Units</h3>
            </button>
            {module?.units?.map(eachUnit => {
              return (
                <button
                  className={`border-b p-3 hover:bg-gray-100 ${unit?._id === eachUnit._id ? 'bg-gray-100' : ''}`}
                  key={eachUnit._id}
                  onClick={() => handlerSelectUnit(eachUnit)}
                  type="button">
                  <div className="flex flex-row items-center gap-3">
                    <Bars2Icon className="h-5 w-5" />
                    <div className="text-xl">{eachUnit.title}</div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/*right content*/}
        <div className="col-span-3">
          {unit ? (
            <div className=" h-auto border border-zinc-100 bg-white">
              <TabView ref={tabRef}>
                <TabPanel header="Unit Detail">
                  <UnitDetailsCard isAdmin unit={unit as Unit} />
                </TabPanel>
                <TabPanel header="Assessment Detail">
                  {unit?.assessments && (unit?.assessments?.questions?.length ?? 0) > 0 ? (
                    <div className="w-full">
                      <div className="flex flex-1 justify-between py-9">
                        <h2 className="text-xl font-bold">{unit.title}</h2>
                        <button
                          className="rounded-md bg-green-600 px-3 py-2  font-semibold text-white shadow-sm hover:bg-green-500"
                          onClick={() => handleEditAssessment()}
                          type="button">
                          Edit
                        </button>
                      </div>
                      <div className="flex flex-row justify-between">
                        <div className="flex basis-1/3 flex-row">
                          <FaClock className="h-5 w-5 pr-1" /> {unit.assessments?.time} mins
                        </div>
                        <div className="flex basis-1/3 flex-row">
                          <FaClipboardCheck className="h-5 w-5 pr-1" /> score min {unit.assessments.min_score} %
                        </div>
                        <div className="flex basis-1/3 flex-row pr-1">
                          <FaFileLines className="h-5 w-5" /> {unit?.assessments?.questions?.length} questions
                        </div>
                      </div>
                      <p className="py-3 text-gray-500">Questions</p>
                      {unit.assessments.questions?.map((question, index) => {
                        return (
                          <div
                            className={`flex flex-col ${index === (unit.assessments.questions?.length ?? 1) - 1 ? '' : 'border-b'} mb-2 gap-2 border-zinc-100 pb-4`}
                            key={question._id}>
                            <div className="flex basis-1/3 flex-row">
                              <div className=" font-semibold leading-6 text-gray-900">{question.header}</div>
                            </div>
                            <div className="ml-4">
                              <div
                                className={cn('gap-2', { 'text-green-600': question.answer === question.options[0] })}>
                                <span className="mr-2 font-bold">A)</span>
                                {question.options[0]}
                              </div>
                              <div
                                className={cn('gap-2', { 'text-green-600': question.answer === question.options[1] })}>
                                <span className="mr-2 font-bold">B)</span>
                                {question.options[1]}
                              </div>
                              <div
                                className={cn('gap-2', { 'text-green-600': question.answer === question.options[2] })}>
                                <span className="mr-2 font-bold">C)</span>
                                {question.options[2]}
                              </div>
                              <div
                                className={cn('gap-2', { 'text-green-600': question.answer === question.options[3] })}>
                                <span className="mr-2 font-bold">D)</span>
                                {question.options[3]}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-center">
                      <svg
                        aria-hidden="true"
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          vectorEffect="non-scaling-stroke"
                        />
                      </svg>
                      <h3 className="mt-2  font-semibold text-gray-900">No assessment</h3>
                      <p className="mt-1  text-gray-500">Get started by creating a new assessment.</p>
                      <div className="mt-6">
                        <button
                          className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
                          onClick={() => {
                            handleNewAssessment()
                          }}
                          type="button">
                          New assessment
                        </button>
                      </div>
                    </div>
                  )}
                </TabPanel>
              </TabView>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
