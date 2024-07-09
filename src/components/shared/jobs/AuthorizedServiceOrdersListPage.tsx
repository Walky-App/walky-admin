import { useState, useEffect, useMemo } from 'react'

import { type IServiceOrder } from '../../../interfaces/serviceOrder'
import { requestService } from '../../../services/requestServiceNew'
import { GlobalTable } from '../GlobalTable'
import { HTLoadingLogo } from '../HTLoadingLogo'

export const AuthorizedServiceOrdersListPage = () => {
  const [authorizedServiceOrders, setAuthorizedServiceOrders] = useState<IServiceOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getAllAuthorizedServiceOrders = async () => {
      try {
        const response = await requestService({
          path: `jobs/service-orders/authorized`,
          method: 'GET',
        })
        if (!response.ok) {
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
  }, [])

  const memoServiceOrdersData = useMemo(() => authorizedServiceOrders, [authorizedServiceOrders])

  const memoServiceOrdersColumns = useMemo(
    () => [
      { Header: 'Status', accessor: 'status' },
      { Header: 'Company Name', accessor: 'company_id.company_name' },
      { Header: 'Job Title', accessor: 'job_id.title' },

      { Header: 'Facility ID', accessor: 'facility_id.name' },
      { Header: 'Created By', accessor: 'created_by.email' },
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
