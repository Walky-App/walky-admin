import { useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { isToday, isYesterday, format } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { IconField } from 'primereact/iconfield'
import { InputIcon } from 'primereact/inputicon'
import { InputText } from 'primereact/inputtext'

import { type IServiceInvoice } from '../../../interfaces/serviceInvoice'
import { exportToExcelTable } from '../../../utils/primeReactUtils'
import { roleChecker } from '../../../utils/roleChecker'

export const ServiceInvoicesListView = ({ invoices }: { invoices: IServiceInvoice[] }) => {
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const navigate = useNavigate()
  const role = roleChecker()

  const rowClassName = (invoice: IServiceInvoice) => {
    if (invoice.status === 'paid') {
      return 'bg-green-100 bg-opacity-50'
    }
  }

  const getHeader = () => {
    return (
      <div className="justify-content-end flex">
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText
            type="search"
            onInput={(e: React.ChangeEvent<HTMLInputElement>) => setGlobalFilter(e.target.value)}
            placeholder="Search..."
          />
        </IconField>
      </div>
    )
  }

  const paginatorRight = (
    <Button type="button" icon="pi pi-download" text onClick={() => exportToExcelTable(invoices, 'invoices')} />
  )

  return (
    <div className="card text-2xl">
      <DataTable
        value={invoices}
        paginator
        paginatorLeft={`Total ${invoices.length} invoices`}
        paginatorRight={paginatorRight}
        rows={20}
        rowsPerPageOptions={[20, 40, 50]}
        sortOrder={-1}
        rowClassName={rowClassName}
        sortField="createdAt"
        scrollable
        scrollHeight="calc(100vh - 300px)"
        frozenWidth="200px"
        dataKey="_id"
        className="text-lg"
        globalFilter={globalFilter}
        header={getHeader()}
        resizableColumns
        showGridlines
        tableStyle={{ minWidth: '50rem' }}>
        <Column
          frozen
          field="uid"
          header="Invoice ID"
          body={invoice => (
            <Button text label={invoice.uid} onClick={() => navigate(`/${role}/invoices/${invoice._id}`)} />
          )}
        />
        <Column field="status" header="Status" />
        <Column
          field="quickbooks_id"
          header="QuickBooks ID"
          body={invoice => (invoice.quickbooks_id ? invoice.quickbooks_id : '🚫 No ID')}
        />
        <Column
          field="service_order_id.ach_authorized"
          header="Payment type"
          body={invoice => (invoice.service_order_id.ach_authorized ? 'ACH' : 'CC')}
        />
        <Column
          field="createdAt"
          header="Created"
          body={invoice =>
            isToday(invoice.createdAt)
              ? 'Today'
              : isYesterday(invoice.createdAt)
                ? 'Yesterday'
                : format(invoice.createdAt, 'P')
          }
        />
        <Column
          field="company_id.company_name"
          header="Company Name"
          body={invoice => (
            <Button
              text
              label={invoice.company_id.company_name}
              onClick={() => navigate(`/${role}/companies/${invoice.company_id._id}`)}
            />
          )}
        />
        <Column field="job_id.title" header="Job Title" />
        <Column
          field="job_id.uid"
          header="Job UID"
          body={invoice => (
            <Button text label={invoice.job_id.uid} onClick={() => navigate(`/${role}/jobs/${invoice.job_id._id}`)} />
          )}
        />
        <Column
          field="job_id.job_dates[0]"
          header="Job Start Date"
          body={(invoice: IServiceInvoice) => {
            const startDate = new Date(invoice.job_id.job_dates[0])
            const zonedStartDate = toZonedTime(startDate, invoice.facility_id.timezone)
            return format(zonedStartDate, 'MMM d')
          }}
        />
        <Column
          field="job_id.job_dates[job_id.job_dates.length - 1]"
          header="Job End Date"
          body={(invoice: IServiceInvoice) => {
            const endDate = new Date(invoice.job_id.job_dates[invoice.job_id.job_dates.length - 1])
            const zonedEndDate = toZonedTime(endDate, invoice.facility_id.timezone)
            return format(zonedEndDate, 'MMM d')
          }}
        />
        <Column
          field="facility_id.name"
          header="Facility Name"
          body={invoice => (
            <Button
              text
              label={invoice.facility_id.name}
              onClick={() => navigate(`/${role}/facilities/${invoice.facility_id._id}`)}
            />
          )}
        />
        <Column field="created_by" header="Created By" />
        <Column field="details.total_cost" header="Total Cost, $" />
      </DataTable>
    </div>
  )
}
