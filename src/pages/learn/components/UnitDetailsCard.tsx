/* eslint-disable react/no-danger */
import { useNavigate } from 'react-router-dom'

import { useAdmin } from '../../../contexts/AdminContext'
import { type Unit } from '../../../interfaces/unit'

interface UnitDetailsCardProps {
  unit: Unit
  isAdmin?: boolean
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
        {unit?.type === 'blog' && !isAdmin ? <p className="flex-1 p-3 text-2xl">{unit?.title}</p> : null}
        {isAdmin ? (
          <div className="flex flex-1 justify-between py-9">
            <h2 className="text-xl font-bold">{unit.title}</h2>
            <button
              className="h-9 rounded-md bg-green-600 px-3 py-2 font-semibold text-white shadow-sm hover:bg-green-500"
              onClick={handlerEditUnit}
              type="button">
              Edit
            </button>
          </div>
        ) : null}
      </div>
      <div className="pt-3">
        {unit?.sections.map((item, index) => (
          <div
            className={` ${index === unit.sections.length - 1 ? 'mx-3 mb-3' : 'mx-3 mb-4 border-b pb-4'}`}
            id={item.title.replace(' ', '-')}
            key={`unit-card-${index}`}>
            <div className="mb-4 text-xs text-gray-500">{item.title}</div>
            <div className="p-editor-content ql-container ql-snow !border-0">
              <div className="ql-editor b-0 !p-0" dangerouslySetInnerHTML={{ __html: item.body }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
