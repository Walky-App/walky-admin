import { useCallback, useEffect, useMemo, useState } from 'react'

import { Calendar } from 'primereact/calendar'
import { Column, type ColumnEditorOptions, type ColumnEvent } from 'primereact/column'
import { DataTable, type DataTableExpandedRows, type DataTableValueArray } from 'primereact/datatable'
import { type Nullable } from 'primereact/ts-helpers'

import { type ITimeSheet } from '../../../interfaces/timesheet'
import { requestService } from '../../../services/requestServiceNew'
import { useUtils } from '../../../store/useUtils'
import { getCurrentUserRole } from '../../../utils/UserRole'
import { cn } from '../../../utils/cn'
import { formatTime, isTodaysDateSameAsTimeStamp } from '../../../utils/timeUtils'
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

export const UserTimesheetsTable: React.FC<IUserTimesheetsProps> = ({ selectedUserId }) => {
  const [processedTimeSheets, setProcessedTimeSheets] = useState<IPunchPairsWithData[]>([])
  const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | DataTableValueArray | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<Nullable<Date>>(null)

  const { showToast } = useUtils()

  const currentUserRole = getCurrentUserRole()

  const fetchTimesheets = useCallback(async () => {
    if (!selectedUserId) {
      console.error('selectedUserId is undefined')
      return
    }
    const { access_token } = GetTokenInfo()
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

        const punchPairsAndData: IPunchPairsWithData[] = timesheets.map(timeSheet => {
          return processPunchPairsWithData(timeSheet.punches, timeSheet.job_id)
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
      case 'in_time':
        timeStamp = options.value ? in_time_stamp : new Date().toISOString()
        break
      default:
        timeStamp = options.value ? out_time_stamp : new Date().toISOString()
        break
    }

    const initialTimeValue = selectedTime || new Date(timeStamp)

    return (
      <Calendar
        value={initialTimeValue}
        hourFormat="12"
        onChange={e => {
          if (e.value) {
            const newTime = e.value
            const oldDate = new Date(timeStamp)
            const updatedDate = new Date(
              oldDate.getFullYear(),
              oldDate.getMonth(),
              oldDate.getDate(),
              newTime.getHours(),
              newTime.getMinutes(),
              newTime.getSeconds(),
            )

            setSelectedTime(updatedDate)
            options.editorCallback!(updatedDate)
          }
        }}
        timeOnly
      />
    )
  }

  const onCellEditComplete = async (e: ColumnEvent) => {
    try {
      const { rowData, newValue, field } = e as { rowData: IPunchPair; newValue: string; field: string }

      const isFieldInTime = field === 'in_time'
      const isFieldOutTime = field === 'out_time'

      if ((isFieldInTime && newValue === rowData.in_time) || (isFieldOutTime && newValue === rowData.out_time)) {
        return
      }

      if (isFieldInTime || isFieldOutTime) {
        const newTimeStamp = newValue
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
          detail: formatTime(newTimeStamp),
        })

        fetchTimesheets()
        setSelectedTime(null)
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

    if (field === 'out_time' && (!rowData[field] || rowData[field] === '')) {
      return isTodaysDateSameAsTimeStamp(rowData['in_time']) ? 'Clocked In' : 'Clock Out not recorded'
    } else if (field === 'total_time' && (!rowData['out_time'] || rowData['out_time'] === '')) {
      return ''
    } else {
      const value = rowData[field]
      if (Array.isArray(value)) {
        return value.map((punch: IPunchDetails) => punch[field as keyof IPunchDetails]).join(', ')
      } else {
        return value
      }
    }
  }

  const allowExpansion = (rowData: IPunchPairsWithData) => {
    return !rowData['out_time'] || rowData['out_time'] !== ''
  }

  const getEditableProps = (currentUserRole: string) => {
    if (currentUserRole === 'admin') {
      return {
        editor: (options: ColumnEditorOptions) => timeEditor(options),
        onCellEditComplete: onCellEditComplete,
        onCellEditCancel: () => setSelectedTime(null),
      }
    }
    return {}
  }

  const rowExpansionTemplate = (data: IPunchPairsWithData) => {
    const commonColumnStyle = 'w-1/12'
    const editableCellColumnStyle = currentUserRole === 'admin' ? 'cursor-pointer hover:text-primary' : ''
    const editableCellColumnProps = getEditableProps(currentUserRole)
    const punchColumns = [
      {
        field: 'in_time',
        header: 'Punch In',
      },
      {
        field: 'out_time',
        header: 'Punch Out',
        body: (rowData: IPunchDetails) =>
          rowData.out_time
            ? rowData.out_time
            : isTodaysDateSameAsTimeStamp(rowData.in_time)
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
          <Column className={cn([commonColumnStyle, 'w-4/12'])} field="total_time" header="Total Hours" />
        </DataTable>
      </div>
    )
  }
  const totalTimeSum = sortedTimeSheets.reduce((sum, record) => {
    const hours = parseFloat(record.total_time)
    return sum + hours
  }, 0)

  const totalTimeSumString = totalTimeSum.toFixed(2)

  return (
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
  )
}
