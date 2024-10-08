import { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'

import { type StatesSettingsDocument } from '../../../interfaces/setting'
import { requestService } from '../../../services/requestServiceNew'

export const Settings = () => {
  const [settings, setSettings] = useState<StatesSettingsDocument[]>([])
  const [selectedState, setSelectedS] = useState<StatesSettingsDocument | null>(null)

  const navigate = useNavigate()

  useEffect(() => {
    const getStateSettings = async () => {
      try {
        const response = await requestService({ path: '/settings' })
        if (response.ok) {
          const data = await response.json()
          setSettings(data)
        }
      } catch (error) {
        console.error(error)
      }
    }
    getStateSettings()
  }, [])

  const holidayFormatRow = (rowData: StatesSettingsDocument) => {
    return rowData.holiday.length === 0 ? <span> </span> : <span>{rowData.holiday.length}</span>
  }

  return (
    <div className="card text-2xl">
      <DataTable
        data-testid="states-detail-view"
        value={settings}
        sortField="our_fee"
        sortOrder={-1}
        selectionMode="single"
        selection={selectedState!}
        onSelectionChange={e => {
          setSelectedS(e.value)
          navigate(`/admin/settings/${e.value.state}`)
        }}
        dataKey="_id"
        className="text-lg"
        tableStyle={{ minWidth: '50rem' }}>
        <Column sortable field="state" header="State" />
        <Column sortable field="admin_costs.total" header="Admin Costs" />
        <Column sortable field="minimun_wage" header="Minimum Wage" />
        <Column sortable field="processing_fee" header="Processing Fee" />
        <Column sortable field="licenses_required" header="Licenses Required" />
        <Column sortable field="our_fee" header="Our Fee" />
        <Column sortable field="holiday.length" header="Holiday" body={holidayFormatRow} />
      </DataTable>
    </div>
  )
}
