import { useCallback, useEffect, useMemo, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { isEqual } from 'date-fns'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'

import { HtInputLabel } from '../../../../components/shared/forms/HtInputLabel'
import { HtInfoTooltip } from '../../../../components/shared/general/HtInfoTooltip'
import {
  applicantHasPunchInWithoutPunchOut,
  applicantHasPunchOut,
  applicantTimesheetTableTemplate,
  shiftDayAndTimeUTC,
  workingApplicantsDropdownData,
  workingApplicantShiftsDropdownData,
} from '../../../../components/shared/jobDetail/jobDetailUtils'
import {
  type IPunchPairsWithData,
  type ITimesheetWithJobAndShiftDetails,
  processPunchPairsWithData,
} from '../../../../components/shared/timesheets/timesheetsUtils'
import { type IJob } from '../../../../interfaces/job'
import { type Shifts } from '../../../../interfaces/shifts'
import { type ITimeSheet } from '../../../../interfaces/timesheet'
import { requestService } from '../../../../services/requestServiceNew'
import { useUtils } from '../../../../store/useUtils'

export const JobDetailApplicantTimesheetTabAdmin = ({ job }: { job: IJob }) => {
  const [timesheets, setTimesheets] = useState<ITimesheetWithJobAndShiftDetails[]>([])
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

  useEffect(() => {
    const applicants = workingApplicantsDropdownData(job)
    const selectedApplicantExists = applicants.find(applicant => applicant.value === selectedUserId)
    if (applicants.length > 0 && !selectedApplicantExists) {
      setSelectedUserId(undefined)
      setSelectedShift(null)
      setIsClockedIn(false)
    }
  }, [job, selectedUserId])

  const getCurrentJobTimeSheets = useCallback(async () => {
    try {
      const response = await requestService({
        path: `timesheets/employee/${selectedUserId}?job_id=${job?._id}`,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      if (response.status === 200) {
        const data: ITimesheetWithJobAndShiftDetails[] = await response.json()

        setTimesheets(data)
      }

      if (response.status === 204) {
        setTimesheets([])
      }
    } catch (error) {
      console.error('Failed to fetch timesheet:', error)
      setTimesheets([])
    }
  }, [job, selectedUserId])

  useEffect(() => {
    if (selectedUserId == null) return

    getCurrentJobTimeSheets()
    setSelectedShift(null)
  }, [getCurrentJobTimeSheets, selectedUserId])

  const punchPairsAndData: IPunchPairsWithData[] = useMemo(() => {
    if (!timesheets || !selectedUserId) {
      return []
    }

    const processedPunchPairsWithData = timesheets.map(timesheet => {
      return processPunchPairsWithData(timesheet)
    })

    if (!selectedShift) {
      return processedPunchPairsWithData
    }

    return processedPunchPairsWithData.filter(punchPair => isEqual(selectedShift?.shift_day, punchPair.shift_day))
  }, [timesheets, selectedUserId, selectedShift])

  useEffect(() => {
    if (timesheets != null && timesheets.length > 0 && selectedShift) {
      const isApplicantClockedIn =
        !applicantHasPunchOut(punchPairsAndData) && applicantHasPunchInWithoutPunchOut(punchPairsAndData)

      setIsClockedIn(isApplicantClockedIn)
    }
  }, [punchPairsAndData, selectedShift, timesheets])

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
              disabled={!selectedShift || applicantHasPunchOut(punchPairsAndData)}
              pt={{ label: { className: 'text-nowrap' } }}
            />
          </div>
        </div>
      </div>
      <div>{applicantTimesheetTableTemplate(punchPairsAndData, job.facility.timezone)}</div>
    </section>
  )
}
