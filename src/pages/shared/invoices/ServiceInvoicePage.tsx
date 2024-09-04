import { useEffect, useMemo, useState } from 'react'

import { Link, useParams } from 'react-router-dom'

import { format } from 'date-fns'
import { Button } from 'primereact/button'
import { FloatLabel } from 'primereact/floatlabel'
import { InputNumber } from 'primereact/inputnumber'
import { InputTextarea } from 'primereact/inputtextarea'

import { TrashIcon } from '@heroicons/react/20/solid'

import { GlobalTable } from '../../../components/shared/GlobalTable'
import { HTLoadingLogo } from '../../../components/shared/HTLoadingLogo'
import { type ILog } from '../../../interfaces/logs'
import { type IServiceInvoice } from '../../../interfaces/serviceInvoice'
import { requestService } from '../../../services/requestServiceNew'
import { roleChecker } from '../../../utils/roleChecker'
import { DiscountDialog } from './DiscountDialog'
import { SendInvoiceDialog } from './SendInvoiceDialog'

export const ServiceInvoicePage = () => {
  const [invoice, setInvoice] = useState<IServiceInvoice | null>(null)
  const [discount, setDiscount] = useState<number>(0)
  const [note, setNote] = useState<string>('')
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [sendInvoiceShow, setSendInvoiceShow] = useState(false)
  const { invoiceId } = useParams()
  const role = roleChecker()
  const [logs, setLogs] = useState<ILog[]>([])

  useEffect(() => {
    const getinvoice = async () => {
      try {
        const response = await requestService({ path: `invoices/${invoiceId}` })
        if (!response.ok) {
          throw new Error('Failed to fetch service order')
        }
        const { invoice, logs } = await response.json()
        setInvoice(invoice)
        setLogs(logs)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching service order data:', error)
      }
    }

    getinvoice()
  }, [invoiceId])

  const statusDisplayText = {
    authorized: 'Authorized',
    pending_select_payment: 'Pending Payment',
    paid: 'Transaction Successful - Invoice Paid',
  }

  const handlerRegenerateInvoice = async () => {
    try {
      setIsLoading(true)
      const response = await requestService({ path: `invoices/re-generate/${invoiceId}`, method: 'POST' })
      if (!response.ok) {
        throw new Error('Failed to regenerate invoice')
      }
      const { invoice, logs } = await response.json()
      setInvoice(invoice)
      setLogs(logs)
      setIsLoading(false)
    } catch (error) {
      console.error('Error regenerating invoice:', error)
      setIsLoading(false)
    }
  }

  const handlerAuthorizeInvoice = async () => {
    try {
      setIsLoading(true)
      const response = await requestService({ path: `invoices/authorize/${invoiceId}`, method: 'POST' })
      if (!response.ok) {
        throw new Error('Failed to authorize invoice')
      }
      const { invoice, logs } = await response.json()
      setInvoice(invoice)
      setLogs(logs)
      setIsLoading(false)
    } catch (error) {
      console.error('Error authorizing invoice:', error)
      setIsLoading(false)
    }
  }

  const handlerSetDiscount = async (comment: string) => {
    try {
      setIsLoading(true)
      const response = await requestService({
        path: `invoices/discount/${invoiceId}`,
        method: 'POST',
        body: JSON.stringify({ discount, comment }),
      })
      if (!response.ok) {
        throw new Error('Failed to apply discount to invoice')
      }
      const { invoice, logs } = await response.json()
      setInvoice(invoice)
      setLogs(logs)
      setIsOpen(false)
      setIsLoading(false)
    } catch (error) {
      console.error('Error regenerating invoice:', error)
      setIsLoading(false)
    }
  }

  const handlerSetNote = async () => {
    try {
      setIsLoading(true)
      const response = await requestService({
        path: `invoices/note/${invoiceId}`,
        method: 'POST',
        body: JSON.stringify({ note }),
      })
      if (!response.ok) {
        throw new Error('Failed to send email')
      }
      const { invoice, logs } = await response.json()
      setInvoice(invoice)
      setLogs(logs)
      setIsLoading(false)
    } catch (error) {
      console.error('Error sending email:', error)
      setIsLoading(false)
    }
  }

  const handlerSendEmail = async () => {
    setSendInvoiceShow(true)
  }

  const handlerRemoveDiscount = async () => {
    try {
      setIsLoading(true)
      const response = await requestService({
        path: `invoices/discount/${invoiceId}`,
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to apply discount to invoice')
      }
      const { invoice, logs } = await response.json()
      setInvoice(invoice)
      setLogs(logs)
      setDiscount(0)
      setIsLoading(false)
    } catch (error) {
      console.error('Error regenerating invoice:', error)
      setIsLoading(false)
    }
  }

  const memoLogsColumns = useMemo(
    () => [
      { Header: 'User', accessor: 'user_id' },
      { Header: 'Event Type', accessor: 'event_type' },
      { Header: 'Created At', accessor: 'createdAt' },
    ],
    [],
  )

  return isLoading ? (
    <HTLoadingLogo />
  ) : (
    <div className="px-4 sm:px-6 lg:px-24 print:block print:text-xs">
      <DiscountDialog isOpen={isOpen} hidden={setIsOpen} handlerSetDiscount={handlerSetDiscount} />
      <SendInvoiceDialog
        invoiceId={invoiceId}
        setInvoice={setInvoice}
        setLogs={setLogs}
        setIsLoading={setIsLoading}
        setVisible={setSendInvoiceShow}
        visible={sendInvoiceShow}
      />
      <div className="my-8 flex items-center justify-between">
        <img className="w</div>-auto h-16" src="/assets/logos/logo-horizontal-cropped.png" alt="HempTemps Logo" />
        <h1 className="text-xl font-semibold leading-6">
          Invoice <br /> #{invoice?.uid}
        </h1>
      </div>
      <div className="">
        <div className="ml-6 flex items-center justify-between">
          <div>
            <h1 className="mb-6 border-b border-gray-200 text-xl font-bold">Customer: </h1>
            <h1 className="font-bold">{invoice?.company_id.company_name}</h1>
            <h2>{invoice?.company_id.company_address}</h2>
            <h2>Phone: {invoice?.company_id.company_phone_number}</h2>
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
                <th className="border border-gray-300 bg-gray-100 p-4 text-left">Invoice Status</th>
                <th className="border border-gray-300 bg-gray-100 p-4 text-left">Facility</th>
                <th className="border border-gray-300 bg-gray-100 p-4 text-left">Facility Address</th>
                {invoice?.service_order_id ? (
                  <th className="border border-gray-300 bg-gray-100 p-4 text-left">SO Ref</th>
                ) : null}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-4">
                  {statusDisplayText[invoice?.status as keyof typeof statusDisplayText] || invoice?.status}
                </td>
                <td className="border border-gray-300 p-4">
                  <h3 className="text-base font-semibold leading-6">{invoice?.facility_id.name}</h3>
                </td>
                <td className="border border-gray-300 p-4">{invoice?.facility_id.address}</td>
                {invoice?.service_order_id ? (
                  <td className="cursor-pointer border border-gray-300 p-4">
                    <Link to={`/admin/jobs/service-orders/${invoice?.service_order_id}`}>{invoice?.uid}</Link>
                  </td>
                ) : null}
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
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left font-semibold ">
                Description
              </th>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left font-semibold sm:table-cell">
                Activity
              </th>
              <th scope="col" className="hidden px-3 py-3.5 text-right font-semibold sm:table-cell">
                QTY
              </th>
              <th scope="col" className="hidden px-3 py-3.5 text-right font-semibold sm:table-cell">
                Rate
              </th>
              <th scope="col" className="hidden px-3 py-3.5 text-right font-semibold sm:table-cell">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {invoice?.details.temps_details.map((detail, index) => (
              <tr key={index}>
                <td className="flex-1 py-5 pl-4 pr-3 sm:table-cell">
                  {role === 'admin' ? (
                    <Link
                      className="cursor-pointer font-medium hover:text-primary"
                      to={`/admin/users/employees/${detail.temp_id}`}>
                      {detail.description}
                    </Link>
                  ) : (
                    <div className="font-medium">{detail.description}</div>
                  )}
                </td>
                <td className="py-5 pl-4 pr-3 text-left sm:table-cell">
                  <div className="font-medium">{detail.activity}</div>
                </td>
                <td className="hidden px-3 py-5 text-right sm:table-cell">{detail.total_worked_hours.toFixed(2)}</td>
                <td className="hidden px-3 py-5 text-right sm:table-cell">${detail.pay_rate}</td>
                <td className="hidden px-3 py-5 text-right sm:table-cell">${detail.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-12 flex">
          <div className="text-lg sm:flex-auto">
            <h2 className="mt-2 font-bold ">
              For {invoice?.job_id.title} job{' '}
              <Link
                className="cursor-pointer hover:text-primary"
                to={role === 'admin' ? `/admin/jobs/${invoice?.job_id._id}` : `/client/jobs/${invoice?.job_id._id}`}>
                #{invoice?.job_id.uid}
              </Link>{' '}
              on:
            </h2>
            <ul>
              {invoice?.job_id.job_dates.map(date => (
                <li key={date} className="mt-4">
                  {format(new Date(date), 'PPPP')}
                </li>
              ))}
            </ul>
            {invoice?.status !== 'paid' ? (
              <div>
                {!invoice?.note ? (
                  <div className="flex flex-col pb-3 print:hidden">
                    <FloatLabel>
                      <InputTextarea
                        id="note"
                        value={note}
                        onChange={e => setNote(e.target.value)}
                        rows={5}
                        cols={30}
                      />
                      <label htmlFor="note">Note</label>
                    </FloatLabel>
                    <Button className="w-1/4" label="Save note" onClick={handlerSetNote} />
                  </div>
                ) : (
                  <div>
                    <h2 className="mt-2 font-bold">Note:</h2>
                    <p>{invoice.note}</p>
                  </div>
                )}
              </div>
            ) : null}
          </div>
          <table className="flex flex-col items-end justify-end">
            {invoice?.details?.total_overtime_fees && invoice.details.total_overtime_fees > 0 ? (
              <tr>
                <th scope="row" colSpan={3} className="hidden pl-4 pr-3 pt-6 text-right sm:table-cell sm:pl-0">
                  Total Overtime Cost
                </th>
                <td className="pl-3 pr-4 pt-6 text-right sm:pr-0">
                  ${Number(invoice.details.total_overtime_fees).toFixed(2)}
                </td>
              </tr>
            ) : null}
            <tr>
              <th scope="row" colSpan={3} className="hidden pl-4 pr-3  text-right font-semibold sm:table-cell sm:pl-0">
                Subtotal
              </th>
              <td className="pl-3 pr-4 text-left sm:pr-0">${Number(invoice?.details.total_base_amount).toFixed(2)}</td>
            </tr>
            <tr>
              <th scope="row" colSpan={3} className="hidden pl-4 pr-3 pt-4 text-right sm:table-cell sm:pl-0">
                Admin Costs
              </th>
              <td className="pl-3 pr-4 pt-4 text-left sm:pr-0">
                ${Number(invoice?.details.admin_costs_total).toFixed(2)}
              </td>
            </tr>
            <tr>
              <th scope="row" colSpan={3} className="hidden pl-4 pr-3 pt-4 text-right sm:table-cell sm:pl-0">
                Our Fee
              </th>
              <td className="pl-3 pr-4 pt-4 text-left sm:pr-0">${Number(invoice?.details.our_fee).toFixed(2)}</td>
            </tr>
            <tr>
              <th scope="row" colSpan={3} className="hidden pl-4 pr-3 pt-4 text-right sm:table-cell sm:pl-0">
                Processing Fee
              </th>
              <td className="pl-3 pr-4 pt-4 text-left sm:pr-0">
                ${Number(invoice?.details.processing_fee).toFixed(2)}
              </td>
            </tr>
            <tr>
              <th scope="row" colSpan={3} className="hidden py-4 pl-4 pr-3 text-right sm:table-cell sm:pl-0">
                Estimated Total per Hour
              </th>
              <td className="py-4 pl-3 pr-4 text-left sm:pr-0">
                ${Number(invoice?.details.estimated_total_per_hour).toFixed(2)}
              </td>
            </tr>
            <tr className="flex w-full flex-1 items-center justify-end border-t-2">
              {invoice?.status !== 'paid' ? (
                <div>
                  {invoice?.details.discount ? (
                    <div className="flex">
                      <th
                        scope="row"
                        colSpan={3}
                        className="hidden w-full pl-4 pr-3 pt-4 text-right font-semibold sm:table-cell sm:pl-0 ">
                        <div className="flex items-center justify-end">
                          <TrashIcon
                            className="mr-1 h-4 w-4 text-red-600 print:hidden"
                            onClick={handlerRemoveDiscount}
                          />
                          Discount:
                        </div>
                      </th>
                      <td className="w-full pl-3 pr-4 pt-4 text-left font-semibold sm:pr-0">
                        - ${Number(invoice?.details.discount).toFixed(2)}
                      </td>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center print:hidden">
                      <th scope="row" colSpan={3} className="pr-3 pt-4">
                        <InputNumber
                          className="w-full"
                          prefix="$"
                          placeholder="Enter Discount"
                          value={discount}
                          onChange={e => setDiscount(Number(e.value))}
                        />
                      </th>
                      <td className=" pt-4">
                        <Button label="Apply" onClick={() => setIsOpen(true)} disabled={discount == 0} />
                      </td>
                    </div>
                  )}
                </div>
              ) : null}
            </tr>
            <tr>
              <th
                scope="row"
                colSpan={3}
                className="hidden pl-4 pr-3 pt-4 text-right font-semibold sm:table-cell sm:pl-0">
                Total:
              </th>
              <td className="pl-3 pr-4 pt-4 text-left font-semibold sm:pr-0">
                ${Number(invoice?.details.total_cost).toFixed(2)}
              </td>
            </tr>
          </table>
        </div>
        <footer>
          <div>
            Authorized.net Transaction Number
            {invoice?.transaction_id != null ? <h2 className="text-base leading-6">{invoice.transaction_id}</h2> : null}
          </div>
          {role === 'admin' ? (
            <Button className="mt-6 print:hidden" label="Re-generate" onClick={handlerRegenerateInvoice} />
          ) : null}

          {role === 'admin' ? (
            <Button className="ml-3 mt-6 print:hidden" label="Charge" onClick={handlerAuthorizeInvoice} />
          ) : null}

          {role === 'admin' ? (
            <Button className="ml-3 mt-6 print:hidden" label="Send invoice" onClick={handlerSendEmail} />
          ) : null}
        </footer>
      </div>
      <div className="print:hidden">
        <h1 className="my-6 border-t border-gray-200 py-2 text-xl font-bold">Activity </h1>
        {logs && logs.length > 0 ? <GlobalTable data={logs} columns={memoLogsColumns} /> : <p>No activity found</p>}
      </div>
    </div>
  )
}
