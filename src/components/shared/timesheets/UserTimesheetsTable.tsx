import { useCallback, useEffect, useMemo, useState } from 'react'

import { useMediaQuery } from 'react-responsive'

import { format, isToday, isValid } from 'date-fns'
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
import { formatToDateTime, formatToTime } from '../../../utils/timeUtils'
import { HtInputLabel } from '../forms/HtInputLabel'
import { HtInfoTooltip } from '../general/HtInfoTooltip'
import {
  type IPunchPair,
  processPunchPairsWithData,
  type IAdminUserTimesheetsColumnMeta,
  type IPunchDetails,
  type IPunchPairsWithData,
  type ITimesheetWithJobDetails,
  formatDifference,
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
  { field: 'day', header: 'Day', sortable: true },
  { field: 'in_time', header: 'First In', sortable: false },
  { field: 'out_time', header: 'Last Out', sortable: false },
  {
    field: 'details',
    header: <HtInfoTooltip message="Lunch break, Job title, Facility name">Job Details</HtInfoTooltip>,
    sortable: false,
  },
  { field: 'worked_time', header: 'Total Hours', sortable: false },
  { field: 'scheduled_time', header: 'Scheduled Hours', sortable: false },
  { field: 'difference', header: 'Difference', sortable: false },
]

export const UserTimesheetsTable: React.FC<IUserTimesheetsProps> = ({ selectedUserId }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [processedTimeSheets, setProcessedTimeSheets] = useState<IPunchPairsWithData[]>([])
  const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | DataTableValueArray | undefined>(undefined)
  const [isEditorValid, setIsEditorValid] = useState(false)
  const [payPeriods, setPayPeriods] = useState([] as IPayPeriod[])
  const [selectedPayPeriod, setSelectedPayPeriod] = useState<IPayPeriod>()

  const { showToast } = useUtils()

  const currentUserRole = roleChecker()

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })

  const fetchPayPeriodsByEmployee = useCallback(async () => {
    setIsLoading(true)

    if (!selectedUserId) {
      console.error('selectedUserId is undefined')
      return
    }

    const pathString = `timesheets/employee/${selectedUserId}/pay-periods`

    let initialSelectedPayPeriod

    try {
      const response = await requestService({ path: pathString })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const payPeriods: IPayPeriod[] = await response.json()

      const noPayPeriodsObject = { label: 'No pay periods found', start: '', end: '' }

      const [newPayPeriods, newSelectedPayPeriod] =
        payPeriods.length > 0 ? [payPeriods, payPeriods[0]] : [[noPayPeriodsObject], noPayPeriodsObject]

      initialSelectedPayPeriod = newSelectedPayPeriod
      setPayPeriods(newPayPeriods)
      setSelectedPayPeriod(newSelectedPayPeriod)
    } catch (error) {
      console.error('Failed to fetch pay periods:', error)
    } finally {
      setIsLoading(false)
    }

    return initialSelectedPayPeriod
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
    if (selectedPayPeriod) {
      fetchTimesheets(selectedPayPeriod)
    }
  }, [selectedPayPeriod, fetchTimesheets])

  const sortedTimeSheets = useMemo(() => {
    return [...processedTimeSheets].sort((a, b) => new Date(b.time_stamp).getTime() - new Date(a.time_stamp).getTime())
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

    return (
      <Calendar
        value={cellTimeValue}
        hourFormat="12"
        invalid={!isEditorValid}
        onChange={e => {
          const newValue = e.value as Date
          const isValidDate = newValue !== null && isValid(newValue)
          if (isValidDate) {
            options.editorCallback!(newValue)
            setIsEditorValid(true)
          } else {
            setIsEditorValid(false)
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
      const { rowData, newValue, field } = e as { rowData: IPunchPair; newValue: Date | string | null; field: string }

      if (newValue == null) return

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

          if (!isEditorValid) {
            showToast({
              severity: 'error',
              summary: 'Invalid date/time value',
              detail: 'Please use correct format (mm/dd/yyyy hh:mm)',
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
                detail: formatToTime(newTimeStamp),
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
        return format(value, 'hh:mm a')
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
          rowData.in_time
            ? rowData.in_time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            : 'Not recorded',
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
            ? rowData.out_time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
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
        <DataTable value={data.punchesWithDetails} sortField="in_time" sortOrder={-1} editMode="cell">
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
          <Column className={cn([commonColumnStyle])} field="total_time" header="Total Hours" />
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
        header={`Regular ${totalTimeSum.toFixed(2)} | Scheduled ${scheduledTimeSum.toFixed(2)} | Difference ${formatDifference(workedScheduledDifference)}`}
        dataKey="time_stamp"
        value={sortedTimeSheets}
        emptyMessage={isLoading ? 'Loading...' : 'No timesheets found'}
        tableStyle={{ minWidth: '50rem' }}
        size="small"
        paginator
        rows={14}
        rowsPerPageOptions={[7, 14, 30, 90]}
        stripedRows
        showGridlines
        resizableColumns
        columnResizeMode="fit"
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
          <Column
            key={col.field}
            field={col.field}
            header={col.header}
            body={rowData => getCellValue(col, rowData)}
            sortable={col.sortable}
          />
        ))}
      </DataTable>
    </>
  )
}
