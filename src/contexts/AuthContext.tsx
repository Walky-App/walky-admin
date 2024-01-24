import { CheckSession, LogoutService } from '../services/AuthService';
import { createContext, useCallback, useContext, useEffect, useState } from "react"

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
  const [loading, setLoading] = useState(true);

  const login = (user: any) => {
    setUser(user)
  }

  const logout = useCallback(() => {
    if (user !== null) {
      LogoutService()
      window.location.href = '/login'
    }
    setUser(null);
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await CheckSession();
        if (response) {
          if (response.status === 401) {
            return logout();
          }
          login(response);
        } else {
          logout();
        }
      } catch (error) {
        console.error('Error al verificar la sesión:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, [logout]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}



const useAuth = () => useContext(AuthContext)
export { AuthProvider, useAuth }
