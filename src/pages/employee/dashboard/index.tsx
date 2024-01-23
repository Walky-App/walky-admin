import { TaskList, ClassList, CalendarWidget, MessagesWidget } from './widgets'

export default function EmployeeDashboard() {
  return (
    <>
      <div className="w-full sm:w-1/2">
        <TaskList />
        <ClassList />
      </div>
      test
      <div className="w-full sm:w-1/2">
        <CalendarWidget />
        <MessagesWidget />
      </div>
    </>
  )
}
