/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */

/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useEffect, useState } from 'react'

import { Link, useParams } from 'react-router-dom'

import { formatInTimeZone } from 'date-fns-tz'
import { Button } from 'primereact/button'
import { confirmPopup, ConfirmPopup } from 'primereact/confirmpopup'
import { Dropdown } from 'primereact/dropdown'
import { FloatLabel } from 'primereact/floatlabel'
import { InputNumber } from 'primereact/inputnumber'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { classNames } from 'primereact/utils'

import { TrashIcon } from '@heroicons/react/20/solid'
import { ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/outline'

import { HTLoadingLogo } from '../../../components/shared/HTLoadingLogo'
import { Feedback } from '../../../components/shared/dialog/Feedback'
import { HtInfoTooltip } from '../../../components/shared/general/HtInfoTooltip'
import { type ILog } from '../../../interfaces/logs'
import { type IServiceInvoice } from '../../../interfaces/serviceInvoice'
import { requestService } from '../../../services/requestServiceNew'
import { useUtils } from '../../../store/useUtils'
import { roleChecker } from '../../../utils/roleChecker'
import { LogsActivityTable } from '../../LogsActivityTable'
import { DiscountDialog } from './DiscountDialog'
import { SendInvoiceDialog } from './SendInvoiceDialog'

interface IdetailsTarget {
  temp_id?: string
  shifts_days?: Date[]
  total_worked_hours: number
  estimated_total_per_hour: number
  regular_hours: number
  overtime_hours: number
  description: string
  role: string
  activity: string
  pay_rate: number
  amount: number
}

export const ServiceInvoicePage = () => {
  const [invoice, setInvoice] = useState<IServiceInvoice | null>(null)
  const [discount, setDiscount] = useState<number>(0)
  const [status, setStatus] = useState(invoice?.status)
  const [isEditingStatus, setIsEditingStatus] = useState(false)
  const [note, setNote] = useState<string>('')
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isChargeButtonLoading, setIsChargeButtonLoading] = useState(false)
  const [sendInvoiceShow, setSendInvoiceShow] = useState(false)
  const { invoiceId } = useParams()
  const { showToast } = useUtils()
  const role = roleChecker()
  const [logs, setLogs] = useState<ILog[]>([])
  const [detailTarget, setDetailTarget] = useState<IdetailsTarget>({
    temp_id: '',
    shifts_days: [],
    total_worked_hours: 0,
    estimated_total_per_hour: 0,
    regular_hours: 0,
    overtime_hours: 0,
    description: '',
    role: '',
    activity: '',
    pay_rate: 0,
    amount: 0,
  })
  const [quickbooksId, setQuickbooksId] = useState<string>('')
  const [isOpenFeedback, setIsOpenFeedback] = useState<boolean>(false)
  const [objectId, setObjectId] = useState<string>('')
  const [jobId, setJobId] = useState<string>('')

  const handleFeedback = (id: string, job_id: string) => {
    setObjectId(id)
    setJobId(job_id)
    setIsOpenFeedback(true)
  }

  useEffect(() => {
    if (!isOpenFeedback && objectId !== '') {
      setInvoice(prevInvoice => {
        if (prevInvoice) {
          return {
            ...prevInvoice,
            job_id: {
              ...prevInvoice.job_id,
              applicants_feedback_ids: [...prevInvoice.job_id.applicants_feedback_ids, objectId],
            },
          }
        }
        return prevInvoice
      })
    }
  }, [isOpenFeedback, objectId])

  useEffect(() => {
    const getinvoice = async () => {
      try {
        const response = await requestService({ path: `invoices/${invoiceId}` })
        if (!response.ok) {
          throw new Error('Failed to fetch service order')
        }
        const { invoice, logs } = await response.json()
        setInvoice(invoice)
        setStatus(invoice.status)
        setLogs(logs)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching service order data:', error)
      }
    }

    getinvoice()
  }, [invoiceId])

  const statusOptions = [
    { label: 'Authorized', value: 'authorized' },
    { label: 'Transaction Successful - Invoice Paid', value: 'paid' },
  ]

  const statusDisplayText = {
    authorized: 'Authorized',
    pending_select_payment: 'Pending Payment',
    authorizedPendingCapture: 'Authorized Pending Capture',
    capturedPendingSettlement: 'Transaction Successful - Captured Pending Settlement',
    paid: 'Transaction Successful - Invoice Paid',
  }

  const handleStatusChange = (e: { value: string }) => {
    setStatus(e.value)
  }
  const handleStatusClick = async () => {
    if (invoice?.service_order_id?.ach_authorized) {
      setIsEditingStatus(true)
    } else {
      try {
        setIsLoading(true)
        const response = await requestService({ path: `invoices/refresh-authorize/${invoiceId}`, method: 'GET' })
        if (!response.ok) {
          throw new Error('Failed to regenerate invoice')
        }
        const { invoice } = await response.json()
        setStatus(invoice.status)
        setIsLoading(false)
      } catch (error) {
        console.error('Error regenerating invoice:', error)
        setIsLoading(false)
      }
    }
  }

  const handleSave = async () => {
    try {
      const response = await requestService({
        path: `invoices/${invoiceId}/change-status`,
        method: 'PATCH',
        body: JSON.stringify({ status }),
      })
      if (!response.ok) {
        throw new Error('Failed to update invoice status')
      }
      showToast({ severity: 'success', summary: 'Invoice status updated successfully' })
      setIsEditingStatus(false)
    } catch (error) {
      console.error('Error updating invoice status: ', error)
      showToast({ severity: 'error', summary: 'Failed to update invoice status' })
    }
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
      setIsChargeButtonLoading(true)
      const response = await requestService({ path: `invoices/authorize/${invoiceId}`, method: 'POST' })
      if (!response.ok) {
        throw new Error('Failed to authorize invoice')
      }
      const { invoice, logs } = await response.json()
      setInvoice(invoice)
      setLogs(logs)
      setIsLoading(false)
      setIsChargeButtonLoading(false)

      showToast({
        severity: 'success',
        summary: 'Success',
        detail: 'Invoice charged successfully',
      })
    } catch (error) {
      console.error('Error authorizing invoice:', error)
      setIsLoading(false)
      setIsChargeButtonLoading(false)
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

  const handleSendBuyoutNotificationToAdmin =
    (employeeName: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()

      const accept = async () => {
        try {
          const response = await requestService({
            path: `invoices/buyout-employee`,
            method: 'POST',
            body: JSON.stringify({ invoiceId, employeeName }),
          })

          if (response.status === 204) {
            showToast({
              severity: 'success',
              summary: 'Success',
              detail: 'Administrators have been notified of your intention to buyout this employee',
            })
          } else if (response.ok) {
            const data = await response.json()
            showToast({ severity: 'success', summary: 'Success', detail: data.message })
          }
        } catch (error) {
          console.error(error)
          showToast({ severity: 'error', summary: 'Error', detail: 'Error notifying administrators' })
        }
      }

      const reject = () => {
        showToast({ severity: 'warn', summary: 'Cancelled', detail: 'Buyout process cancelled' })
      }

      confirmPopup({
        target: event.currentTarget as HTMLElement,
        message: `Do you want to notify administrators about your intention to ${employeeName} purchase employee contract?`,
        icon: 'pi pi-info-circle',
        defaultFocus: 'reject',
        acceptClassName: 'p-button-danger',
        accept,
        reject,
      })
    }

  const handlerSelectTarget = (details: IdetailsTarget) => {
    if (detailTarget.temp_id !== details.temp_id) {
      setDetailTarget(details)
    }
  }

  const saveSelectTarget = async () => {
    try {
      setIsLoading(true)
      const body = {
        detailTarget,
        invoice_id: invoiceId,
      }
      const response = await requestService({
        path: `invoices/details-temp`,
        method: 'PATCH',
        body: JSON.stringify(body),
      })
      if (!response.ok) {
        throw new Error('Failed to apply discount to invoice')
      }
      const { invoice, logs } = await response.json()
      setInvoice(invoice)
      setLogs(logs)
      resetSelectTarget()
      setIsLoading(false)
    } catch (error) {
      console.error('Error regenerating invoice:', error)
      setIsLoading(false)
    }
  }

  const resetSelectTarget = () => {
    setDetailTarget({
      temp_id: '',
      shifts_days: [],
      total_worked_hours: 0,
      estimated_total_per_hour: 0,
      regular_hours: 0,
      overtime_hours: 0,
      description: '',
      role: '',
      activity: '',
      pay_rate: 0,
      amount: 0,
    })
  }

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && quickbooksId !== '') {
      try {
        setIsLoading(true)
        const response = await requestService({
          path: `invoices/quickbooks/${invoiceId}`,
          method: 'PATCH',
          body: JSON.stringify({ quickbooksId }),
        })
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
  }

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
      <Feedback isOpen={isOpenFeedback} hidden={setIsOpenFeedback} objectId={objectId} jobId={jobId} />
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
                <th className="border border-gray-300 bg-[var(--surface-card)] p-4 text-left">Invoice Status</th>
                <th className="border border-gray-300 bg-[var(--surface-card)] p-4 text-left">Payment Type</th>
                {role === 'admin' ? (
                  <th className="border border-gray-300 bg-[var(--surface-card)] p-4 text-left print:hidden">
                    Quickbooks Id
                  </th>
                ) : null}
                <th className="border border-gray-300 bg-[var(--surface-card)] p-4 text-left">Facility</th>
                <th className="border border-gray-300 bg-[var(--surface-card)] p-4 text-left">Facility Address</th>
                {invoice?.service_order_id ? (
                  <th className="border border-gray-300 bg-[var(--surface-card)] p-4 text-left">SO#</th>
                ) : null}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  className={`border border-gray-300 p-4 ${role === 'admin' && !isEditingStatus ? 'hover:text-green-500' : ''}`}
                  onClick={role === 'admin' && !isEditingStatus ? handleStatusClick : undefined}>
                  {isEditingStatus ? (
                    role === 'admin' && invoice?.service_order_id?.ach_authorized ? (
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Dropdown
                          value={status}
                          options={statusOptions}
                          onChange={handleStatusChange}
                          placeholder={statusDisplayText[status as keyof typeof statusDisplayText] || status}
                          style={{ marginRight: '10px' }}
                        />
                        <Button icon="pi pi-save" onClick={handleSave} />
                      </div>
                    ) : (
                      statusDisplayText[status as keyof typeof statusDisplayText] || status
                    )
                  ) : (
                    statusDisplayText[status as keyof typeof statusDisplayText] || status
                  )}
                </td>
                <td className="border border-gray-300 p-4">
                  {invoice?.service_order_id?.ach_authorized ? 'ACH' : 'Credit Card'}
                </td>
                {role === 'admin' ? (
                  <td className="border border-gray-300 p-4 print:hidden">
                    {invoice?.quickbooks_id ? (
                      <h3 className="text-base leading-6">{invoice?.quickbooks_id}</h3>
                    ) : (
                      <InputText
                        placeholder="Quickbooks Id"
                        value={invoice?.quickbooks_id}
                        onChange={e => setQuickbooksId(e.target.value)}
                        onKeyDown={handleKeyDown}
                      />
                    )}
                  </td>
                ) : null}
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
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left font-semibold">
                Description
              </th>
              {role === 'client' ? (
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left font-semibold print:hidden">
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    Buyout
                    <HtInfoTooltip
                      className="ml-2"
                      message="Select 'Buyout' if you wish to continue working with this individual independently of HempTemps."
                    />
                  </span>
                </th>
              ) : null}
              <th scope="col" className="table-cell py-3.5 pl-4 pr-3 text-left font-semibold">
                Activity
              </th>
              <th scope="col" className="table-cell px-3 py-3.5 text-right font-semibold">
                QTY
              </th>
              <th scope="col" className="table-cell px-3 py-3.5 text-right font-semibold">
                OT
              </th>
              <th scope="col" className="table-cell px-3 py-3.5 text-right font-semibold">
                Total
              </th>
              <th scope="col" className="table-cell px-3 py-3.5 text-right font-semibold">
                Rate
              </th>
              <th scope="col" className="table-cell px-3 py-3.5 text-right font-semibold">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {invoice?.details.temps_details.map((detail, index) => (
              <tr key={index}>
                <td className="table-cell flex-1 py-5 pl-4 pr-3">
                  {role === 'admin' ? (
                    <Link
                      className="cursor-pointer font-medium hover:text-primary"
                      to={`/admin/users/employees/${detail.temp_id}`}>
                      {detail.description}
                    </Link>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="font-medium">{detail.description}</div>
                      {invoice.job_id.applicants_feedback_ids.some(feedback => feedback === detail.temp_id) ? null : (
                        <Button
                          className="min-h-5 min-w-5 p-1 print:hidden"
                          onClick={() => handleFeedback(detail.temp_id, invoice.job_id._id)}>
                          <ChatBubbleLeftEllipsisIcon className="h-5 w-5" />
                        </Button>
                      )}
                    </div>
                  )}
                </td>
                {role === 'client' ? (
                  <td className="table-cell py-5 pl-4 pr-3 text-left print:hidden">
                    <ConfirmPopup className="shadow-sm" />
                    <Button
                      label="Hire"
                      className="ml-2"
                      outlined
                      size="small"
                      onClick={event => {
                        const name = detail.description
                          .replace(/Supervisor/g, '')
                          .trim()
                          .split(' ')[0]
                        handleSendBuyoutNotificationToAdmin(name)(event)
                      }}
                    />
                  </td>
                ) : null}
                <td className="table-cell py-5 pl-4 pr-3 text-left">
                  <div className="font-medium">{detail.activity}</div>
                </td>
                {role === 'admin' ? (
                  <td
                    className="table-cell cursor-pointer px-3 py-5 text-right hover:text-primary"
                    onClick={() => handlerSelectTarget(detail)}>
                    {detail.temp_id === detailTarget.temp_id ? (
                      <InputNumber
                        inputClassName={classNames('w-20 p-1 text-right')}
                        locale="en-US"
                        value={detailTarget.regular_hours}
                        onValueChange={e => setDetailTarget({ ...detailTarget, regular_hours: e.value as number })}
                        minFractionDigits={2}
                      />
                    ) : (
                      detail.regular_hours.toFixed(2)
                    )}
                  </td>
                ) : (
                  <td className="table-cell px-3 py-5 text-right ">{detail.regular_hours.toFixed(2)}</td>
                )}
                {role === 'admin' ? (
                  <td
                    className="table-cell px-3 py-5 text-right hover:text-primary"
                    onClick={() => handlerSelectTarget(detail)}>
                    {detail.temp_id === detailTarget.temp_id ? (
                      <InputNumber
                        inputClassName={classNames('w-20 p-1 text-right')}
                        locale="en-US"
                        value={detailTarget.overtime_hours}
                        onValueChange={e => setDetailTarget({ ...detailTarget, overtime_hours: e.value as number })}
                        minFractionDigits={2}
                      />
                    ) : (
                      detail.overtime_hours.toFixed(2)
                    )}
                  </td>
                ) : (
                  <td className="table-cell px-3 py-5 text-right">{detail.overtime_hours.toFixed(2)}</td>
                )}
                <td className="table-cell px-3 py-5 text-right">{detail.total_worked_hours.toFixed(2)}</td>
                <td className="table-cell px-3 py-5 text-right">${detail.pay_rate}</td>
                <td className="table-cell px-3 py-5 text-right">${detail.amount.toFixed(2)}</td>
                {detail.temp_id === detailTarget.temp_id ? (
                  <td className="table-cell px-3 py-5 text-right">
                    <Button className="mr-2" onClick={saveSelectTarget} icon="pi pi-save" />
                    <Button onClick={resetSelectTarget} icon="pi pi-undo" severity="danger" />
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-12 flex">
          <div className="text-lg sm:flex-auto">
            <table className="mb-7 w-2/3 border-collapse border">
              <thead>
                <tr>
                  <th className="border border-gray-300 bg-[var(--surface-card)] p-4 text-left">
                    <h2 className="font-bold">
                      For Job: Id&nbsp;
                      <Link
                        className="cursor-pointer underline hover:text-primary"
                        to={
                          role === 'admin'
                            ? `/admin/jobs/${invoice?.job_id._id}`
                            : `/client/jobs/${invoice?.job_id._id}`
                        }>
                        #{invoice?.job_id.uid}
                      </Link>
                    </h2>
                  </th>
                  <th className="border border-gray-300 bg-[var(--surface-card)] p-4 text-left">Summary</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-4">
                    <ul>
                      {invoice?.job_id.job_dates.map(date => (
                        <li key={date} className="mt-4">
                          {formatInTimeZone(date, invoice.facility_id.timezone, 'EEE, MMM dd, yyyy')}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="border border-gray-300 p-4">
                    <ul className="text-base">
                      <li className="flex flex-row text-left">
                        <div className="pr-2">Total Hour:</div>
                        {Number(invoice?.details.total_of_all_temps_hours).toFixed(2)}
                      </li>
                      {invoice?.details?.total_overtime_fees && invoice.details.total_overtime_fees > 0 ? (
                        <li className="flex flex-row py-2 text-left">
                          <div className="pr-2">Overtime Cost (Included in subtotal):</div>$
                          {Number(invoice.details.total_overtime_fees).toFixed(2)}
                        </li>
                      ) : null}
                      <li className="flex flex-row text-left">
                        <div className="pr-2">Estimated Total per Hour:</div>$
                        {Number(invoice?.details.estimated_total_per_hour).toFixed(2)}
                      </li>
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>

            {invoice?.status !== 'paid' && role === 'admin' ? (
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
            {role !== 'admin' && invoice?.note ? (
              <div>
                <h2 className="mt-2 font-bold">Note:</h2>
                <p>{invoice.note}</p>
              </div>
            ) : null}
          </div>
          <table className="flex flex-col items-end">
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
              <th scope="row" colSpan={3} className="hidden py-4 pl-4 pr-3 text-right sm:table-cell sm:pl-0">
                Processing Fee
              </th>
              <td className="py-4 pl-3 pr-4 text-left sm:pr-0">
                ${Number(invoice?.details.processing_fee).toFixed(2)}
              </td>
            </tr>
            {role === 'admin' ? (
              <tr className="flex w-full flex-1 items-center justify-end border-t-2">
                {invoice?.details.discount ?? 0 ? (
                  <tr>
                    <th
                      scope="row"
                      colSpan={3}
                      className="hidden pl-4 pr-3 pt-4 text-right font-semibold sm:table-cell sm:pl-0">
                      <div className="flex items-center">
                        {invoice?.status !== 'paid' ? (
                          <TrashIcon
                            className="mr-1 h-4 w-4 text-red-600 print:hidden"
                            onClick={handlerRemoveDiscount}
                          />
                        ) : null}
                        Discount (Reason: {invoice?.details.discount_reason || 'N/A'}):
                      </div>
                    </th>
                    <td className="pl-3 pr-4 pt-4 text-left font-semibold sm:pr-0">
                      - ${Number(invoice?.details.discount).toFixed(2)}
                    </td>
                  </tr>
                ) : (
                  <div className="flex items-center justify-center print:hidden">
                    <th scope="row" colSpan={3} className="pr-3 pt-4">
                      <InputNumber
                        className="w-full"
                        locale="en-US"
                        minFractionDigits={2}
                        maxFractionDigits={2}
                        placeholder="Enter Discount"
                        value={discount}
                        onChange={e => e.value !== null && setDiscount(e.value)}
                      />
                    </th>
                    <td className=" pt-4">
                      <Button label="Apply" onClick={() => setIsOpen(true)} disabled={discount == 0} />
                    </td>
                  </div>
                )}
              </tr>
            ) : null}
            {role !== 'admin' && invoice?.details.discount ? (
              <tr className="flex w-full items-center justify-end border-t-2">
                <div className="flex">
                  <th
                    scope="row"
                    colSpan={3}
                    className="hidden w-full pl-4 pr-3 pt-4 text-right font-semibold sm:table-cell sm:pl-0">
                    <div className="flex items-center justify-end">
                      <TrashIcon className="mr-1 h-4 w-4 text-red-600 print:hidden" onClick={handlerRemoveDiscount} />
                      Discount:
                    </div>
                  </th>
                  <td className="w-full pl-3 pr-4 pt-4 text-left font-semibold sm:pr-0">
                    - ${Number(invoice?.details.discount).toFixed(2)}
                  </td>
                </div>
              </tr>
            ) : (
              <tr className="flex w-full items-center justify-end border-t-2" />
            )}
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
            {invoice?.transaction_id != null ? (
              <h2 className="text-base leading-6"> Authorize.net Transaction Number - {invoice.transaction_id}</h2>
            ) : null}
          </div>
          {role === 'admin' ? (
            <Button className="mt-6 print:hidden" label="Re-generate" onClick={handlerRegenerateInvoice} />
          ) : null}

          {role === 'admin' && !invoice?.service_order_id?.ach_authorized ? (
            <Button
              disabled={invoice?.status === 'paid'}
              loading={isChargeButtonLoading}
              className="ml-3 mt-6 print:hidden"
              label="Charge"
              onClick={handlerAuthorizeInvoice}
            />
          ) : null}

          {role === 'admin' ? (
            <Button className="ml-3 mt-6 print:hidden" label="Send invoice" onClick={handlerSendEmail} />
          ) : null}
        </footer>
      </div>
      {role === 'admin' ? <LogsActivityTable data={logs} /> : null}
    </div>
  )
}
