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
  total_time: string
  details: React.ReactNode
  worked_time: string
  scheduled_time: string
  difference: React.ReactNode
  punchesWithDetails: IPunchDetails[]
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
 * Processes an array of punches into a processed timesheet.
 * @param {IPunch[]} punches - An array of punches.
 * @param {string} jobId - The job ID associated with the timesheet.
 * @returns {IPunchPairsWithData} A processed timesheet.
 */
export function processPunchPairsWithData(timesheet: ITimesheetWithJobDetails): IPunchPairsWithData {
  const { punches, _id, job_details } = timesheet

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
    })
  }

  const totalWorkedHours = totalWorkedTime / 1000 / 60 / 60
  const scheduledHours = job_details.total_hours
  const workedScheduledDifference = totalWorkedHours - scheduledHours

  return {
    time_stamp: sortedPunches[0].time_stamp,
    day: format(sortedPunches[0].time_stamp, 'EEE, MMM d'),
    in_time: inTime,
    out_time: outTime,
    total_time: totalWorkedHours.toFixed(2),
    details: <TimesheetJobDetails job={job_details} />,
    worked_time: totalWorkedHours.toFixed(2),
    scheduled_time: scheduledHours.toFixed(2),
    difference: formatDifference(workedScheduledDifference),
    punchesWithDetails: punchPairs,
  }
}

export const formatDifference = (difference: number) => {
  return difference > 0 ? <span style={{ color: 'red' }}>+{difference.toFixed(2)}</span> : difference.toFixed(2)
}

const TimesheetJobDetails = ({ job }: { job: IJobDetails }) => {
  const { title, facility, lunch_break } = job

  const role = roleChecker()

  return (
    <div className="space-x-2">
      {lunch_break ? <Chip label={`${lunch_break.toLocaleString()} min`} icon="pi pi-clock" /> : null}
      {title ? (
        <Link to={`/${role}/jobs/${job._id}`}>
          <Button label={title} size="small" severity="secondary" rounded icon="pi pi-briefcase" />
        </Link>
      ) : null}
      {facility?.name && facility?._id && role === 'employee' ? (
        <Button label={facility.name} size="small" severity="secondary" disabled rounded icon="pi pi-map-marker" />
      ) : null}
      {facility?.name && facility?._id && role === 'admin' ? (
        <Link to={`/admin/facilities/${facility._id}`}>
          <Button label={facility.name} size="small" severity="secondary" rounded outlined icon="pi pi-map-marker" />
        </Link>
      ) : null}
    </div>
  )
}
