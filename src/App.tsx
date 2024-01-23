import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import EmployeeDashboard from './pages/employee/dashboard'
import { AuthProvider } from './contexts/UserContext'
import Layout from './components/layout/Layout'
import Login from './pages/login'
import { ProtectedRouteAuth, ProtectedRouteRol } from './utils/ProtectedRoute'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route element={<Layout />}>
            <Route element={<ProtectedRouteAuth redirectTo="/login" />} >
              <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
              <Route element={<ProtectedRouteRol redirectTo="/login" canRolActived="client" />} >
                <Route path="/employee/dashboard" element={<EmployeeDashboard />} />

              </Route>

            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider >
  )
}
