import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { Calendar } from 'primereact/calendar'
import { Column, type ColumnEvent, type ColumnEditorOptions } from 'primereact/column'
import { DataTable, type DataTableExpandedRows, type DataTableValueArray } from 'primereact/datatable'
import { type Nullable } from 'primereact/ts-helpers'

import { type ITimeSheet } from '../../../../interfaces/timesheet'
import { requestService } from '../../../../services/requestServiceNew'
import { useUtils } from '../../../../store/useUtils'
import { cn } from '../../../../utils/cn'
import { GetTokenInfo } from '../../../../utils/tokenUtil'
import { useAdminUserContext } from '../AdminUserPage'

interface IPunchDetails {
  in_time: string
  out_time: string
  total_time: string
}

interface IPunchPair {
  _id: string
  day: string
  in_time: string
  out_time: string
  in_time_stamp: string
  out_time_stamp: string
  total_time: string
  timesheet_id: string
}
interface IProcessedTimeSheet {
  time_stamp: string
  day: string
  in_time: string
  out_time: string
  total_time: string
  details: string
  worked_time: string
  scheduled_time: string
  difference: string
  punchesWithDetails: IPunchDetails[]
}

export const AdminUserTimeSheets = () => {
  const [processedTimeSheets, setProcessedTimeSheets] = useState<IProcessedTimeSheet[]>([])
  const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | DataTableValueArray | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<Nullable<Date>>(null)
  const timeStampRef = useRef<string | null>(null)

  const { showToast } = useUtils()

  const { selectedUserId } = useAdminUserContext()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }
  function formatTime(timeStamp: string | number) {
    const date = new Date(timeStamp)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
  }

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
        const data: ITimeSheet[] = await response.json()

        const processedData: IProcessedTimeSheet[] = data.map(timeSheet => {
          const sortedPunches = [...timeSheet.punches].sort(
            (a, b) => new Date(a.time_stamp).getTime() - new Date(b.time_stamp).getTime(),
          )

          let totalWorkedTime = 0
          let punchIn = null
          let inTime = ''
          let outTime = ''
          for (const punch of sortedPunches) {
            if (punch.punch_in) {
              punchIn = punch
              if (!inTime) {
                inTime = formatTime(punch.time_stamp)
              }
              outTime = ''
            } else if (punchIn) {
              const totalTime = Date.parse(punch.time_stamp) - Date.parse(punchIn.time_stamp)
              totalWorkedTime += totalTime
              outTime = formatTime(punch.time_stamp)
              punchIn = null
            }
          }

          if (!outTime && punchIn) {
            const totalTime = Date.now() - Date.parse(punchIn.time_stamp)
            totalWorkedTime += totalTime
          }

          const totalWorkedHours = totalWorkedTime / 1000 / 60 / 60

          const day = formatDate(sortedPunches[0].time_stamp)

          return {
            time_stamp: sortedPunches[0].time_stamp,
            day,
            in_time: inTime,
            out_time: outTime,
            total_time: totalWorkedHours.toFixed(2), // total worked hours
            details: timeSheet.job_id, // generate details
            worked_time: totalWorkedHours.toFixed(2), // total worked hours
            scheduled_time: '', // calculate scheduled
            difference: '', // calculate difference
            punchesWithDetails: (() => {
              const punchPairs: IPunchPair[] = [] as IPunchPair[]
              let punchIn = null

              for (const punch of sortedPunches) {
                if (punch.punch_in) {
                  punchIn = punch
                } else if (punchIn) {
                  const totalTime = Date.parse(punch.time_stamp) - Date.parse(punchIn.time_stamp)
                  punchPairs.push({
                    _id: punch._id,
                    day: formatDate(punch.time_stamp),
                    in_time: formatTime(punchIn.time_stamp),
                    out_time: formatTime(punch.time_stamp),
                    in_time_stamp: punchIn.time_stamp,
                    out_time_stamp: punch.time_stamp,
                    total_time: (totalTime / 1000 / 60 / 60).toFixed(2), // total time in hours
                    timesheet_id: timeSheet._id,
                  })
                  punchIn = null
                }
              }

              // If there's a punch-in without a corresponding punch-out, calculate the total time until now
              if (punchIn) {
                const totalTime = Date.now() - Date.parse(punchIn.time_stamp)
                punchPairs.push({
                  _id: punchIn._id,
                  day: formatDate(punchIn.time_stamp),
                  in_time: formatTime(punchIn.time_stamp),
                  out_time: '',
                  in_time_stamp: punchIn.time_stamp,
                  out_time_stamp: '',
                  total_time: (totalTime / 1000 / 60 / 60).toFixed(2), // total time in hours
                  timesheet_id: timeSheet._id,
                })
              }

              return punchPairs
            })(),
          } as IProcessedTimeSheet
        })
        setProcessedTimeSheets(processedData)
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

  interface IColumnMeta<T> {
    field: keyof T
    header: string
    sortable?: boolean
    editor?: (options: ColumnEditorOptions) => React.ReactNode
  }

  const timeEditor = (options: ColumnEditorOptions) => {
    const { in_time_stamp, out_time_stamp } = options.rowData as IPunchPair

    let timeStamp: string
    if (options.field === 'in_time') {
      timeStamp = in_time_stamp
    } else {
      timeStamp = out_time_stamp
    }

    if (timeStamp !== timeStampRef.current) {
      timeStampRef.current = timeStamp
      if (timeStamp && !isNaN(Date.parse(timeStamp))) {
        setTimeout(() => setSelectedTime(new Date(timeStamp)), 0)
      }
    }

    return (
      <Calendar
        value={selectedTime}
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

            setTimeout(() => setSelectedTime(updatedDate), 0)
            options.editorCallback!(updatedDate)
          }
        }}
        timeOnly
      />
    )
  }

  const onCellEditComplete = async (e: ColumnEvent) => {
    const { rowData, newValue, field } = e as { rowData: IPunchPair; newValue: string; field: string }

    const isFieldInTime = field === 'in_time'
    const isFieldOutTime = field === 'out_time'

    if ((isFieldInTime && newValue === rowData.in_time) || (isFieldOutTime && newValue === rowData.out_time)) {
      return
    }

    if (isFieldInTime || isFieldOutTime) {
      const newTimeStamp = newValue
      const punchId = rowData._id
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
        throw new Error(message)
      } else {
        showToast({
          severity: 'success',
          summary: `Updated ${isFieldInTime ? 'In' : 'Out'} time`,
          detail: formatTime(newTimeStamp),
        })
      }

      fetchTimesheets()
    }
  }

  const cols: IColumnMeta<IProcessedTimeSheet>[] = [
    { field: 'day', header: 'Day', sortable: true },
    { field: 'in_time', header: 'In', sortable: false },
    { field: 'out_time', header: 'Out', sortable: false },
    { field: 'total_time', header: 'Total', sortable: false },
    { field: 'details', header: 'Job Details', sortable: false },
    { field: 'worked_time', header: 'Worked', sortable: false },
    { field: 'scheduled_time', header: 'Scheduled', sortable: false },
    { field: 'difference', header: 'Difference', sortable: false },
  ]

  const getCellValue = (col: IColumnMeta<IProcessedTimeSheet>, rowData: IProcessedTimeSheet) => {
    const field = col.field as keyof IProcessedTimeSheet

    if (field === 'out_time' && (!rowData[field] || rowData[field] === '')) {
      return 'Clocked in'
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

  const allowExpansion = (rowData: IProcessedTimeSheet) => {
    return !rowData['out_time'] || rowData['out_time'] !== ''
  }

  const rowExpansionTemplate = (data: IProcessedTimeSheet) => {
    const commonColumnStyle = 'w-1/12'
    return (
      <div className="p-4">
        <h5 className="text-sm font-semibold">Punch Details</h5>
        <DataTable value={data.punchesWithDetails} sortField="in_time" sortOrder={-1} editMode="cell">
          <Column className={cn([commonColumnStyle])} field="day" header="Day" />
          <Column
            className={cn([commonColumnStyle])}
            field="in_time"
            header="In (✎)"
            editor={options => timeEditor(options)}
            onCellEditComplete={onCellEditComplete}
            onCellEditCancel={() => setSelectedTime(null)}
          />
          <Column
            className={cn([commonColumnStyle])}
            field="out_time"
            header="Out (✎)"
            body={(rowData: IPunchDetails) => rowData.out_time || 'Clocked In'}
            editor={options => timeEditor(options)}
            onCellEditComplete={onCellEditComplete}
            onCellEditCancel={() => setSelectedTime(null)}
          />
          <Column className={cn([commonColumnStyle, 'w-4/12'])} field="total_time" header="Total" />
        </DataTable>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <DataTable
        header="Daily Timesheets"
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
        rowExpansionTemplate={rowExpansionTemplate}>
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
    </div>
  )
}
