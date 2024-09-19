import { useCallback, useEffect, useMemo, useState } from 'react'

import { useMediaQuery } from 'react-responsive'

import { isToday } from 'date-fns'
import { formatInTimeZone } from 'date-fns-tz'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Dropdown } from 'primereact/dropdown'
import { Toolbar } from 'primereact/toolbar'

import { HtInputLabel } from '../../../components/shared/forms/HtInputLabel'
import {
  type IAdminUserTimesheetsColumnMeta,
  type IPunchPairsWithData,
  lunchTimeTemplate,
  jobTitleTemplate,
  facilityNameTemplate,
  type ITimesheetWithJobAndShiftDetails,
  processPunchPairsWithData,
} from '../../../components/shared/timesheets/timesheetsUtils'
import { type IUser } from '../../../interfaces/User'
import { type IPayPeriod } from '../../../interfaces/timesheet'
import { requestService } from '../../../services/requestServiceNew'
import { roleChecker } from '../../../utils/roleChecker'

export const EmployeeTimesheetTable = ({ userData }: { userData: IUser }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [processedTimeSheets, setProcessedTimeSheets] = useState<IPunchPairsWithData[]>([])
  const [payPeriods, setPayPeriods] = useState([] as IPayPeriod[])
  const [selectedPayPeriod, setSelectedPayPeriod] = useState<IPayPeriod>()

  const currentUserRole = roleChecker()

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })

  const fetchPayPeriodsByEmployee = useCallback(async () => {
    setIsLoading(true)

    const pathString = `timesheets/employee/${userData._id}/pay-periods`
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
  }, [userData])

  const fetchTimesheets = useCallback(
    async (selectedPayPeriod: IPayPeriod) => {
      setIsLoading(true)

      setProcessedTimeSheets([])

      const selectedPayPeriodStart = selectedPayPeriod?.start
      const selectedPayPeriodEnd = selectedPayPeriod?.end

      const pathString = `timesheets/employee/${userData._id}/pay-period?start=${selectedPayPeriodStart}&end=${selectedPayPeriodEnd}`

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
    [userData],
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

  const totalTimeSum = sortedTimeSheets.reduce((sum, record) => {
    const hours = typeof record.total_time === 'number' ? parseFloat(record.total_time) : Number(record.total_time)
    const result = sum + hours
    return result
  }, 0)

  const scheduledTimeSum = sortedTimeSheets.reduce((sum, record) => {
    const hours = parseFloat(record.scheduled_time)
    return sum + hours
  }, 0)

  const payPeriodSelectorContent = (
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
  )

  const cols: (IAdminUserTimesheetsColumnMeta<IPunchPairsWithData> | null)[] = [
    {
      field: 'shift_day',
      header: 'Shift Day',
      sortable: false,
      body: rowData => formatInTimeZone(rowData.shift_day, rowData.facility_timezone, 'MMM d'),
    },
    {
      field: 'in_time',
      header: 'In',
      sortable: false,
      body: rowData =>
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
      body: rowData =>
        rowData.out_time != null
          ? formatInTimeZone(rowData.out_time, rowData.facility_timezone, 'h:mmaaaaa (z)')
          : rowData.in_time != null && isToday(rowData.in_time)
            ? 'Clocked In'
            : '',
    },
    {
      field: 'lunch_time',
      header: 'Lunch Break',
      sortable: false,
      body: rowData => lunchTimeTemplate(rowData.lunch_time),
    },
    {
      field: 'job_title',
      header: 'Job',
      sortable: false,
      body: rowData => jobTitleTemplate(rowData.job_title, rowData.job_uid, rowData.job_id, currentUserRole),
    },
    {
      field: 'facility_name',
      header: 'Facility',
      sortable: false,
      body: rowData => facilityNameTemplate(rowData.facility_name, rowData.facility_id, currentUserRole),
    },
    currentUserRole === 'admin'
      ? {
          field: 'note',
          header: 'Note',
          sortable: false,
          body: (rowData: IPunchPairsWithData) => (rowData.note ? `${rowData.note} ✎` : '✎'),
        }
      : null,
    { field: 'total_time', header: 'Total Hours', sortable: false, className: 'text-red-400' },
    {
      field: 'scheduled_time',
      header: 'Scheduled Hours',
      sortable: false,
      body: rowData => (rowData.scheduled_time ? rowData.scheduled_time : 'test'),
    },
  ]

  return (
    <div className="flex flex-col">
      {isMobile ? <Toolbar start={payPeriodSelectorContent} /> : <Toolbar end={payPeriodSelectorContent} />}
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
