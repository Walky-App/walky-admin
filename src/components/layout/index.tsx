import { Outlet } from 'react-router-dom'
import { AppShell } from '../shared/ui/AppShell'

export default function Layout() {
  return (
    <>
      <AppShell>
        <Outlet />
      </AppShell>
    </>
  )
}
