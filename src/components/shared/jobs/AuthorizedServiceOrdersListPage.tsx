import { useState, useEffect, useMemo } from 'react'

import { format } from 'date-fns'

import { type IServiceOrder } from '../../../interfaces/serviceOrder'
import { requestService } from '../../../services/requestServiceNew'
import { roleChecker } from '../../../utils/roleChecker'
import { GlobalTable } from '../GlobalTable'
import { HTLoadingLogo } from '../HTLoadingLogo'

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
      { Header: 'Status', accessor: 'status' },
      { Header: 'UID', accessor: 'uid' },
      { Header: 'Company Name', accessor: 'company_id.company_name' },
      { Header: 'Job Title', accessor: 'job_id.title' },

      { Header: 'Facility ID', accessor: 'facility_id.name' },
      { Header: 'Created By', accessor: 'created_by' },
      { Header: 'Total Cost', accessor: 'details.total_cost' },
      {
        Header: 'Created At',
        accessor: (row: { createdAt: Date }) => format(row.createdAt, 'yyyy-MM-dd HH:mm:ss'),
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
