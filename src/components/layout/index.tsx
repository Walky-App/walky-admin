import { useEffect, useRef } from 'react'

import { Outlet } from 'react-router-dom'

import { ConfirmDialog } from 'primereact/confirmdialog'
import { Toast } from 'primereact/toast'

import { useCoordinates } from '../../store/useCoordinates'
import { useUtils } from '../../store/useUtils'
import { AppShell } from './AppShell'

export const Layout = () => {
  const toastRef = useRef<Toast>(null)
  const { toastPosition, setToast, onRemoveToast } = useUtils()
  const { getLocation, latitude, longitude } = useCoordinates()

  useEffect(() => {
    setToast(toastRef)
    if (latitude === null && longitude === null) {
      getLocation()
    }
  }, [setToast, latitude, longitude, getLocation])

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
