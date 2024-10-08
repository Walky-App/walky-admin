import { type ReactNode, createContext, useContext, useEffect, useState } from 'react'

import { type IUser } from '../interfaces/User'
import { type ITokenInfo } from '../interfaces/services'
import { roleChecker } from '../utils/roleChecker'

interface AuthContextType {
  user: IUser | undefined
  setUser: (user: IUser) => void
  profilePath: string
  setProfilePath: (path: string) => void
}

interface AuthProviderProps {
  children: ReactNode
}

const AuthContext = createContext<AuthContextType>({
  user: undefined,
  setUser: () => {
    throw new Error('setUser function must be overridden')
  },
  profilePath: '',
  setProfilePath: () => {
    throw new Error('setProfilePath function must be overridden')
  },
})

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<IUser>()
  const [profilePath, setProfilePath] = useState<string>('')

  useEffect(() => {
    const ls_data: ITokenInfo = JSON.parse(localStorage.getItem('ht_usr') as string)
    if (ls_data != null && ls_data.role) {
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
  }, [role, user])

  return <AuthContext.Provider value={{ user, setUser, profilePath, setProfilePath }}>{children}</AuthContext.Provider>
}

const useAuth = () => useContext(AuthContext)
export { AuthProvider, useAuth }
