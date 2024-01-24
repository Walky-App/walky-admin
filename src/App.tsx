import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRouteAuth, ProtectedRouteRol } from './utils/ProtectedRoute'

import Layout from './components/layout/'

/** Auth Pages */
import Login from './pages/login'

/** Employee Pages */
import EmployeeDashboard from './pages/employees/dashboard'
import EmployeeJobs from './pages/employees/jobs'
import EmployeeProfile from './pages/employees/EmployeeProfile'

/** Learn Pages */
import Learn from './pages/learn'

/** Admin Pages */
import AdminDashboard from './pages/admin/dashboard'
import UsersPage from './pages/admin/users'

/** Client Pages */
import ClientDashboard from './pages/client/dashboard'
import Facilities from './pages/client/facilities'
import FacilityDetail from './pages/client/facilities/DetailView'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route element={<Layout />}>
            <Route element={<ProtectedRouteAuth redirectTo="/login" />}>
              <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
              <Route path="/employee/jobs" element={<EmployeeJobs />} />
              <Route path="/employee/profile" element={<EmployeeProfile />} />
              {/* LMS Module */}
              <Route path="/learn" element={<Learn />} />
              <Route element={<ProtectedRouteRol redirectTo="/login" roleAccess="client" />}>
                <Route path="/client/dashboard" element={<ClientDashboard />} />
                <Route path="/client/facilities" element={<Facilities />} />
                <Route path="/client/facilities/:facilityId" element={<FacilityDetail />} />
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
    </AuthProvider>
  )
}
