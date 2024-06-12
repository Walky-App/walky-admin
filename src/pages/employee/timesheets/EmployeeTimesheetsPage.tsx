import { UserTimesheetsTable } from '../../../components/shared/timesheets/UserTimesheetsTable'
import { GetTokenInfo } from '../../../utils/tokenUtil'

export const EmployeeTimesheets = () => {
  const currentUserId = GetTokenInfo()._id

  return <UserTimesheetsTable selectedUserId={currentUserId} />
}
