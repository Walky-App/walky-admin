import { useEffect, useState } from 'react'

import { HTLoadingLogo } from '../../../../components/shared/HTLoadingLogo'
import { requestService } from '../../../../services/requestServiceNew'
import { type IShift } from '../MyJobs'
import { ShiftCard } from '../ShiftCard'

export const ActiveShifts = ({ employeeId }: { employeeId: string }) => {
  const [shifts, setShifts] = useState<IShift[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const getActiveJobs = async () => {
      try {
        const response = await requestService({ path: `shifts/by-employee/${employeeId}/upcoming` })
        if (response.ok) {
          const allshifts = await response.json()
          setShifts(allshifts)
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
        shifts.length > 0 ? (
          shifts.map(shift => {
            const jobInfo = shift.job_id
            if (!jobInfo || !jobInfo.facility) return null
            return <ShiftCard key={shift._id} shift={shift} status="active" />
          })
        ) : (
          <h2>No active shifts! 😎</h2>
        )
      ) : (
        <HTLoadingLogo />
      )}
    </ul>
  )
}
