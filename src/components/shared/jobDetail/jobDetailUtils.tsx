import { format, isToday, set } from 'date-fns'
import { formatInTimeZone, fromZonedTime } from 'date-fns-tz'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'

import { type IJob, type IJobShiftDay } from '../../../interfaces/job'
import { type ITimeSheet } from '../../../interfaces/timesheet'
import { type IPunchPairsWithData } from '../timesheets/timesheetsUtils'

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

export const applicantHasPunchInWithoutPunchOut = (punchPairsAndTotalTime: IPunchPairsWithData[]) => {
  if (punchPairsAndTotalTime.length === 0) return false

  if (punchPairsAndTotalTime.length > 0 && punchPairsAndTotalTime.some(punchPair => punchPair.out_time == null))
    return true

  return false
}

export const applicantHasPunchOut = (punchPairsAndTotalTime: IPunchPairsWithData[]) => {
  if (punchPairsAndTotalTime.length === 0) return false

  if (punchPairsAndTotalTime.length > 0 && punchPairsAndTotalTime.some(punchPair => punchPair.out_time != null))
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

export const applicantTimesheetTableTemplate = (punchPairsAndData: IPunchPairsWithData[], facilityTimezone: string) => {
  return (
    <>
      <h2 className="text-base font-semibold leading-6 text-gray-900">Timesheet</h2>
      <DataTable
        value={punchPairsAndData}
        stripedRows
        paginator
        rows={7}
        rowsPerPageOptions={[7, 14, 30]}
        emptyMessage="No time data to display">
        <Column
          header="Shift Day"
          body={(rowData: IPunchPairsWithData) =>
            rowData.shift_day != null ? formatInTimeZone(rowData.shift_day, facilityTimezone, 'PP') : 'No Timestamp'
          }
        />
        <Column
          header="Time In"
          body={(rowData: IPunchPairsWithData) =>
            rowData.in_time != null
              ? formatInTimeZone(rowData.in_time, facilityTimezone, 'hh:mm a (z)')
              : rowData.in_time != null && isToday(rowData.in_time)
                ? 'Clocked In'
                : 'Clock In not recorded'
          }
        />
        <Column
          header="Time Out"
          body={(rowData: IPunchPairsWithData) =>
            rowData.out_time != null
              ? formatInTimeZone(rowData.out_time, facilityTimezone, 'hh:mm a (z)')
              : rowData.in_time != null && isToday(rowData.in_time)
                ? 'Clocked In'
                : 'Clock Out not recorded'
          }
        />
        <Column header="Lunch Break" body={(rowData: IPunchPairsWithData) => rowData.lunch_time} />
        <Column header="Scheduled Hours" body={(rowData: IPunchPairsWithData) => rowData.scheduled_time ?? ''} />
        <Column
          header="Total Hours"
          body={(rowData: IPunchPairsWithData) => (rowData.in_time && rowData.out_time ? rowData.total_time : '')}
        />
      </DataTable>
    </>
  )
}
