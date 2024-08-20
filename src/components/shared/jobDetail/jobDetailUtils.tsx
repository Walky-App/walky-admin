import { format, set } from 'date-fns'
import { formatInTimeZone, fromZonedTime } from 'date-fns-tz'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'

import { type IJob, type IJobShiftDay } from '../../../interfaces/job'
import { type ITimeSheet } from '../../../interfaces/timesheet'
import { isTodaySameAsTimeStamp, isValidDate } from '../../../utils/timeUtils'
import { type IPunchPairWithTotalTime } from '../timesheets/timesheetsUtils'

export const getLatestTimeSheet = (array?: ITimeSheet[] | null) => {
  if (array?.length == null) {
    return null
  }

  const sortedTimesheets = [...array].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return sortedTimesheets[0]
}

export const isApplicantWorkingThisJob = (job: IJob, applicantId: string) => {
  const isWorking = job?.job_days.some((day: IJobShiftDay) =>
    day?.shifts_id?.user_shifts?.some(shift => {
      const isMatch = shift.user_id._id === applicantId
      return isMatch
    }),
  )

  return isWorking
}

export const isApplicantWorkingThisShift = (job: IJob, shiftId: string, applicantId: string) => {
  const isWorking = job?.job_days.some(
    (day: IJobShiftDay) =>
      day?.shifts_id?._id === shiftId &&
      day?.shifts_id?.user_shifts?.some(shift => {
        const isMatch = shift.user_id._id === applicantId
        return isMatch
      }),
  )

  return isWorking
}

export const workingApplicantsDropdownData = (job: IJob) => {
  const applicants = job.applicants.map(applicant => ({
    label: `${applicant.user.first_name} ${applicant.user.last_name}`,
    value: applicant.user._id,
  }))

  return applicants
}

export const workingApplicantShiftsDropdownData = (job: IJob, applicantId: string) => {
  const allShiftsData = job.job_days.map((day, index) => ({
    label: `Day ${index + 1} - ${format(new Date(day.day), 'EEEE, MMMM d, yyyy')}`,
    value: day.shifts_id,
  }))

  const applicantShifts = allShiftsData.filter(shift => {
    const isWorking = isApplicantWorkingThisShift(job, shift.value._id, applicantId)
    return isWorking
  })

  applicantShifts.sort((a, b) => {
    const shiftDayA = new Date(a.value.shift_day).getTime()
    const shiftDayB = new Date(b.value.shift_day).getTime()
    return shiftDayB - shiftDayA
  })

  return applicantShifts
}

export const applicantHasPunchInWithoutPunchOut = (punchPairsAndTotalTime: IPunchPairWithTotalTime[]) => {
  if (punchPairsAndTotalTime.length === 0) return false

  if (punchPairsAndTotalTime.length > 0 && punchPairsAndTotalTime.some(punchPair => punchPair.punchOut == null))
    return true

  return false
}

export const applicantHasPunchOut = (punchPairsAndTotalTime: IPunchPairWithTotalTime[]) => {
  if (punchPairsAndTotalTime.length === 0) return false

  if (punchPairsAndTotalTime.length > 0 && punchPairsAndTotalTime.some(punchPair => punchPair.punchOut != null))
    return true

  return false
}

export const shiftDayAndTimeUTC = (shiftDay: Date, shiftTime: string) => {
  const timeUTC = fromZonedTime(shiftTime, 'UTC')

  const hours = timeUTC.getUTCHours()
  const minutes = timeUTC.getUTCMinutes()
  const seconds = timeUTC.getUTCSeconds()
  const milliseconds = timeUTC.getUTCMilliseconds()

  const shiftDayAndTimeUTC = set(shiftDay, {
    hours,
    minutes,
    seconds,
    milliseconds,
  })
  return shiftDayAndTimeUTC
}

export const applicantTimesheetTableTemplate = (
  punchPairsAndTotalTime: IPunchPairWithTotalTime[],
  facilityTimezone: string,
) => {
  return (
    <>
      <h2 className="text-base font-semibold leading-6 text-gray-900">Timesheet</h2>
      <DataTable
        value={punchPairsAndTotalTime}
        stripedRows
        paginator
        rows={7}
        rowsPerPageOptions={[7, 14, 30]}
        emptyMessage="No time data to display">
        <Column
          field="punchIn.time_stamp"
          header="Date"
          body={(rowData: IPunchPairWithTotalTime) =>
            isValidDate(rowData.punchIn.time_stamp)
              ? formatInTimeZone(rowData.punchIn.time_stamp, facilityTimezone, 'P')
              : 'No Timestamp'
          }
        />
        <Column
          header="Time In"
          body={rowData => formatInTimeZone(rowData.punchIn.time_stamp, facilityTimezone, 'hh:mm a (z)')}
        />
        <Column
          header="Time Out"
          body={(rowData: IPunchPairWithTotalTime) =>
            rowData.punchOut
              ? formatInTimeZone(rowData.punchOut.time_stamp, facilityTimezone, 'hh:mm a (z)')
              : isTodaySameAsTimeStamp(rowData.punchIn.time_stamp)
                ? 'Clocked In'
                : 'Clock Out not recorded'
          }
        />
        <Column header="Total Time" body={(rowData: IPunchPairWithTotalTime) => rowData.totalTime ?? ''} />
      </DataTable>
    </>
  )
}
