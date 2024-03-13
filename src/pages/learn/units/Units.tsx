import { useEffect, useState } from "react"
import { RequestService } from "../../../services/RequestService"
import { useNavigate, useParams } from "react-router-dom"
import { BriefcaseIcon, ClockIcon, NewspaperIcon } from '@heroicons/react/24/outline'
import { secondsToTimeDescription } from "../../../utils/FunctionUtils"
import { Badge } from "flowbite-react"
import { useAdmin } from "../../../contexts/AdminContext"
import type { Module } from "../../../interfaces/module"
import { CircularProgressBar } from "../components/CircularProgressBar"
import type { Unit } from '../../../interfaces/unit';
import { ArrowRightIcon } from "@heroicons/react/20/solid"

export const Units = () => {
    const { module, setModule, setUnit } = useAdmin()
    const [loading, setLoading] = useState<boolean>(true)
    const params = useParams()
    const navigate = useNavigate()

    const fetchData = async () => {
        const response: Module = await RequestService(`modules/${params.moduleId}`)
        if (response) {
            setModule(response)
        }
        setLoading(!loading)
    }

    useEffect(() => {
        if (!module) {
            fetchData()
        }
    })

    const handlerUnit = (unit: Unit) => {
        setUnit(unit)
        navigate(`/learn/module/${module?._id}/unit/${unit._id}`)
    }

    return (
        <div>
            <div className="mb-4 flex flex-col h-auto rounded-2xl border border-zinc-100 bg-white" key={module?._id} >
                <div className="flex-row flex max-h-36">
                    <div className="m-3">
                        {module?.image ? (
                            <img
                                alt={`Hemp Temp ${module?.title} module`}
                                className="h-full w-36 rounded-xl"
                                src={module?.image}
                            />
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
                                    <div className="flex items-center h-5 text-xs font-medium text-black">
                                        {secondsToTimeDescription(module?.total_time as number)}
                                    </div>
                                </div>
                                <div className="h-1 w-1 rounded-full bg-stone-500" />
                                <div className="flex items-center justify-start gap-1">
                                    <NewspaperIcon className="h-5" />
                                    <div className="flex items-center h-5 text-xs font-medium text-black">
                                        {module?.units?.length} Units
                                    </div>
                                </div>
                                <div className="h-1 w-1 rounded-full bg-stone-500" />
                                <div className="flex items-center justify-start gap-1">
                                    <BriefcaseIcon className="h-5" />
                                    <div className="flex items-center h-5 text-xs font-medium text-black">{module?.level}</div>
                                </div>

                            </div>
                        </div>
                        <div className="m-3 flex flex-col items-center">
                            <CircularProgressBar progressData={{
                                total: module?.units?.length || 0,
                                complete: 0,
                            }} />
                        </div>
                    </div>
                </div>
                <div className="m-3 h-auto text-xs font-normal text-stone-500">
                    {module?.description}
                </div>
            </div>
            {
                module?.units?.map((unit: Unit, index) => (
                    <div className="flex items-center justify-center bg-white pl-6" key={`unit-${index}`}>
                        <div className={`space-y-6 pb-6 ${index !== (module?.units?.length ?? 0) - 1 && 'border-l-2 border-dashed'} `}>
                            <div className="relative w-full">
                                <div className="-ml-3.5 -top-0.5 absolute bg-white border flex h-7 justify-center rounded-full text-blue-500 w-7 z-10" />
                                <button className="ml-6 min-h-24 max-h-24 h-24 cursor-pointer text-left" onClick={() => handlerUnit(unit)} type="button">
                                    <div className="flex flex-row h-auto rounded-2xl border border-zinc-100 bg-white">
                                        <div>
                                            <div className="m-2 flex flex-1 flex-row gap-3">
                                                <div className="flex flex-1 flex-col justify-evenly">
                                                    <div className="text-base font-semibold text-black">{unit.title}</div>
                                                </div>
                                            </div>
                                            <div className="mx-2 mb-2 h-auto text-xs font-normal text-stone-500">
                                                {module?.description}
                                            </div>
                                        </div>
                                        <div className="items-center px-2 flex">
                                            <ArrowRightIcon className="h-5 w-5" />
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}
