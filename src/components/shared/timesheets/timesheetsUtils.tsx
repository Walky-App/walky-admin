import React from 'react'

import { Link } from 'react-router-dom'

import { format } from 'date-fns'
import { Button } from 'primereact/button'
import { Chip } from 'primereact/chip'
import { type ColumnEditorOptions } from 'primereact/column'

import { type IPunch, type ITimeSheet } from '../../../interfaces/timesheet'
import { roleChecker } from '../../../utils/roleChecker'
import { convertMillisecondsToReadableTime } from '../../../utils/timeUtils'

export interface IAdminUserTimesheetsColumnMeta<T> {
  field: keyof T
  header: React.ReactNode
  sortable?: boolean
  editor?: (options: ColumnEditorOptions) => React.ReactNode
}

export interface IPunchPair {
  day: string
  in_id: string
  out_id: string
  in_time: Date | null
  out_time: Date | null
  in_time_stamp: string
  out_time_stamp: string
  total_time: string
  timesheet_id: string
  facility_timezone: string
  in_notes?: string
  out_notes?: string
}

export interface IPunchDetails {
  in_time: Date | null
  out_time: Date | null
  total_time: string
  in_notes?: string
  out_notes?: string
}
export interface IPunchPairsWithData {
  time_stamp: string
  day: string
  in_time: Date | null
  out_time: Date | null
  lunch_time: React.ReactNode
  job_title: React.ReactNode
  facility_name: React.ReactNode
  facility_timezone: string
  total_time: string
  worked_time: string
  scheduled_time: string
  difference: React.ReactNode
  punchesWithDetails: IPunchDetails[]
  timesheet_id: string
}

export interface IPunchPairWithTotalTime {
  punchIn: IPunch
  punchOut: IPunch | null
  totalTime: string | undefined
}

interface IJobDetails {
  _id: string
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

export interface ITimesheetWithJobDetails extends ITimeSheet {
  job_details: IJobDetails
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

/**
 * Processes an array of punches into a processed timesheet.
 * @param {IPunch[]} punches - An array of punches.
 * @param {string} jobId - The job ID associated with the timesheet.
 * @returns {IPunchPairsWithData} A processed timesheet.
 */
export function processPunchPairsWithData(timesheet: ITimesheetWithJobDetails): IPunchPairsWithData {
  const { punches, _id, job_details } = timesheet
  const role = roleChecker()

  const sortedPunches = sortPunches(punches)

  let totalWorkedTime = 0
  let punchIn = null
  let punchOut = null
  let inTime: Date | null = null
  let outTime: Date | null = null
  const punchPairs: IPunchPair[] = []

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
      punchPairs.push({
        day: format(punchOut.time_stamp, 'EEE, MMM d'),
        in_id: punchIn._id,
        out_id: punchOut._id,
        in_time: new Date(punchIn.time_stamp),
        out_time: new Date(punchOut.time_stamp),
        in_time_stamp: punchIn.time_stamp,
        out_time_stamp: punchOut.time_stamp,
        total_time: (totalTime / 1000 / 60 / 60).toFixed(2),
        in_notes: punchIn.note,
        out_notes: punchOut.note,
        timesheet_id: _id,
        facility_timezone: job_details.facility.timezone,
      })
      punchIn = null
    }
  }

  if (!outTime && punchIn) {
    punchPairs.push({
      day: format(punchIn.time_stamp, 'EEE, MMM d'),
      in_id: punchIn._id,
      out_id: '',
      in_time: new Date(punchIn.time_stamp),
      out_time: null,
      in_time_stamp: punchIn.time_stamp,
      out_time_stamp: '',
      total_time: '',
      in_notes: punchIn.note,
      out_notes: '',
      timesheet_id: _id,
      facility_timezone: job_details.facility.timezone,
    })
  }

  const scheduledHours = job_details.total_hours
  const lunchHours = job_details.lunch_break / 60
  const workedHours = totalWorkedTime / 1000 / 60 / 60

  const totalWorkedHours = workedHours - lunchHours
  const workedScheduledDifference = totalWorkedHours - scheduledHours

  const adjustedWorkedScheduledDifference = adjustForFloatingPointError(workedScheduledDifference)

  const lunchTimeTemplate = () => {
    if (job_details.lunch_break) {
      return <Chip label={`${job_details.lunch_break.toLocaleString()} min`} icon="pi pi-clock" />
    }
    return null
  }

  const facilityNameTemplate = () => {
    const { facility } = job_details

    if (facility?.name && facility?._id) {
      if (role === 'employee') {
        return (
          <Button label={facility.name} size="small" severity="secondary" disabled rounded icon="pi pi-map-marker" />
        )
      } else if (role === 'admin') {
        return (
          <Link to={`/admin/facilities/${facility._id}`}>
            <Button label={facility.name} size="small" severity="secondary" rounded outlined icon="pi pi-map-marker" />
          </Link>
        )
      }
    }
    return null
  }

  const jobTitleTemplate = () => {
    const { title } = job_details

    if (title) {
      return (
        <Link to={`/${role}/jobs/${job_details._id}`}>
          <Button label={title} size="small" severity="secondary" rounded icon="pi pi-briefcase" />
        </Link>
      )
    }
    return null
  }

  return {
    time_stamp: sortedPunches[0].time_stamp,
    day: format(sortedPunches[0].time_stamp, 'EEE, MMM d'),
    in_time: inTime,
    out_time: outTime,
    lunch_time: lunchTimeTemplate(),
    job_title: jobTitleTemplate(),
    facility_name: facilityNameTemplate(),
    facility_timezone: job_details.facility.timezone,
    total_time: totalWorkedHours.toFixed(2),
    worked_time: totalWorkedHours.toFixed(2),
    scheduled_time: scheduledHours.toFixed(2),
    difference: formatDifference(adjustedWorkedScheduledDifference),
    punchesWithDetails: punchPairs,
    timesheet_id: _id,
  }
}
