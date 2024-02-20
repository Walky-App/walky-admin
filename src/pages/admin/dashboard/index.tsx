import { TaskList, ClassList, CalendarWidget, MessagesWidget } from './widgets'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'

import { useRef } from 'react'

export default function AdminDashboard() {
  const toast = useRef<Toast>(null)

  const handleShow = () => {
    toast.current?.show({ severity: 'info', summary: 'Info', detail: 'Message Content' })
  }

  return (
    <>
      <div className="card justify-content-center flex">
        <Toast ref={toast} />
        <Button size='small' onClick={handleShow} label="Show" />
      </div>
      <br />
      <div className="card justify-content-center flex flex-wrap gap-3">
        <Button label="Primary" />
        <Button label="Secondary" severity="secondary" />
        <Button label="Success" severity="success" />
        <Button label="Info" severity="info" />
        <Button label="Warning" severity="warning" />
        <Button label="Help" severity="help" />
        <Button label="Danger" severity="danger" />
      </div>
      <div className="w-full sm:w-1/2">
        <TaskList />
        <ClassList />
      </div>
      <div className="w-full sm:w-1/2">
        <CalendarWidget />
        <MessagesWidget />
      </div>
    </>
  )
}
