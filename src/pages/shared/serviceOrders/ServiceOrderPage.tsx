import { useEffect, useState } from 'react'

import { useNavigate, useParams } from 'react-router-dom'

import { format } from 'date-fns'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'

import { HTLoadingLogo } from '../../../components/shared/HTLoadingLogo'
import { HtInputHelpText } from '../../../components/shared/forms/HtInputHelpText'
import { type IPaymentMethod, type IServiceOrder } from '../../../interfaces/serviceOrder'
import { requestService } from '../../../services/requestServiceNew'
import { useUtils } from '../../../store/useUtils'
import { roleChecker } from '../../../utils/roleChecker'

interface AchPaymentDetails {
  ach_account_name: string
  ach_account_number: string
  ach_bank_name: string
  ach_routing_number: string
}

interface SelectedCard {
  payment_profile_id: string
  card_number: string
}

export const ServiceOrderPage = () => {
  const [selectedCard, setSelectedCard] = useState<SelectedCard | null>(null)
  const [serviceOrder, setServiceOrderData] = useState<IServiceOrder | null>(null)
  const [paymentMethods, setPaymentMethods] = useState<IPaymentMethod[] | null>(null)
  const [achPaymentDetails, setACHPaymentDetails] = useState<AchPaymentDetails | null>(null)
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
        setPaymentMethods(fetchedData?.payments_methods)
        setACHPaymentDetails(fetchedData.ach_payment)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching service order data:', error)
      }
    }

    getServiceOrder()
  }, [serviceOrderId])

  useEffect(() => {
    const defaultPaymentMethod = paymentMethods?.find(method => method.is_default)
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

  const handleAuthorizeACHTransfer = async () => {
    try {
      const response = await requestService({
        path: `jobs/authorize-ach/${serviceOrderId}`,
        method: 'PATCH',
      })
      if (!response.ok) {
        const message = await response.text()
        throw new Error(message)
      }
      showToast({
        severity: 'success',
        summary: 'Success',
        detail: `ACH Transfer for $${serviceOrder?.details.total_cost} authorized successfully`,
      })
      setTimeout(() => {
        navigate(role === 'admin' ? `/admin/jobs/service-orders` : `/client/jobs/service-orders`)
      }, 3000)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : error
      console.error('Error authorizing payment:', errorMessage)
      showToast({ severity: 'error', summary: 'Error', detail: 'Failed to authorize ACH Transfer' })
    }
  }

  const statusDisplayText = {
    authorized: 'Authorized',
    pending_select_payment: 'Pending Payment',
  }

  const handleGenerateInvoice = async () => {
    try {
      const response = await requestService({
        path: `invoices/${serviceOrder?.job_id._id}`,
        method: 'POST',
        body: JSON.stringify({}),
      })
      if (!response.ok) {
        const invoice = await response.json()
        showToast({ severity: 'error', summary: 'Error', detail: invoice.message })
        throw new Error('Failed to generate invoice')
      }

      if (response.ok) {
        const invoice = await response.json()
        navigate(`/admin/invoices/${invoice.invoiceId}`)
        showToast({ severity: 'success', summary: 'Success', detail: 'Invoice generated successfully' })
      }
    } catch (error) {
      console.error('Error generating invoice:', error)
    }
  }

  return isLoading ? (
    <HTLoadingLogo />
  ) : (
    <div className="px-4 sm:px-6 lg:px-24">
      <div className="my-8 flex items-center justify-between">
        <img className="w</div>-auto h-16" src="/assets/logos/logo-horizontal-cropped.png" alt="HempTemps Logo" />
        <h1 className="text-base text-xl font-semibold leading-6">
          Service order <br /> #{serviceOrder?.uid}
        </h1>
      </div>
      <div className="">
        <div className="ml-6 flex items-center justify-between">
          <div>
            <h1 className="mb-6 border-b border-gray-200 text-xl font-bold">Customer: </h1>
            <h1 className="font-bold">{serviceOrder?.company_id.company_name}</h1>
            <h2>{serviceOrder?.company_id.company_address}</h2>
            <h2>Phone: {serviceOrder?.company_id.company_phone_number}</h2>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <Button icon="pi pi-print" className="mr-2" outlined onClick={() => window.print()} />
            {/* todo: this should be to download the service order */}
            {/* <Button icon="pi pi-arrow-down" className="mr-2" outlined /> */}
          </div>
        </div>

        <p className="mt-2 text-sm text-gray-700" />
        <div className="mt-8">
          <table className="w-full border-collapse border border-gray-400">
            <thead>
              <tr>
                <th className="border border-gray-300 bg-gray-100 p-4 text-left">SO Status</th>
                <th className="border border-gray-300 bg-gray-100 p-4 text-left">Facility</th>
                <th className="border border-gray-300 bg-gray-100 p-4 text-left">Facility Address</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-4">
                  {statusDisplayText[serviceOrder?.status as keyof typeof statusDisplayText] || serviceOrder?.status}
                </td>
                <td className="border border-gray-300 p-4">
                  <h3 className="text-base font-semibold leading-6">{serviceOrder?.facility_id.name}</h3>
                </td>
                <td className="border border-gray-300 p-4">{serviceOrder?.facility_id.address}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="-mx-4 mt-8 flow-root sm:mx-0">
        <table className="min-w-full">
          <colgroup>
            <col className="w-full sm:w-1/2" />
          </colgroup>
          <thead className="border-b border-gray-300">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left font-semibold sm:pl-0">
                Job Title
              </th>
              <th scope="col" className="hidden px-3 py-3.5 text-right font-semibold sm:table-cell">
                Hours per Day
              </th>
              <th scope="col" className="hidden px-3 py-3.5 text-right font-semibold sm:table-cell">
                Number of Working Days
              </th>
              <th scope="col" className="hidden px-3 py-3.5 text-right font-semibold sm:table-cell">
                Vacancy
              </th>

              <th scope="col" className="py-3.5 pl-3 pr-4 text-right font-semibold sm:pr-0">
                Hourly Rate
              </th>
              <th scope="col" className="py-3.5 pl-3 pr-4 text-right font-semibold sm:pr-0">
                Hours Total
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="max-w-0 py-5 pl-4 pr-3 sm:pl-0">
                <div className="font-medium">{serviceOrder?.job_id.title}</div>
              </td>
              <td className="hidden px-3 py-5 text-right sm:table-cell">{serviceOrder?.job_id.total_hours}</td>
              <td className="hidden px-3 py-5 text-right sm:table-cell">
                {serviceOrder?.details.number_of_selected_working_days}{' '}
                {serviceOrder?.details.number_of_holidays ?? 0 > 0
                  ? `(including ${serviceOrder?.details.number_of_holidays} holidays)`
                  : null}
              </td>
              <td className="hidden px-3 py-5 text-right sm:table-cell">{serviceOrder?.job_id.vacancy}</td>
              <td className="hidden py-5 pl-3 pr-4 text-right sm:pr-0">
                {serviceOrder?.details.total_of_all_temps_hours} ${serviceOrder?.job_id.hourly_rate}
              </td>
              <td className="px-3 py-5 text-right sm:table-cell">${serviceOrder?.job_id.hourly_rate}</td>
              <td className="px-3 py-5 text-right sm:table-cell">{serviceOrder?.details.total_of_all_temps_hours}</td>
            </tr>
          </tbody>
          <div className="mt-2 flex">
            {serviceOrder?.status === 'pending_select_payment' && paymentMethods !== undefined ? (
              <div className="flex flex-col">
                <div>
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

                  <Button label="Authorize Hold On Card" onClick={handleAuthorizePayment} />
                </div>
                <HtInputHelpText
                  fieldName="Authorize"
                  helpText="This button will authorize a hold for the total amount on your credit card. Once the services are rendered and timesheets are reconciled, you will be billed against this hold. More definitions can be found under 'Terms and Conditions.'"
                />
              </div>
            ) : serviceOrder?.status === 'pending_select_payment' &&
              paymentMethods === undefined &&
              achPaymentDetails !== null ? (
              <div className="flex flex-col space-y-4">
                <div>
                  <h2 className="text-xl font-bold">ACH Payment Details</h2>
                  <p className="text-base">
                    Your default ACH payment method is set to:
                    <span className="block font-medium">Account Name: {achPaymentDetails?.ach_account_name}</span>
                    <span className="block font-medium">Account Number: {achPaymentDetails?.ach_account_number}</span>
                    <span className="block font-medium">Bank Name: {achPaymentDetails?.ach_bank_name}</span>
                    <span className="block font-medium">Routing Number: {achPaymentDetails?.ach_routing_number}</span>
                  </p>
                </div>

                <Button label="Authorize ACH Transfer" onClick={handleAuthorizeACHTransfer} />

                <HtInputHelpText
                  fieldName="Authorize"
                  helpText="We will process the payment for this service order via your default ACH payment method."
                />
              </div>
            ) : serviceOrder?.status === 'authorized' && achPaymentDetails && paymentMethods === undefined ? (
              <div>
                <h2 className="text-lg font-semibold">Payment Authorization Successful</h2>
                <p>
                  The payment has been authorized using the following ACH account details:
                  <ul>
                    <li>
                      <strong>Account Name:</strong> {achPaymentDetails?.ach_account_name}
                    </li>
                    <li>
                      <strong>Account Number:</strong> {achPaymentDetails?.ach_account_number}
                    </li>
                    <li>
                      <strong>Bank Name:</strong> {achPaymentDetails?.ach_bank_name}
                    </li>
                    <li>
                      <strong>Routing Number:</strong> {achPaymentDetails?.ach_routing_number}
                    </li>
                  </ul>
                </p>
              </div>
            ) : null}
          </div>
        </table>
        <div className="mt-12 flex">
          <div className="text-lg sm:flex-auto">
            <h2 className="mt-2 font-bold ">
              For {serviceOrder?.job_id.title} job #{serviceOrder?.job_id.uid} on:
            </h2>
            <ul>
              {serviceOrder?.job_id.job_dates.map(date => (
                <li key={date} className="mt-4">
                  {format(new Date(date), 'PPPP')}
                </li>
              ))}
            </ul>
          </div>
          <table className="float-right">
            {serviceOrder?.details?.supervisor_fees && serviceOrder.details.supervisor_fees > 0 ? (
              <tr>
                <th scope="row" colSpan={3} className="hidden pl-4 pr-3 pt-6 text-right sm:table-cell sm:pl-0">
                  Supervisor Fees
                </th>
                <td className="pl-3 pr-4 pt-6 text-left sm:pr-0">${serviceOrder.details.supervisor_fees}</td>
              </tr>
            ) : null}
            {serviceOrder?.details?.total_overtime_fees && serviceOrder.details.total_overtime_fees > 0 ? (
              <tr>
                <th scope="row" colSpan={3} className="hidden pl-4 pr-3 pt-6 text-right sm:table-cell sm:pl-0">
                  Total Overtime Fees
                </th>
                <td className="pl-3 pr-4 pt-6 text-right sm:pr-0">${serviceOrder.details.total_overtime_fees}</td>
              </tr>
            ) : null}
            <tr>
              <th scope="row" colSpan={3} className="hidden pl-4 pr-3  text-right font-semibold sm:table-cell sm:pl-0">
                Subtotal
              </th>
              <td className="pl-3 pr-4 text-left sm:pr-0">${serviceOrder?.details.total_base_amount}</td>
            </tr>
            <tr>
              <th scope="row" colSpan={3} className="hidden pl-4 pr-3 pt-4 text-right sm:table-cell sm:pl-0">
                Admin Costs
              </th>
              <td className="pl-3 pr-4 pt-4 text-left sm:pr-0">
                ${Number(serviceOrder?.details.admin_costs_total).toFixed(2)}
              </td>
            </tr>
            <tr>
              <th scope="row" colSpan={3} className="hidden pl-4 pr-3 pt-4 text-right sm:table-cell sm:pl-0">
                Our Fee
              </th>
              <td className="pl-3 pr-4 pt-4 text-left sm:pr-0">
                ${Number(serviceOrder?.details.our_fee_total).toFixed(2)}
              </td>
            </tr>
            <tr>
              <th scope="row" colSpan={3} className="hidden pl-4 pr-3 pt-4 text-right sm:table-cell sm:pl-0">
                Processing Fee
              </th>
              <td className="pl-3 pr-4 pt-4 text-left sm:pr-0">
                ${Number(serviceOrder?.details.processing_fee_total).toFixed(2)}
              </td>
            </tr>
            <tr>
              <th scope="row" colSpan={3} className="hidden py-4 pl-4 pr-3 text-right sm:table-cell sm:pl-0">
                Estimated Total per Hour
              </th>
              <td className="py-4 pl-3 pr-4 text-left sm:pr-0">
                ${Number(serviceOrder?.details.estimated_total_per_hour).toFixed(2)}
              </td>
            </tr>
            <tr className="border-t-2">
              <th
                scope="row"
                colSpan={3}
                className="hidden pl-4 pr-3 pt-4 text-right font-semibold sm:table-cell sm:pl-0">
                Total:
              </th>
              <td className="pl-3 pr-4 pt-4 text-left font-semibold sm:pr-0">
                ${Number(serviceOrder?.details.total_cost).toFixed(2)}
              </td>
            </tr>
          </table>
        </div>
        <footer>
          <div>
            Authorized.net Transaction Number
            {serviceOrder?.transaction_id != null ? (
              <h2 className="text-base leading-6">{serviceOrder.transaction_id}</h2>
            ) : null}
          </div>
          {role === 'admin' ? <Button className="mt-6" label="Create Invoice" onClick={handleGenerateInvoice} /> : null}
        </footer>
      </div>
    </div>
  )
}
