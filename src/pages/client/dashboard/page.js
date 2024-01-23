import { useAuth } from '../../../contexts/UserContext'
import { TaskList, ClassList, CalendarWidget, MessagesWidget } from './widgets'

export default function Dashboard() {
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
