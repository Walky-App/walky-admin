import { useState, useEffect } from 'react'

import { Controller, type SubmitHandler, useForm, type FieldErrors } from 'react-hook-form'
import { useParams } from 'react-router-dom'

import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Dropdown } from 'primereact/dropdown'
import { InputTextarea } from 'primereact/inputtextarea'
import { classNames } from 'primereact/utils'

import { SubHeader } from '../../../components/shared/SubHeader'
import { type IUser } from '../../../interfaces/User'
import { type IFacility } from '../../../interfaces/facility'
import { requestService } from '../../../services/requestServiceNew'
import { useUtils } from '../../../store/useUtils'
import { roleChecker } from '../../../utils/roleChecker'
import { clientFacilitiesLink } from '../../client/facilities/clientSubHeaderLinks'
import { adminFacilitiesLinks } from './adminFacilitySubHeaderLinks'

interface IDNRFormValues {
  employee: string
  reason: string
}

export const AdminFacilityDNR = () => {
  const { showToast } = useUtils()
  const { facilityId } = useParams()
  const [facility, setFacility] = useState<IFacility>()
  const [employees, setEmployees] = useState<IUser[]>([])
  const role = roleChecker()

  useEffect(() => {
    const getFacilityWithDNRusers = async () => {
      try {
        const response = await requestService({ path: `facilities/${facilityId}/dnr-users` })
        if (response.status === 200) {
          const jsonResponse: IFacility = await response.json()
          setFacility(jsonResponse)
        }
      } catch (error) {
        console.error('Error fetching facility data:', error)
      }
    }
    getFacilityWithDNRusers()
  }, [facilityId])

  useEffect(() => {
    const getEmployees = async () => {
      try {
        const response = await requestService({ path: 'users/employees' })
        if (response.status === 200) {
          const jsonResponse: IUser[] = await response.json()
          setEmployees(jsonResponse)
        }
      } catch (error) {
        console.error('Error fetching employees:', error)
      }
    }

    getEmployees()
  }, [])

  const defaultValues = {
    employee: '',
    reason: '',
  }

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({ defaultValues })

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
      const response = await requestService({
        path: `facilities/${facilityId}/dnr`,
        method: 'POST',
        body: JSON.stringify(payload),
      })
      if (response.status === 200) {
        const jsonResponse = await response.json()
        setFacility(jsonResponse)
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

  const deleteFromDNR = async (userId: string) => {
    try {
      const response = await requestService({
        path: `facilities/${facilityId}/dnr`,
        method: 'DELETE',
        body: JSON.stringify({ user_id: userId }),
      })
      if (response.status === 200) {
        const jsonResponse = await response.json()
        setFacility(jsonResponse)
        showToast({
          severity: 'success',
          summary: 'Success',
          detail: 'Employee removed from DNR list successfully',
        })
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
      {facility ? (
        <SubHeader data={facility} links={role === 'admin' ? adminFacilitiesLinks : clientFacilitiesLink} />
      ) : null}
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
                          label: `${employee.first_name} ${employee.last_name}`,
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
                        onChange={e => field.onChange(e.target.value)}
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
                value={facility?.dnr}
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
                />
                <Column field="user_id.first_name" header="First Name" />
                <Column field="user_id.last_name" header="Last Name" />
                <Column field="reason" header="Reason" />
                <Column
                  header="Delete"
                  body={rowData => (
                    <Button
                      icon="pi pi-trash"
                      rounded
                      severity="danger"
                      onClick={() => {
                        deleteFromDNR(rowData.user_id._id)
                      }}
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
