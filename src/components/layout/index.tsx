import { useRef } from 'react'

import { Outlet } from 'react-router-dom'

import { ConfirmDialog } from 'primereact/confirmdialog'
import { Toast } from 'primereact/toast'

import { useUtils } from '../../store/useUtils'
import { AppShell } from './AppShell'

export const Layout = () => {
  const toastRef = useRef<Toast>(null)
  const { toastPosition, onRemoveToast } = useUtils()

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
