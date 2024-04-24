import { useState, useEffect, createContext, useContext } from 'react'

import { Outlet, useParams } from 'react-router-dom'

import { Skeleton } from 'primereact/skeleton'

import { type SubHeaderData, SubHeader } from '../../../components/shared/SubHeader'
import { type IUser } from '../../../interfaces/User'
import { requestService } from '../../../services/requestServiceNew'
import { adminUserLinks } from './adminUserSubHeaderLinks'

interface IAdminUserContext {
  selectedUserData: IUser
  selectedUserId?: string
}

const AdminUserContext = createContext<IAdminUserContext>({} as IAdminUserContext)

export const useAdminUserContext = () => {
  return useContext(AdminUserContext)
}

export const AdminUserPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedUserData, setSelectedUserData] = useState<IUser>({} as IUser)

  const selectedUserId = useParams().id

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await requestService({ path: `users/${selectedUserId}` })
        if (!response.ok) {
          throw new Error('Failed to fetch user data')
        }
        const userFound: IUser = await response.json()
        setSelectedUserData(userFound)
      } catch (error) {
        console.error('Error fetching user data: ', error)
      } finally {
        setIsLoading(false)
      }
    }
    getUser()
  }, [selectedUserId])

  const subheaderUserDetails: SubHeaderData = {
    _id: selectedUserData?._id,
    name: `${selectedUserData?.first_name} ${selectedUserData?.last_name}`,
    city: selectedUserData?.city,
    address: selectedUserData?.address,
  }

  return (
    <AdminUserContext.Provider value={{ selectedUserId, selectedUserData }}>
      {isLoading ? (
        <Skeleton width="100%" height="100%" />
      ) : (
        <>
          <SubHeader data={subheaderUserDetails} links={adminUserLinks} />
          <Outlet />
        </>
      )}
    </AdminUserContext.Provider>
  )
}
