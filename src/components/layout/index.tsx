import { useEffect, useRef } from 'react'

import { Outlet } from 'react-router-dom'

import { ConfirmDialog } from 'primereact/confirmdialog'
import { Toast } from 'primereact/toast'

import { requestService } from '../../services/requestServiceNew'
import { useCoordinates } from '../../store/useCoordinates'
import { useSettings } from '../../store/useSettings'
import { useUtils } from '../../store/useUtils'
import { AppShell } from './AppShell'

export const Layout = () => {
  const toastRef = useRef<Toast>(null)
  const { toastPosition, setToast, onRemoveToast } = useUtils()
  const { getLocation, latitude, longitude } = useCoordinates()
  const { setSettings, settings } = useSettings()

  useEffect(() => {
    setToast(toastRef)
    if (latitude === null && longitude === null) {
      getLocation()
    }
    const fetchStateSettings = async () => {
      const reponse = await requestService({ path: `settings/user` })
      if (reponse.ok) {
        const data = await reponse.json()
        setSettings(data)
      }
    }
    if (!settings) {
      fetchStateSettings()
    }
  }, [setToast, latitude, longitude, getLocation, settings, setSettings])

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
