import { useCallback, useEffect, useMemo, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { formatInTimeZone } from 'date-fns-tz'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Dropdown } from 'primereact/dropdown'

import { HtInputLabel } from '../../../../components/shared/forms/HtInputLabel'
import { HtInfoTooltip } from '../../../../components/shared/general/HtInfoTooltip'
import {
  applicantHasPunchInWithoutPunchOut,
  applicantHasPunchOut,
  shiftDayAndTimeUTC,
  workingApplicantsDropdownData,
  workingApplicantShiftsDropdownData,
} from '../../../../components/shared/jobDetail/jobDetailUtils'
import {
  type IPunchPairWithTotalTime,
  createPunchPairsWithTotalTime,
  getAllPunches,
  sortPunches,
} from '../../../../components/shared/timesheets/timesheetsUtils'
import { type IJob } from '../../../../interfaces/job'
import { type Shifts } from '../../../../interfaces/shifts'
import { type ITimeSheet } from '../../../../interfaces/timesheet'
import { requestService } from '../../../../services/requestServiceNew'
import { useUtils } from '../../../../store/useUtils'
import { isTodaySameAsTimeStamp, isValidDate } from '../../../../utils/timeUtils'

export const JobDetailApplicantTimesheetTabAdmin = ({ job }: { job: IJob }) => {
  const [timesheets, setTimesheets] = useState<ITimeSheet[]>([])
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(undefined)
  const [selectedShift, setSelectedShift] = useState<Shifts | null>(null)
  const [isClockInOutLoading, setIsClockInOutLoading] = useState<boolean>(false)
  const [isClockedIn, setIsClockedIn] = useState<boolean>(false)
  const [latitude, setLatitude] = useState<number | undefined>(undefined)
  const [longitude, setLongitude] = useState<number | undefined>(undefined)

  const { showToast } = useUtils()
  const navigate = useNavigate()

  useEffect(() => {
    const getLocation = () => {
      try {
        if (navigator.geolocation == null) {
          showToast({ severity: 'error', summary: 'Error', detail: 'Geolocation is not enabled on your browser' })
          return
        }
        navigator.geolocation.getCurrentPosition(position => {
          setLatitude(position.coords.latitude)
          setLongitude(position.coords.longitude)
        })
      } catch (error) {
        console.error(error)
      }
    }
    getLocation()
  }, [showToast])

  const getCurrentJobTimeSheets = useCallback(async () => {
    try {
      const response = await requestService({
        path: `timesheets/employee/${selectedUserId}?job_id=${job?._id}`,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      if (response.status === 200) {
        const data: ITimeSheet[] = await response.json()

        setTimesheets(data)
      }
    } catch (error) {
      console.error('Failed to fetch timesheet:', error)
      setTimesheets([])
    }
  }, [job?._id, selectedUserId])

  useEffect(() => {
    if (selectedUserId == null) return

    getCurrentJobTimeSheets()
    setSelectedShift(null)
  }, [getCurrentJobTimeSheets, selectedUserId])

  const punchPairsAndTotalTime: IPunchPairWithTotalTime[] = useMemo(() => {
    if (!timesheets) {
      return []
    }

    const allPunches = getAllPunches(timesheets)
    const sortedPunches = sortPunches(allPunches)
    const punchPairsAndTotalTime = createPunchPairsWithTotalTime(sortedPunches)

    if (!selectedShift) {
      return punchPairsAndTotalTime
    }

    return punchPairsAndTotalTime.filter(punchPair => {
      const shiftDay = new Date(selectedShift?.shift_day)
      const punchInDay = new Date(punchPair.punchIn.time_stamp)
      return shiftDay.toDateString() === punchInDay.toDateString()
    })
  }, [timesheets, selectedShift])

  useEffect(() => {
    if (timesheets != null && timesheets.length > 0 && selectedShift) {
      const isApplicantClockedIn =
        !applicantHasPunchOut(punchPairsAndTotalTime) && applicantHasPunchInWithoutPunchOut(punchPairsAndTotalTime)

      setIsClockedIn(isApplicantClockedIn)
    }
  }, [punchPairsAndTotalTime, selectedShift, timesheets])

  const punchInTimeStampUTC = selectedShift?.shift_day
    ? shiftDayAndTimeUTC(selectedShift.shift_day, selectedShift.shift_start_time)
    : undefined

  const punchOutTimeStampUTC = selectedShift?.shift_day
    ? shiftDayAndTimeUTC(selectedShift.shift_day, selectedShift.shift_end_time)
    : undefined

  const clockInOut = async (endpoint: string) => {
    setIsClockInOutLoading(true)

    try {
      const body = {
        job_id: job?._id,
        location: [latitude, longitude],
        applicant_id: selectedUserId,
        shift_id: selectedShift?._id,
        time_stamp: isClockedIn ? punchOutTimeStampUTC : punchInTimeStampUTC,
      }
      const response: Response = await requestService({
        path: `timesheets/${endpoint}/by-admin`,
        method: 'POST',
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error('Please enable location sharing in your browser in order to clock in.')
      }

      const timeSheet: ITimeSheet = data

      await getCurrentJobTimeSheets()
      showToast({ severity: 'success', summary: 'Success', detail: 'Clock in/out successful' })

      return timeSheet
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.'
      showToast({ severity: 'error', summary: 'Error', detail: errorMessage })
    } finally {
      setIsClockInOutLoading(false)
    }
  }

  return (
    <section className="space-y-6">
      <div className="mt-4 items-end justify-between space-y-4 sm:flex">
        <div>
          <HtInfoTooltip message="Select an applicant to view their timesheet">
            <HtInputLabel htmlFor="applicant_dropdown" labelText="Applicant:" />
          </HtInfoTooltip>
          <div className="p-inputgroup">
            <Dropdown
              value={selectedUserId}
              name="applicant_dropdown"
              placeholder="Select an applicant"
              onChange={event => setSelectedUserId(event.value)}
              options={workingApplicantsDropdownData(job)}
              filter
            />
            {selectedUserId ? (
              <Button
                label="View Details"
                link
                onClick={() => navigate(`/admin/users/employees/${selectedUserId}`)}
                loading={isClockInOutLoading}
                disabled={selectedUserId == null}
                pt={{ label: { className: 'text-nowrap' } }}
              />
            ) : null}
          </div>
        </div>

        <div>
          <HtInfoTooltip message="Select a shift to view and/or clock in/out for the selected applicant">
            <HtInputLabel htmlFor="applicant_shift_dropdown" labelText="Shift:" />
          </HtInfoTooltip>
          <div className="p-inputgroup">
            <Button
              icon="pi pi-refresh"
              label="Reset"
              severity="secondary"
              onClick={() => setSelectedShift(null)}
              disabled={!selectedUserId}
            />
            <Dropdown
              value={selectedShift}
              name="applicant_shift_dropdown"
              placeholder="Select a shift"
              onChange={event => setSelectedShift(event.value)}
              options={workingApplicantShiftsDropdownData(job, selectedUserId ?? '')}
              disabled={!selectedUserId}
              filter
            />
            <Button
              label={isClockedIn ? 'Clock Out for Applicant' : 'Clock-In For Applicant'}
              severity={isClockedIn ? 'warning' : undefined}
              onClick={() => clockInOut(isClockedIn ? 'clock-out' : 'clock-in')}
              loading={isClockInOutLoading}
              disabled={!selectedShift || applicantHasPunchOut(punchPairsAndTotalTime)}
              pt={{ label: { className: 'text-nowrap' } }}
            />
          </div>
        </div>
      </div>
      <div>{timesheetTableTemplate(punchPairsAndTotalTime, job.facility.timezone)}</div>
    </section>
  )
}

const timesheetTableTemplate = (punchPairsAndTotalTime: IPunchPairWithTotalTime[], facilityTimezone: string) => {
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
