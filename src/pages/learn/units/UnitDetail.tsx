import { useEffect } from "react"
import { useAdmin } from "../../../contexts/AdminContext"
import { useNavigate, useParams } from "react-router-dom"
import { RequestService } from "../../../services/RequestService"
import { TableContents } from "../components/TableContents"
import { UnitDetailsCard } from "../components/UnitDetailsCard"
import type { Unit } from "../../../interfaces/unit"

export const UnitDetail = () => {
    const { unit, setUnit } = useAdmin()
    const params = useParams()

    const navigate = useNavigate()

    const fetchData = async () => {
        const response = await RequestService(`units/${params.unitId}`)
        if (response) {
            setUnit(response)
        }
    }


    useEffect(() => {
        if (!unit) {
            fetchData()
        }
    })

    return (
        <div>
            <div className="mt-4 grid grid-cols-4 md:grid-cols-3 gap-6">
                {/*left content*/}
                <div className="col-span-4 md:col-span-2 order-2 md:order-1 ">
                    <div className="flex flex-col h-auto rounded-2xl border border-zinc-100 bg-white">
                        <UnitDetailsCard unit={unit as Unit} />
                    </div>
                </div>

                {/*right content*/}
                <div className="order-1 col-span-4 md:col-span-1 sticky top-[70px] h-80">
                    <div className="h-auto rounded-2xl border border-zinc-100 bg-white p-3">
                        <div className="text-base font-semibold">Complete {unit?.title}?</div>
                        <div className="text-xs">
                            Take the assessment to unlock the next unit.
                        </div>
                        <div className="flex justify-center mt-3">
                            <button className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500" disabled={unit?.assessments ? false : true} onClick={() => { navigate(`/learn/module/${params.moduleId}/unit/${params.unitId}/assesment`) }} type="button">
                                Take Assessment
                            </button>
                        </div>
                    </div>
                    <div className="m-3">
                        <TableContents header='Topics' />
                    </div>
                </div>
            </div>
        </div >
    )
}
