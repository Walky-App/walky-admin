import { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'

import { format as formatTz, toZonedTime } from 'date-fns-tz'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'

import { HTLoadingLogo } from '../../../../components/shared/HTLoadingLogo'
import { requestService } from '../../../../services/requestServiceNew'
import { type IShift } from '../../../employee/jobs/MyJobs'

export const DroppedShiftsByJob = ({ jobId }: { jobId: string }) => {
  const [droppedShifts, setDroppedShifts] = useState<IShift[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const getDroppedShifts = async () => {
      try {
        const response = await requestService({ path: `shifts/by-job/${jobId}/dropped` })
        if (response.ok) {
          const data = await response.json()
          setDroppedShifts(data)
          setLoading(false)
        }
      } catch (error) {
        console.error('Failed to fetch dropped shifts:', error)
      }
    }
    getDroppedShifts()
  }, [jobId])

  return (
    <div className="card rounded-l p-6 shadow">
      {!loading ? (
        droppedShifts.length > 0 ? (
          <DataTable value={droppedShifts} className="w-full">
            <Column
              field="shift_day"
              header="Shift Day"
              body={(shift: IShift) => {
                const zonedDate = toZonedTime(shift.shift_day, shift.job_id.facility.timezone)
                return formatTz(zonedDate, 'yyyy-MM-dd, EEEE', { timeZone: shift.job_id.facility.timezone })
              }}
            />
            <Column
              header="Drop Shift Details"
              body={(shift: IShift) =>
                shift.change_history?.map((history, index) => {
                  const zonedDate = toZonedTime(history.date, shift.job_id.facility.timezone)
                  const formattedDate = formatTz(zonedDate, 'yyyy-MM-dd, EEEE', {
                    timeZone: shift.job_id.facility.timezone,
                  })

                  return (
                    <Link to={`/admin/users/employees/${history.user_id._id}`} key={index}>
                      <div className="my-4 space-y-2 border-b-2 border-t-2 border-gray-200 pb-4 pt-4 transition-colors duration-200 hover:bg-gray-300 hover:bg-opacity-50">
                        <div className="grid grid-cols-2 gap-4">
                          <p className="font-bold">
                            Full Name:&nbsp;
                            <span className="font-normal">{`${history.user_id.first_name} ${history.user_id.last_name}`}</span>
                          </p>
                          <p className="font-bold">
                            Dropped By:&nbsp;
                            <span className="font-normal">
                              {history.action === 'dropped employee' ? 'Employee' : 'Admin'}
                            </span>
                          </p>
                          <p className="font-bold">
                            When was dropped: <span className="font-normal">{formattedDate}</span>
                          </p>
                          {history.reason ? (
                            <p className="col-span-2 font-bold">
                              Reason: <span className="font-normal">{history.reason}</span>
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </Link>
                  )
                })
              }
            />
          </DataTable>
        ) : (
          <h2 className="text-2xl font-bold">No Dropped Shifts!</h2>
        )
      ) : (
        <HTLoadingLogo />
      )}
    </div>
  )
}
