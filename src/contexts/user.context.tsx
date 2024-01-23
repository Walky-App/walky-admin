import { AuthService } from '../services/AuthService'
import { createContext, useContext, useEffect, useState } from 'react'

export const AuthContext = createContext('any' as any)

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState()

  const setLogin = (userData: any) => {
    setUser(userData)
  }

  const isConected = async () => {
    if (!user) {
      const res = await AuthService('auth/user')
      setUser(res)
    }
  }

  const setLogout = () => {
    setUser(null as any)
  }

  useEffect(() => {
    isConected()
  }, [])
  return <AuthContext.Provider value={{ user, setLogin, setLogout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
