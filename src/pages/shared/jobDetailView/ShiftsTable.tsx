import { type Dispatch, type SetStateAction, useState } from 'react'

import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputTextarea } from 'primereact/inputtextarea'

import { HtInfoTooltip } from '../../../components/shared/general/HtInfoTooltip'
import { type IJob } from '../../../interfaces/job'
import { type ITokenInfo } from '../../../interfaces/services'
import { type UserShiftsPopulate } from '../../../interfaces/shifts'
import { requestService } from '../../../services/requestServiceNew'
import { useUtils } from '../../../store/useUtils'

export const ShiftsTable = ({
  job,
  setJob,
  user,
  setIsApplyForJobLoading,
  setHasDateIntersection,
}: {
  job: IJob
  setJob: Dispatch<SetStateAction<IJob | null>>
  user: ITokenInfo
  setIsApplyForJobLoading: Dispatch<SetStateAction<boolean>>
  setHasDateIntersection: Dispatch<SetStateAction<boolean>>
}) => {
  const [shiftDropReason, setShiftDropReason] = useState('')
  const [showDialog, setShowDialog] = useState(false)
  const [shiftInfo, setShiftInfo] = useState({ shiftId: '', userShiftId: '' })
  const { showToast } = useUtils()

  const reject = () => {
    setShowDialog(false)
    setShiftDropReason('')
    setShiftInfo({ shiftId: '', userShiftId: '' })
    showToast({ severity: 'success', summary: 'Rejected', detail: 'Shift was not dropped 🙂', life: 3000 })
  }

  const applyForDay = async (e: React.MouseEvent<HTMLButtonElement>, dateString: string) => {
    e.preventDefault()
    try {
      const [month, day, year] = dateString.split('/')
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
      const formattedDate = date.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
      const shift = job?.job_days.find(jobDay => {
        const jobDate = new Date(jobDay.day)
        const formattedJobDate = jobDate.toLocaleDateString('en-US', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
        return formattedJobDate === formattedDate
      })
      if (shift?.shifts_id.user_shifts?.length === job?.vacancy) {
        showToast({
          severity: 'error',
          summary: 'Failed',
          detail: 'This day is already full',
        })
        return
      }

      const response = await requestService({
        path: `shifts/apply-one/${shift?.shifts_id._id}`,
        method: 'PATCH',
        body: JSON.stringify({ userId: user._id, jobId: job._id }),
      })

      if (response.ok) {
        const data = await response.json()
        setJob(data)
        showToast({ severity: 'success', summary: 'Success', detail: 'You have successfully picked Up Shift' })
        setIsApplyForJobLoading(true)
        setTimeout(() => {
          setIsApplyForJobLoading(false)
        }, 1500)
      }
    } catch (error: unknown) {
      setIsApplyForJobLoading(false)
      if (typeof error === 'object' && error !== null && 'status' in error && 'message' in error) {
        const err = error as { status: number; message: string }
        if (err.status === 400) {
          setHasDateIntersection(true)
          showToast({
            severity: 'error',
            summary: 'Failed',
            detail: err.message,
          })
        }
      }
    }
  }

  const handleJobDropRequest = async () => {
    try {
      const response = await requestService({
        path: `shifts/drop/${shiftInfo.shiftId}`,
        method: 'PATCH',
        body: JSON.stringify({
          userId: user._id,
          jobId: job._id,
          userShiftId: shiftInfo.userShiftId,
          shiftDropReason: shiftDropReason,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to drop the shift')
      }

      const data = await response.json()
      setJob(data)
      setShiftDropReason('')

      showToast({
        severity: 'success',
        summary: 'Confirmed',
        detail: 'You have Dropped the Shift',
        life: 3000,
      })
      setShowDialog(false)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.'
      showToast({ severity: 'error', summary: 'Error', detail: errorMessage, life: 3000 })
    }
  }

  return (
    <section className="mt-12">
      <table className="min-w-full divide-y divide-gray-300">
        <thead>
          <tr>
            <th scope="col" className="py-3.5 pl-4 pr-3 text-left sm:pl-0">
              Shifts
            </th>
            <th scope="col" className="px-3 py-3.5 text-left">
              Date
            </th>
            <th scope="col" className="py-3.5 pl-4 pr-3 text-left sm:pl-0">
              Day of Week
            </th>

            <th scope="col" className="relative py-3.5 pl-3 pr-4 text-right sm:pr-0">
              Pick up Shifts
              <span className="sr-only">Edit</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {job.job_days.map((eachShift, index) => {
            const dateObj = new Date(eachShift.day)
            const formattedDate = dateObj.toLocaleDateString()
            const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'long' })

            const getUserShiftsIdByUserId = (userId: string) => {
              return eachShift?.shifts_id?.user_shifts?.find(shift => shift.user_id._id === userId)?._id
            }

            function getUserShiftsLengthByDate(dateString: string): UserShiftsPopulate[] {
              const [month, day, year] = dateString.split('/')
              const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
              const formattedDate = date.toLocaleDateString('en-US', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })
              const result = job?.job_days.find(jobDay => {
                const jobDate = new Date(jobDay.day)
                const formattedJobDate = jobDate.toLocaleDateString('en-US', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })
                return formattedJobDate === formattedDate
              })
              if (!result) return []
              return result.shifts_id?.user_shifts as UserShiftsPopulate[]
            }

            return (
              <tr key={eachShift.day.toString()}>
                <td>{index + 1}</td>
                <td className="whitespace-nowrap px-3 py-4 text-lg font-medium">{formattedDate}</td>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-lg font-medium sm:pl-0">
                  <time dateTime={eachShift.day.toString()} className="w-28 flex-none">
                    {dayOfWeek}
                  </time>
                </td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right sm:pr-0">
                  <a href="/">
                    {getUserShiftsLengthByDate(formattedDate).length === job.vacancy ? (
                      <div>
                        {getUserShiftsLengthByDate(formattedDate).some(shift => shift.user_id._id === user._id) ? (
                          <p>Shift Claimed</p>
                        ) : (
                          <p>Vacancy completed</p>
                        )}
                      </div>
                    ) : (
                      <div>
                        {getUserShiftsLengthByDate(formattedDate).some(shift => shift.user_id._id === user._id) ? (
                          <>
                            <p className="flex justify-end text-sm">
                              <HtInfoTooltip
                                className="mr-2"
                                message={`If you drop the shift within 24hours of Shift start time \n your account will marked down with 1 strike \n ( 2 strikes and account will be suspended )`}
                              />
                              Shift Confirmed
                            </p>
                            <Button
                              onClick={e => {
                                e.preventDefault()
                                setShowDialog(true)
                                setShiftInfo({
                                  shiftId: eachShift.shifts_id._id,
                                  userShiftId: getUserShiftsIdByUserId(user._id) ?? '',
                                })
                              }}
                              severity="danger"
                              label="Drop Shift"
                              icon="pi pi-times"
                            />
                          </>
                        ) : (
                          <Button label="Pickup Shift" onClick={e => applyForDay(e, formattedDate)} />
                        )}
                      </div>
                    )}
                  </a>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <div>
        <Dialog
          header="Drop Shift?"
          visible={showDialog}
          draggable={false}
          style={{ width: '70%' }}
          onHide={() => {
            if (!showDialog) return
            setShowDialog(false)
          }}
          footer={() => (
            <div>
              <Button label="No" icon="pi pi-check" onClick={reject} className="p-button-text" />
              <Button
                disabled={shiftDropReason.length < 20}
                label="Yes, Drop the Shift"
                severity="danger"
                icon="pi pi-times"
                onClick={handleJobDropRequest}
              />
            </div>
          )}>
          <p className="m-0">
            <h2 className="text-lg font-medium">
              If you drop the shift within 24hours of Shift start time your account will marked down with 1 strike
            </h2>
            <p className="text-lg font-medium">( 2 strikes and your account will be suspended! ☹️ )</p>
            <br />
            <h2 className="text-xl font-medium text-red-600">Reason for dropping the shift</h2>{' '}
            <InputTextarea
              required
              rows={5}
              cols={30}
              className="text-lg"
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setShiftDropReason(e.target.value)}
              value={shiftDropReason}
            />
          </p>
        </Dialog>
      </div>
    </section>
  )
}
