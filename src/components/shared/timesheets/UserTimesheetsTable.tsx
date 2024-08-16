import { useCallback, useEffect, useMemo, useState } from 'react'

import { useMediaQuery } from 'react-responsive'

import { format, isBefore, isEqual, isToday, isValid } from 'date-fns'
import { formatInTimeZone, fromZonedTime, toZonedTime } from 'date-fns-tz'
import { Calendar } from 'primereact/calendar'
import { Column, type ColumnEditorOptions, type ColumnEvent } from 'primereact/column'
import { DataTable, type DataTableExpandedRows, type DataTableValueArray } from 'primereact/datatable'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { Toolbar } from 'primereact/toolbar'

import { type IToastParameters } from '../../../interfaces/global'
import { requestService } from '../../../services/requestServiceNew'
import { useUtils } from '../../../store/useUtils'
import { cn } from '../../../utils/cn'
import { roleChecker } from '../../../utils/roleChecker'
import { formatToDateTime } from '../../../utils/timeUtils'
import { HtInputLabel } from '../forms/HtInputLabel'
import {
  type IPunchPair,
  processPunchPairsWithData,
  type IAdminUserTimesheetsColumnMeta,
  type IPunchDetails,
  type IPunchPairsWithData,
  type ITimesheetWithJobDetails,
  adjustForFloatingPointError,
} from './timesheetsUtils'

interface IUserTimesheetsProps {
  selectedUserId: string
}

interface IPayPeriod {
  label: string
  start: string
  end: string
}

const cols: IAdminUserTimesheetsColumnMeta<IPunchPairsWithData>[] = [
  { field: 'day', header: 'Day', sortable: false },
  { field: 'in_time', header: 'First In', sortable: false },
  { field: 'out_time', header: 'Last Out', sortable: false },
  { field: 'lunch_time', header: 'Lunch Break', sortable: false },
  { field: 'job_title', header: 'Job Title', sortable: false },
  { field: 'facility_name', header: 'Facility', sortable: false },
  { field: 'scheduled_time', header: 'Scheduled Hours', sortable: false },
  { field: 'worked_time', header: 'Total Hours', sortable: false },
  { field: 'difference', header: 'Difference', sortable: false },
]

export const UserTimesheetsTable: React.FC<IUserTimesheetsProps> = ({ selectedUserId }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [processedTimeSheets, setProcessedTimeSheets] = useState<IPunchPairsWithData[]>([])
  const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | DataTableValueArray | undefined>(undefined)
  const [payPeriods, setPayPeriods] = useState([] as IPayPeriod[])
  const [selectedPayPeriod, setSelectedPayPeriod] = useState<IPayPeriod>()

  const { showToast } = useUtils()

  const currentUserRole = roleChecker()

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })

  const fetchPayPeriodsByEmployee = useCallback(async () => {
    setIsLoading(true)

    if (!selectedUserId) {
      console.error('selectedUserId is undefined')
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
          const timesheets: ITimesheetWithJobDetails[] = await response.json()

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

  const cellEditor = (options: ColumnEditorOptions) => {
    if (options.field === 'in_time' || options.field === 'out_time') {
      return timeEditor(options)
    } else {
      return textEditor(options)
    }
  }

  const timeEditor = (options: ColumnEditorOptions) => {
    const { in_time_stamp, out_time_stamp } = options.rowData as IPunchPair

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

  const onCellEditComplete = async (e: ColumnEvent) => {
    try {
      const { rowData, newValue, field, value } = e as {
        rowData: IPunchPair
        newValue: Date | string | null
        field: string
        value: Date | string | null
      }

      const newValueDate = newValue instanceof Date ? newValue : newValue

      const isNewValueBeforePunchInTime =
        newValueDate != null && rowData.in_time != null && isBefore(newValueDate, rowData.in_time)

      if (newValue == null || isNewValueBeforePunchInTime) {
        showToast({
          severity: 'warn',
          summary: 'Invalid date/time value',
          detail: 'Punch Out must be after existing Punch In time',
        })
        return
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

      switch (field) {
        case 'in_time':
        case 'out_time': {
          const newValueDateString = newValue instanceof Date ? newValue.toISOString() : newValue
          const formattedNewValue = formatToDateTime(newValueDateString)

          if (
            (field === 'in_time' && rowData.in_time && formattedNewValue === format(rowData.in_time, 'hh:mm a')) ||
            (field === 'out_time' && rowData.out_time && formattedNewValue === format(rowData.out_time, 'hh:mm a'))
          ) {
            return
          }

          const hasPunchOut = rowData.out_time != null

          const isNewValueSameAsInitial = value != null && isEqual(newValue, value)

          const isClockOutByAdmin = !hasPunchOut && newValue != null

          if (isNewValueSameAsInitial && isClockOutByAdmin) {
            showToast({
              severity: 'warn',
              summary: 'Invalid date/time value or no change',
              detail: 'Please use correct format (mm/dd/yyyy hh:mm AM/PM)',
            })
            return
          }

          if (field === 'in_time' || field === 'out_time') {
            const newTimeStamp: string = newValueDateString
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
          }
          break
        }
        case 'in_notes':
        case 'out_notes': {
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

          break
        }
        default:
          break
      }
    } catch (error) {
      if (error instanceof Error) {
        showToast({ severity: 'error', summary: 'Error', detail: error.message })
      } else {
        showToast({ severity: 'error', summary: 'Error', detail: 'An unknown error occurred' })
      }
    }
  }

  const getCellValue = (col: IAdminUserTimesheetsColumnMeta<IPunchPairsWithData>, rowData: IPunchPairsWithData) => {
    const field = col.field as keyof IPunchPairsWithData

    if (field === 'out_time' && (!rowData[field] || rowData[field] === null)) {
      return rowData['in_time'] && isToday(rowData['in_time']) ? 'Clocked In' : 'Clock Out not recorded'
    } else if (field === 'total_time' && (!rowData['out_time'] || rowData['out_time'] === null)) {
      return ''
    } else {
      const value = rowData[field]
      if (Array.isArray(value)) {
        return value.map((punch: IPunchDetails) => punch[field as keyof IPunchDetails]).join(', ')
      } else if (value instanceof Date) {
        return formatInTimeZone(value, rowData.facility_timezone, 'hh:mm a (z)')
      } else {
        return value
      }
    }
  }

  const allowExpansion = (rowData: IPunchPairsWithData) => {
    return !rowData['out_time'] || rowData['out_time'] !== null
  }

  const getEditableProps = (currentUserRole: string) => {
    if (currentUserRole === 'admin') {
      return {
        editor: (options: ColumnEditorOptions) => cellEditor(options),
        onCellEditComplete: onCellEditComplete,
      }
    }
    return {}
  }

  const rowExpansionTemplate = (data: IPunchPairsWithData) => {
    const commonColumnStyle = ''
    const editableCellColumnStyle = currentUserRole === 'admin' ? 'cursor-pointer hover:text-primary' : ''
    const editableCellColumnProps = getEditableProps(currentUserRole)
    const punchColumns = [
      {
        field: 'in_time',
        header: 'Punch In',
        body: (rowData: IPunchDetails) =>
          rowData.in_time ? formatInTimeZone(rowData.in_time, data.facility_timezone, 'hh:mm a (z)') : 'Not recorded',
      },
      currentUserRole === 'admin' && {
        field: 'in_notes',
        header: 'In Notes',
        body: (rowData: IPunchDetails) => (rowData.in_notes ? rowData.in_notes : '✎'),
      },
      {
        field: 'out_time',
        header: 'Punch Out',
        body: (rowData: IPunchDetails) =>
          rowData.out_time
            ? formatInTimeZone(rowData.out_time, data.facility_timezone, 'hh:mm a (z)')
            : rowData.in_time && isToday(rowData.in_time)
              ? 'Clocked In'
              : 'Clock Out not recorded',
      },
      currentUserRole === 'admin' && {
        field: 'out_notes',
        header: 'Out Notes',
        body: (rowData: IPunchDetails) => (rowData.out_notes ? rowData.out_notes : '✎'),
      },
    ]

    return (
      <div className="p-4">
        <h5 className="text-sm font-semibold">Punch Details</h5>
        <DataTable value={data.punchesWithDetails} editMode="cell">
          {punchColumns.map(column => {
            if (typeof column === 'object' && column.body != null) {
              return (
                <Column
                  key={column.field}
                  className={cn([commonColumnStyle, editableCellColumnStyle])}
                  field={column.field}
                  header={column.header}
                  body={column.body}
                  {...editableCellColumnProps}
                />
              )
            }
          })}
        </DataTable>
      </div>
    )
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

  return (
    <>
      {isMobile ? <Toolbar start={payPeriodSelectorContent} /> : <Toolbar end={payPeriodSelectorContent} />}

      <DataTable
        header={`Scheduled ${scheduledTimeSum.toFixed(2)} | Total ${totalTimeSum.toFixed(2)} | Difference ${adjustedWorkedScheduledDifference.toFixed(2)} hours`}
        dataKey="timesheet_id"
        value={sortedTimeSheets}
        emptyMessage={isLoading ? 'Loading...' : 'No timesheets found'}
        size="small"
        paginator
        rows={14}
        rowsPerPageOptions={[7, 14, 30, 90]}
        stripedRows
        showGridlines
        expandedRows={expandedRows}
        onRowToggle={e => setExpandedRows(e.data)}
        rowExpansionTemplate={rowExpansionTemplate}
        pt={{
          header: {
            className: 'font-normal text-sm text-gray-500',
          },
        }}>
        <Column expander={allowExpansion} />
        {cols.map(col => (
          <Column key={col.field} field={col.field} header={col.header} body={rowData => getCellValue(col, rowData)} />
        ))}
      </DataTable>
    </>
  )
}
