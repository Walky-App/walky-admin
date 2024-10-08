import { useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { format } from 'date-fns'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { IconField } from 'primereact/iconfield'
import { InputIcon } from 'primereact/inputicon'
import { InputText } from 'primereact/inputtext'

import { type ICompany } from '../../../interfaces/company'
import { formatPhoneNumber } from '../../../utils/dataUtils'
import { exportToExcelTable } from '../../../utils/primeReactUtils'

export const CompanyListView = ({ companies, role }: { companies: ICompany[]; role: string }) => {
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

  const paginatorRight = (
    <Button type="button" icon="pi pi-download" text onClick={() => exportToExcelTable(companies, 'companies')} />
  )

  return (
    <div className="card text-2xl">
      <DataTable
        value={companies}
        paginator
        paginatorLeft={`Total ${companies.length} Companies`}
        paginatorRight={paginatorRight}
        rows={30}
        rowsPerPageOptions={[30, 40, 50]}
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
          field="company_name"
          header="Name"
          body={company => (
            <Button
              label={company.company_name}
              className="p-button-text"
              onClick={() => navigate(`/${role}/companies/${company._id}`)}
            />
          )}
        />
        <Column
          field="company_dbas"
          header="DBA"
          body={(company: ICompany) => company.company_dbas?.join(', ') ?? ''}
        />
        <Column field="company_tax_id" header="Tax ID" />
        <Column
          field="createdAt"
          header="Created Date"
          body={(company: ICompany) =>
            company && company.createdAt ? format(new Date(company.createdAt), 'P') : 'N/A'
          }
        />
        <Column
          field="company_phone_number"
          header="Phone"
          body={(company: ICompany) => formatPhoneNumber(company.company_phone_number)}
        />
        <Column
          field="payment_information"
          header="Payment Information"
          body={(company: ICompany) => company?.payment_information?.length}
        />
        <Column field="company_address" header="Address" />
        <Column field="company_city" header="City" />
        <Column field="company_state" header="State" />
        <Column field="company_zip" header="Zip" />
        <Column field="facilities" header="Facilities" body={(company: ICompany) => company.facilities.length} />
      </DataTable>
    </div>
  )
}
