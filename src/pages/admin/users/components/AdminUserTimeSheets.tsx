import React, { useEffect, useMemo, useState } from 'react'

import { Calendar } from 'primereact/calendar'
import { Column, type ColumnEditorOptions } from 'primereact/column'
import { DataTable } from 'primereact/datatable'

import { type ITimeSheet } from '../../../../interfaces/timesheet'
import { GetTokenInfo } from '../../../../utils/TokenUtils'
import { useAdminUserContext } from '../AdminUserPage'

interface IProcessedTimeSheet {
  day: string
  in: string
  out: string
  total: string
  details: string
  worked: string
  scheduled: string
  difference: string
}

export const AdminUserTimeSheets = () => {
  const [timeSheets, setTimeSheets] = useState<ITimeSheet[]>([])
  const [processedTimeSheets, setProcessedTimeSheets] = useState<IProcessedTimeSheet[]>([])

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
          setTimeSheets([])
        } else {
          const data: ITimeSheet[] = await response.json()
          setTimeSheets(data)

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

            const totalWorkedHours = totalWorkedTime / 1000 / 60 / 60

            const day = formatDate(sortedPunches[0].time_stamp)

            return {
              day,
              in: inTime,
              out: outTime,
              total: totalWorkedHours.toFixed(2), // total worked hours
              details: timeSheet.job_id, // generate details
              worked: totalWorkedHours.toFixed(2), // total worked hours
              scheduled: '', // calculate scheduled
              difference: '', // calculate difference
            }
          })
          setProcessedTimeSheets(processedData)
        }
      } catch (error) {
        console.error('Failed to fetch timesheet:', error)
        setTimeSheets([])
      }
    }
    fetchTimeSheets()
  }, [selectedUserId])

  const sortedTimeSheets = useMemo(() => {
    return [...processedTimeSheets].sort((a, b) => new Date(b.day).getTime() - new Date(a.day).getTime())
  }, [processedTimeSheets])

  interface IColumnMeta {
    field: string
    header: string
    sortable?: boolean
    editor?: (options: ColumnEditorOptions) => React.ReactNode
  }

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

  const cols: IColumnMeta[] = [
    { field: 'day', header: 'Day', sortable: true },
    { field: 'in', header: 'In', sortable: false, editor: timeEditor },
    { field: 'out', header: 'Out', sortable: false, editor: timeEditor },
    { field: 'total', header: 'Total', sortable: false },
    { field: 'details', header: 'Job Details', sortable: false },
    { field: 'worked', header: 'Worked', sortable: false },
    { field: 'scheduled', header: 'Scheduled', sortable: false },
    { field: 'difference', header: 'Difference', sortable: false },
  ]

  const getEditor = (col: IColumnMeta) => {
    if (col.field === 'in' || col.field === 'out') {
      return (options: ColumnEditorOptions) => (col.editor ? col.editor(options) : undefined)
    }
    return undefined
  }

  return (
    <div className="flex flex-col gap-4">
      <DataTable value={sortedTimeSheets} editMode="row" tableStyle={{ minWidth: '50rem' }}>
        {cols.map(col => (
          <Column
            key={col.field}
            field={col.field}
            header={col.header}
            body={rowData =>
              col.field === 'out' && (!rowData[col.field] || rowData[col.field] === '')
                ? 'Clocked in'
                : rowData[col.field]
            }
            sortable={col.sortable}
            editor={getEditor(col)}
          />
        ))}
        <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }} />
      </DataTable>
      {timeSheets !== null ? <pre>{JSON.stringify(timeSheets, null, 3)}</pre> : null}
    </div>
  )
}
