import React from 'react'

import { Link } from 'react-router-dom'

import { set } from 'date-fns'
import { fromZonedTime } from 'date-fns-tz'
import { Button } from 'primereact/button'
import { Chip } from 'primereact/chip'
import { type ColumnEvent, type ColumnEditorOptions } from 'primereact/column'

import { type IPunch, type ITimeSheet } from '../../../interfaces/timesheet'
import { convertMillisecondsToReadableTime } from '../../../utils/timeUtils'

export interface IAdminUserTimesheetsColumnMeta<T> {
  field: keyof T
  header: React.ReactNode
  sortable?: boolean
  body?: (rowData: T) => React.ReactNode
  editor?: (options: ColumnEditorOptions) => React.ReactNode
  onCellEditComplete?: (e: ColumnEvent) => void
  className?: string
}

export interface IPunchPairsWithData {
  time_stamp: string
  in_time: Date | null
  out_time: Date | null
  in_id: string
  out_id: string
  in_time_stamp: string
  out_time_stamp: string
  note: string
  lunch_time: number
  job_title: string
  job_id: string
  job_uid: string
  facility_name: string
  facility_timezone: string
  facility_id: string
  total_time: string
  scheduled_time: string
  difference: number
  shift_id: string
  shift_day: Date
  shift_start_time: Date
  shift_end_time: Date
  timesheet_id: string
}

export interface IPunchPairWithTotalTime {
  punchIn: IPunch
  punchOut: IPunch | null
  totalTime: string | undefined
}

interface IJobDetails {
  _id: string
  uid: string
  title: string
  start_time: Date
  end_time: Date
  lunch_break: number
  total_hours: number
  facility: {
    _id: string
    name: string
    timezone: string
  }
}

interface IShiftDetailsSlim {
  shift_id: string
  shift_day: Date
  shift_start_time: Date
  shift_end_time: Date
  job_id: string
}

export interface ITimesheetWithJobAndShiftDetails extends ITimeSheet {
  job_details: IJobDetails
  shift_details: IShiftDetailsSlim
}

export interface ITimesheetWithJobAndShiftDetailsAndPunches {
  timesheetsResults: ITimesheetWithJobAndShiftDetails[]
  jobsInDateRange: IJobDetails[]
}

/**
 * Flattens an array of timesheets into an array of punches.
 * @param {ITimeSheet[]} timesheets - An array of timesheets.
 * @returns {IPunch[]} An array of all punches from all timesheets.
 */
export function getAllPunches(timesheets: ITimeSheet[]): IPunch[] {
  return timesheets.flatMap(timesheet => timesheet.punches)
}

/**
 * Sorts an array of punches by their timestamps.
 * @param {IPunch[]} punches - An array of punches.
 * @returns {IPunch[]} The input array of punches, sorted by timestamp.
 */
export function sortPunches(punches: IPunch[]): IPunch[] {
  return punches.sort((a, b) => Date.parse(a.time_stamp) - Date.parse(b.time_stamp))
}

/**
 * Creates punch pairs and calculates total time for each pair.
 * @param {IPunch[]} punches - An array of sorted punches.
 * @returns {IPunchPairWithTotalTime[]} An array of punch pairs with total time.
 */
export function createPunchPairsWithTotalTime(punches: IPunch[]): IPunchPairWithTotalTime[] {
  const pairs = []
  let punchIn = null
  let i = 0
  for (const punch of punches) {
    if (punch.punch_in) {
      if (punchIn) {
        pairs.push({ punchIn, punchOut: null, totalTime: undefined })
      }
      punchIn = punch
    } else if (punchIn) {
      const totalTime = Date.parse(punch.time_stamp) - Date.parse(punchIn.time_stamp)
      pairs.push({ punchIn, punchOut: punch, totalTime: convertMillisecondsToReadableTime(totalTime) })
      punchIn = null
    }
    if (punchIn && i === punches.length - 1) {
      pairs.push({ punchIn, punchOut: null, totalTime: undefined })
    }
    i++
  }

  return pairs.reverse()
}

/**
 * Adjusts a numerical difference to zero if it is within a specified threshold to handle floating-point precision errors.
 *
 * @param {number} value - The numerical value to adjust.
 * @param {number} threshold - The threshold value to determine if the difference should be considered zero.
 * @returns {number} - The adjusted numerical value.
 */
export const adjustForFloatingPointError = (value: number, threshold = 0.001): number => {
  return Math.abs(value) < threshold ? 0 : value
}

/**
 * Formats a numerical difference as a string with two decimal places.
 * If the difference is positive, it returns a JSX element with the difference in red color.
 * If the difference is zero or negative, it returns the difference as a string.
 *
 * @param {number} difference - The numerical difference to format.
 * @returns {React.ReactNode} - A formatted JSX element or string representing the difference.
 */
export const formatDifference = (difference: number): React.ReactNode => {
  return difference > 0 ? <span style={{ color: 'red' }}>+{difference.toFixed(2)}</span> : difference.toFixed(2)
}

export const lunchTimeTemplate = (lunchBreak: number) => {
  if (lunchBreak) {
    return <Chip label={`${lunchBreak.toLocaleString()} min`} icon="pi pi-clock" />
  }
  return null
}

export const facilityNameTemplate = (facilityName: string, id: string, role: string) => {
  const facilityButton = (
    <Button
      label={facilityName}
      size="small"
      severity="secondary"
      disabled={role === 'employee'}
      rounded
      outlined
      icon="pi pi-map-marker"
    />
  )

  if (facilityName && id) {
    return role === 'admin' ? <Link to={`/admin/facilities/${id}`}>{facilityButton}</Link> : facilityButton
  }
  return null
}

export const jobTitleTemplate = (jobTitle: string, uid: string, id: string, role: string) => {
  if (jobTitle && uid && id) {
    const jobLabel = `${jobTitle} #${uid}`
    return (
      <Link to={`/${role}/jobs/${id}`}>
        <Button label={jobLabel} size="small" severity="secondary" rounded icon="pi pi-briefcase" />
      </Link>
    )
  }
  return null
}

/**
 * Processes an array of punches into a processed timesheet.
 * @param {IPunch[]} punches - An array of punches.
 * @param {string} jobId - The job ID associated with the timesheet.
 * @returns {IPunchPairsWithData} A processed timesheet.
 */
export function processPunchPairsWithData(timesheet: ITimesheetWithJobAndShiftDetails): IPunchPairsWithData {
  const { punches, _id, job_details, shift_details, note } = timesheet
  const { shift_id, shift_day, shift_start_time, shift_end_time, job_id } = shift_details

  const scheduledHours = job_details.total_hours
  const lunchHours = job_details.lunch_break / 60

  if (!punches.length) {
    return {
      time_stamp: '',
      in_time: null,
      out_time: null,
      in_id: '',
      out_id: '',
      in_time_stamp: '',
      out_time_stamp: '',
      note: '',
      lunch_time: job_details.lunch_break,
      job_id,
      job_uid: job_details.uid,
      job_title: job_details.title,
      facility_id: job_details.facility._id,
      facility_name: job_details.facility.name,
      facility_timezone: job_details.facility.timezone,
      total_time: '',
      scheduled_time: scheduledHours.toFixed(2),
      difference: 0,
      shift_id,
      shift_day,
      shift_start_time,
      shift_end_time,
      timesheet_id: _id,
    }
  }

  const sortedPunches = sortPunches(punches)

  let totalWorkedTime = 0
  let punchIn = null
  let punchOut = null
  let inTime: Date | null = null
  let outTime: Date | null = null
  let inId = ''
  let outId = ''
  let inTimeStamp = ''
  let outTimeStamp = ''

  for (const punch of sortedPunches) {
    if (punch.punch_in) {
      punchIn = punch
      if (!inTime) {
        inTime = new Date(punch.time_stamp)
      }
      outTime = null
    } else if (punchIn) {
      punchOut = punch
      const totalTime = Date.parse(punchOut.time_stamp) - Date.parse(punchIn.time_stamp)
      totalWorkedTime += totalTime

      outTime = new Date(punchOut.time_stamp)
      inId = punchIn._id
      outId = punchOut._id
      inTimeStamp = punchIn.time_stamp
      outTimeStamp = punchOut.time_stamp
      punchIn = null
    }
  }

  if (!outTime && punchIn) {
    inId = punchIn._id
    outId = ''
    inTimeStamp = punchIn.time_stamp
    outTimeStamp = ''
  }

  const workedHours = totalWorkedTime / 1000 / 60 / 60

  const totalWorkedHours = workedHours - lunchHours
  const workedScheduledDifference = totalWorkedHours - scheduledHours

  const adjustedWorkedScheduledDifference = adjustForFloatingPointError(workedScheduledDifference)

  return {
    shift_id,
    shift_day,
    shift_start_time,
    shift_end_time,
    time_stamp: sortedPunches[0].time_stamp,
    in_time: inTime,
    out_time: outTime,
    in_id: inId,
    out_id: outId,
    in_time_stamp: inTimeStamp,
    out_time_stamp: outTimeStamp,
    note: note ?? '',
    lunch_time: job_details.lunch_break,
    job_id,
    job_uid: job_details.uid,
    job_title: job_details.title,
    facility_id: job_details.facility._id,
    facility_name: job_details.facility.name,
    facility_timezone: job_details.facility.timezone,
    total_time: totalWorkedHours.toFixed(2),
    scheduled_time: scheduledHours.toFixed(2),
    difference: adjustedWorkedScheduledDifference,
    timesheet_id: _id,
  }
}

export const combineDayAndTimeUTC = (day: Date, time: string) => {
  const timeUTC = fromZonedTime(time, 'UTC')

  const hours = timeUTC.getUTCHours()
  const minutes = timeUTC.getUTCMinutes()
  const seconds = timeUTC.getUTCSeconds()
  const milliseconds = timeUTC.getUTCMilliseconds()

  const dayAndTimeUTC = set(day, {
    hours,
    minutes,
    seconds,
    milliseconds,
  })
  return dayAndTimeUTC
}
