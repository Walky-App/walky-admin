import { useRef, useState, useMemo } from 'react'

import { Button } from 'primereact/button'
import { Column, type ColumnEditorOptions, type ColumnEvent } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { InputNumber } from 'primereact/inputnumber'
import { ToggleButton } from 'primereact/togglebutton'

import { type StatesSettingsDocument } from '../../../../interfaces/setting'
import { cn } from '../../../../utils/cn'

interface ColumnMeta {
  field: string
  header: string
}

interface Cost {
  name: string
  value: number
}

export const StatesDetailView = ({
  settings,
  handleStateSettingsUpdate,
  setSettings,
}: {
  settings: StatesSettingsDocument
  handleStateSettingsUpdate: () => void
  setSettings: (data: StatesSettingsDocument) => void
}) => {
  const dt = useRef<DataTable<Cost[]>>(null)

  const [adminCost] = useState<Cost[]>(settings.admin_costs.fees)

  const columns: ColumnMeta[] = [
    { field: 'name', header: 'name' },
    { field: 'value', header: '% (edit)' },
  ]

  const sumAdminCost = useMemo(() => {
    return settings.admin_costs.fees.reduce((acc, cost) => acc + cost.value, 0)
  }, [settings.admin_costs.fees])

  const onCellEditComplete = (e: ColumnEvent) => {
    const { rowData, newValue, field, originalEvent: event } = e

    switch (field) {
      case 'value':
        if (newValue >= 0) {
          rowData[field] = newValue
          setSettings({
            ...settings,
            admin_costs: {
              total: sumAdminCost,
              fees: adminCost,
            },
          })
        } else event.preventDefault()
        break

      default:
        if (newValue.trim().length > 0) {
          rowData[field] = newValue
          setSettings({
            ...settings,
            admin_costs: {
              total: sumAdminCost,
              fees: adminCost,
            },
          })
        } else event.preventDefault()
        break
    }
  }

  const valueEditor = (options: ColumnEditorOptions) => {
    return (
      <InputNumber
        name="value"
        maxFractionDigits={2}
        min={0}
        max={100}
        value={options.value}
        onChange={e => options.editorCallback && options.editorCallback(e?.value as number)}
      />
    )
  }

  const cellEditor = (options: ColumnEditorOptions) => {
    if (options.field === 'value') return valueEditor(options)
    return options.value
  }

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 gap-x-8 gap-y-10 pb-12 pt-12 md:grid-cols-3">
        <div>
          <h2 className="text-base font-semibold leading-7">General settings</h2>
          <p className="mt-1 text-sm leading-6">configuration for the entire application</p>
        </div>
        <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
          <div className="sm:col-span-3">
            <label htmlFor="first_name" className="block text-sm font-medium leading-6">
              Minimum wage
            </label>
            <InputNumber
              tooltip="Enter the minimum pay rate for all USD jobs in this state."
              tooltipOptions={{ position: 'mouse' }}
              mode="currency"
              currency="USD"
              showButtons
              name="minimum_wage"
              min={1}
              step={0.1}
              onChange={e => setSettings({ ...settings, minimun_wage: Number(e.value) })}
              value={settings.minimun_wage}
            />
          </div>
          <div className="sm:col-span-3">
            <label htmlFor="supervisor_fee" className="block text-sm font-medium leading-6">
              Supervisor Fee
            </label>
            <InputNumber
              tooltip="Enter the supervisor fee for this job."
              tooltipOptions={{ position: 'mouse' }}
              mode="currency"
              currency="USD"
              showButtons
              name="supervisor_fee"
              min={1}
              step={0.1}
              onChange={e => setSettings({ ...settings, supervisor_fee: Number(e.value) })}
              value={settings.supervisor_fee}
            />
          </div>
          <div className="sm:col-span-3">
            <label htmlFor="first_name" className="block text-sm font-medium leading-6">
              Licenses required
            </label>
            <ToggleButton
              className={cn('mt-1 text-white ', settings.licenses_required ? 'bg-primary ' : 'bg-gray-400')}
              onLabel="Enabled"
              offLabel="Disabled"
              checked={settings.licenses_required}
              onChange={e => setSettings({ ...settings, licenses_required: e.value })}
            />
          </div>
          <div className="sm:col-span-3">
            <label htmlFor="first_name" className="block text-sm font-medium leading-6">
              Limit work hours per week
            </label>
            <InputNumber
              mode="decimal"
              name="limit_work_hours_per_week"
              onChange={e => setSettings({ ...settings, max_hours_per_day: Number(e.value) })}
              value={settings.max_hours_per_day}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
        <div>
          <h2 className="text-base font-semibold leading-7">Admin Cost</h2>
          <p className="mt-1 text-sm leading-6">
            Total Admin cost is <strong>{sumAdminCost}%</strong>
          </p>
        </div>
        <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
          <div className="col-span-4">
            <DataTable ref={dt} value={adminCost} editMode="cell">
              {columns.map((field, header) => {
                return (
                  <Column
                    key={header}
                    field={field.field}
                    header={field.header}
                    editor={options => cellEditor(options)}
                    onCellEditComplete={onCellEditComplete}
                  />
                )
              })}
            </DataTable>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
        <div>
          <h2 className="text-base font-semibold leading-7">Fees Manager</h2>
        </div>
        <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
          <div className="col-span-3">
            <label htmlFor="our_fees" className="block text-sm font-medium leading-6">
              Our fees
            </label>
            <InputNumber
              className="mt-1 block w-full"
              maxFractionDigits={2}
              min={0}
              max={100}
              name="our_fees"
              prefix="% "
              value={settings.our_fee}
              onChange={e => setSettings({ ...settings, our_fee: Number(e.value) })}
            />
          </div>
          <div className="col-span-3">
            <label htmlFor="our_fees" className="block text-sm font-medium leading-6">
              Processing fees
            </label>
            <InputNumber
              className="mt-1 block w-full"
              maxFractionDigits={2}
              min={0}
              max={100}
              name="processing_fees"
              prefix="% "
              value={settings.processing_fee}
              onChange={e => setSettings({ ...settings, processing_fee: Number(e.value) })}
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-x-8 gap-y-10 pb-12 md:grid-cols-3">
        <div>
          <h2 className="text-base font-semibold leading-7">Overtime</h2>
        </div>
        <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
          <div className="col-span-3">
            <label htmlFor="our_fees" className="block text-sm font-medium leading-6">
              Holidays rate
            </label>
            <InputNumber
              className="mt-1 block w-full"
              maxFractionDigits={2}
              min={0}
              max={2}
              name="holidays_rate"
              value={settings.overtime_rate.holiday_rate}
              onChange={e =>
                setSettings({
                  ...settings,
                  overtime_rate: { ...settings.overtime_rate, holiday_rate: Number(e.value) },
                })
              }
            />
          </div>
          <div className="col-span-3">
            <label htmlFor="our_fees" className="block text-sm font-medium leading-6">
              Overtime rate
            </label>
            <InputNumber
              className="mt-1 block w-full"
              maxFractionDigits={2}
              min={0}
              max={2}
              name="over_time_rate"
              value={settings.overtime_rate.overtime_rate}
              onChange={e =>
                setSettings({
                  ...settings,
                  overtime_rate: { ...settings.overtime_rate, overtime_rate: Number(e.value) },
                })
              }
            />
          </div>
          <div className="sm:col-span-3">
            <label htmlFor="first_name" className="block text-sm font-medium leading-6">
              Minimum hours for overtime
            </label>
            <InputNumber
              mode="decimal"
              name="minimum_hours_for_overtime"
              value={settings.overtime_rate.minimun_hours}
              onChange={e =>
                setSettings({
                  ...settings,
                  overtime_rate: { ...settings.overtime_rate, minimun_hours: Number(e.value) },
                })
              }
            />
          </div>
        </div>
      </div>
      <div className="sticky top-16 z-50 flex justify-end">
        <Button label="Save" onClick={handleStateSettingsUpdate} />
      </div>
    </div>
  )
}
