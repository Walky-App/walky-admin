import { useState, useEffect, useMemo } from 'react'

import { format, isToday, isYesterday } from 'date-fns'

import { GlobalTable } from '../../../components/shared/GlobalTable'
import { HTLoadingLogo } from '../../../components/shared/HTLoadingLogo'
import { type IServiceOrder } from '../../../interfaces/serviceOrder'
import { requestService } from '../../../services/requestServiceNew'
import { roleChecker } from '../../../utils/roleChecker'

export const PendingServiceOrdersListPage = () => {
  const [pendingServiceOrders, setPendingServiceOrders] = useState<IServiceOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const role = roleChecker()

  useEffect(() => {
    const getAllPendingServiceOrders = async () => {
      try {
        let response
        if (role === 'admin') {
          response = await requestService({
            path: `jobs/service-orders/pending`,
            method: 'GET',
          })
        } else if (role === 'client') {
          response = await requestService({
            path: `jobs/service-orders/pending-by-client-companies`,
            method: 'GET',
          })
        }

        if (!response || !response.ok) {
          throw new Error('Failed to fetch service orders')
        }

        const allServiceOrders = await response.json()
        setPendingServiceOrders(allServiceOrders)
      } catch (error) {
        console.error('Error fetching service orders data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    getAllPendingServiceOrders()
  }, [role])

  const memoServiceOrdersData = useMemo(() => pendingServiceOrders, [pendingServiceOrders])

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
      { Header: 'Company Name', accessor: 'company_id.company_name' },
      { Header: 'Job Title', accessor: 'job_id.title' },
      { Header: 'Job UID', accessor: 'job_id.uid' },
      {
        Header: 'Job Start Date',
        accessor: (row: IServiceOrder) => {
          if (row.job_id && Array.isArray(row.job_id.job_dates) && row.job_id.job_dates.length > 0) {
            const sortedDates = [...row.job_id.job_dates].sort()
            const earliestDate = sortedDates[0]
            return earliestDate.split('T')[0]
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
            return latestDate.split('T')[0]
          }
          return 'N/A'
        },
        id: 'job_end_date',
      },
      {
        Header: 'Job has ended?',
        accessor: (row: IServiceOrder) =>
          row.job_id !== null && typeof row.job_id?.is_completed !== 'undefined'
            ? row.job_id?.is_completed
              ? 'Yes'
              : 'No'
            : 'N/A',
        id: 'is_completed',
      },
      { Header: 'Facility ID', accessor: 'facility_id.name' },
      { Header: 'Created By', accessor: 'created_by' },
      { Header: 'Total Cost, $', accessor: 'details.total_cost' },
      {
        Header: 'Created At',
        accessor: (row: IServiceOrder) => {
          return isToday(row.createdAt)
            ? 'Today ⭐️'
            : isYesterday(row.createdAt)
              ? 'Yesterday'
              : format(row.createdAt, 'P')
        },
        id: 'createdAt',
      },
    ],
    [],
  )

  return isLoading ? (
    <HTLoadingLogo />
  ) : (
    <GlobalTable data={memoServiceOrdersData} columns={memoServiceOrdersColumns} allowClick />
  )
}
