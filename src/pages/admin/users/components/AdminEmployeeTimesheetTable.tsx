import { useCallback, useEffect, useMemo, useState } from 'react'

import { format, isAfter, isBefore, isEqual, isToday, isValid, parse } from 'date-fns'
import { formatInTimeZone, fromZonedTime, toZonedTime } from 'date-fns-tz'
import { Avatar } from 'primereact/avatar'
import { Calendar } from 'primereact/calendar'
import { Column, type ColumnEditorOptions, type ColumnEvent } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'

import { HtInputLabel } from '../../../../components/shared/forms/HtInputLabel'
import {
  processPunchPairsWithData,
  type IAdminUserTimesheetsColumnMeta,
  type IPunchPairsWithData,
  type ITimesheetWithJobAndShiftDetails,
  lunchTimeTemplate,
  jobTitleTemplate,
  facilityNameTemplate,
  combineDayAndTimeUTC,
} from '../../../../components/shared/timesheets/timesheetsUtils'
import { type IUser } from '../../../../interfaces/User'
import { type IToastParameters } from '../../../../interfaces/global'
import { type IPayPeriod } from '../../../../interfaces/timesheet'
import { requestService } from '../../../../services/requestServiceNew'
import { useUtils } from '../../../../store/useUtils'
import { roleChecker } from '../../../../utils/roleChecker'

export const AdminEmployeeTimesheetTable = ({ selectedUser = undefined }: { selectedUser: IUser | undefined }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [processedTimeSheets, setProcessedTimeSheets] = useState<IPunchPairsWithData[]>([])
  const [payPeriods, setPayPeriods] = useState([] as IPayPeriod[])
  const [selectedPayPeriod, setSelectedPayPeriod] = useState<IPayPeriod>()

  const { showToast } = useUtils()

  const currentUserRole = roleChecker()

  const fetchPayPeriodsByEmployee = useCallback(async () => {
    setIsLoading(true)

    const pathString = `timesheets/employee/${selectedUser?._id}/pay-periods`
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
  }, [selectedUser])

  const fetchTimesheets = useCallback(
    async (selectedPayPeriod: IPayPeriod) => {
      setIsLoading(true)

      setProcessedTimeSheets([])

      const selectedPayPeriodStart = selectedPayPeriod?.start
      const selectedPayPeriodEnd = selectedPayPeriod?.end

      const pathString = `timesheets/employee/${selectedUser?._id}/pay-period?start=${selectedPayPeriodStart}&end=${selectedPayPeriodEnd}`

      try {
        const response = await requestService({ path: pathString })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        if (response.status === 204) {
          console.error('No timesheets found')
        } else {
          const data = await response.json()

          const punchPairsAndData = data.timesheetsResults.map((timesheet: ITimesheetWithJobAndShiftDetails) => {
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
    [selectedUser],
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

    const showInvalidDateTimeToast = (summary: string, detail: string) => {
      showToast({
        severity: 'warn',
        summary,
        detail,
      })
    }

    try {
      if (newValue == null) {
        showInvalidDateTimeToast('Invalid date/time value or no change', 'Please use correct format (h:mma/p)')
        return
      }

      const isNewValueSameAsInitial = value != null && isEqual(newValue, value)
      const isNewValueAfterPunchOutTime = rowData.out_time != null && isAfter(newValue, rowData.out_time)
      const isNewValueBeforePunchInTime = rowData.in_time != null && isBefore(newValue, rowData.in_time)

      if (field === 'in_time') {
        if (isNewValueAfterPunchOutTime) {
          showInvalidDateTimeToast('Invalid date/time value', 'Punch-In must be before existing Punch-Out time')
          return
        }

        if (isNewValueSameAsInitial) {
          showInvalidDateTimeToast('Invalid date/time value or no change', 'Please use correct format (h:mma/p)')
          return
        }
      }

      if (field === 'out_time') {
        if (isNewValueBeforePunchInTime) {
          showInvalidDateTimeToast('Invalid date/time value', 'Punch-Out must be after existing Punch-In time')
          return
        }

        if (isNewValueSameAsInitial) {
          showInvalidDateTimeToast('Invalid date/time value or no change', 'Please use correct format (h:mma/p)')
          return
        }
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
      } else if (field === 'note') {
        if (typeof newValue !== 'string') {
          showToast({
            severity: 'error',
            summary: 'Invalid note value',
            detail: 'Please enter a valid text',
          })
          return
        }

        const newNote = newValue
        const punchId = field === 'note' ? rowData.in_id : rowData.out_id
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
            summary: newNote ? `${field === 'note' ? 'In' : 'Out'} Note updated:` : 'Note erased successfully',
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
    const hours = typeof record.total_time === 'number' ? parseFloat(record.total_time) : Number(record.total_time)
    const result = sum + hours
    return result
  }, 0)

  const scheduledTimeSum = sortedTimeSheets.reduce((sum, record) => {
    const hours = parseFloat(record.scheduled_time)
    return sum + hours
  }, 0)

  const editableCellColumnStyle = currentUserRole === 'admin' ? 'cursor-pointer hover:text-primary' : ''

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
    const shiftDay = options.rowData.shift_day
    const cellTimeValue = options.value ?? new Date(timeStamp)
    const zonedCellTimeValue = toZonedTime(cellTimeValue, options.rowData.facility_timezone)

    const formatDateTime = (date: Date): string => {
      return format(date, 'h:mmaaaaa')
    }

    const parseDateTime = (text: string): Date => {
      const timeFormat = 'hh:mma'
      const parsedDate = parse(text, timeFormat, shiftDay)
      return isValid(parsedDate) ? parsedDate : zonedCellTimeValue
    }

    return (
      <Calendar
        value={zonedCellTimeValue}
        hourFormat="12"
        onChange={e => {
          const newValue = e.value as Date
          const isValidDate = newValue != null && isValid(newValue)
          if (isValidDate) {
            const newValueSetOnShiftDay = combineDayAndTimeUTC(shiftDay, newValue.toISOString())
            const utcNewValue = fromZonedTime(newValueSetOnShiftDay, options.rowData.facility_timezone)
            options.editorCallback!(utcNewValue)
          }
        }}
        showTime
        showOnFocus={false}
        timeOnly
        formatDateTime={formatDateTime}
        parseDateTime={parseDateTime}
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

  const cellEditor = (options: ColumnEditorOptions) => {
    if (options.field === 'in_time' || options.field === 'out_time') {
      return timeEditor(options)
    } else if (options.field === 'note') {
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

  const dropdownEditor = (options: ColumnEditorOptions) => {
    return (
      <Dropdown
        value={options.value}
        options={options.rowData.job_title}
        onChange={e => options.editorCallback!(e.value)}
        placeholder="Select a job"
        className="w-full"
      />
    )
  }

  const getEditableDropdownProps = (currentUserRole: string) => {
    if (currentUserRole === 'admin') {
      return {
        editor: (options: ColumnEditorOptions) => dropdownEditor(options),
        onCellEditComplete: onCellEditComplete,
        className: editableCellColumnStyle,
      }
    }
    return {}
  }

  const cols: (IAdminUserTimesheetsColumnMeta<IPunchPairsWithData> | null)[] = [
    {
      field: 'shift_day',
      header: 'Shift Day',
      sortable: false,
      body: (rowData: IPunchPairsWithData) => formatInTimeZone(rowData.shift_day, rowData.facility_timezone, 'MMM d'),
    },
    {
      field: 'in_time',
      header: 'In',
      sortable: false,
      ...getEditableProps(currentUserRole),
      body: (rowData: IPunchPairsWithData) =>
        rowData.in_time != null
          ? formatInTimeZone(rowData.in_time, rowData.facility_timezone, 'h:mmaaaaa (z)')
          : rowData.in_time != null && isToday(rowData.in_time)
            ? 'Clocked In'
            : '',
    },
    {
      field: 'out_time',
      header: 'Out',
      sortable: false,
      body: (rowData: IPunchPairsWithData) =>
        rowData.out_time != null
          ? formatInTimeZone(rowData.out_time, rowData.facility_timezone, 'h:mmaaaaa (z)')
          : rowData.in_time != null && isToday(rowData.in_time)
            ? 'Clocked In'
            : '',
      ...getEditableProps(currentUserRole),
    },
    {
      field: 'lunch_time',
      header: 'Lunch Break',
      sortable: false,
      body: (rowData: IPunchPairsWithData) => lunchTimeTemplate(rowData.lunch_time),
    },
    {
      field: 'job_title',
      header: 'Job',
      sortable: false,
      body: (rowData: IPunchPairsWithData) =>
        jobTitleTemplate(rowData.job_title, rowData.job_uid, rowData.job_id, currentUserRole),
      ...getEditableDropdownProps(currentUserRole),
    },
    {
      field: 'facility_name',
      header: 'Facility',
      sortable: false,
      body: (rowData: IPunchPairsWithData) =>
        facilityNameTemplate(rowData.facility_name, rowData.facility_id, currentUserRole),
    },
    currentUserRole === 'admin'
      ? {
          field: 'note',
          header: 'Note',
          sortable: false,
          body: (rowData: IPunchPairsWithData) => (rowData.note ? `${rowData.note} ✎` : '✎'),
          ...getEditableProps(currentUserRole),
        }
      : null,
    { field: 'total_time', header: 'Total Hours', sortable: false, className: 'text-red-400' },
    {
      field: 'scheduled_time',
      header: 'Scheduled Hours',
      sortable: false,
      body: (rowData: IPunchPairsWithData) => (rowData.scheduled_time ? rowData.scheduled_time : 'test'),
    },
  ]

  return (
    <div className="flex flex-col">
      <div className="flex w-full justify-between">
        {selectedUser?.first_name ? (
          <div className="flex items-center pl-8">
            <Avatar
              label={selectedUser ? selectedUser?.first_name : ''}
              image={selectedUser?.avatar}
              size="xlarge"
              shape="circle"
              pt={{ image: { className: 'object-cover' } }}
            />
            <h1 className="pl-4 text-xl font-bold leading-3">
              {selectedUser?.first_name + ' ' + selectedUser.last_name}
            </h1>
          </div>
        ) : null}

        <div className="flex flex-col items-baseline gap-y-2">
          <HtInputLabel htmlFor="pay-period-dropdown" labelText="Pay Period" />
          <Dropdown
            id="pay-period-dropdown"
            value={selectedPayPeriod}
            options={payPeriods}
            onChange={e => setSelectedPayPeriod(e.value)}
            placeholder="Select a pay period"
            className="w-60"
          />
        </div>
      </div>

      <DataTable
        header={`Total ${totalTimeSum.toFixed(2)} | Scheduled ${scheduledTimeSum.toFixed(2)}`}
        dataKey="timesheet_id"
        editMode="cell"
        value={sortedTimeSheets}
        emptyMessage={isLoading ? 'Loading...' : 'No timesheets found'}
        size="small"
        rows={14}
        stripedRows
        showGridlines
        pt={{
          header: {
            className: 'font-normal text-sm text-gray-500',
          },
        }}>
        {cols.map(col => {
          if (!col) return null
          return (
            <Column
              key={col?.field}
              field={col?.field}
              header={col?.header}
              body={col?.body}
              editor={col?.editor}
              className={col?.className}
              onCellEditComplete={col?.onCellEditComplete}
            />
          )
        })}
      </DataTable>
      <h2 className="mt-5 text-right text-2xl font-bold">Total Hrs {totalTimeSum.toFixed(2)}</h2>
    </div>
  )
}
