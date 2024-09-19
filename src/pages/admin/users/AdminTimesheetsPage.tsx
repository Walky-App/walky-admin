import { useEffect, useState } from 'react'

import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { IconField } from 'primereact/iconfield'
import { InputIcon } from 'primereact/inputicon'
import { InputText } from 'primereact/inputtext'

import { HTLoadingLogo } from '../../../components/shared/HTLoadingLogo'
import { type IUser } from '../../../interfaces/User'
import { requestService } from '../../../services/requestServiceNew'
import { AdminEmployeeTimesheetTable } from './components/AdminEmployeeTimesheetTable'

export const AdminTimesheetsPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<IUser>()
  const [usersData, setUsersData] = useState<IUser[]>([])
  const [globalFilter, setGlobalFilter] = useState<string>('')

  useEffect(() => {
    setIsLoading(true)
    const getActiveEmployees = async () => {
      try {
        const response = await requestService({ path: 'users/employees/active' })
        const data = await response.json()

        if (!response.ok) throw new Error(data.message ?? 'Failed to fetch users')

        setUsersData(data as IUser[])
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    getActiveEmployees()
  }, [])

  const handleDropdownOptions = () => {
    return usersData
      .sort((a, b) => a.last_name.localeCompare(b.last_name))
      .map(applicant => ({ label: applicant.first_name + ' ' + applicant.last_name, value: applicant }))
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

  return isLoading ? (
    <HTLoadingLogo />
  ) : (
    <div className="flex">
      <DataTable
        header={getHeader()}
        dataKey="_id"
        editMode="cell"
        value={handleDropdownOptions()}
        emptyMessage={isLoading ? 'Loading...' : 'No timesheets found'}
        size="small"
        paginator
        rows={50}
        globalFilter={globalFilter}
        stripedRows
        scrollable
        scrollHeight="calc(100vh - 300px)"
        showGridlines
        pt={{
          header: {
            className: 'font-normal text-sm text-gray-500',
          },
        }}>
        <Column
          field="label"
          header={usersData.length + ' Employees'}
          sortable={false}
          body={rowData => <Button text label={rowData.label} onClick={() => setSelectedUser(rowData.value)} />}
        />
      </DataTable>
      <AdminEmployeeTimesheetTable selectedUser={selectedUser ?? ({} as IUser)} />
    </div>
  )
}
