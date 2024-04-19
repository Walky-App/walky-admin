/* eslint-disable */
import { useState, useEffect } from 'react'

import { Controller, type SubmitHandler, useForm, type FieldErrors } from 'react-hook-form'
import { useParams } from 'react-router-dom'

import { Button } from 'primereact/button'
import { Calendar } from 'primereact/calendar'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Dropdown } from 'primereact/dropdown'
import { InputTextarea } from 'primereact/inputtextarea'
import { classNames } from 'primereact/utils'

import { SubHeader } from '../../../components/shared/SubHeader'
import { useAuth } from '../../../contexts/AuthContext'
import { IUser } from '../../../interfaces/User'
import { RequestService } from '../../../services/RequestService'
import { useUtils } from '../../../store/useUtils'
import { adminFacilitiesLinks } from './adminFacilitySubHeaderLinks'

interface IDNRFormValues {
  employee: string
  reason: string
}

export const AdminFacilityDNR = () => {
  const { showToast } = useUtils()
  const { user } = useAuth()
  const { facilityId } = useParams()
  const [facility, setFacility] = useState<any>({})
  const [formDNR, setFormDNR] = useState<IDNRFormValues>({
    employee: '',
    reason: '',
  })

  const [DNRList, setDNRList] = useState<IUser[]>([])
  const [employees, setEmployees] = useState<IUser[]>([])
  const [selectedEmployee, setSelectedEmployee] = useState<IUser | null>(null)

  useEffect(() => {
    const getFacility = async () => {
      try {
        const facilityFound = await RequestService(`facilities/${facilityId}`)
        setFacility(facilityFound)
      } catch (error) {
        console.error('Error fetching facility data:', error)
      }
    }
    getFacility()
  }, [])

  useEffect(() => {
    const getEmployees = async () => {
      try {
        const response = await RequestService('users/employees', 'GET')
        setEmployees(response)
      } catch (error) {
        console.error('error fetching holidays', error)
      }
    }
    getEmployees()
  }, [])

  useEffect(() => {
    const getDNRList = async () => {
      try {
        const response = await RequestService(`facilities/${facilityId}/dnr`, 'GET')
        console.log('DNR list:', response)
        setDNRList(response)
      } catch (error) {
        console.error('Error fetching DNR list:', error)
      }
    }
    if (facilityId) {
      getDNRList()
    }
  }, [DNRList])

  const defaultValues = {
    employee: formDNR?.employee,
    reason: formDNR?.reason,
  }

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
  } = useForm({ defaultValues })

  useEffect(() => {
    if (formDNR) {
      setValue('employee', formDNR?.employee)
      setValue('reason', formDNR?.reason)
    }
  }, [])

  function getFormErrorMessage(path: string, errors: FieldErrors) {
    const pathParts = path.split('.')
    let error: FieldErrors = errors

    for (const part of pathParts) {
      if (typeof error !== 'object' || error === null) {
        return null
      }
      error = error[part as keyof typeof error] as FieldErrors
    }

    if (error?.message) {
      return error.message ? <p className="mt-2 text-sm text-red-600">{String(error.message)}</p> : null
    }
    return null
  }

  const onSubmit: SubmitHandler<IDNRFormValues> = async data => {
    try {
      const payload = {
        user_id: data.employee,
        reason: data.reason,
      }
      const response = await RequestService(`facilities/${facilityId}/dnr`, 'POST', payload)

      if (response) {
        showToast({
          severity: 'success',
          summary: 'Success',
          detail: 'Employee added to DNR list successfully',
        })
        reset()
      }
    } catch (error) {
      console.error('Error:', error)
      showToast({
        severity: 'error',
        summary: 'Error',
        detail: 'Error adding employee to DNR list',
      })
    }
  }

  const deleteFromDNR = async (user_id: IUser) => {
    try {
      const response = await RequestService(`facilities/${facilityId}/dnr/`, 'DELETE')

      if (response) {
        showToast({
          severity: 'success',
          summary: 'Success',
          detail: 'Employee removed from DNR list successfully',
        })
        reset()
      }
    } catch (error) {
      console.error('Error:', error)
      showToast({
        severity: 'error',
        summary: 'Error',
        detail: 'Error removing employee from DNR list',
      })
    }
  }

  return (
    <>
      <SubHeader data={facility} links={adminFacilitiesLinks} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-12">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">DNR list </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Add an employee to the DNR list. This is a blacklist of employees who can't see your job postings.
                Select a person from the dropdown component and click button to add to the table.
              </p>
            </div>

            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
              <div className="sm:col-span-3">
                <label htmlFor="employee" className="block text-sm font-medium leading-6 text-gray-900">
                  Select Employee
                </label>
                <div className="mt-2">
                  <Controller
                    name="employee"
                    control={control}
                    rules={{ required: 'Employee selection is required' }}
                    render={({ field, fieldState }) => (
                      <Dropdown
                        id={field.name}
                        value={field.value}
                        name="employee"
                        className={classNames({ 'p-invalid': fieldState.error }, 'w-full')}
                        onChange={e => field.onChange(e.target.value)}
                        options={employees.map(employee => ({
                          value: employee._id,
                          label: `${employee.first_name} ${employee.last_name.charAt(0)}`,
                        }))}
                        optionLabel="label"
                        filter
                      />
                    )}
                  />
                </div>
                {getFormErrorMessage('employee', errors)}
              </div>
              <div className="sm:col-span-3">
                <label htmlFor="reason" className="block text-sm font-medium leading-6 text-gray-900">
                  Reason for DNR:
                </label>
                <div className="mt-2">
                  <Controller
                    name="reason"
                    control={control}
                    rules={{ required: 'Reason for DNR is required' }}
                    render={({ field, fieldState }) => (
                      <InputTextarea
                        id={field.name}
                        value={field.value}
                        name="reason"
                        className={classNames({ 'p-invalid': fieldState.error }, 'w-full')}
                        onChange={(e: { target: { value: any } }) => field.onChange(e.target.value)}
                      />
                    )}
                  />
                </div>
                {getFormErrorMessage('reason', errors)}
              </div>

              <div className="flex justify-end sm:col-span-6">
                <Button type="submit" label="Submit" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 pb-12 md:grid-cols-1">
            <div>
              <h1 className="text-xl font-bold leading-7 text-gray-900">DNR Table</h1>
              <DataTable
                value={DNRList}
                selectionMode="single"
                selection={selectedEmployee}
                // onSelectionChange={e => setSelectedEmployee(e.value)}
                // onRowSelect={e => setFormHoliday(e.data)}
                dataKey="user_id._id"
                paginator
                rows={5}
                metaKeySelection={false}
                tableStyle={{ minWidth: '50rem' }}>
                <Column
                  field="user_id.avatar"
                  header="Avatar"
                  body={rowData =>
                    rowData.user_id.avatar ? (
                      <img src={rowData.user_id.avatar} alt="Avatar" style={{ width: '50px', height: '50px' }} />
                    ) : null
                  }
                />{' '}
                <Column field="user_id.first_name" header="First Name" />
                <Column field="user_id.last_name" header="Last Name" />
                <Column field="reason" header="Reason" />
                <Column
                  header="Delete"
                  body={rowData => (
                    <Button
                      icon="pi pi-trash"
                      className="p-button-rounded p-button-danger"
                      onClick={() => deleteFromDNR(rowData.user_id)}
                    />
                  )}
                />
              </DataTable>
            </div>
          </div>
        </div>
      </form>
    </>
  )
}
