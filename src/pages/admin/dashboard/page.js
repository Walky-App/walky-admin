import { TaskList, ClassList, CalendarWidget, MessagesWidget } from './widgets'

export default function Dashboard() {
  return (
    <>
      <div className="w-full sm:w-1/2">
        <TaskList />
      </div>
      <div className="w-full sm:w-1/2">
        <CalendarWidget />
        <MessagesWidget />
      </div>
    </>
  )
}
