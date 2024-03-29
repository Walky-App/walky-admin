import { useEffect } from 'react'

import { useNavigate, useParams } from 'react-router-dom'

import { useAdmin } from '../../../contexts/AdminContext'
import type { Unit } from '../../../interfaces/unit'
import { RequestService } from '../../../services/RequestService'
import { useLearn } from '../../../store/useLearn'
import { TableContents } from '../components/TableContents'
import { UnitDetailsCard } from '../components/UnitDetailsCard'

export const UnitDetail = () => {
  const { unit, setUnit } = useAdmin()
  const { setRecord } = useLearn()
  const params = useParams()

  const navigate = useNavigate()

  const fetchData = async () => {
    const response = await RequestService(`units/${params.unitId}`)
    if (response) {
      setUnit(response)
    }
    const responseLms = await RequestService('lms')
    if (responseLms.length !== 0) {
      setRecord(responseLms)
    }
  }

  useEffect(() => {
    if (!unit) {
      fetchData()
    }
  })

  return (
    <div>
      <div className="mt-4 grid grid-cols-4 gap-6 md:grid-cols-3">
        {/*left content*/}
        <div className="order-2 col-span-4 md:order-1 md:col-span-2 ">
          <div className="flex h-auto flex-col rounded-2xl border border-zinc-100 bg-white">
            <UnitDetailsCard unit={unit as Unit} />
          </div>
        </div>

        {/*right content*/}
        <div className="sticky top-[70px] order-1 col-span-4 h-80 md:col-span-1">
          <div className="h-auto rounded-2xl border border-zinc-100 bg-white p-3">
            <div className="text-base font-semibold">Complete {unit?.title}?</div>
            <div className="text-xs">Take the assessment to unlock the next unit.</div>
            <div className="mt-3 flex justify-center">
              <button
                className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
                disabled={unit?.assessments ? false : true}
                onClick={() => {
                  navigate(`/learn/module/${params.moduleId}/unit/${params.unitId}/assesment`)
                }}
                type="button">
                Take Assessment
              </button>
            </div>
          </div>
          <div className="m-3">
            <TableContents header="Topics" />
          </div>
        </div>
      </div>
    </div>
  )
}
