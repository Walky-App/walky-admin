import { useState, useEffect } from 'react'

import { useParams } from 'react-router-dom'

import { TabView } from 'primereact/tabview'
import { TabPanel } from 'primereact/tabview'

import { type StatesSettingsDocument } from '../../../interfaces/setting'
import { requestService } from '../../../services/requestServiceNew'
import { useUtils } from '../../../store/useUtils'
import { AdminHolidays } from './components/AdminHolidays'
// import { Announcements } from './components/Announcements' // to do implement announcements
import { StatesDetailView } from './components/StatesDetailView'

export const StateSettings = () => {
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
    supervisor_fee: 0,
    holiday: [],
    htu: [],
    licenses_required: false,
    max_hours_per_day: 0,
  })

  const { showToast } = useUtils()

  const { state } = useParams()

  useEffect(() => {
    const getStateSettings = async () => {
      try {
        const response = await requestService({ path: `/settings/${state?.toLocaleUpperCase()}` })
        if (response.ok) {
          const data = await response.json()
          setSettings(data)
        }
      } catch (error) {
        console.error(error)
      }
    }
    getStateSettings()
  }, [state])

  const handleStateSettingsUpdate = async () => {
    try {
      const response = await requestService({
        path: `settings/${state?.toLocaleUpperCase()}`,
        method: 'PATCH',
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        showToast({ severity: 'success', summary: 'Success', detail: 'Settings updated successfully' })
      }
    } catch (error) {
      console.error(error)
      showToast({ severity: 'error', summary: 'Error', detail: 'Error updating settings' })
    }
  }

  return (
    <div data-testid="state-settings">
      <div className="mb-8">
        <div className="text-3xl font-bold">{state} Settings:</div>
      </div>
      <TabView>
        <TabPanel header="Announcements (beta)">
          <h1> Coming soon! </h1>
          {/* <Announcements
            settings={settings}
            setSettings={setSettings}
            handleStateSettingsUpdate={handleStateSettingsUpdate}
          /> */}
        </TabPanel>
        <TabPanel header="State Details">
          <StatesDetailView
            settings={settings}
            setSettings={setSettings}
            handleStateSettingsUpdate={handleStateSettingsUpdate}
          />
        </TabPanel>
        <TabPanel header="Holidays">
          <AdminHolidays
            settings={settings}
            setSettings={setSettings}
            handleStateSettingsUpdate={handleStateSettingsUpdate}
          />
        </TabPanel>
      </TabView>
    </div>
  )
}
