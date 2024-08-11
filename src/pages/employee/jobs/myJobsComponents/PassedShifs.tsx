import { useEffect, useState } from 'react'

import { HTLoadingLogo } from '../../../../components/shared/HTLoadingLogo'
import { requestService } from '../../../../services/requestServiceNew'
import { type IShift } from '../MyJobs'
import { ShiftCard } from '../ShiftCard'

export const PassedShifts = ({ employeeId }: { employeeId: string }) => {
  const [shifts, setShifts] = useState<IShift[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const getActiveJobs = async () => {
      try {
        const response = await requestService({ path: `shifts/by-employee/${employeeId}/passed` })
        if (response.ok) {
          const allJobs = await response.json()
          setShifts(allJobs)
          setLoading(false)
        }
      } catch (error) {
        console.error('Failed to fetch active jobs:', error)
      }
    }
    getActiveJobs()
  }, [employeeId])

  return (
    <ul className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-2 2xl:grid-cols-3">
      {!loading ? (
        shifts.map(shift => {
          const jobiInfo = shift.job_id
          if (!jobiInfo || !jobiInfo.facility) return null
          return <ShiftCard key={shift._id} shift={shift} status="past" />
        })
      ) : (
        <HTLoadingLogo />
      )}
    </ul>
  )
}
