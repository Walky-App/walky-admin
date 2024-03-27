/* eslint-disable */
import { createContext, useContext, useEffect, useState } from 'react'

import { type IUser } from '../interfaces/User'
import { type ITokenInfo } from '../interfaces/services'

const admin_role = process.env.REACT_APP_ADMIN_ROLE as string
const client_role = process.env.REACT_APP_CLIENT_ROLE as string
const employee_role = process.env.REACT_APP_EMPLOYEE_ROLE as string
const sales_role = process.env.REACT_APP_SALES_ROLE as string

interface AuthContextType {
  user: IUser | undefined
  setUser: (user: IUser) => void
  profilePath: string
  setProfilePath: (path: string) => void
}

const AuthContext = createContext<AuthContextType>({
  user: undefined,
  setUser: () => {},
  profilePath: '',
  setProfilePath: () => {},
})

const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<IUser>()
  const [profilePath, setProfilePath] = useState<string>('')

  useEffect(() => {
    const ls_data: ITokenInfo = JSON.parse(localStorage.getItem('ht_usr') as any)
    if (ls_data && ls_data.role) {
      setUser(ls_data as IUser)
    }
  }, [])

  useEffect(() => {
    if (user && user.role) {
      switch (user.role) {
        case admin_role:
          setProfilePath('/admin/profile')
          break
        case client_role:
          setProfilePath('/client/profile')
          break
        case employee_role:
          setProfilePath('/employee/profile')
          break
        case sales_role:
          setProfilePath('/sales/profile')
          break
        default:
          setProfilePath('/')
          break
      }
    } else {
      setProfilePath('/')
    }
  }, [user])

  return <AuthContext.Provider value={{ user, setUser, profilePath, setProfilePath }}>{children}</AuthContext.Provider>
}

const useAuth = () => useContext(AuthContext)
export { AuthProvider, useAuth }
