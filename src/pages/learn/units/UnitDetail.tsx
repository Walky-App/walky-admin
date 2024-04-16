import { useEffect } from 'react'

import { useNavigate, useParams } from 'react-router-dom'

import { useAdmin } from '../../../contexts/AdminContext'
import type { Unit } from '../../../interfaces/unit'
import { requestService } from '../../../services/requestServiceNew'
import { useLearn } from '../../../store/useLearn'
import { useUtils } from '../../../store/useUtils'
import { TableContents } from '../components/TableContents'
import { UnitDetailsCard } from '../components/UnitDetailsCard'
import { VideoPlayer } from '../components/VideoPlayer'

export const UnitDetail = () => {
  const { unit, setUnit } = useAdmin()
  const { setRecord } = useLearn()
  const params = useParams()
  const { showToast } = useUtils()

  const navigate = useNavigate()

  const fetchData = async () => {
    try {
      const response = await requestService(`units/${params.unitId}`)
      if (response.status === 200) {
        const jsonResponse: Unit = await response.json()
        setUnit(jsonResponse)
      }
    } catch (error) {
      showToast({ severity: 'error', detail: 'Internal error', summary: 'wait a moment and try again' })
      navigate('/learn')
    }
    try {
      const responseLms = await requestService('lms')
      if (responseLms.status === 200) {
        const jsonResponseLMS = await responseLms.json()
        setRecord(jsonResponseLMS)
      }
    } catch (error) {
      showToast({ severity: 'error', detail: 'Internal error', summary: 'wait a moment and try again' })
      navigate('/learn')
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
        <div className="order-1 col-span-4 rounded-2xl border border-zinc-100 bg-white md:col-span-2">
          {unit?.type === 'video' ? <VideoPlayer url={unit.url_video} captions={unit.url_captions} /> : null}
          <div className="flex h-auto flex-col ">{unit ? <UnitDetailsCard unit={unit} /> : null}</div>
        </div>

        {/*right content*/}
        <div className="order-2 col-span-4 md:sticky md:top-[70px] md:col-span-1 md:h-80">
          <div className="h-auto rounded-2xl border border-zinc-100 bg-white p-3">
            <div className="my-3 flex justify-center">
              <button
                className="w-full rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
                disabled={unit?.assessments ? false : true}
                onClick={() => {
                  navigate(`/learn/module/${params.moduleId}/unit/${params.unitId}/assesment`)
                }}
                type="button">
                Take Assessment
              </button>
            </div>
            <div className="m-3 hidden md:block">
              <TableContents headerTitle="Topics" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
