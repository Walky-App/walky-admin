import { useRef } from 'react'
import { useMemo, useState } from 'react'

import { AutoComplete, type AutoCompleteChangeEvent, type AutoCompleteCompleteEvent } from 'primereact/autocomplete'
import { Button } from 'primereact/button'
import { Column, type ColumnEditorOptions, type ColumnEvent } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { InputNumber } from 'primereact/inputnumber'
import { ToggleButton } from 'primereact/togglebutton'

import { HeaderComponent } from '../../../../components/shared/general/HeaderComponent'
import { type SelectedOptionInterface } from '../../../../interfaces/global'
import { type HolidayDocument, type StatesSettingsDocument } from '../../../../interfaces/setting'
import { RequestService } from '../../../../services/RequestService'
import { requestService } from '../../../../services/requestServiceNew'
import { useUtils } from '../../../../store/useUtils'
import { states } from '../../../../utils/VariablesUtils'
import { cn } from '../../../../utils/cn'
import { AdminHolidays } from '../AdminHolidays'

interface ColumnMeta {
  field: string
  header: string
}

interface Cost {
  name: string
  value: number
}

export const FormSettings = () => {
  const dt = useRef<DataTable<Cost[]>>(null)
  const [countries] = useState<SelectedOptionInterface[]>(states)
  const [selectedCountry, setSelectedCountry] = useState<SelectedOptionInterface>()
  const [filteredCountries, setFilteredCountries] = useState<SelectedOptionInterface[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [settings, setSettings] = useState<StatesSettingsDocument>({
    _id: '',
    state: '',
    admin_costs: {
      total: 0,
      fees: [],
    },
    our_fee: 0,
    processing_fee: 0,
    overtime_rate: {
      holiday_rate: 0,
      overtime_rate: 0,
      minimun_hours: 0,
    },
    minimun_wage: 0,
    holiday: [],
    htu: [],
    licenses_required: false,
    max_hours_per_day: 0,
  })
  const [maxHoursPerDay, setMaxHoursPerDay] = useState<number>(settings.max_hours_per_day || 40)
  const [lisenceRequiredChecked, setLisenceRequiredChecked] = useState<boolean>(settings.licenses_required || true)
  const [minimunWage, setMinimunWage] = useState<number>(settings.minimun_wage || 10)
  const [ourFees, setOurFees] = useState<number>(settings.our_fee || 0)
  const [processingFees, setProcessingFees] = useState<number>(settings.processing_fee || 0)
  const [holidaysRate, setHolidaysRate] = useState<number>(settings.overtime_rate.holiday_rate || 0)
  const [overTimeRate, setOverTimeRate] = useState<number>(settings.overtime_rate.overtime_rate || 0)
  const [holidays, setHolidays] = useState<HolidayDocument[]>(settings.holiday || [])
  const [minimumHoursForOvertime, setMinimumHoursForOvertime] = useState<number>(
    settings.overtime_rate.overtime_rate || 0,
  )
  const [adminCost, setAdminCost] = useState<Cost[]>([
    {
      name: 'FICA',
      value: 0,
    },
    {
      name: 'FUTA',
      value: 0,
    },
    {
      name: 'Average SUI',
      value: 0,
    },
    {
      name: `Worker's Comp.`,
      value: 0,
    },
    {
      name: `Other state fees`,
      value: 0,
    },
    {
      name: `Other (hedge)`,
      value: 0,
    },
  ])
  const { showToast } = useUtils()

  const columns: ColumnMeta[] = [
    { field: 'name', header: 'name' },
    { field: 'value', header: '% (edit)' },
  ]

  const search = (event: AutoCompleteCompleteEvent) => {
    setTimeout(() => {
      let _filteredCountries
      if (!event.query.trim().length) {
        _filteredCountries = [...countries]
      } else {
        _filteredCountries = countries.filter(country => {
          return country.name.toLowerCase().startsWith(event.query.toLowerCase())
        })
      }
      setFilteredCountries(_filteredCountries)
    }, 250)
  }

  const handlerGetSettings = async (event: AutoCompleteChangeEvent) => {
    try {
      setSelectedCountry(event.value)
      if (event.value.code) {
        setIsLoading(true)
        const response = await RequestService(`settings/${event.value.code}`)
        setSettings(response)
        setStateSettings(response)
        setIsLoading(false)
      }
    } catch (error) {
      console.error('error fetching settings', error)
    }
  }

  const setStateSettings = (data: StatesSettingsDocument) => {
    setMaxHoursPerDay(data.max_hours_per_day)
    setLisenceRequiredChecked(data.licenses_required)
    setMinimunWage(data.minimun_wage)
    setOurFees(data.our_fee)
    setProcessingFees(data.processing_fee)
    setHolidaysRate(data.overtime_rate.holiday_rate)
    setOverTimeRate(data.overtime_rate.overtime_rate)
    setHolidays(data.holiday)
    setMinimumHoursForOvertime(data.overtime_rate.minimun_hours)
    setAdminCost(data.admin_costs.fees)
  }

  const sumAdminCost = useMemo(() => {
    return adminCost.reduce((acc, cost) => acc + cost.value, 0)
  }, [adminCost])

  const onCellEditComplete = (e: ColumnEvent) => {
    const { rowData, newValue, field, originalEvent: event } = e

    switch (field) {
      case 'value':
        if (newValue >= 0) {
          rowData[field] = newValue
          setAdminCost([...adminCost])
        } else event.preventDefault()
        break

      default:
        if (newValue.trim().length > 0) {
          rowData[field] = newValue
          setAdminCost([...adminCost])
        } else event.preventDefault()
        break
    }
  }

  const cellEditor = (options: ColumnEditorOptions) => {
    if (options.field === 'value') return valueEditor(options)
    return options.value
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

  const HandlerSetSettings = async () => {
    const data = {
      admin_costs: {
        total: sumAdminCost,
        fees: adminCost,
      },
      our_fee: ourFees,
      processing_fee: processingFees,
      overtime_rate: {
        holiday_rate: holidaysRate,
        overtime_rate: overTimeRate,
        minimun_hours: minimumHoursForOvertime,
      },
      minimun_wage: minimunWage,
      holiday: holidays,
      licenses_required: lisenceRequiredChecked,
      max_hours_per_day: maxHoursPerDay,
    }
    const response = await requestService({
      path: `settings/${selectedCountry?.code}`,
      method: 'PATCH',
      body: JSON.stringify(data),
    })

    if (response.ok) {
      showToast({ severity: 'success', summary: 'Success', detail: 'Settings updated successfully' })
    }
  }

  return (
    <div>
      <HeaderComponent title="Settings" />
      <div className="flex flex-col items-center justify-center">
        <label htmlFor="select_state" className="block text-sm font-medium leading-6 text-gray-900">
          Select a state
        </label>
        <AutoComplete
          field="name"
          value={selectedCountry}
          suggestions={filteredCountries}
          completeMethod={search}
          onChange={e => handlerGetSettings(e)}
        />
      </div>
      {settings._id === '' ? (
        <div className="pt-10 text-center">{isLoading ? 'Loading...' : 'Select a state to view settings'}</div>
      ) : (
        <div className="space-y-12">
          <div className="sticky top-16 z-50 flex justify-end">
            <Button label="Save" onClick={HandlerSetSettings} />
          </div>
          <div className="mt-5 grid grid-cols-1 gap-x-8 gap-y-10 border-y border-gray-900/10 pb-12 pt-12 md:grid-cols-3">
            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">General settings</h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">configuration for the entire application</p>
            </div>
            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
              <div className="sm:col-span-3">
                <label htmlFor="first_name" className="block text-sm font-medium leading-6 text-gray-900">
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
                  onChange={e => setMinimunWage(Number(e.value))}
                  value={minimunWage}
                />
              </div>
              <div className="sm:col-span-3">
                <label htmlFor="first_name" className="block text-sm font-medium leading-6 text-gray-900">
                  Licenses required
                </label>
                <ToggleButton
                  className={cn('mt-1 text-white ', lisenceRequiredChecked ? 'bg-primary ' : 'bg-gray-400')}
                  onLabel="Enabled"
                  offLabel="Disabled"
                  checked={lisenceRequiredChecked}
                  onChange={e => setLisenceRequiredChecked(e.value)}
                />
              </div>
              <div className="sm:col-span-3">
                <label htmlFor="first_name" className="block text-sm font-medium leading-6 text-gray-900">
                  Limit work hours per week
                </label>
                <InputNumber
                  mode="decimal"
                  name="limit_work_hours_per_week"
                  onChange={e => setMaxHoursPerDay(Number(e.value))}
                  value={maxHoursPerDay}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">Admin Cost</h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Total Admin cost is <strong>{sumAdminCost}%</strong>
              </p>
            </div>
            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
              <div className="col-span-4 ">
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
              <h2 className="text-base font-semibold leading-7 text-gray-900">Fees Manager</h2>
            </div>
            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
              <div className="col-span-3">
                <label htmlFor="our_fees" className="block text-sm font-medium leading-6 text-gray-900">
                  Our fees
                </label>
                <InputNumber
                  className="mt-1 block w-full"
                  maxFractionDigits={2}
                  min={0}
                  max={100}
                  name="our_fees"
                  prefix="% "
                  value={ourFees}
                  onChange={e => setOurFees(Number(e.value))}
                />
              </div>
              <div className="col-span-3">
                <label htmlFor="our_fees" className="block text-sm font-medium leading-6 text-gray-900">
                  Processing fees
                </label>
                <InputNumber
                  className="mt-1 block w-full"
                  maxFractionDigits={2}
                  min={0}
                  max={100}
                  name="processing_fees"
                  prefix="% "
                  value={processingFees}
                  onChange={e => setProcessingFees(Number(e.value))}
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">Overtime</h2>
            </div>
            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
              <div className="col-span-3">
                <label htmlFor="our_fees" className="block text-sm font-medium leading-6 text-gray-900">
                  Holidays rate
                </label>
                <InputNumber
                  className="mt-1 block w-full"
                  maxFractionDigits={2}
                  min={0}
                  max={2}
                  name="holidays_rate"
                  value={holidaysRate}
                  onChange={e => setHolidaysRate(Number(e.value))}
                />
              </div>
              <div className="col-span-3">
                <label htmlFor="our_fees" className="block text-sm font-medium leading-6 text-gray-900">
                  Overtime rate
                </label>
                <InputNumber
                  className="mt-1 block w-full"
                  maxFractionDigits={2}
                  min={0}
                  max={2}
                  name="over_time_rate"
                  value={overTimeRate}
                  onChange={e => setOverTimeRate(Number(e.value))}
                />
              </div>
              <div className="sm:col-span-3">
                <label htmlFor="first_name" className="block text-sm font-medium leading-6 text-gray-900">
                  Minimum hours for overtime
                </label>
                <InputNumber
                  mode="decimal"
                  name="minimum_hours_for_overtime"
                  value={minimumHoursForOvertime}
                  onChange={e => setMinimumHoursForOvertime(Number(e.value))}
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
            <div className="col-span-6">
              <AdminHolidays holidays={holidays} setHolidays={setHolidays} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
