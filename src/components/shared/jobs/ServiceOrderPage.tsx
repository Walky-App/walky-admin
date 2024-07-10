import { useEffect, useState } from 'react'

import { useNavigate, useParams } from 'react-router-dom'

import { format } from 'date-fns'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'

import { type IPaymentMethod, type IServiceOrder } from '../../../interfaces/serviceOrder'
import { requestService } from '../../../services/requestServiceNew'
import { useUtils } from '../../../store/useUtils'
import { roleChecker } from '../../../utils/roleChecker'

export const ServiceOrderPage = () => {
  const [selectedCard, setSelectedCard] = useState(null)
  const [serviceOrder, setServiceOrderData] = useState<IServiceOrder | null>(null)
  const [paymentMethods, setPaymentMethods] = useState<IPaymentMethod[] | null>(null)
  const jobId = useParams().id
  const serviceOrderId = useParams().serviceOrderId
  const { showToast } = useUtils()
  const navigate = useNavigate()
  const role = roleChecker()

  useEffect(() => {
    const getServiceOrder = async () => {
      try {
        // const response = await requestService({ path: `jobs/${jobId}/service-order`, method: 'GET' })
        const response = await requestService({ path: `jobs/service-order/${serviceOrderId}` })
        if (!response.ok) {
          throw new Error('Failed to fetch service order')
        }
        const fetchedData = await response.json()
        setServiceOrderData(fetchedData.service_order)
        setPaymentMethods(fetchedData.payments_methods)
      } catch (error) {
        console.error('Error fetching service order data:', error)
      }
    }

    getServiceOrder()
  }, [serviceOrderId])

  const handleAuthorizePayment = async () => {
    try {
      const response = await requestService({
        path: `jobs/authorize/${serviceOrderId}`,
        method: 'PATCH',
        body: JSON.stringify({ payment_profile_id: selectedCard }),
      })
      if (!response.ok) {
        const message = await response.text()
        throw new Error(message)
      }
      showToast({
        severity: 'success',
        summary: 'Success',
        detail: `Payment for $${serviceOrder?.details.total_cost} authorized successfully`,
      })
      setTimeout(() => {
        navigate(role === 'admin' ? `/admin/jobs/${jobId}` : `/client/jobs/${jobId}`)
      }, 3000)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : error
      console.error('Error authorizing payment:', errorMessage)
      showToast({ severity: 'error', summary: 'Error', detail: 'Failed to authorize payment' })
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <img className="h-16 w-auto" src="/assets/logos/logo-horizontal-cropped.png" alt="HempTemps Logo" />
          <h1 className="text-base font-semibold leading-6 text-gray-900">Service order #{serviceOrder?._id}</h1>

          <p className="mt-2 text-sm text-gray-700">
            For {serviceOrder?.job_id.title} job on:
            {serviceOrder?.job_id.job_dates.map(date => format(new Date(date), 'PPPP')).join(', ')}
          </p>
          <p className="mt-2 text-sm text-gray-700">
            Company Information: {serviceOrder?.company_id.company_name} - {serviceOrder?.company_id.company_address} -
            {serviceOrder?.company_id.company_phone_number}
          </p>
          <p className="mt-2 text-sm text-gray-700">
            Facility information: {serviceOrder?.facility_id.name} - {serviceOrder?.facility_id.address}
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="focus-visible:ou3tline-green-600 block rounded-md bg-green-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
            Print
          </button>
        </div>
      </div>
      <div className="-mx-4 mt-8 flow-root sm:mx-0">
        <table className="min-w-full">
          <colgroup>
            <col className="w-full sm:w-1/2" />
            <col className="sm:w-1/6" />
            <col className="sm:w-1/6" />
            <col className="sm:w-1/6" />
          </colgroup>
          <thead className="border-b border-gray-300 text-gray-900">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                Job Title
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-900 sm:table-cell">
                Hours per Day
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-900 sm:table-cell">
                Dates
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-900 sm:table-cell">
                Vacancy
              </th>

              <th
                scope="col"
                className="hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-900 sm:table-cell">
                Base Rate
              </th>
              <th scope="col" className="py-3.5 pl-3 pr-4 text-right text-sm font-semibold text-gray-900 sm:pr-0">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="max-w-0 py-5 pl-4 pr-3 text-sm sm:pl-0">
                <div className="font-medium text-gray-900">{serviceOrder?.job_id.title}</div>
                <div className="mt-1 truncate text-gray-500">
                  {serviceOrder?.job_id.job_dates.map(date => format(new Date(date), 'PPPP')).join(', ')}
                </div>
              </td>
              <td className="hidden px-3 py-5 text-right text-sm text-gray-500 sm:table-cell">
                {serviceOrder?.job_id.total_hours}
              </td>
              <td className="hidden px-3 py-5 text-right text-sm text-gray-500 sm:table-cell">
                {serviceOrder?.job_id.job_dates.map(date => <div key={date}>{format(new Date(date), 'PPPP')}</div>)}
              </td>
              <td className="hidden px-3 py-5 text-right text-sm text-gray-500 sm:table-cell">
                {serviceOrder?.job_id.vacancy}
              </td>
              <td className="py-5 pl-3 pr-4 text-right text-sm text-gray-500 sm:pr-0">
                {serviceOrder?.job_id.hourly_rate}
              </td>
              <td className="hidden px-3 py-5 text-right text-sm text-gray-500 sm:table-cell">
                $
                {(
                  Number(serviceOrder?.job_id.total_hours || 0) *
                  Number(serviceOrder?.job_id.job_dates.length || 0) *
                  Number(serviceOrder?.job_id.vacancy || 0) *
                  Number(serviceOrder?.job_id.hourly_rate || 0)
                ).toFixed(2)}
              </td>
            </tr>
          </tbody>
          <div className="mt-2 flex">
            <Dropdown
              value={selectedCard}
              options={paymentMethods?.map(method => ({
                label: method.card_name + ' ' + method.card_number,
                value: method._id,
              }))}
              onChange={e => setSelectedCard(e.value)}
              placeholder="Select a Credit Card"
            />

            <Button label="Authorize Payment" onClick={handleAuthorizePayment} />
          </div>
          <tfoot>
            <tr>
              <th
                scope="row"
                colSpan={3}
                className="hidden pl-4 pr-3 pt-6 text-right text-sm font-normal text-gray-500 sm:table-cell sm:pl-0">
                Subtotal
              </th>
              <th scope="row" className="pl-4 pr-3 pt-6 text-left text-sm font-normal text-gray-500 sm:hidden">
                Subtotal
              </th>
              <td className="pl-3 pr-4 pt-6 text-right text-sm text-gray-500 sm:pr-0">
                $
                {(
                  Number(serviceOrder?.details.total_cost) -
                  Number(serviceOrder?.details.admin_cost) -
                  Number(serviceOrder?.details.our_fee) -
                  Number(serviceOrder?.details.processing_fee)
                ).toFixed(2)}
              </td>
            </tr>
            <tr>
              <th
                scope="row"
                colSpan={3}
                className="hidden pl-4 pr-3 pt-4 text-right text-sm font-normal text-gray-500 sm:table-cell sm:pl-0">
                Admin Cost
              </th>
              <th scope="row" className="pl-4 pr-3 pt-4 text-left text-sm font-normal text-gray-500 sm:hidden">
                Admin Cost
              </th>
              <td className="pl-3 pr-4 pt-4 text-right text-sm text-gray-500 sm:pr-0">
                ${Number(serviceOrder?.details.admin_cost).toFixed(2)}
              </td>
            </tr>
            <tr>
              <th
                scope="row"
                colSpan={3}
                className="hidden pl-4 pr-3 pt-4 text-right text-sm font-normal text-gray-500 sm:table-cell sm:pl-0">
                Our Fee
              </th>
              <th scope="row" className="pl-4 pr-3 pt-4 text-left text-sm font-normal text-gray-500 sm:hidden">
                Our Fee
              </th>
              <td className="pl-3 pr-4 pt-4 text-right text-sm text-gray-500 sm:pr-0">
                ${Number(serviceOrder?.details.our_fee).toFixed(2)}
              </td>
            </tr>
            <tr>
              <th
                scope="row"
                colSpan={3}
                className="hidden pl-4 pr-3 pt-4 text-right text-sm font-normal text-gray-500 sm:table-cell sm:pl-0">
                Processing Fee
              </th>
              <th scope="row" className="pl-4 pr-3 pt-4 text-left text-sm font-normal text-gray-500 sm:hidden">
                Processing Fee
              </th>
              <td className="pl-3 pr-4 pt-4 text-right text-sm text-gray-500 sm:pr-0">
                ${Number(serviceOrder?.details.processing_fee).toFixed(2)}
              </td>
            </tr>
            <tr>
              <th
                scope="row"
                colSpan={3}
                className="hidden pl-4 pr-3 pt-4 text-right text-sm font-semibold text-gray-900 sm:table-cell sm:pl-0">
                Total:
              </th>
              <th scope="row" className="pl-4 pr-3 pt-4 text-left text-sm font-semibold text-gray-900 sm:hidden">
                Total
              </th>
              <td className="pl-3 pr-4 pt-4 text-right text-sm font-semibold text-gray-900 sm:pr-0">
                ${Number(serviceOrder?.details.total_cost).toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
