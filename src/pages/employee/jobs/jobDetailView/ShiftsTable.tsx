import { type Dispatch, type SetStateAction, useState } from 'react'

import { format, isBefore, startOfDay } from 'date-fns'
import { formatInTimeZone } from 'date-fns-tz'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputTextarea } from 'primereact/inputtextarea'

import { HtInputLabel } from '../../../../components/shared/forms/HtInputLabel'
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
  userWorkingInThisJob,
  setUserWorkingInThisJob,
  employeeActive,
}: {
  job: IJob
  setJob: Dispatch<SetStateAction<IJob | null>>
  user: ITokenInfo
  jobHasEnded: boolean
  setHasDateIntersection: Dispatch<SetStateAction<boolean>>
  userWorkingInThisJob: boolean
  setUserWorkingInThisJob: Dispatch<SetStateAction<boolean>>
  employeeActive: boolean
}) => {
  const [pickupShiftLoading, setPickupShiftLoading] = useState(false)
  const [dropShiftLoading, setDropShiftLoading] = useState(false)
  const [shiftDropReason, setShiftDropReason] = useState('')
  const [showDialogPickupShift, setShowDialogPickupShift] = useState(false)
  const [showDialogDropShift, setShowDialogDropShift] = useState(false)
  const [shiftInfo, setShiftInfo] = useState({ shiftId: '', shiftDay: '', userShiftId: '' })
  const { showToast } = useUtils()

  const reject = () => {
    setShowDialogDropShift(false)
    setShiftDropReason('')
    setShiftInfo({ shiftId: '', shiftDay: '', userShiftId: '' })
    showToast({ severity: 'success', summary: 'Rejected', detail: 'Shift was not dropped 🙂', life: 3000 })
  }

  const today = new Date()

  const applyForAShift = async (e: React.MouseEvent<HTMLButtonElement>, dateString: string) => {
    e.preventDefault()
    setPickupShiftLoading(true)
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
        setShowDialogPickupShift(false)
      }
      if (!response.ok) {
        const data = await response.json()
        setHasDateIntersection(true)
        showToast({
          severity: 'error',
          summary: 'Failed',
          detail: data.message,
        })
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
    } finally {
      setPickupShiftLoading(false)
    }
  }

  const handleJobDropRequest = async () => {
    setDropShiftLoading(true)
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
      setShowDialogDropShift(false)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.'
      showToast({ severity: 'error', summary: 'Error', detail: errorMessage, life: 3000 })
    } finally {
      setDropShiftLoading(false)
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

  const pickupDropShiftPopupJobDetailsTemplate = (job: IJob, formattedDate: string) => (
    <>
      <div className="text-lg font-bold sm:text-xl">
        {formattedDate} @ {formatInTimeZone(job.start_time, job.facility.timezone, 'p')} -{' '}
        {formatInTimeZone(job.end_time, job.facility.timezone, 'p (z)')}
      </div>
      <div className="align-center flex flex-col items-start justify-start gap-1">
        <div className="flex items-center text-xl font-bold sm:text-2xl">{job.title}</div>
        <div className="flex items-center">
          <i className="pi pi-building" />
          <h2 className="ml-2 text-lg sm:text-xl">{job.facility.name}</h2>
        </div>
        <div className="flex items-center">
          <i className="pi pi-directions" />
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job.facility.address)}`}
            target="_blank"
            rel="noopener noreferrer">
            <div className="ml-2 text-lg underline sm:text-xl">{job.facility.address}</div>
          </a>
        </div>
        <div className="flex items-center">
          <i className="pi pi-map-marker" />
          <div className="ml-2 text-lg sm:text-xl">
            {job.facility.city}, {job.facility.state}, {job.facility.zip}
          </div>
        </div>
      </div>
    </>
  )

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
          <div className="flex justify-end">
            {jobHasEnded ? (
              <p>Job has ended</p>
            ) : getUserShiftsLengthByDate(formattedDate).some(shift => shift.user_id._id === user._id) ? (
              <div>
                <HtInfoTooltip
                  message={`If you drop the shift within 24hours of Shift start time \n your account will marked down with 1 strike \n ( 2 strikes and account will be suspended )`}>
                  <p className="text-sm">Shift Confirmed</p>
                </HtInfoTooltip>
                <Button
                  onClick={() => {
                    setShowDialogDropShift(true)
                    setShiftInfo({
                      shiftId: eachShift.shifts_id._id,
                      shiftDay: format(eachShift.day, 'MM/dd/yyyy'),
                      userShiftId: getUserShiftsIdByUserId(user._id) ?? '',
                    })
                  }}
                  severity="danger"
                  label="Drop Shift"
                  icon="pi pi-times"
                  className="mt-1 w-full"
                />
              </div>
            ) : getUserShiftsLengthByDate(formattedDate).length >= job.vacancy ? (
              <p>Vacancy completed</p>
            ) : (
              <Button
                label="Pickup Shift"
                onClick={() => {
                  setShowDialogPickupShift(true)
                  setShiftInfo({
                    shiftId: eachShift.shifts_id._id,
                    shiftDay: format(eachShift.day, 'MM/dd/yyyy'),
                    userShiftId: getUserShiftsIdByUserId(user._id) ?? '',
                  })
                }}
              />
            )}
          </div>
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
            const dayOfWeek = formatInTimeZone(eachShift.day, job.facility.timezone, 'P (EEEE)')

            if (!employeeActive) {
              return handleWhenUserIsNotApproved(eachShift, index, dayOfWeek, dayOfWeek)
            }

            if (isBefore(eachShift.day, startOfDay(today))) {
              return handleShowWhenJobHasEnded(eachShift, index, dayOfWeek, dayOfWeek)
            }

            return handleShowButtons(eachShift, index, dayOfWeek, dayOfWeek)
          })}
        </tbody>
      </table>
      {shiftInfo.shiftId ? (
        <Dialog
          header="Are you sure you would like to PICKUP this shift?"
          visible={showDialogPickupShift}
          draggable={false}
          className="w-full md:w-1/2"
          onHide={() => {
            if (!showDialogPickupShift) return
            setShowDialogPickupShift(false)
          }}
          footer={() => (
            <div>
              <Button
                label="Cancel"
                outlined
                severity="secondary"
                onClick={() => {
                  setShowDialogPickupShift(false)
                  setShiftInfo({ shiftId: '', shiftDay: '', userShiftId: '' })
                }}
              />
              <Button
                label="Yes - Pickup this Shift"
                onClick={e => {
                  applyForAShift(e, shiftInfo.shiftDay)
                }}
                loading={pickupShiftLoading}
              />
            </div>
          )}>
          <div className="m-0 space-y-4">
            {userWorkingInThisJob
              ? pickupDropShiftPopupJobDetailsTemplate(job, format(shiftInfo.shiftDay, 'MM/dd/yyyy'))
              : null}
            <div>
              <p className="font-medium sm:text-lg">
                If you drop the shift within 24 hours of the Shift start time your account will marked down with 1
                strike.
              </p>
              <p className="font-medium sm:text-lg">(2 strikes and your account will be suspended! ☹️)</p>
            </div>
          </div>
        </Dialog>
      ) : null}
      {shiftInfo.shiftId ? (
        <Dialog
          header="Are you sure you would like to DROP this shift?"
          visible={showDialogDropShift}
          draggable={false}
          className="w-full md:w-1/2"
          onHide={() => {
            if (!showDialogDropShift) return
            setShowDialogDropShift(false)
          }}
          footer={() => (
            <div>
              <Button label="No" icon="pi pi-check" onClick={reject} className="p-button-text" />
              <Button
                disabled={shiftDropReason.length < 20}
                label="Yes, Drop this Shift"
                severity="danger"
                icon="pi pi-times"
                onClick={handleJobDropRequest}
                loading={dropShiftLoading}
              />
            </div>
          )}>
          <div className="m-0 space-y-4">
            {userWorkingInThisJob
              ? pickupDropShiftPopupJobDetailsTemplate(job, format(shiftInfo.shiftDay, 'MM/dd/yyyy'))
              : null}
            <div>
              <p className="font-medium sm:text-lg">
                If you drop the shift within 24 hours of the Shift start time your account will marked down with 1
                strike.
              </p>
              <p className="font-medium sm:text-lg">(2 strikes and your account will be suspended! ☹️)</p>
            </div>
            <HtInputLabel
              htmlFor="shiftDropReason"
              labelText="Reason for dropping the shift:"
              className="font-medium text-red-600 sm:text-xl"
            />
            <InputTextarea
              id="shiftDropReason"
              required
              autoResize
              className="w-full text-lg sm:w-2/3"
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setShiftDropReason(e.target.value)}
              value={shiftDropReason}
              placeholder="Must be at least 20 characters"
            />
          </div>
        </Dialog>
      ) : null}
    </section>
  )
}
