import { useState, useEffect } from 'react'

import { HTLoadingLogo } from '../../../components/shared/HTLoadingLogo'
import { type IServiceInvoice } from '../../../interfaces/serviceInvoice'
import { requestService } from '../../../services/requestServiceNew'
import { roleChecker } from '../../../utils/roleChecker'
import { ServiceInvoicesListView } from './ServiceInvoicesListView'

export const AllInvoicesListPage = () => {
  const [invoices, setInvoices] = useState<IServiceInvoice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const role = roleChecker()

  useEffect(() => {
    const getAllServiceOrders = async () => {
      try {
        const response = await requestService({
          path: `invoices/list`,
          method: 'GET',
        })

        if (!response || !response.ok) {
          throw new Error('Failed to fetch service orders')
        }

        const allInvoices = await response.json()
        setInvoices(allInvoices)
      } catch (error) {
        console.error('Error fetching service orders data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    getAllServiceOrders()
  }, [role])

  return isLoading ? <HTLoadingLogo /> : <ServiceInvoicesListView invoices={invoices} />
}
