import { useAdmin } from "../../../contexts/AdminContext"
import { BriefcaseIcon, ClockIcon, NewspaperIcon } from '@heroicons/react/24/outline'
import { secondsToTimeDescription } from "../../../utils/FunctionUtils"
import { Badge } from "flowbite-react"
import { useEffect, useState } from "react"
import { Module } from "../../../interfaces/Module"
import { RequestService } from "../../../services/RequestService"
import { useNavigate, useParams } from "react-router-dom"
import { CategoryTitle } from "../../../interfaces/Category"
import { Bars2Icon, PlusIcon } from "@heroicons/react/20/solid"
import { Unit } from '../../../interfaces/Unit';
import { TabPanel, TabView } from "primereact/tabview"
import { UnitDetailsCard } from "../../learn/components/UnitDetailsCard"

export const AdminUnitsLearn = () => {
    const { module, setModule, setUnit, unit } = useAdmin()
    const [category, setCategory] = useState<CategoryTitle>()
    const params = useParams()
    const navigate = useNavigate()


    const fecthData = async () => {
        const responseModule: Module = await RequestService(`modules/${params.moduleId}`)
        if (responseModule) {
            setModule(responseModule)
            setCategory(responseModule.category as unknown as CategoryTitle)
        }
    }

    const handlerCreateUnit = () => {
        navigate(`/admin/learn/modules/${module?._id}/units/new`)
    }

    const handlerSelectUnit = (unit: Unit) => {
        setUnit(unit)
    }


    useEffect(() => {
        if (!module) {
            fecthData()
        }
    })

    return (
        <div>
            <div className="mb-4 flex flex-col h-auto rounded-2xl border border-zinc-100 bg-white" key={module?._id}>
                <div className="flex-row flex">
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
                    <div className="m-3 flex flex-1 flex-col justify-center gap-3">
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
                </div>
                <div className="m-3 h-auto text-xs font-normal text-stone-500">
                    {module?.description}
                </div>
            </div>

            <div className="mt-4 grid grid-cols-5 gap-6">
                <div className="col-span-2 ">
                    <div className="flex flex-col h-auto rounded-2xl border border-zinc-100 bg-white">
                        <button className="flex flex-row justify-center p-3 text-left text-sm bg-gray-300 rounded-t-2xl border " onClick={handlerCreateUnit} type="button"> <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" /> Create Unit</button>
                        {
                            module?.units?.map((unit, index) => {
                                return (
                                    <button className={`flex flex-row justify-between p-3 text-left text-sm border-b border-zinc-100 hover:bg-gray-100  ${index === (module?.units?.length ?? 0) - 1 ? 'rounded-b-2xl' : ''}`} key={unit._id} onClick={() => { handlerSelectUnit(unit) }} type="button">
                                        <div className="flex flex-row gap-3 items-center">
                                            <Bars2Icon className="h-5 w-5" />
                                            <div>{unit.title}</div>
                                        </div>
                                    </button>
                                )
                            })
                        }
                    </div>
                </div>

                {/*right content*/}
                <div className="col-span-3 ">
                    {
                        unit ? <div className=" h-auto border border-zinc-100 bg-white">
                            <TabView>
                                <TabPanel header="Unit Detail">
                                    <UnitDetailsCard isAdmin unit={unit as Unit} />
                                </TabPanel>
                                <TabPanel header="Assessment Detail">
                                    Coming soon
                                </TabPanel>
                            </TabView>
                        </div> : null
                    }
                </div>
            </div>
        </div>
    )
}
