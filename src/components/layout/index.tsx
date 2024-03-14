import { Outlet } from 'react-router-dom'
import { AppShell } from './AppShell'
import { Toast } from 'primereact/toast'
import { useEffect, useRef } from 'react';
import useStore from '../../store/useUtils';

export const Layout = () => {
  const toastRef = useRef<Toast>(null);
  const { setToast } = useStore();

  useEffect(() => {
    setToast(toastRef);
  }, []);

  return (
    <>

      <Toast position="bottom-right" ref={toastRef} />
      <AppShell>
        <Outlet />
      </AppShell>
    </>
  )
}
