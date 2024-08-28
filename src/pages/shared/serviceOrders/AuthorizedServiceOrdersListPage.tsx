import { useState, useEffect } from 'react'

import { HTLoadingLogo } from '../../../components/shared/HTLoadingLogo'
import { type IServiceOrder } from '../../../interfaces/serviceOrder'
import { requestService } from '../../../services/requestServiceNew'
import { roleChecker } from '../../../utils/roleChecker'
import { ServiceOrdersListView } from './ServiceOrdersListView'

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

  return isLoading ? <HTLoadingLogo /> : <ServiceOrdersListView serviceOrders={authorizedServiceOrders} role={role} />
}
