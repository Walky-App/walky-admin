/* eslint-disable */
import { createContext, useContext, useEffect, useState } from 'react'

import { type IUser } from '../interfaces/User'
import { type ITokenInfo } from '../interfaces/services'
import { roleChecker } from '../utils/roleChecker'

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

  const role = roleChecker()

  useEffect(() => {
    if (user && role) {
      switch (role) {
        case 'admin':
          setProfilePath('/admin/profile')
          break
        case 'client':
          setProfilePath('/client/profile')
          break
        case 'employee':
          setProfilePath('/employee/profile')
          break
        case 'sales':
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
