import { useState, useEffect } from 'react'

import { SelectButton, type SelectButtonChangeEvent } from 'primereact/selectbutton'

import { HTLoadingLogo } from '../../../components/shared/HTLoadingLogo'
import { type IServiceOrder } from '../../../interfaces/serviceOrder'
import { requestService } from '../../../services/requestServiceNew'
import { roleChecker } from '../../../utils/roleChecker'
import { ServiceOrderCalendar } from './ServiceOrderCalendar'
import { ServiceOrdersListView } from './ServiceOrdersListView'

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
        <ServiceOrdersListView serviceOrders={serviceOrders} role={role} />
      )}
    </>
  )
}
