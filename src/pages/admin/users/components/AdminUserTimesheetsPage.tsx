import { UserTimesheetsTable } from '../../../../components/shared/timesheets/UserTimesheetsTable'
import { useAdminUserPageContext } from '../AdminUserPage'

export const AdminUserTimesheets = () => {
  const { selectedUserId } = useAdminUserPageContext()

  return (
    <div className="flex flex-col gap-4">
      {!selectedUserId ? <div>User not found</div> : <UserTimesheetsTable selectedUserId={selectedUserId} />}
    </div>
  )
}
