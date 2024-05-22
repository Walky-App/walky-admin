import { useCallback, useEffect, useMemo, useState } from 'react'

import { useMediaQuery } from 'react-responsive'

import { format, isToday, isValid } from 'date-fns'
import { Calendar } from 'primereact/calendar'
import { Column, type ColumnEditorOptions, type ColumnEvent } from 'primereact/column'
import { DataTable, type DataTableExpandedRows, type DataTableValueArray } from 'primereact/datatable'
import { Dropdown } from 'primereact/dropdown'
import { Toolbar } from 'primereact/toolbar'

import { type ITimeSheet } from '../../../interfaces/timesheet'
import { requestService } from '../../../services/requestServiceNew'
import { useUtils } from '../../../store/useUtils'
import { getCurrentUserRole } from '../../../utils/UserRole'
import { cn } from '../../../utils/cn'
import { formatToDateTime, formatToTime } from '../../../utils/timeUtils'
import { HtInputLabel } from '../forms/HtInputLabel'
import {
  type IPunchPair,
  processPunchPairsWithData,
  type IAdminUserTimesheetsColumnMeta,
  type IPunchDetails,
  type IPunchPairsWithData,
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
  { field: 'total_time', header: 'Total Hours', sortable: false },
  { field: 'details', header: 'Job Details', sortable: false },
  { field: 'worked_time', header: 'Worked Hours', sortable: false },
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

  const currentUserRole = getCurrentUserRole()

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
          const timesheets: ITimeSheet[] = await response.json()

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

    const cellTimeValue = options.value || new Date(timeStamp)

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

  const onCellEditComplete = async (e: ColumnEvent) => {
    try {
      const { rowData, newValue, field } = e as { rowData: IPunchPair; newValue: Date | null; field: string }

      const isFieldInTime = field === 'in_time'
      const isFieldOutTime = field === 'out_time'

      if (newValue) {
        const newValueDateString = newValue.toISOString()
        const formattedNewValue = formatToDateTime(newValueDateString)

        if (
          (isFieldInTime && rowData.in_time && formattedNewValue === format(rowData.in_time, 'hh:mm a')) ||
          (isFieldOutTime && rowData.out_time && formattedNewValue === format(rowData.out_time, 'hh:mm a'))
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

        if (isFieldInTime || isFieldOutTime) {
          const newTimeStamp: string = newValue.toISOString()
          const punchId = isFieldInTime ? rowData.in_id : rowData.out_id
          const timeSheetId = rowData.timesheet_id

          const body = isFieldInTime
            ? { punch_in_id: punchId, new_time_stamp_in: newTimeStamp }
            : { punch_out_id: punchId, new_time_stamp_out: newTimeStamp }

          const response = await requestService({
            path: `timesheets/${timeSheetId}/in-out-punches`,
            method: 'PATCH',
            body: JSON.stringify(body),
          })

          if (!response.ok) {
            const message = await response.text()
            showToast({ severity: 'error', summary: 'Error', detail: message })
            return
          }

          showToast({
            severity: 'success',
            summary: `Updated ${isFieldInTime ? 'In' : 'Out'} time`,
            detail: formatToTime(newTimeStamp),
          })

          if (selectedPayPeriod) {
            fetchTimesheets(selectedPayPeriod)
          } else {
            showToast({ severity: 'error', summary: 'Error', detail: 'No selected pay period' })
          }
        }
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
        editor: (options: ColumnEditorOptions) => timeEditor(options),
        onCellEditComplete: onCellEditComplete,
      }
    }
    return {}
  }

  const rowExpansionTemplate = (data: IPunchPairsWithData) => {
    const commonColumnStyle = 'w-3/12'
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
    ]

    return (
      <div className="p-4">
        <h5 className="text-sm font-semibold">Punch Details</h5>
        <DataTable value={data.punchesWithDetails} sortField="in_time" sortOrder={-1} editMode="cell">
          <Column className={cn([commonColumnStyle])} field="day" header="Day" />
          {punchColumns.map(({ field, header, body }) => (
            <Column
              key={field}
              className={cn([commonColumnStyle, editableCellColumnStyle])}
              field={field}
              header={`${header} ${currentUserRole === 'admin' ? '(✎)' : ''}`}
              body={body}
              {...editableCellColumnProps}
            />
          ))}
          <Column className={cn([commonColumnStyle, 'w-3/12'])} field="total_time" header="Total Hours" />
        </DataTable>
      </div>
    )
  }

  const totalTimeSum = sortedTimeSheets.reduce((sum, record) => {
    const hours = parseFloat(record.total_time)
    return sum + hours
  }, 0)

  const totalTimeSumString = totalTimeSum.toFixed(2)

  const startContent = (
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
      {isMobile ? <Toolbar start={startContent} /> : <Toolbar end={startContent} />}

      <DataTable
        header={`Regular ${totalTimeSumString} | Scheduled 0.00 | Difference 0.00`}
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
