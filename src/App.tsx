import { useEffect, useState, createContext } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/'
import Login from './pages/login'

import { ProtectedRouteAuth, ProtectedRouteRol } from './utils/ProtectedRoute'
import EmployeeDashboard from './pages/employees/dashboard'
import EmployeeJobs from './pages/employees/jobs'

import ClientDashboard from './pages/client/dashboard'

import Learn from './pages/learn'
import AdminDashboard from './pages/admin/dashboard'
import UsersPage from './pages/admin/users'
import Facilities from './pages/client/facilities'
import FacilityDetail from './pages/client/facilities/DetailView'
import Jobs from './pages/client/jobs'

export const AuthContext = createContext({} as any)

export default function App() {
  const [user, setUser] = useState<any>({})

  useEffect(() => {
    const ls_data = JSON.parse(localStorage.getItem('ht_usr') as any)
    if (ls_data && ls_data.role) {
      setUser({ ...user, role: ls_data.role })
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route element={<Layout />}>
            <Route element={<ProtectedRouteAuth redirectTo="/login" />}>
              <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
              <Route path="/employee/jobs" element={<EmployeeJobs />} />
              {/* LMS Module */}
              <Route path="/learn" element={<Learn />} />
              <Route element={<ProtectedRouteRol redirectTo="/login" roleAccess="client" />}>
                <Route path="/client/dashboard" element={<ClientDashboard />} />
                <Route path="/client/facilities" element={<Facilities />} />
                <Route path="/client/facilities/:facilityId" element={<FacilityDetail />} />
                <Route path="/client/jobs" element={<Jobs />} />
              </Route>
              <Route element={<ProtectedRouteRol redirectTo="/login" roleAccess="admin" />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<UsersPage />} />
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<h2>Page cannot be found </h2>} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  )
}
