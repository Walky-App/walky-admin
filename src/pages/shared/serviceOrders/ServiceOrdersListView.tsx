import { useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { format } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { IconField } from 'primereact/iconfield'
import { InputIcon } from 'primereact/inputicon'
import { InputText } from 'primereact/inputtext'

import { type IServiceOrder } from '../../../interfaces/serviceOrder'
import { exportToExcelTable } from '../../../utils/primeReactUtils'

export const ServiceOrdersListView = ({ serviceOrders, role }: { serviceOrders: IServiceOrder[]; role: string }) => {
  const [globalFilter, setGlobalFilter] = useState<string>('')

  const navigate = useNavigate()

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

  const rowClassName = (serviceOrder: IServiceOrder) => {
    const endDate = new Date(serviceOrder.job_id.job_dates[serviceOrder.job_id.job_dates.length - 1])
    const zonedEndDate = toZonedTime(endDate, serviceOrder.facility_id.timezone)

    if (!serviceOrder.service_invoice_id && zonedEndDate < new Date() && serviceOrder.status === 'authorized') {
      return 'bg-yellow-100 text-black'
    }

    if (!serviceOrder.service_invoice_id && serviceOrder.status === 'authorized') {
      return 'text-black'
    }

    if (
      serviceOrder.status === 'authorized' &&
      serviceOrder.service_invoice_id &&
      serviceOrder.service_invoice_id.status === 'paid'
    ) {
      return 'bg-green-100 text-black'
    }

    if (serviceOrder.status === 'pending_select_payment') {
      return 'bg-red-100 text-black'
    }
  }

  const paginatorRight = (
    <Button
      type="button"
      icon="pi pi-download"
      text
      onClick={() => exportToExcelTable(serviceOrders, 'service-orders')}
    />
  )

  return (
    <div className="card text-2xl">
      <DataTable
        value={serviceOrders}
        paginator
        paginatorLeft={`Total ${serviceOrders.length} Service Orders`}
        paginatorRight={paginatorRight}
        rows={20}
        rowsPerPageOptions={[20, 40, 50]}
        rowClassName={rowClassName}
        sortOrder={-1}
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
          header="SO UID"
          body={serviceOrder => (
            <Button
              text
              label={serviceOrder.uid}
              onClick={() => navigate(`/${role}/jobs/service-orders/${serviceOrder._id}`)}
            />
          )}
        />
        <Column
          field="service_invoice_id"
          sortable
          header="Invoice UID"
          body={serviceOrder =>
            serviceOrder.service_invoice_id ? (
              <Button
                text
                label={serviceOrder.service_invoice_id.uid}
                onClick={() => navigate(`/${role}/invoices/${serviceOrder.service_invoice_id._id}`)}
              />
            ) : (
              'No Invoice'
            )
          }
        />
        <Column field="status" sortable header="Status" />
        <Column
          field="ach_authorized"
          sortable
          header="Payment Type"
          body={serviceOrder => {
            if (serviceOrder.ach_authorized) {
              return 'ACH'
            } else if (serviceOrder.transaction_id) {
              return 'CC'
            } else {
              return ''
            }
          }}
        />
        <Column
          field="company_id.company_name"
          header="Company Name"
          body={serviceOrder => (
            <Button
              text
              label={serviceOrder.company_id.company_name}
              onClick={() => navigate(`/${role}/companies/${serviceOrder.company_id._id}`)}
            />
          )}
        />
        <Column field="job_id.title" header="Job Title" />
        <Column
          field="job_id.uid"
          header="Job UID"
          body={serviceOrder => (
            <Button
              text
              label={serviceOrder.job_id.uid}
              onClick={() => navigate(`/${role}/jobs/${serviceOrder.job_id._id}`)}
            />
          )}
        />

        <Column
          field="job_id.job_dates"
          header="Job Start Date"
          sortable
          body={(serviceOrder: IServiceOrder) => {
            const startDate = new Date(serviceOrder.job_id.job_dates[0])
            const zonedStartDate = toZonedTime(startDate, serviceOrder.facility_id.timezone)
            return format(zonedStartDate, 'MMM d')
          }}
        />
        <Column
          field="job_id.job_dates[job_id.job_dates.length - 1]"
          header="Job End Date"
          body={(serviceOrder: IServiceOrder) => {
            const endDate = new Date(serviceOrder.job_id.job_dates[serviceOrder.job_id.job_dates.length - 1])
            const zonedEndDate = toZonedTime(endDate, serviceOrder.facility_id.timezone)
            return format(zonedEndDate, 'MMM d')
          }}
        />
        <Column
          field="facility_id.name"
          header="Facility Name"
          body={serviceOrder => (
            <Button
              text
              label={serviceOrder.facility_id.name}
              onClick={() => navigate(`/${role}/facilities/${serviceOrder.facility_id._id}`)}
            />
          )}
        />
        <Column field="created_by" header="Created By" />
      </DataTable>
    </div>
  )
}
