import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ProtectedRouteAuth, ProtectedRouteRol } from './utils/ProtectedRoute'

import { AuthProvider } from './contexts/AuthContext'

/** Utilities Pages */
import Layout from './components/layout/'
import Error404 from './pages/Error404'

/** Auth Pages */
import Auth from './pages/auth'

/** Employee Pages */
import EmployeeDashboard from './pages/employees/dashboard'
import EmployeeJobs from './pages/employees/jobs'
import JobDetailView from './pages/employees/jobs/JobDetailView'
import EmployeeProfile from './pages/employees/EmployeeProfile'

/** Learn Pages */
import Learn from './pages/learn'

/** Client Pages */
import ClientDashboard from './pages/client/dashboard'
import Facilities from './pages/client/facilities'
import FacilityDetail from './pages/client/facilities/DetailView'
import NewFacility from './pages/client/facilities/NewFacility'
import Jobs from './pages/client/jobs'
import AddJob from './pages/client/jobs/AddJob'

/** Admin Pages */
import AdminDashboard from './pages/admin/dashboard'
import AdminProfile from './pages/admin/profile'
import AdminUsers from './pages/admin/users'
import AdminAddUser from './pages/admin/users/AdminAddUser'
import AdminUserDetails from './pages/admin/users/AdminUserDetails'
import AdminFacilities from './pages/admin/facilities'
import AdminFacilityDetails from './pages/admin/facilities/AdminFacilityDetails'
import AdminJobs from './pages/admin/jobs'
import AdminJobDetails from './pages/admin/jobs/AdminJobDetails'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/login" element={<Auth />} />
          <Route element={<Layout />}>
            <Route element={<ProtectedRouteAuth redirectTo="/login" />}>
              <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
              <Route path="/employee/jobs" element={<EmployeeJobs />} />
              <Route path="/employee/jobs/:id" element={<JobDetailView />} />
              <Route path="/employee/profile" element={<EmployeeProfile />} />
              {/* LMS Module */}
              <Route path="/learn" element={<Learn />} />
              <Route element={<ProtectedRouteRol redirectTo="/login" roleAccess="client" />}>
                <Route path="/client/dashboard" element={<ClientDashboard />} />
                <Route path="/client/facilities" element={<Facilities />} />
                <Route path="/client/facilities/new" element={<NewFacility />} />
                <Route path="/client/facilities/:facilityId" element={<FacilityDetail />} />
                <Route path="/client/jobs" element={<Jobs />} />
                <Route path="/client/jobs/new" element={<AddJob />} />
              </Route>
              <Route element={<ProtectedRouteRol redirectTo="/login" roleAccess="admin" />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/profile" element={<AdminProfile />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/users/add" element={<AdminAddUser />} />
                <Route path="/admin/users/:id" element={<AdminUserDetails />} />
                <Route path="/admin/facilities" element={<AdminFacilities />} />
                <Route path="/admin/facilities/:facilityId" element={<AdminFacilityDetails />} />
                <Route path="/admin/jobs" element={<AdminJobs />} />
                <Route path="/admin/jobs/:id" element={<AdminJobDetails />} />
                <Route path="/admin/learn" element={<Learn />} />
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<Error404 />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
