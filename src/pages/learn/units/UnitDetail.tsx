import { useEffect, useState } from "react"
import { useAdmin } from "../../../contexts/AdminContext"
import { useParams } from "react-router-dom"
import { RequestService } from "../../../services/RequestService"
import TableContents from "../components/TableContents"
import { NavigationButtonInterface } from "../../../interfaces/Global"

export default function UnitDetail() {
    const { unit, setUnit } = useAdmin()
    const [dataContents, setDataContents] = useState<NavigationButtonInterface[]>([])
    const params = useParams()

    const fetchData = async () => {
        const response = await RequestService(`units/${params.unitId}`)
        if (response) {
            setUnit(response)
            const data: NavigationButtonInterface[] = response.sections.map((item: any) => {
                return {
                    to: `${item.title.replace(' ', '-')}`,
                    text: item.title
                }
            })
            setDataContents(data)
        }
    }


    useEffect(() => {
        if (!unit) {
            fetchData()
        }

    })

    return (
        <>
            <div className="mt-4 grid grid-cols-4 md:grid-cols-3 gap-6">
                {/*left content*/}
                <div className="col-span-4 md:col-span-2 order-2 md:order-1 ">
                    <div className="flex flex-col h-auto rounded-2xl border border-zinc-100 bg-white">
                        <p className="text-2xl p-3">
                            {unit?.title}
                        </p>
                        <div className="pt-3">
                            {
                                unit?.sections.map((item, index) => (
                                    <div key={index} id={item.title.replace(' ', '-')} className={` ${index === unit?.sections.length - 1 ? 'mx-3 mb-3' : 'border-b pb-4 mb-4 mx-3'}`}>
                                        <div className='mb-4 text-xs text-gray-500'>{item.title}</div>
                                        <div className='p-editor-content ql-container ql-snow !border-0'>
                                            <div className='ql-editor !p-0 b-0' dangerouslySetInnerHTML={{ __html: item.body }} />
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
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
                            <button disabled className="rounded-md bg-gray-400 px-3 py-2 text-sm font-semibold text-white shadow-sm">
                                Resume Assessment
                            </button>
                        </div>
                    </div>
                    <div className="m-3">
                        <TableContents header={'Topics'} data={dataContents} />
                    </div>
                </div>
            </div>
        </>
    )
}
