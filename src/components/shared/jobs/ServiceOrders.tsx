import { useState, useEffect, useMemo } from 'react'

import { requestService } from '../../../services/requestServiceNew'
import { GlobalTable } from '../GlobalTable'
import { HTLoadingLogo } from '../HTLoadingLogo'

export const ServiceOrdersListPage = () => {
  const [serviceOrders, setServiceOrders] = useState<[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getAllServiceOrders = async () => {
      try {
        const response = await requestService({
          path: `jobs/service-orders`,
          method: 'GET',
        })
        // console.log('response', response)
        if (!response.ok) {
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
  }, [])

  const memoServiceOrdersData = useMemo(() => serviceOrders, [serviceOrders])

  const memoServiceOrdersColumns = useMemo(
    () => [
      { Header: 'Status', accessor: 'status' },
      { Header: 'Company ID', accessor: 'company_id' },
      { Header: 'Job ID', accessor: 'job_id' },
      { Header: 'Facility ID', accessor: 'facility_id' },
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
