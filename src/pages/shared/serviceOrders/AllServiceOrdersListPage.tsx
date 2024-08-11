import { useState, useEffect, useMemo } from 'react'

import { format, isToday, isYesterday } from 'date-fns'
import { SelectButton, type SelectButtonChangeEvent } from 'primereact/selectbutton'

import { GlobalTable } from '../../../components/shared/GlobalTable'
import { HTLoadingLogo } from '../../../components/shared/HTLoadingLogo'
import { type IServiceOrder } from '../../../interfaces/serviceOrder'
import { requestService } from '../../../services/requestServiceNew'
import { roleChecker } from '../../../utils/roleChecker'
import { ServiceOrderCalendar } from './ServiceOrderCalendar'

interface ViewOption {
  icon: string
  value: string
}

export const AllServiceOrdersListPage = () => {
  const [serviceOrders, setServiceOrders] = useState<IServiceOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [view, setView] = useState<string>('list')
  const role = roleChecker()

  const viewOptions: ViewOption[] = [
    { icon: 'pi pi-bars', value: 'list' },
    { icon: 'pi pi-calendar', value: 'calendar' },
  ]

  const viewOptionsTemplate = (option: ViewOption) => {
    return <i className={option.icon} />
  }

  useEffect(() => {
    const getAllServiceOrders = async () => {
      try {
        let response
        if (role === 'admin') {
          response = await requestService({
            path: `jobs/service-orders`,
            method: 'GET',
          })
        } else if (role === 'client') {
          response = await requestService({
            path: `jobs/service-orders/by-client-companies`,
            method: 'GET',
          })
        }

        if (!response || !response.ok) {
          throw new Error('Failed to fetch service orders')
        }

        const allServiceOrders = await response.json()
        setServiceOrders(allServiceOrders)
      } catch (error) {
        console.error('Error fetching service orders data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    getAllServiceOrders()
  }, [role])

  const memoServiceOrdersData = useMemo(() => serviceOrders, [serviceOrders])

  const memoServiceOrdersColumns = useMemo(
    () => [
      {
        Header: 'Status',
        accessor: (row: IServiceOrder) => {
          if (row.status === 'authorized') {
            return 'Authorized / Published'
          } else if (row.status === 'pending_select_payment') {
            return 'Pending / Needs Authorization'
          } else {
            return row.status
          }
        },
        id: 'status',
      },
      { Header: 'SO_UID', accessor: 'uid' },
      {
        Header: 'Created',
        width: 200,
        accessor: (a: IServiceOrder) => {
          return isToday(a.createdAt) ? 'Today ⭐️' : isYesterday(a.createdAt) ? 'Yesterday' : format(a.createdAt, 'P')
        },
      },
      { Header: 'Company Name', accessor: 'company_id.company_name' },
      { Header: 'Job Title', accessor: 'job_id.title' },
      { Header: 'Job UID', accessor: 'job_id.uid' },
      {
        Header: 'Job Start Date',
        accessor: (row: IServiceOrder) => {
          if (row.job_id && Array.isArray(row.job_id.job_dates) && row.job_id.job_dates.length > 0) {
            const sortedDates = [...row.job_id.job_dates].sort()
            const earliestDate = sortedDates[0]
            return format(new Date(earliestDate), 'P')
          }
          return 'N/A'
        },
        id: 'job_start_date',
      },
      {
        Header: 'Job End Date',
        accessor: (row: IServiceOrder) => {
          if (row.job_id && Array.isArray(row.job_id.job_dates) && row.job_id.job_dates.length > 0) {
            const sortedDates = [...row.job_id.job_dates].sort()
            const latestDate = sortedDates[sortedDates.length - 1]
            return format(new Date(latestDate), 'P')
          }
          return 'N/A'
        },
        id: 'job_end_date',
      },
      {
        Header: 'Number of days',
        accessor: (row: IServiceOrder) => {
          if (row.job_id && Array.isArray(row.job_id.job_dates) && row.job_id.job_dates.length > 0) {
            return row.job_id.job_dates.length
          }
          return 'N/A'
        },
        id: 'total_days',
      },
      { Header: 'Facility ID', accessor: 'facility_id.name' },
      { Header: 'Created By', accessor: 'created_by' },
      { Header: 'Total Cost, $', accessor: 'details.total_cost' },
    ],
    [],
  )

  return isLoading ? (
    <HTLoadingLogo />
  ) : (
    <>
      <div className="flex w-full justify-end">
        <SelectButton
          value={view}
          onChange={(e: SelectButtonChangeEvent) => setView(e.value)}
          options={viewOptions}
          optionLabel="value"
          itemTemplate={viewOptionsTemplate}
          pt={{ button: { className: 'justify-center' } }}
        />
      </div>
      {view === 'calendar' ? (
        <ServiceOrderCalendar serviceOrders={serviceOrders} />
      ) : (
        <GlobalTable data={memoServiceOrdersData} columns={memoServiceOrdersColumns} allowClick />
      )}
    </>
  )
}
