import { createContext, useContext, useEffect, useState } from "react"
import { AuthService } from "../services/AuthService";

interface AuthContextType {
  user: any | null;
  login: (user: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => { },
  logout: () => { }
});

const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null)
  const login = (user: any) => {
    setUser(user)
  }
  const logout = () => {
    setUser(null)
  }

  const isConected = async () => {
    if (!user) {
      const res = await AuthService('auth/user')
      setUser(res)
    }
  }


  useEffect(() => {
    isConected()
  }, [])


  console.log('user in context->', user)

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}



const useAuth = () => useContext(AuthContext)
export { AuthProvider, useAuth }
