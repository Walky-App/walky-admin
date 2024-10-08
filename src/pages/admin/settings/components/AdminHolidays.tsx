import { useState } from 'react'

import { Button } from 'primereact/button'
import { Calendar } from 'primereact/calendar'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { InputText } from 'primereact/inputtext'

import { type StatesSettingsDocument } from '../../../../interfaces/setting'
import { useUtils } from '../../../../store/useUtils'

export interface IHoliday {
  _id: string
  holiday_name: string
  holiday_date: Date
}
interface IHolidayFormValues {
  holiday_name: string
  holiday_date: Date | undefined
}

export const AdminHolidays = ({
  settings,
  setSettings,
  handleStateSettingsUpdate,
}: {
  settings: StatesSettingsDocument
  setSettings: (settings: StatesSettingsDocument) => void
  handleStateSettingsUpdate: () => void
}) => {
  const { showToast } = useUtils()
  const [formHoliday, setFormHoliday] = useState<IHolidayFormValues>({
    holiday_name: '',
    holiday_date: undefined,
  })

  const deleteHoliday = async (holiday: IHoliday) => {
    const newHolidays = settings.holiday.filter(h => h.holiday_date !== holiday.holiday_date)
    setSettings({ ...settings, holiday: newHolidays })
  }

  const handleSubmit = () => {
    if (!formHoliday.holiday_name || !formHoliday.holiday_date) {
      showToast({ severity: 'error', summary: 'Error', detail: 'Please fill all fields' })
      return
    }

    const newHolidays = [
      ...settings.holiday,
      { holiday_name: formHoliday.holiday_name, holiday_date: formHoliday.holiday_date },
    ]

    setSettings({ ...settings, holiday: newHolidays })
    setFormHoliday({ holiday_name: '', holiday_date: undefined })
    handleStateSettingsUpdate()
  }

  return (
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
              <InputText
                id="holiday_name"
                value={formHoliday.holiday_name}
                name="holiday_name"
                onChange={e => setFormHoliday({ ...formHoliday, holiday_name: e.target.value })}
              />
            </div>
          </div>

          <div className="sm:col-span-6 sm:col-start-1">
            <label htmlFor="holiday_date" className="block text-sm font-medium leading-6 text-gray-900">
              Holiday Date
            </label>
            <div className="mt-2">
              <div>
                <Calendar
                  inputId="holiday_date"
                  onChange={e => setFormHoliday({ ...formHoliday, holiday_date: e.value || undefined })}
                  dateFormat="mm/dd/yy"
                  showIcon
                />
                <Button icon="pi pi-plus" onClick={handleSubmit} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-x-8 gap-y-10  md:grid-cols-1">
        <div>
          <h1 className="text-xl font-bold leading-7 text-gray-900">Holidays Table</h1>
          <DataTable value={settings.holiday} dataKey="holiday_date" paginator rows={5} metaKeySelection={false}>
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
          <div className="mt-2 flex justify-end sm:col-span-6">
            <Button label="Save Changes" onClick={handleStateSettingsUpdate} />
          </div>
        </div>
      </div>
    </div>
  )
}
