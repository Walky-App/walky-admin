import { type Dispatch, type SetStateAction, useState } from 'react'

import { isBefore, startOfDay } from 'date-fns'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputTextarea } from 'primereact/inputtextarea'

import { HtInfoTooltip } from '../../../../components/shared/general/HtInfoTooltip'
import { type IJobShiftDay, type IApplicant, type IJob } from '../../../../interfaces/job'
import { type ITokenInfo } from '../../../../interfaces/services'
import { type UserShiftsPopulate } from '../../../../interfaces/shifts'
import { requestService } from '../../../../services/requestServiceNew'
import { useUtils } from '../../../../store/useUtils'

export const ShiftsTable = ({
  job,
  setJob,
  user,
  jobHasEnded,
  setHasDateIntersection,
  setUserWorkingInThisJob,
  employeeActive,
}: {
  job: IJob
  setJob: Dispatch<SetStateAction<IJob | null>>
  user: ITokenInfo
  jobHasEnded: boolean
  setHasDateIntersection: Dispatch<SetStateAction<boolean>>
  setUserWorkingInThisJob: Dispatch<SetStateAction<boolean>>
  employeeActive: boolean
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

  const today = new Date()

  const applyForAShift = async (e: React.MouseEvent<HTMLButtonElement>, dateString: string) => {
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
        setUserWorkingInThisJob(true)
        showToast({ severity: 'success', summary: 'Success', detail: 'You have successfully picked Up Shift' })
      }
    } catch (error: unknown) {
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

      if (data.applicants?.some((applicant: IApplicant) => applicant?.user?._id === user._id)) {
        // setUserWorkingInThisJob(true)
      } else {
        setUserWorkingInThisJob(false)
      }

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

  const handleWhenUserIsNotApproved = (
    eachShift: IJobShiftDay,
    index: number,
    formattedDate: string,
    dayOfWeek: string,
  ) => {
    return (
      <tr key={eachShift.day.toString()}>
        <td>{index + 1}</td>
        <td className="whitespace-nowrap py-4 text-lg font-medium md:px-3">{formattedDate}</td>
        <td className="hidden py-8 text-lg font-medium sm:pl-0 md:block">
          <time dateTime={eachShift.day.toString()}>{dayOfWeek}</time>
        </td>
        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right sm:pr-0">
          <p>Account not Active or Verified</p>
        </td>
      </tr>
    )
  }

  const handleShowWhenJobHasEnded = (
    eachShift: IJobShiftDay,
    index: number,
    formattedDate: string,
    dayOfWeek: string,
  ) => {
    const getUserShiftsLengthByDate = (dateString: string): UserShiftsPopulate[] => {
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
        <td className="whitespace-nowrap py-4 text-lg font-medium md:px-3">{formattedDate}</td>
        <td className="hidden py-8 text-lg font-medium sm:pl-0 md:block">
          <time dateTime={eachShift.day.toString()}>{dayOfWeek}</time>
        </td>
        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right sm:pr-0">
          {getUserShiftsLengthByDate(formattedDate).length === job.vacancy ? (
            <p>Vacancy completed</p>
          ) : (
            <div>
              <p>Job has ended</p>
            </div>
          )}
        </td>
      </tr>
    )
  }

  const handleShowButtons = (eachShift: IJobShiftDay, index: number, formattedDate: string, dayOfWeek: string) => {
    const getUserShiftsIdByUserId = (userId: string) =>
      eachShift?.shifts_id?.user_shifts?.find(shift => shift.user_id._id === userId)?._id

    const getUserShiftsLengthByDate = (dateString: string): UserShiftsPopulate[] => {
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
        <td className="whitespace-nowrap py-4 text-lg font-medium md:px-3">{formattedDate}</td>
        <td className="hidden py-8 text-lg font-medium sm:pl-0 md:block">
          <time dateTime={eachShift.day.toString()}>{dayOfWeek}</time>
        </td>
        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right sm:pr-0">
          <a href="/">
            {jobHasEnded ? (
              <p>Job has ended</p>
            ) : getUserShiftsLengthByDate(formattedDate).some(shift => shift.user_id._id === user._id) ? (
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
            ) : getUserShiftsLengthByDate(formattedDate).length === job.vacancy ? (
              <p>Vacancy completed</p>
            ) : (
              <Button label="Pickup Shift" onClick={e => applyForAShift(e, formattedDate)} />
            )}
          </a>
        </td>
      </tr>
    )
  }

  return (
    <section className="mt-12">
      <table className="min-w-full divide-y divide-gray-300">
        <thead>
          <tr>
            <th scope="col" className="py-3.5 text-left sm:pl-0 md:pl-4 md:pr-3">
              Shift
            </th>
            <th scope="col" className="px-3 text-left md:py-3.5">
              Date
            </th>
            <th scope="col" className="hidden py-3.5 pr-3 text-left sm:pl-0 md:block">
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

            if (!employeeActive) {
              return handleWhenUserIsNotApproved(eachShift, index, formattedDate, dayOfWeek)
            }

            if (isBefore(dateObj, startOfDay(today))) {
              return handleShowWhenJobHasEnded(eachShift, index, formattedDate, dayOfWeek)
            }

            return handleShowButtons(eachShift, index, formattedDate, dayOfWeek)
          })}
        </tbody>
      </table>
      <div>
        <Dialog
          header="Drop Shift?"
          visible={showDialog}
          draggable={false}
          className="w-full md:w-1/2"
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
            <h2 className="text-xl font-medium text-red-600">Reason for dropping the shift</h2>
            <InputTextarea
              required
              rows={5}
              cols={50}
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
