import { useEffect, useState } from 'react'

import { Dropdown } from 'primereact/dropdown'

import { HTLoadingLogo } from '../../../components/shared/HTLoadingLogo'
import { HtInputLabel } from '../../../components/shared/forms/HtInputLabel'
import { HtInfoTooltip } from '../../../components/shared/general/HtInfoTooltip'
import { UserTimesheetsTable } from '../../../components/shared/timesheets/UserTimesheetsTable'
import { type IUser } from '../../../interfaces/User'
import { requestService } from '../../../services/requestServiceNew'

export const AdminTimesheetsPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<IUser>()
  const [usersData, setUsersData] = useState<IUser[]>([])

  useEffect(() => {
    setIsLoading(true)
    const getActiveEmployees = async () => {
      try {
        const response = await requestService({ path: 'users/employees/active' })
        const data = await response.json()

        if (!response.ok) throw new Error(data.message ?? 'Failed to fetch users')

        setUsersData(data as IUser[])
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    getActiveEmployees()
  }, [])

  const handleDropdownOptions = () => {
    return usersData.map(applicant => ({ label: applicant.first_name + ' ' + applicant.last_name, value: applicant }))
  }

  return (
    <div>
      {isLoading ? (
        <HTLoadingLogo />
      ) : (
        <div>
          <HtInfoTooltip message="ONLY Approved Employees are listed here">
            <HtInputLabel htmlFor="applicant_dropdown" labelText="ONLY Approved Employees:" />
          </HtInfoTooltip>
          <div className="p-inputgroup w-1/3">
            <Dropdown
              value={selectedUser}
              name="applicant_dropdown"
              placeholder="Select an applicant"
              onChange={event => setSelectedUser(event.value)}
              options={handleDropdownOptions()}
              filter
            />
          </div>
        </div>
      )}
      <UserTimesheetsTable selectedUserId={selectedUser?._id ?? ''} />
    </div>
  )
}
