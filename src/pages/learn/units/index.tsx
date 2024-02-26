import { useEffect, useState } from "react"
import { RequestService } from "../../../services/RequestService"
import { useNavigate, useParams } from "react-router-dom"
import { BriefcaseIcon, ClockIcon, NewspaperIcon } from '@heroicons/react/24/outline'
import { secondsToTimeDescription } from "../../../utils/FunctionUtils"
import { Badge } from "flowbite-react"
import { CategoryTitle } from "../../../interfaces/Category"
import { useAdmin } from "../../../contexts/AdminContext"
import { Module } from "../../../interfaces/Module"
import CircularProgressBar from "../components/CircularProgressBar"
import { Unit } from '../../../interfaces/Unit';
import { ArrowRightIcon } from "@heroicons/react/20/solid"

export default function Units() {
    const { module, setModule } = useAdmin()
    const [category, setCategory] = useState<CategoryTitle>()
    const [loading, setLoading] = useState<boolean>(true)
    const params = useParams()
    const navigate = useNavigate()

    const fecthData = async () => {
        const response: Module = await RequestService(`modules/${params.moduleId}`)
        if (response) {
            setModule(response)
            setCategory(response.category as unknown as CategoryTitle)
        }
        setLoading(false)
    }

    useEffect(() => {
        if (!module) {
            fecthData()
        }
    })

    const handlerUnit = (unit: Unit) => {
        navigate(`/learn/module/${module?._id}/unit/${unit._id}`)
    }

    return (
        <div>
            <div key={module?._id} className="mb-4 flex flex-col h-auto rounded-2xl border border-zinc-100 bg-white">
                <div className="flex-row flex max-h-36">
                    <div className="m-3">
                        {module?.image ? (
                            <img
                                alt={`Hemp Temp ${module?.title} module`}
                                src={module?.image}
                                className="h-full w-36 rounded-xl"
                            />
                        ) : (
                            <div className="h-full w-36 rounded-xl bg-neutral-200" />
                        )}
                    </div>
                    <div className="m-3 flex flex-1 flex-row gap-3">
                        <div className="flex flex-1 flex-col justify-evenly">
                            <div className="flex basis-1/3 flex-wrap ">
                                <Badge color="gray" size="sm">
                                    <p className="text-xs font-normal text-stone-500">{category?.title}</p>
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
                                <div className="h-1 w-1 rounded-full bg-stone-500"></div>
                                <div className="flex items-center justify-start gap-1">
                                    <NewspaperIcon className="h-5" />
                                    <div className="flex items-center h-5 text-xs font-medium text-black">
                                        {module?.units?.length} Units
                                    </div>
                                </div>
                                <div className="h-1 w-1 rounded-full bg-stone-500"></div>
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
                    <div key={unit._id} className="flex items-center justify-center bg-white pl-6">
                        <div className={`space-y-6 pb-6 ${index !== (module?.units?.length ?? 0) - 1 && 'border-l-2 border-dashed'} `}>
                            <div className="relative w-full">
                                <div className="-ml-3.5 -top-0.5 absolute bg-white border flex h-7 justify-center rounded-full text-blue-500 w-7 z-10"></div>
                                <div onClick={() => handlerUnit(unit)} className="ml-6 min-h-24 max-h-24 cursor-pointer">
                                    <div className="flex flex-row h-auto rounded-2xl border border-zinc-100 bg-white">
                                        <div>
                                            <div className="m-2 flex flex-1 flex-row gap-3">
                                                <div className="flex flex-1 flex-col justify-evenly">
                                                    <div className="text-xl font-semibold text-black">{unit.title}</div>
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
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}
