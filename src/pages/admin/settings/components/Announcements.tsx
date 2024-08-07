import { useState } from 'react'

import { Button } from 'primereact/button'
// import { Calendar } from 'primereact/calendar'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
// import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'

import { type StatesSettingsDocument } from '../../../../interfaces/setting'

// import { useUtils } from '../../../../store/useUtils'

export const Announcements = ({
  settings,
  // setSettings,
  handleStateSettingsUpdate,
}: {
  settings: StatesSettingsDocument
  // setSettings: (settings: StatesSettingsDocument) => void
  handleStateSettingsUpdate: () => void
}) => {
  // const { showToast } = useUtils()
  const [value, setValue] = useState<string>('')

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 gap-x-8 gap-y-10  md:grid-cols-3">
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">Announcements </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">Set messages </p>
        </div>

        <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
          <div className="sm:col-span-3">
            <label htmlFor="holiday_name" className="block text-sm font-medium leading-6 text-gray-900">
              Holiday name
            </label>
            <div className="mt-2">
              <InputTextarea
                value={value}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setValue(e.target.value)}
                rows={5}
                cols={30}
              />
            </div>
          </div>

          <div className="sm:col-span-6 sm:col-start-1">
            {/* <Button icon="pi pi-plus" onClick={handleSubmit} /> */}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-x-8 gap-y-10  md:grid-cols-1">
        <div>
          <h1 className="text-xl font-bold leading-7 text-gray-900">Announcements </h1>
          <DataTable value={settings.holiday} dataKey="holiday_date" paginator rows={5} metaKeySelection={false}>
            <Column field="holiday_name" header="Name" />
            <Column
              body={rowData => (
                <span>{rowData.holiday_date ? new Date(rowData.holiday_date).toLocaleDateString() : ''}</span>
              )}
              header="Date"
            />
            {/* <Column
              header="Delete"
              body={rowData => (
                <Button
                  type="button"
                  icon="pi pi-trash"
                  className="p-button-rounded p-button-danger"
                  onClick={() => deleteHoliday(rowData)}
                />
              )}
            /> */}
          </DataTable>
          <div className="mt-2 flex justify-end sm:col-span-6">
            <Button label="Save Changes" onClick={handleStateSettingsUpdate} />
          </div>
        </div>
      </div>
    </div>
  )
}
