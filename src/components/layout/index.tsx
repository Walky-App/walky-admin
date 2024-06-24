import { useEffect, useRef } from 'react'

import { Outlet } from 'react-router-dom'

import { ConfirmDialog } from 'primereact/confirmdialog'
import { Toast } from 'primereact/toast'

import { requestService } from '../../services/requestServiceNew'
import { useSettings } from '../../store/useSettings'
import { useUtils } from '../../store/useUtils'
import { AppShell } from './AppShell'

export const Layout = () => {
  const toastRef = useRef<Toast>(null)
  const { toastPosition, setToast, onRemoveToast } = useUtils()
  const { setSettings, settings } = useSettings()

  useEffect(() => {
    setToast(toastRef)
  }, [setToast])

  useEffect(() => {
    const fetchStateSettings = async () => {
      try {
        const response = await requestService({ path: `settings/user` })
        if (response.ok) {
          const data = await response.json()
          setSettings(data)
        }
      } catch (error) {
        setSettings(null)
        console.error('Error fetching settings', error)
      }
    }
    if (!settings) {
      fetchStateSettings()
    }
  }, [settings, setSettings])

  return (
    <>
      <Toast ref={toastRef} position={toastPosition} onRemove={e => onRemoveToast(e)} />
      <ConfirmDialog />
      <AppShell>
        <Outlet />
      </AppShell>
    </>
  )
}
