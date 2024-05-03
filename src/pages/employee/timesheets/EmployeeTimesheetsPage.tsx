import { HeaderComponent } from '../../../components/shared/general/HeaderComponent'
import { UserTimesheetsTable } from '../../../components/shared/timesheets/UserTimesheetsTable'
import { GetTokenInfo } from '../../../utils/tokenUtil'

export const EmployeeTimesheets = () => {
  const currentUserId = GetTokenInfo()._id

  return (
    <>
      <HeaderComponent title="Timesheets" />
      <UserTimesheetsTable selectedUserId={currentUserId} />
    </>
  )
}
