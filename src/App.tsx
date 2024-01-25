import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ProtectedRouteAuth, ProtectedRouteRol } from './utils/ProtectedRoute'

import { AuthProvider } from './contexts/AuthContext'

/** Utilities Pages */
import Layout from './components/layout/'
import Error404 from './pages/Error404'

/** Auth Pages */
import Login from './pages/login'

/** Employee Pages */
import EmployeeDashboard from './pages/employees/dashboard'
import EmployeeJobs from './pages/employees/jobs'
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
import AdminUsers from './pages/admin/users'
import AdminFacilities from './pages/admin/facilities'
import AdminJobs from './pages/admin/jobs'
// import AdminJobDetail from './pages/admin/jobs/details/AdminJobDetail'

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
                <Route path="/client/facilities/new" element={<NewFacility />} />
                <Route path="/client/facilities/:facilityId" element={<FacilityDetail />} />
                <Route path="/client/jobs" element={<Jobs />} />
                <Route path="/client/jobs/new" element={<AddJob />} />
              </Route>
              <Route element={<ProtectedRouteRol redirectTo="/login" roleAccess="admin" />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/facilities" element={<AdminFacilities />} />
                <Route path="/admin/jobs" element={<AdminJobs />} />
                {/* <Route path="/admin/jobs/details/:jobId" element={<AdminJobDetail />} /> */}
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<Error404 />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
