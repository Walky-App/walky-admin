import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../../contexts/AdminContext";
import { Unit } from "../../../interfaces/unit";
import { PencilSquareIcon } from "@heroicons/react/20/solid";

interface UnitDetailsCardProps {
    unit: Unit;
    isAdmin?: boolean;
}

export const UnitDetailsCard = ({ unit, isAdmin = false }: UnitDetailsCardProps) => {
    const { module } = useAdmin()
    const navigate = useNavigate()
    const handlerEditUnit = () => {
        navigate(`/admin/learn/modules/${module?._id}/units/${unit?._id}`)
    }
    return (
        <div>
            <div className="flex flex-row">
                <p className="flex-1 text-2xl p-3">
                    {unit?.title}
                </p>
                {
                    isAdmin ? <div className="flex justify-end text-black hover:text-green-400">
                        <button
                            className="rounded-md bg-green-600 px-3 py-2 h-9 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
                            onClick={handlerEditUnit}
                            type="button"
                        >
                            Edit
                        </button>
                    </div> : null
                }

            </div>
            <div className="pt-3">
                {
                    unit?.sections.map((item, index) => (
                        <div className={` ${index === unit.sections.length - 1 ? 'mx-3 mb-3' : 'border-b pb-4 mb-4 mx-3'}`} id={item.title.replace(' ', '-')} key={`unit-card-${index}`}  >
                            <div className='mb-4 text-xs text-gray-500'>{item.title}</div>
                            <div className='p-editor-content ql-container ql-snow !border-0'>
                                <div className='ql-editor !p-0 b-0' dangerouslySetInnerHTML={{ __html: item.body }} />
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}
