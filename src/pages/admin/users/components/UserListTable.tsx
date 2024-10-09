import { useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { format } from 'date-fns'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { IconField } from 'primereact/iconfield'
import { InputIcon } from 'primereact/inputicon'
import { InputText } from 'primereact/inputtext'

import { type IUser } from '../../../../interfaces/User'
import { exportToExcelTable } from '../../../../utils/primeReactUtils'
import { roleChecker } from '../../../../utils/roleChecker'

export const UserListTable = ({ data, userType }: { data: IUser[]; userType: string }) => {
  const [globalFilter, setGlobalFilter] = useState<string>('')

  const navigate = useNavigate()
  const role = roleChecker()

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

  const imageBodyTemplate = (user: IUser) => {
    return (
      <img
        src={user.avatar ? user.avatar : '/assets/photos/no-photo-found.jpg'}
        alt={user.avatar}
        className="h-32 w-32 rounded-md object-cover"
      />
    )
  }

  const paginatorRight = (
    <Button type="button" icon="pi pi-download" text onClick={() => exportToExcelTable(data, userType)} />
  )

  return (
    <>
      <h1 className="font-bold">{userType}</h1>
      <DataTable
        value={data}
        paginator
        paginatorLeft={`Total ${data.length} - ${userType}`}
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
        <Column header="Image" body={imageBodyTemplate} />
        <Column
          field="first_name"
          header="Name"
          sortable
          body={user => (
            <Button
              label={user.first_name + ' ' + user.last_name}
              className="p-button-text"
              onClick={() => navigate(`/${role}/users/${user._id}`)}
            />
          )}
        />
        <Column
          field="is_active"
          sortable
          header="Approved"
          body={(user: IUser) => (user?.is_active ? '✅' : '❌')}
        />
        <Column
          field="onboarding.completed"
          sortable
          header="Onboarded"
          body={(user: IUser) => (user?.is_onboarded ? '✅' : '❌')}
        />
      
        <Column field="city" header="City" />
        <Column field="state" header="State" />
        <Column
          field="createdAt"
          header="Created Date"
          body={(user: IUser) => (user && user.createdAt ? format(new Date(user.createdAt), 'P') : 'N/A')}
        />
      </DataTable>
    </>
  )
}
