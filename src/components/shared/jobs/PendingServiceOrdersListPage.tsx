import { useState, useEffect, useMemo } from 'react'

import { type IServiceOrder } from '../../../interfaces/serviceOrder'
import { requestService } from '../../../services/requestServiceNew'
import { roleChecker } from '../../../utils/roleChecker'
import { GlobalTable } from '../GlobalTable'
import { HTLoadingLogo } from '../HTLoadingLogo'

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
      { Header: 'Status', accessor: 'status' },
      { Header: 'Company Name', accessor: 'company_id.company_name' },
      { Header: 'Job Title', accessor: 'job_id.title' },

      { Header: 'Facility ID', accessor: 'facility_id.name' },
      { Header: 'Created By', accessor: 'created_by' },
      { Header: 'Total Cost', accessor: 'details.total_cost' },
    ],
    [],
  )

  return isLoading ? (
    <HTLoadingLogo />
  ) : (
    <GlobalTable data={memoServiceOrdersData} columns={memoServiceOrdersColumns} allowClick />
  )
}
