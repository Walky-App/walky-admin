import { createContext, useContext, useEffect, useState } from 'react'

import { IUser } from '../interfaces/User'
import { ITokenInfo } from '../interfaces/services.interfaces'

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
        case 'employee':
          setProfilePath('/employee/profile')
          break
        case 'client':
          setProfilePath('/client/profile')
          break
        case 'admin':
          setProfilePath('/admin/profile')
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
