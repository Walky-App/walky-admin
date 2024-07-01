import { UserTimesheetsTable } from '../../../components/shared/timesheets/UserTimesheetsTable'

export const ProfileTimesheets = ({ userId }: { userId: string }) => {
  return (
    <div className="flex flex-col gap-4">
      {!userId ? <div>User not found</div> : <UserTimesheetsTable selectedUserId={userId} />}
    </div>
  )
}
