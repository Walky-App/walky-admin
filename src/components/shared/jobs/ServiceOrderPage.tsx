import { useEffect, useState } from 'react'

import { useNavigate, useParams } from 'react-router-dom'

import { format } from 'date-fns'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'

import { type IPaymentMethod, type IServiceOrder } from '../../../interfaces/serviceOrder'
import { requestService } from '../../../services/requestServiceNew'
import { useUtils } from '../../../store/useUtils'
import { roleChecker } from '../../../utils/roleChecker'
import { HTLoadingLogo } from '../HTLoadingLogo'

interface SelectedCard {
  payment_profile_id: string
  card_number: string
}

export const ServiceOrderPage = () => {
  const [selectedCard, setSelectedCard] = useState<SelectedCard | null>(null)
  const [serviceOrder, setServiceOrderData] = useState<IServiceOrder | null>(null)
  const [paymentMethods, setPaymentMethods] = useState<IPaymentMethod[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const serviceOrderId = useParams().serviceOrderId
  const { showToast } = useUtils()
  const navigate = useNavigate()
  const role = roleChecker()

  useEffect(() => {
    const getServiceOrder = async () => {
      try {
        const response = await requestService({ path: `jobs/service-order/${serviceOrderId}` })
        if (!response.ok) {
          throw new Error('Failed to fetch service order')
        }
        const fetchedData = await response.json()
        setServiceOrderData(fetchedData.service_order)
        setPaymentMethods(fetchedData.payments_methods)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching service order data:', error)
      }
    }

    getServiceOrder()
  }, [serviceOrderId])

  useEffect(() => {
    const defaultPaymentMethod = paymentMethods?.find(method => method.isDefault)
    if (defaultPaymentMethod) {
      setSelectedCard({
        payment_profile_id: defaultPaymentMethod._id,
        card_number: defaultPaymentMethod.card_number,
      })
    }
  }, [paymentMethods])

  const handleAuthorizePayment = async () => {
    try {
      const response = await requestService({
        path: `jobs/authorize/${serviceOrderId}`,
        method: 'PATCH',
        body: JSON.stringify({
          payment_profile_id: selectedCard?.payment_profile_id,
          card_number: selectedCard?.card_number,
        }),
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
        navigate(role === 'admin' ? `/admin/jobs/service-orders` : `/client/jobs/service-orders`)
      }, 3000)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : error
      console.error('Error authorizing payment:', errorMessage)
      showToast({ severity: 'error', summary: 'Error', detail: 'Failed to authorize payment' })
    }
  }

  const statusDisplayText = {
    authorized: 'Authorized',
    pending_select_payment: 'Pending Payment',
  }

  return isLoading ? (
    <HTLoadingLogo />
  ) : (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <img className="h-16 w-auto" src="/assets/logos/logo-horizontal-cropped.png" alt="HempTemps Logo" />
          <h1 className="text-base font-semibold leading-6 text-gray-900">Service order #{serviceOrder?._id}</h1>
          <h2 className="text-base font-semibold leading-6 text-gray-900">
            Status: {statusDisplayText[serviceOrder?.status as keyof typeof statusDisplayText] || serviceOrder?.status}
          </h2>
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
                Number of Working Days
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-900 sm:table-cell">
                Vacancy
              </th>

              <th scope="col" className="py-3.5 pl-3 pr-4 text-right text-sm font-semibold text-gray-900 sm:pr-0">
                Hourly Rate
              </th>
              <th scope="col" className="py-3.5 pl-3 pr-4 text-right text-sm font-semibold text-gray-900 sm:pr-0">
                Hours Total
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="max-w-0 py-5 pl-4 pr-3 text-sm sm:pl-0">
                <div className="font-medium text-gray-900">{serviceOrder?.job_id.title}</div>
              </td>
              <td className="hidden px-3 py-5 text-right text-sm text-gray-500 sm:table-cell">
                {serviceOrder?.job_id.total_hours}
              </td>
              <td className="hidden px-3 py-5 text-right text-sm text-gray-500 sm:table-cell">
                {serviceOrder?.details.number_of_selected_working_days}{' '}
                {serviceOrder?.details.number_of_holidays ?? 0 > 0
                  ? `(including ${serviceOrder?.details.number_of_holidays} holidays)`
                  : null}
              </td>
              <td className="hidden px-3 py-5 text-right text-sm text-gray-500 sm:table-cell">
                {serviceOrder?.job_id.vacancy}
              </td>
              <td className="hidden py-5 pl-3 pr-4 text-right text-sm text-gray-500 sm:pr-0">
                {serviceOrder?.details.total_of_all_temps_hours} ${serviceOrder?.job_id.hourly_rate}
              </td>
              <td className="px-3 py-5 text-right text-sm text-gray-500 sm:table-cell">
                ${serviceOrder?.job_id.hourly_rate}
              </td>
              <td className="px-3 py-5 text-right text-sm text-gray-500 sm:table-cell">
                {serviceOrder?.details.total_of_all_temps_hours}
              </td>
            </tr>
          </tbody>
          <div className="mt-2 flex">
            {serviceOrder?.status === 'pending_select_payment' ? (
              <>
                <Dropdown
                  value={selectedCard}
                  options={paymentMethods?.map(method => ({
                    label: method.card_name + ' ' + method.card_number,
                    value: { payment_profile_id: method._id, card_number: method.card_number },
                  }))}
                  onChange={e => {
                    setSelectedCard(e.value)
                  }}
                  placeholder="Select a Credit Card"
                />

                <Button label="Authorize Payment" onClick={handleAuthorizePayment} />
              </>
            ) : null}
          </div>
          <tfoot>
            {serviceOrder?.details?.supervisor_fees && serviceOrder.details.supervisor_fees > 0 ? (
              <tr>
                <th
                  scope="row"
                  colSpan={3}
                  className="hidden pl-4 pr-3 pt-6 text-right text-sm font-normal text-gray-500 sm:table-cell sm:pl-0">
                  Supervisor Fees
                </th>
                <th scope="row" className="pl-4 pr-3 pt-6 text-left text-sm font-normal text-gray-500 sm:hidden">
                  Supervisor Fees
                </th>
                <td className="pl-3 pr-4 pt-6 text-right text-sm text-gray-500 sm:pr-0">
                  ${serviceOrder.details.supervisor_fees}
                </td>
              </tr>
            ) : null}
            {serviceOrder?.details?.total_overtime_fees && serviceOrder.details.total_overtime_fees > 0 ? (
              <tr>
                <th
                  scope="row"
                  colSpan={3}
                  className="hidden pl-4 pr-3 pt-6 text-right text-sm font-normal text-gray-500 sm:table-cell sm:pl-0">
                  Total Overtime Fees
                </th>
                <th scope="row" className="pl-4 pr-3 pt-6 text-left text-sm font-normal text-gray-500 sm:hidden">
                  Total Overtime Fees
                </th>
                <td className="pl-3 pr-4 pt-6 text-right text-sm text-gray-500 sm:pr-0">
                  ${serviceOrder.details.total_overtime_fees}
                </td>
              </tr>
            ) : null}
            <tr>
              <th
                scope="row"
                colSpan={3}
                className="hidden pl-4 pr-3 pt-6 text-right text-sm font-semibold text-gray-500 sm:table-cell sm:pl-0">
                Subtotal
              </th>
              <th scope="row" className="pl-4 pr-3 pt-6 text-left text-sm font-semibold text-gray-500 sm:hidden">
                Subtotal
              </th>
              <td className="pl-3 pr-4 pt-6 text-right text-sm text-gray-500 sm:pr-0">
                ${serviceOrder?.details.total_base_amount}
              </td>
            </tr>
            <tr>
              <th
                scope="row"
                colSpan={3}
                className="hidden pl-4 pr-3 pt-4 text-right text-sm font-normal text-gray-500 sm:table-cell sm:pl-0">
                Admin Costs
              </th>
              <th scope="row" className="pl-4 pr-3 pt-4 text-left text-sm font-normal text-gray-500 sm:hidden">
                Admin Costs
              </th>
              <td className="pl-3 pr-4 pt-4 text-right text-sm text-gray-500 sm:pr-0">
                ${Number(serviceOrder?.details.admin_costs_total).toFixed(2)}
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
                ${Number(serviceOrder?.details.our_fee_total).toFixed(2)}
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
                ${Number(serviceOrder?.details.processing_fee_total).toFixed(2)}
              </td>
            </tr>
            <tr>
              <th
                scope="row"
                colSpan={3}
                className="hidden pl-4 pr-3 pt-4 text-right text-sm font-normal text-gray-500 sm:table-cell sm:pl-0">
                Estimated Total per Hour
              </th>
              <th scope="row" className="pl-4 pr-3 pt-4 text-left text-sm font-normal text-gray-500 sm:hidden">
                Estimated Total per Hour
              </th>
              <td className="pl-3 pr-4 pt-4 text-right text-sm text-gray-500 sm:pr-0">
                ${Number(serviceOrder?.details.estimated_total_per_hour).toFixed(2)}
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
