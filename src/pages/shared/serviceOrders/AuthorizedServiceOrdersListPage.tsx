import { useState, useEffect, useMemo } from 'react'

import { format, isToday, isYesterday } from 'date-fns'

import { GlobalTable } from '../../../components/shared/GlobalTable'
import { HTLoadingLogo } from '../../../components/shared/HTLoadingLogo'
import { type IServiceOrder } from '../../../interfaces/serviceOrder'
import { requestService } from '../../../services/requestServiceNew'
import { roleChecker } from '../../../utils/roleChecker'

export const AuthorizedServiceOrdersListPage = () => {
  const [authorizedServiceOrders, setAuthorizedServiceOrders] = useState<IServiceOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const role = roleChecker()

  useEffect(() => {
    const getAllAuthorizedServiceOrders = async () => {
      try {
        let response
        if (role === 'admin') {
          response = await requestService({
            path: `jobs/service-orders/authorized`,
            method: 'GET',
          })
        } else if (role === 'client') {
          response = await requestService({
            path: `jobs/service-orders/authorized-by-client-companies`,
            method: 'GET',
          })
        }

        if (!response || !response.ok) {
          throw new Error('Failed to fetch service orders')
        }

        const allServiceOrders = await response.json()
        setAuthorizedServiceOrders(allServiceOrders)
      } catch (error) {
        console.error('Error fetching service orders data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    getAllAuthorizedServiceOrders()
  }, [role])

  const memoServiceOrdersData = useMemo(() => authorizedServiceOrders, [authorizedServiceOrders])

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
    ],
    [],
  )

  return isLoading ? (
    <HTLoadingLogo />
  ) : (
    <GlobalTable data={memoServiceOrdersData} columns={memoServiceOrdersColumns} allowClick />
  )
}
