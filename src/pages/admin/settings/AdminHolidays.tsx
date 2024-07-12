import { useState, useEffect } from 'react'

import { Controller, type SubmitHandler, useForm } from 'react-hook-form'

import { isSameDay } from 'date-fns'
import { Button } from 'primereact/button'
import { Calendar } from 'primereact/calendar'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { InputText } from 'primereact/inputtext'
import { classNames } from 'primereact/utils'

import { type HolidayDocument } from '../../../interfaces/setting'
import { useUtils } from '../../../store/useUtils'
import { getFormErrorMessage } from '../../../utils/formUtils'

interface IHoliday {
  _id: string
  holiday_name: string
  holiday_date: Date
}
interface IHolidayFormValues {
  holiday_name: string
  holiday_date: Date | undefined
}

interface HolidaysProps {
  holidays: HolidayDocument[]
  setHolidays: (holidays: HolidayDocument[]) => void
}

export const AdminHolidays = ({ holidays, setHolidays }: HolidaysProps) => {
  const { showToast } = useUtils()
  const [formHoliday, setFormHoliday] = useState<IHolidayFormValues>({
    holiday_name: '',
    holiday_date: undefined,
  })

  const [selectedHoliday, setSelectedHoliday] = useState<IHoliday | null>(null)

  const defaultValues = {
    holiday_name: formHoliday?.holiday_name,
    holiday_date: formHoliday?.holiday_date,
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
    }
  }, [formHoliday, setValue])

  const deleteHoliday = async (holiday: IHoliday) => {
    const newHolidays = holidays.filter(h => h.holiday_date !== holiday.holiday_date)
    setHolidays(newHolidays)
  }

  const onSubmit: SubmitHandler<IHolidayFormValues> = async data => {
    try {
      if (!data.holiday_date || !data.holiday_name) {
        return
      }
      const dataForm: HolidayDocument = {
        holiday_name: data.holiday_name,
        holiday_date: data.holiday_date,
      }
      if (holidayExistsForDate(dataForm.holiday_date)) {
        showToast({
          severity: 'error',
          summary: 'Error',
          detail: 'Holiday already exists for this date',
        })
        return
      }
      if (selectedHoliday) {
        const newData: HolidayDocument[] = holidays.map(holiday => {
          if (holiday.holiday_date === selectedHoliday.holiday_date) {
            return dataForm
          }
          return holiday
        })
        setHolidays(newData)
        setSelectedHoliday(null)
        reset()
      } else {
        const newData: HolidayDocument[] = [...holidays, dataForm]
        setHolidays(newData)
        setSelectedHoliday(null)
        reset()
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const holidayExistsForDate = (date: Date): boolean => {
    return holidays.some(holiday => isSameDay(holiday.holiday_date, date))
  }

  const handlerSelectHoliday = (holiday: IHoliday) => {
    setSelectedHoliday(holiday)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-12">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10  md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Holidays </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">Select date to define holidays.</p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
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
              <Button type="submit" label={selectedHoliday ? 'Update' : 'Add'} />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-10  md:grid-cols-1">
          <div>
            <h1 className="text-xl font-bold leading-7 text-gray-900">Holidays Table</h1>
            <DataTable
              value={holidays}
              selectionMode="single"
              selection={selectedHoliday}
              onSelectionChange={e => handlerSelectHoliday(e.value as IHoliday)}
              onRowSelect={e => setFormHoliday(e.data)}
              dataKey="holiday_date"
              paginator
              rows={5}
              metaKeySelection={false}>
              <Column field="holiday_name" header="Name" />
              <Column
                body={(rowData: IHoliday) => (
                  <span>{rowData.holiday_date ? new Date(rowData.holiday_date).toLocaleDateString() : ''}</span>
                )}
                header="Date"
              />
              <Column
                header="Delete"
                body={rowData => (
                  <Button
                    type="button"
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
    </form>
  )
}
