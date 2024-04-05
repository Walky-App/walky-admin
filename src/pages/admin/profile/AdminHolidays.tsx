import { useState, useRef, useEffect, type SetStateAction } from 'react'

import { Controller, type SubmitHandler, useForm, type FieldErrors } from 'react-hook-form'

import { Button } from 'primereact/button'
import { Calendar } from 'primereact/calendar'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { InputText } from 'primereact/inputtext'
import { Toast } from 'primereact/toast'
import { classNames } from 'primereact/utils'

import { useAuth } from '../../../contexts/AuthContext'
import { RequestService } from '../../../services/RequestService'

interface IHoliday {
  _id?: string
  holiday_name?: string
  holiday_date?: Date
  created_by?: string
  updated_by?: string
}

export const AdminHolidays = () => {
  const { user } = useAuth()

  const [formHoliday, setFormHoliday] = useState<IHoliday>({
    holiday_name: '',
    holiday_date: undefined,
    created_by: user?.email != null ? user.email : '',
    updated_by: '',
  })

  const [holidays, setHolidays] = useState<IHoliday[]>([])
  const [selectedHoliday, setSelectedHoliday] = useState<IHoliday | null>(null)

  useEffect(() => {
    const getHolidays = async () => {
      try {
        const response = await RequestService('/holidays', 'GET')
        const holidaysWithId = response.map((holiday: IHoliday, index: number) => ({ id: String(index), ...holiday }))
        setHolidays(holidaysWithId)
      } catch (error) {
        console.error('error fetching holidays', error)
      }
    }
    getHolidays()
  }, [])

  const deleteHoliday = async (holiday: IHoliday) => {
    try {
      await RequestService(`/holidays/${holiday._id}`, 'DELETE')
      setHolidays(holidays.filter(existingHoliday => existingHoliday._id !== holiday._id))
      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Holiday deleted successfully',
        life: 3000,
      })
    } catch (error) {
      console.error('error deleting holiday', error)
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Error deleting holiday',
        life: 3000,
      })
    }
  }

  const toast = useRef<Toast>(null)

  const defaultValues = {
    holiday_name: formHoliday?.holiday_name,
    holiday_date: formHoliday?.holiday_date,
    created_by: formHoliday?.created_by,
    updated_by: formHoliday?.updated_by,
  }

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
  } = useForm({ defaultValues })

  useEffect(() => {
    if (formHoliday) {
      setValue('holiday_name', formHoliday.holiday_name)
      setValue('holiday_date', formHoliday.holiday_date)
      setValue('created_by', formHoliday.created_by)
      setValue('updated_by', formHoliday.updated_by)
    }
  }, [formHoliday, setValue])

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

  const onSubmit: SubmitHandler<IHoliday> = async data => {
    try {
      let response: SetStateAction<IHoliday>
      if (selectedHoliday) {
        const updatedData = { ...data, updated_by: user?.email || '' }
        response = await RequestService(`/holidays/${selectedHoliday._id}`, 'PATCH', updatedData)
      } else {
        const newData = { ...data, created_by: user?.email || '' }
        response = await RequestService('/holidays', 'POST', newData)
      }
      if (response) {
        setFormHoliday({
          holiday_name: '',
          holiday_date: undefined,
          created_by: user?.email || '',
          updated_by: '',
        })
        if (selectedHoliday) {
          setHolidays(
            holidays.map(holiday =>
              holiday._id === (response as IHoliday)._id ? response : holiday,
            ) as SetStateAction<IHoliday[]>,
          )
        } else {
          setHolidays([...holidays, response] as SetStateAction<IHoliday[]>)
        }
        toast.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: selectedHoliday ? 'Holiday updated successfully' : 'Holiday created successfully',
          life: 3000,
        })
        reset()
        setSelectedHoliday(null)
      }
    } catch (error) {
      console.error('Error:', error)
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: selectedHoliday ? 'Error updating holiday' : 'Error creating holiday',
        life: 3000,
      })
    }
  }

  const updatedByTemplate = (rowData: IHoliday) => {
    if (rowData.created_by == rowData.updated_by) {
      return <span>{rowData.updated_by}</span>
    }
    return null
  }

  return (
    <>
      {user?.role ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-12">
            {' '}
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
              <div>
                <h2 className="text-base font-semibold leading-7 text-gray-900">Holidays </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">Select date to define holidays.</p>
              </div>

              <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
                {/* First Name */}
                <div className="sm:col-span-3">
                  <label htmlFor="holiday_name" className="block text-sm font-medium leading-6 text-gray-900">
                    Holiday name
                  </label>
                  <div className="mt-2">
                    <Controller
                      name="holiday_name"
                      control={control}
                      rules={{ required: 'Holiday name is required' }}
                      render={({ field, fieldState }) => (
                        <InputText
                          id={field.name}
                          value={field.value}
                          name="holiday_name"
                          className={classNames({ 'p-invalid': fieldState.error }, 'w-full')}
                          onChange={e => field.onChange(e.target.value)}
                        />
                      )}
                    />
                  </div>
                  {getFormErrorMessage('holiday_name', errors)}
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="created_by" className="block text-sm font-medium leading-6 text-gray-900">
                    Created By
                  </label>
                  <div className="mt-2">
                    <Controller
                      name="created_by"
                      control={control}
                      defaultValue={user?.first_name}
                      render={({ field, fieldState }) => (
                        <InputText
                          disabled
                          id={field.name}
                          value={field.value}
                          name="created_by"
                          className={classNames({ 'p-invalid': fieldState.error }, 'w-full')}
                          onChange={e => field.onChange(e.target.value)}
                        />
                      )}
                    />
                  </div>
                  {getFormErrorMessage('created_by', errors)}
                </div>

                <div className="sm:col-span-6 sm:col-start-1">
                  <label htmlFor="holiday_date" className="block text-sm font-medium leading-6 text-gray-900">
                    Holiday Date
                  </label>
                  <div className="mt-2">
                    <Controller
                      name="holiday_date"
                      control={control}
                      rules={{ required: 'Holiday date is required' }}
                      render={({ field, fieldState }) => (
                        <div>
                          <Calendar
                            inputId={field.name}
                            value={field.value ? new Date(field.value) : undefined}
                            onChange={field.onChange}
                            dateFormat="mm/dd/yy"
                            className={classNames({ 'p-invalid': fieldState.error }, 'w-full')}
                            showIcon
                          />
                        </div>
                      )}
                    />
                  </div>
                  {getFormErrorMessage('holiday_date', errors)}
                </div>
                <div className="flex justify-end sm:col-span-6">
                  <Button type="submit" label="Submit" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-1">
              <div>
                <h1 className="text-xl font-bold leading-7 text-gray-900">Holidays Table</h1>
                <DataTable
                  value={holidays}
                  selectionMode="single"
                  selection={selectedHoliday}
                  onSelectionChange={e => setSelectedHoliday(e.value)}
                  onRowSelect={e => setFormHoliday(e.data)}
                  dataKey="id"
                  paginator
                  rows={5}
                  metaKeySelection={false}
                  tableStyle={{ minWidth: '50rem' }}>
                  <Column field="holiday_name" header="Name" />
                  <Column
                    body={(rowData: IHoliday) => (
                      <span>{rowData.holiday_date ? new Date(rowData.holiday_date).toLocaleDateString() : ''}</span>
                    )}
                    header="Date"
                  />
                  <Column field="created_by" header="Created By" />
                  <Column body={updatedByTemplate} header="Updated By" />
                  <Column
                    header="Delete"
                    body={rowData => (
                      <Button
                        icon="pi pi-trash"
                        className="p-button-rounded p-button-danger"
                        onClick={() => deleteHoliday(rowData)}
                      />
                    )}
                  />
                </DataTable>
              </div>
            </div>
          </div>
          <Toast ref={toast} />
        </form>
      ) : null}
    </>
  )
}
