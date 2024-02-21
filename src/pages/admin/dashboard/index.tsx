import { TaskList, ClassList, CalendarWidget, MessagesWidget } from './widgets'
import ToastComponent from '../../../components/shared/general/ToastComponent'

export default function AdminDashboard() {
  return (
    <>
    <div>
      <ToastComponent />
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
