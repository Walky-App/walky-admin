import { useCallback, useEffect, useMemo, useState } from 'react'

import { endOfWeek, format, isToday, isValid, startOfWeek } from 'date-fns'
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
import { GetTokenInfo } from '../../../utils/tokenUtil'
import {
  type IPunchPair,
  processPunchPairsWithData,
  type IAdminUserTimesheetsColumnMeta,
  type IPunchDetails,
  type IPunchPairsWithData,
} from './timesheetsUtils'

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

interface IUserTimesheetsProps {
  selectedUserId: string
}

// const generatePayPeriods = () => {
//   const now = new Date()
//   const startOfCurrentWeek = startOfWeek(now, { weekStartsOn: 1 })
//   const endOfCurrentWeek = endOfWeek(now, { weekStartsOn: 1 })
//   const startOfPreviousWeek = subWeeks(startOfCurrentWeek, 1)
//   const endOfPreviousWeek = subWeeks(endOfCurrentWeek, 1)
//   const startOfNextWeek = addWeeks(startOfCurrentWeek, 1)
//   const endOfNextWeek = addWeeks(endOfCurrentWeek, 1)

//   return {
//     current: `${format(startOfCurrentWeek, 'MMM dd')} - ${format(endOfCurrentWeek, 'MMM dd, yyyy')}`,
//     previous: `${format(startOfPreviousWeek, 'MMM dd')} - ${format(endOfPreviousWeek, 'MMM dd, yyyy')}`,
//     next: `${format(startOfNextWeek, 'MMM dd')} - ${format(endOfNextWeek, 'MMM dd, yyyy')}`,
//   }
// }

const generateAllPayPeriods = (timeSheets: IPunchPairsWithData[]) => {
  return timeSheets.reduce(
    (acc, sheet) => {
      const date = new Date(sheet.day)
      const startOfWeekDate = startOfWeek(date, { weekStartsOn: 1 })
      const endOfWeekDate = endOfWeek(date, { weekStartsOn: 1 })

      const payPeriod = `${format(startOfWeekDate, 'MMM dd')} - ${format(endOfWeekDate, 'MMM dd, yyyy')}`

      if (!acc[payPeriod]) {
        acc[payPeriod] = payPeriod
      }

      return acc
    },
    {} as Record<string, string>,
  )
}

export const UserTimesheetsTable: React.FC<IUserTimesheetsProps> = ({ selectedUserId }) => {
  const [processedTimeSheets, setProcessedTimeSheets] = useState<IPunchPairsWithData[]>([])
  const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | DataTableValueArray | undefined>(undefined)
  const [isEditorValid, setIsEditorValid] = useState(false)

  // lets create a dropdown using the primereact dropdown component and use it to filter the timesheets visible in the table based on the 2 week pay period, for example like April 21 - May 04, 2024
  // the dropdown should be able to filter the timesheets based on the pay period selected
  // the pay period should be generated dynamically based on the current date
  // the pay period should be generated in the format "MMM dd - MMM dd, yyyy"
  // the dropdown should have the following options:
  // - Current Pay Period
  // - Previous Pay Period
  // - Next Pay Period
  // - Custom Pay Period
  // - All Pay Periods
  // the default selected option should be "Current Pay Period"
  // the dropdown should be placed above the table
  // the dropdown should have a label "Pay Period"

  const [payPeriods, setPayPeriods] = useState({} as Record<string, string>)
  const [selectedPayPeriod, setSelectedPayPeriod] = useState('')

  // const payPeriodOptions = [
  //   { label: `Current Pay Period (${payPeriods.current})`, value: 'current' },
  //   { label: `Previous Pay Period (${payPeriods.previous})`, value: 'previous' },
  //   { label: `Next Pay Period (${payPeriods.next})`, value: 'next' },
  //   { label: 'Custom Pay Period', value: 'custom' },
  //   { label: 'All Pay Periods', value: 'all' },
  // ]

  const payPeriodOptions = Object.keys(payPeriods).map(period => ({ label: period, value: period }))
  payPeriodOptions.unshift({ label: 'All Pay Periods', value: 'all' })

  useEffect(() => {
    const allPayPeriods = generateAllPayPeriods(processedTimeSheets)
    setPayPeriods(allPayPeriods)
  }, [processedTimeSheets])

  const { showToast } = useUtils()

  const currentUserRole = getCurrentUserRole()

  const fetchTimesheets = useCallback(async () => {
    if (!selectedUserId) {
      console.error('selectedUserId is undefined')
      return
    }
    const { access_token } = GetTokenInfo()

    // const { start, end } = payPeriods[selectedPayPeriod]

    const url = `${process.env.REACT_APP_PUBLIC_API}/timesheets/employee/${selectedUserId}`

    const options: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
    }

    try {
      const response = await fetch(url, options)

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
    }
  }, [selectedUserId])

  useEffect(() => {
    fetchTimesheets()
  }, [fetchTimesheets, selectedUserId])

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

          fetchTimesheets()
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
    <Dropdown
      value={selectedPayPeriod}
      options={payPeriodOptions}
      onChange={e => setSelectedPayPeriod(e.value)}
      placeholder="Select a pay period"
    />
  )

  return (
    <>
      <Toolbar end={startContent} />

      <DataTable
        header={`Regular ${totalTimeSumString} | Scheduled 0.00 | Difference 0.00`}
        dataKey="time_stamp"
        value={sortedTimeSheets}
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
