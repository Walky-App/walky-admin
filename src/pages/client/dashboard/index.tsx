import { useAuth } from "../../../contexts/AuthContext"
import { TaskList, ClassList, CalendarWidget, MessagesWidget } from './widgets'

export default function ClientDashboard() {
  const { user } = useAuth()

  console.log('employee user->', user)
  return (
    <>
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
