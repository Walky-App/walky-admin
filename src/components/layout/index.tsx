import { Outlet } from 'react-router-dom'
import { AppShell } from './AppShell'
import { Toast } from 'primereact/toast'
import { useEffect, useRef } from 'react';
import { useUtils } from '../../store/useUtils';

export const Layout = () => {
  const toastRef = useRef<Toast>(null);
  const { toastPosition, setToast } = useUtils();

  useEffect(() => {
    setToast(toastRef);
  }, []);

  return (
    <>
      <Toast position={toastPosition} ref={toastRef} />
      <AppShell>
        <Outlet />
      </AppShell>
    </>
  )
}
