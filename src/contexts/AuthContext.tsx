import { createContext, useContext, useEffect, useState } from 'react'

import { IUser } from '../interfaces/User'
import { ITokenInfo } from '../interfaces/services.interfaces'

interface AuthContextType {
  user: IUser | undefined
  setUser: (user: IUser) => void
}

const AuthContext = createContext<AuthContextType>({
  user: undefined,
  setUser: () => {},
})

const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<IUser>()

  useEffect(() => {
    const ls_data: ITokenInfo = JSON.parse(localStorage.getItem('ht_usr') as any)
    if (ls_data && ls_data.role) {
      setUser(ls_data as IUser)
    }
  }, [])

  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>
}

const useAuth = () => useContext(AuthContext)
export { AuthProvider, useAuth }
