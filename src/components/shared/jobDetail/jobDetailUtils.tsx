import { format } from 'date-fns'

import { type IJob, type IJobShiftDay } from '../../../interfaces/job'
import { type ITimeSheet } from '../../../interfaces/timesheet'
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
