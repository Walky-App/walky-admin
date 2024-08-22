import { useCallback, useEffect, useMemo, useState } from 'react'

import { useMediaQuery } from 'react-responsive'

import { isAfter, isBefore, isEqual, isToday, isValid } from 'date-fns'
import { formatInTimeZone, fromZonedTime, toZonedTime } from 'date-fns-tz'
import { Calendar } from 'primereact/calendar'
import { Column, type ColumnEditorOptions, type ColumnEvent } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { Toolbar } from 'primereact/toolbar'

import { type IToastParameters } from '../../../interfaces/global'
import { requestService } from '../../../services/requestServiceNew'
import { useUtils } from '../../../store/useUtils'
import { roleChecker } from '../../../utils/roleChecker'
import { HtInputLabel } from '../forms/HtInputLabel'
import {
  processPunchPairsWithData,
  type IAdminUserTimesheetsColumnMeta,
  type IPunchPairsWithData,
  type ITimesheetWithJobAndShiftDetails,
  adjustForFloatingPointError,
  formatDifference,
  lunchTimeTemplate,
  jobTitleTemplate,
  facilityNameTemplate,
} from './timesheetsUtils'

interface IUserTimesheetsProps {
  selectedUserId: string
}

interface IPayPeriod {
  label: string
  start: string
  end: string
}

export const UserTimesheetsTable: React.FC<IUserTimesheetsProps> = ({ selectedUserId }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [processedTimeSheets, setProcessedTimeSheets] = useState<IPunchPairsWithData[]>([])
  const [payPeriods, setPayPeriods] = useState([] as IPayPeriod[])
  const [selectedPayPeriod, setSelectedPayPeriod] = useState<IPayPeriod>()

  const { showToast } = useUtils()

  const currentUserRole = roleChecker()

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })

  const fetchPayPeriodsByEmployee = useCallback(async () => {
    setIsLoading(true)

    if (!selectedUserId) {
      setIsLoading(false)
      return
    }

    const pathString = `timesheets/employee/${selectedUserId}/pay-periods`
    const noPayPeriodsObject = { label: 'No pay periods found', start: '', end: '' } as IPayPeriod

    try {
      const response = await requestService({ path: pathString })

      if (!response.ok && response.status !== 204) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      let payPeriods = [noPayPeriodsObject]
      if (response.status !== 204) {
        payPeriods = await response.json()
        if (!payPeriods.length) payPeriods = [noPayPeriodsObject]
      }

      const selectedPayPeriod = payPeriods[0]

      setPayPeriods(payPeriods)
      setSelectedPayPeriod(selectedPayPeriod)
      return selectedPayPeriod
    } catch (error) {
      console.error('Failed to fetch pay periods:', error)
    } finally {
      setIsLoading(false)
    }
  }, [selectedUserId])

  const fetchTimesheets = useCallback(
    async (selectedPayPeriod: IPayPeriod) => {
      setIsLoading(true)

      if (!selectedUserId) {
        console.error('selectedUserId is undefined')
        return
      }
      setProcessedTimeSheets([])

      const selectedPayPeriodStart = selectedPayPeriod?.start
      const selectedPayPeriodEnd = selectedPayPeriod?.end

      const pathString = `timesheets/employee/${selectedUserId}/pay-period?start=${selectedPayPeriodStart}&end=${selectedPayPeriodEnd}`

      try {
        const response = await requestService({ path: pathString })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        if (response.status === 204) {
          console.error('No timesheets found')
        } else {
          const timesheets: ITimesheetWithJobAndShiftDetails[] = await response.json()

          const punchPairsAndData: IPunchPairsWithData[] = timesheets.map(timesheet => {
            return processPunchPairsWithData(timesheet)
          })

          setProcessedTimeSheets(punchPairsAndData)
        }
      } catch (error) {
        console.error('Failed to fetch timesheet:', error)
      } finally {
        setIsLoading(false)
      }
    },
    [selectedUserId],
  )

  useEffect(() => {
    const fetchPayPeriodsAndTimesheets = async () => {
      const fetchedPayPeriod = await fetchPayPeriodsByEmployee()
      setSelectedPayPeriod(fetchedPayPeriod)
    }

    fetchPayPeriodsAndTimesheets()
  }, [fetchPayPeriodsByEmployee])

  useEffect(() => {
    if (selectedPayPeriod && selectedPayPeriod.start && selectedPayPeriod.end) {
      fetchTimesheets(selectedPayPeriod)
    }
  }, [selectedPayPeriod, fetchTimesheets])

  const sortedTimeSheets = useMemo(() => {
    return [...processedTimeSheets].sort((a, b) => new Date(a.time_stamp).getTime() - new Date(b.time_stamp).getTime())
  }, [processedTimeSheets])

  const timeEditor = (options: ColumnEditorOptions) => {
    const { in_time_stamp, out_time_stamp } = options.rowData as IPunchPairsWithData

    let timeStamp: string
    switch (options.field) {
      case 'out_time':
        timeStamp = out_time_stamp || in_time_stamp || new Date().toISOString()
        break
      default:
        timeStamp = in_time_stamp || new Date().toISOString()
        break
    }

    const cellTimeValue = options.value ?? new Date(timeStamp)
    const zonedCellTimeValue = toZonedTime(cellTimeValue, options.rowData.facility_timezone)

    return (
      <Calendar
        value={zonedCellTimeValue}
        hourFormat="12"
        onChange={e => {
          const newValue = e.value as Date
          const utcNewValue = fromZonedTime(newValue, options.rowData.facility_timezone)
          const isValidDate = newValue != null && isValid(utcNewValue)
          if (isValidDate) {
            options.editorCallback!(utcNewValue)
          }
        }}
        showTime
        pt={{
          panel: {
            className: 'hidden',
          },
        }}
      />
    )
  }

  const onCellEditComplete = async (e: ColumnEvent) => {
    const { rowData, newValue, field, value } = e as {
      rowData: IPunchPairsWithData
      newValue: Date | string | null
      field: string
      value: Date | string | null
    }

    const handleToastAndFetchTimesheets = async ({ severity, summary, detail }: IToastParameters) => {
      if (selectedPayPeriod) {
        await fetchTimesheets(selectedPayPeriod)
        showToast({ severity, summary, detail })
      } else {
        showToast({ severity: 'error', summary: 'Error', detail: 'No selected pay period' })
      }
    }

    const handleErrorResponse = async (response: Response) => {
      if (!response.ok) {
        const message = await response.text()
        showToast({ severity: 'error', summary: 'Error', detail: message })
        return false
      }
      return true
    }

    try {
      if (newValue == null) {
        showToast({
          severity: 'warn',
          summary: 'Invalid date/time value or no change',
          detail: 'Please use correct format (mm/dd/yyyy hh:mm AM/PM)',
        })
        return
      }

      const isNewValueSameAsInitial = value != null && isEqual(newValue, value)
      const isNewValueAfterPunchOutTime = rowData.out_time != null && isAfter(newValue, rowData.out_time)
      const isNewValueBeforePunchInTime = rowData.in_time != null && isBefore(newValue, rowData.in_time)
      const hasPunchOut = rowData.out_time != null

      if (field === 'in_time' && isNewValueAfterPunchOutTime) {
        showToast({
          severity: 'warn',
          summary: 'Invalid date/time value',
          detail: 'Punch-In must be before existing Punch-Out time',
        })
        return
      }

      if (field === 'in_time' && isNewValueSameAsInitial) {
        showToast({
          severity: 'warn',
          summary: 'Invalid date/time value or no change',
          detail: 'Please use correct format (mm/dd/yyyy hh:mm AM/PM)',
        })
        return
      }

      if (field === 'out_time' && isNewValueBeforePunchInTime) {
        showToast({
          severity: 'warn',
          summary: 'Invalid date/time value',
          detail: 'Punch-Out must be after existing Punch-In time',
        })
        return
      }

      if (field === 'out_time' && isNewValueSameAsInitial && !hasPunchOut) {
        showToast({
          severity: 'warn',
          summary: 'Invalid date/time value or no change',
          detail: 'Please use correct format (mm/dd/yyyy hh:mm AM/PM)',
        })
        return
      }

      if (field === 'out_time' && isNewValueSameAsInitial) {
        showToast({
          severity: 'warn',
          summary: 'Invalid date/time value or no change',
          detail: 'Please use correct format (mm/dd/yyyy hh:mm AM/PM)',
        })
        return
      }

      if (field === 'in_time' || field === 'out_time') {
        const newTimeStamp = newValue
        const punchId = field === 'in_time' ? rowData.in_id : rowData.out_id
        const timeSheetId = rowData.timesheet_id

        const body =
          field === 'in_time'
            ? { punch_in_id: punchId, new_time_stamp_in: newTimeStamp }
            : { punch_out_id: punchId, new_time_stamp_out: newTimeStamp }

        const response = await requestService({
          path: `timesheets/${timeSheetId}/in-out-punches`,
          method: 'PATCH',
          body: JSON.stringify(body),
        })

        if (await handleErrorResponse(response)) {
          await handleToastAndFetchTimesheets({
            severity: 'success',
            summary: `Updated ${field === 'in_time' ? 'In' : 'Out'} time`,
            detail: formatInTimeZone(newTimeStamp, rowData.facility_timezone, 'hh:mm a (z)'),
          })
        }
      } else if (field === 'in_notes' || field === 'out_notes') {
        if (typeof newValue !== 'string') {
          showToast({
            severity: 'error',
            summary: 'Invalid note value',
            detail: 'Please enter a valid text',
          })
          return
        }

        const newNote = newValue
        const punchId = field === 'in_notes' ? rowData.in_id : rowData.out_id
        const timeSheetId = rowData.timesheet_id

        const body = { punch_id: punchId, note: newNote }

        const response = await requestService({
          path: `timesheets/${timeSheetId}/punch-note`,
          method: 'PATCH',
          body: JSON.stringify(body),
        })

        if (await handleErrorResponse(response)) {
          await handleToastAndFetchTimesheets({
            severity: 'success',
            summary: newNote ? `${field === 'in_notes' ? 'In' : 'Out'} Note updated:` : 'Note erased successfully',
            detail: newNote ? `${newNote}` : '',
          })
        }
      }
    } catch (error) {
      showToast({
        severity: 'error',
        summary: 'Error',
        detail: error instanceof Error ? error.message : 'An unknown error occurred',
      })
    }
  }

  const totalTimeSum = sortedTimeSheets.reduce((sum, record) => {
    const hours = parseFloat(record.total_time)
    return sum + hours
  }, 0)

  const scheduledTimeSum = sortedTimeSheets.reduce((sum, record) => {
    const hours = parseFloat(record.scheduled_time)
    return sum + hours
  }, 0)

  const workedScheduledDifference = totalTimeSum - scheduledTimeSum
  const adjustedWorkedScheduledDifference = adjustForFloatingPointError(workedScheduledDifference)

  const payPeriodSelectorContent = (
    <div className="flex flex-col items-baseline gap-y-2">
      <HtInputLabel htmlFor="pay-period-dropdown" labelText="Pay Period" className="text-base" />
      <Dropdown
        id="pay-period-dropdown"
        value={selectedPayPeriod}
        options={payPeriods}
        onChange={e => setSelectedPayPeriod(e.value)}
        placeholder="Select a pay period"
        className="w-60"
      />
    </div>
  )

  const editableCellColumnStyle = currentUserRole === 'admin' ? 'cursor-pointer hover:text-primary' : ''

  const textEditor = (options: ColumnEditorOptions) => {
    return (
      <InputText
        type="text"
        value={options.value ?? ''}
        onChange={e => options.editorCallback!(e.target.value)}
        className="w-full"
      />
    )
  }

  const cellEditor = (options: ColumnEditorOptions) => {
    if (options.field === 'in_time' || options.field === 'out_time') {
      return timeEditor(options)
    } else if (options.field === 'in_notes' || options.field === 'out_notes') {
      return textEditor(options)
    }
  }

  const getEditableProps = (currentUserRole: string) => {
    if (currentUserRole === 'admin') {
      return {
        editor: (options: ColumnEditorOptions) => cellEditor(options),
        onCellEditComplete: onCellEditComplete,
        className: editableCellColumnStyle,
      }
    }
    return {}
  }

  const cols: IAdminUserTimesheetsColumnMeta<IPunchPairsWithData>[] = [
    {
      field: 'shift_day',
      header: 'Shift Day',
      sortable: false,
      body: rowData => formatInTimeZone(rowData.shift_day, rowData.facility_timezone, 'PP'),
    },
    {
      field: 'in_time',
      header: 'In',
      sortable: false,
      body: rowData =>
        rowData.in_time != null
          ? formatInTimeZone(rowData.in_time, rowData.facility_timezone, 'hh:mm a (z)')
          : rowData.in_time != null && isToday(rowData.in_time)
            ? 'Clocked In'
            : 'Clock In not recorded',
      ...getEditableProps(currentUserRole),
    },
    {
      field: 'out_time',
      header: 'Out',
      sortable: false,
      body: rowData =>
        rowData.out_time != null
          ? formatInTimeZone(rowData.out_time, rowData.facility_timezone, 'hh:mm a (z)')
          : rowData.in_time != null && isToday(rowData.in_time)
            ? 'Clocked In'
            : 'Clock Out not recorded',
      ...getEditableProps(currentUserRole),
    },
    {
      field: 'lunch_time',
      header: 'Lunch Break',
      sortable: false,
      body: rowData => lunchTimeTemplate(rowData.lunch_time),
    },
    {
      field: 'job_title',
      header: 'Job Title',
      sortable: false,
      body: rowData => jobTitleTemplate(rowData.job_title, rowData.job_id, currentUserRole),
    },
    {
      field: 'facility_name',
      header: 'Facility',
      sortable: false,
      body: rowData => facilityNameTemplate(rowData.facility_name, rowData.facility_id, currentUserRole),
    },
    { field: 'scheduled_time', header: 'Scheduled Hours', sortable: false },
    { field: 'total_time', header: 'Total Hours', sortable: false },
    {
      field: 'difference',
      header: 'Difference',
      sortable: false,
      body: rowData => formatDifference(rowData.difference),
    },
  ]

  return (
    <>
      {isMobile ? <Toolbar start={payPeriodSelectorContent} /> : <Toolbar end={payPeriodSelectorContent} />}

      <DataTable
        header={`Scheduled ${scheduledTimeSum.toFixed(2)} | Total ${totalTimeSum.toFixed(2)} | Difference ${adjustedWorkedScheduledDifference.toFixed(2)} hours`}
        dataKey="timesheet_id"
        editMode="cell"
        value={sortedTimeSheets}
        emptyMessage={isLoading ? 'Loading...' : 'No timesheets found'}
        size="small"
        paginator
        rows={14}
        rowsPerPageOptions={[7, 14, 30, 90]}
        stripedRows
        showGridlines
        pt={{
          header: {
            className: 'font-normal text-sm text-gray-500',
          },
        }}>
        {cols.map(col => (
          <Column
            key={col.field}
            field={col.field}
            header={col.header}
            body={col.body}
            editor={col.editor}
            className={col.className}
            onCellEditComplete={col.onCellEditComplete}
          />
        ))}
      </DataTable>
    </>
  )
}
