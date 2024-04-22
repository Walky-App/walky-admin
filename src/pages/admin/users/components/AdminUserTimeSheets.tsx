import React, { useEffect, useMemo, useState } from 'react'

import { Calendar } from 'primereact/calendar'
import { Column, type ColumnEditorOptions } from 'primereact/column'
import { DataTable, type DataTableExpandedRows, type DataTableValueArray } from 'primereact/datatable'

import { type ITimeSheet } from '../../../../interfaces/timesheet'
import { GetTokenInfo } from '../../../../utils/TokenUtils'
import { useAdminUserContext } from '../AdminUserPage'

interface IPunchDetails {
  in_time: string
  out_time: string
  total_time: string
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

  const { selectedUserId } = useAdminUserContext()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }
  function formatTime(timeStamp: string | number) {
    const date = new Date(timeStamp)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
  }

  useEffect(() => {
    const fetchTimeSheets = async () => {
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
                const punchPairs = []
                let punchIn = null

                for (const punch of sortedPunches) {
                  if (punch.punch_in) {
                    punchIn = punch
                  } else if (punchIn) {
                    const totalTime = Date.parse(punch.time_stamp) - Date.parse(punchIn.time_stamp)
                    punchPairs.push({
                      in_time: formatTime(punchIn.time_stamp),
                      out_time: formatTime(punch.time_stamp),
                      total_time: (totalTime / 1000 / 60 / 60).toFixed(2), // total time in hours
                    })
                    punchIn = null
                  }
                }

                // If there's a punch-in without a corresponding punch-out, calculate the total time until now
                if (punchIn) {
                  const totalTime = Date.now() - Date.parse(punchIn.time_stamp)
                  punchPairs.push({
                    in_time: formatTime(punchIn.time_stamp),
                    out_time: '',
                    total_time: (totalTime / 1000 / 60 / 60).toFixed(2), // total time in hours
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
    }
    fetchTimeSheets()
  }, [selectedUserId])

  const sortedTimeSheets = useMemo(() => {
    return [...processedTimeSheets].sort((a, b) => new Date(b.time_stamp).getTime() - new Date(a.time_stamp).getTime())
  }, [processedTimeSheets])

  // const textEditor = (options: ColumnEditorOptions) => {
  //   return (
  //     <InputText
  //       type="text"
  //       value={options.value}
  //       onChange={(e: React.ChangeEvent<HTMLInputElement>) => options.editorCallback!(e.target.value)}
  //     />
  //   )
  // }

  const timeEditor = (options: ColumnEditorOptions) => {
    return <Calendar value={options.value} onChange={e => options.editorCallback!(e.target.value)} timeOnly />
  }

  interface IColumnMeta<T> {
    field: keyof T
    header: string
    sortable?: boolean
    editor?: (options: ColumnEditorOptions) => React.ReactNode
  }

  const cols: IColumnMeta<IProcessedTimeSheet>[] = [
    { field: 'day', header: 'Day', sortable: true },
    { field: 'in_time', header: 'In', sortable: false, editor: timeEditor },
    { field: 'out_time', header: 'Out', sortable: false, editor: timeEditor },
    { field: 'total_time', header: 'Total', sortable: false },
    { field: 'details', header: 'Job Details', sortable: false },
    { field: 'worked_time', header: 'Worked', sortable: false },
    { field: 'scheduled_time', header: 'Scheduled', sortable: false },
    { field: 'difference', header: 'Difference', sortable: false },
  ]

  const getEditor = (col: IColumnMeta<IProcessedTimeSheet>) => {
    if (col.field === 'in_time' || col.field === 'out_time') {
      return (options: ColumnEditorOptions) => (col.editor ? col.editor(options) : undefined)
    }
    return undefined
  }

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
    return (
      <div className="p-4">
        <h5 className="text-sm font-semibold">Punch Details</h5>
        <DataTable value={data.punchesWithDetails}>
          <Column field="in_time" header="In" />
          <Column field="out_time" header="Out" />
          <Column field="total_time" header="Total" />
        </DataTable>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <DataTable
        header="Daily Timesheets"
        value={sortedTimeSheets}
        editMode="row"
        tableStyle={{ minWidth: '50rem' }}
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
            editor={getEditor(col)}
          />
        ))}
        <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }} />
      </DataTable>
    </div>
  )
}
