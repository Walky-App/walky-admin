import { createContext, useContext, useEffect, useState } from 'react'

interface AuthContextType {
  user: any | null
  setUser: (user: any) => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
})

const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>({})

  useEffect(() => {
    const ls_data = JSON.parse(localStorage.getItem('ht_usr') as any)
    if (ls_data && ls_data.role) {
      setUser({ ...user, role: ls_data.role, first_name: ls_data.first_name})
    }
  }, [])

  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>
}

const useAuth = () => useContext(AuthContext)
export { AuthProvider, useAuth }
