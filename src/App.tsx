import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ProtectedRouteAuth, ProtectedRouteRol } from './utils/ProtectedRoute'

import { AuthProvider } from './contexts/AuthContext'
import { AdminProvider } from './contexts/AdminContext'

/** Utilities Pages */
import Layout from './components/layout/'
import Error404 from './pages/Error404'

/** Auth Pages */
import Auth from './pages/auth'
import NewPasswordForm from './pages/auth/NewPasswordForm'

/** Employee Pages */
import EmployeeDashboard from './pages/employees/dashboard'
import EmployeeJobs from './pages/employees/jobs'
import JobDetailView from './pages/employees/jobs/JobDetailView'
import EmployeeProfile from './pages/employees/EmployeeProfile'

/** Learn Pages */
import Learn from './pages/learn'
import Modules from './pages/learn/modules'

/** Client Pages */
import ClientDashboard from './pages/client/dashboard'
import Facilities from './pages/client/facilities'
import FacilityDetail from './pages/client/facilities/DetailView'
import NewFacility from './pages/client/facilities/NewFacility'
import Jobs from './pages/client/jobs'
import AddJob from './pages/client/jobs/AddJob'
import ClientProfile from './pages/client/ClientProfile'
import JobDetailViewClient from './pages/client/jobs/JobDetailViewClient'

/** Admin Pages */
import AdminDashboard from './pages/admin/dashboard'
import AdminProfile from './pages/admin/profile'
import AdminUsers from './pages/admin/users'
import AdminAddUser from './pages/admin/users/AdminAddUser'
import AdminUserDetails from './pages/admin/users/AdminUserDetails'
import AdminFacilities from './pages/admin/facilities'
import AdminFacilityDetails from './pages/admin/facilities/AdminFacilityDetails'
import AdminFacilityContacts from './pages/admin/facilities/AdminFacilityContacts'
import AdminJobs from './pages/admin/jobs'
import AdminJobDetails from './pages/admin/jobs/AdminJobDetails'
import AdminAddFacility from './pages/admin/facilities/AdminAddFacility'
import AdminFacilityInternalNotes from './pages/admin/facilities/AdminFacilityInternalNotes'
import AdminAddJob from './pages/admin/jobs/AdminAddJob'
import AdminAddCategory from './pages/admin/HTU/AdminAddCategory'
import AdminAddModule from './pages/admin/HTU/AdminAddModule'
import AdminCategoryLearn from './pages/admin/HTU/AdminCategoryLearn'
import AdminDashboardLearn from './pages/admin/HTU'
import AdminModulesLearn from './pages/admin/HTU/AdminModulesLearn'
import AdminFacilityImages from './pages/admin/facilities/AdminFacilityImages'
import AdminFacilityLicenses from './pages/admin/facilities/AdminFacilityLicenses'
import AdminDetailsCategory from './pages/admin/HTU/AdminDetailsCategory'
import AdminDetailsModule from './pages/admin/HTU/AdminDetailsModule'
import AdminFacilityJobs from './pages/admin/facilities/AdminFacilityJobs'
import AdminFacilityAddJob from './pages/admin/facilities/AdminFacilityAddJob'
import AdminFacilityJobDetails from './pages/admin/facilities/AdminFacilityJobDetails'

export default function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/reset/:id/:at" element={<NewPasswordForm />} />
          <Route element={<Layout />}>
              <Route element={<ProtectedRouteAuth redirectTo="/login" />}>
                <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
                <Route path="/employee/jobs" element={<EmployeeJobs />} />
                <Route path="/employee/jobs/:id" element={<JobDetailView />} />
                <Route path="/employee/profile" element={<EmployeeProfile />} />
                {/* LMS Module */}
                <Route path="/learn" element={<Learn />} />
                <Route path="/learn/category/:id" element={<Modules />} />
                <Route element={<ProtectedRouteRol redirectTo="/login" roleAccess="client" />}>
                  <Route path="/client/dashboard" element={<ClientDashboard />} />
                  <Route path="/client/profile" element={<ClientProfile />} />
                  <Route path="/client/facilities" element={<Facilities />} />
                  <Route path="/client/facilities/new" element={<NewFacility />} />
                  <Route path="/client/facilities/:facilityId" element={<FacilityDetail />} />
                  <Route path="/client/jobs" element={<Jobs />} />
                  <Route path="/client/jobs/new" element={<AddJob />} />
                  <Route path="/client/jobs/:id" element={<JobDetailViewClient />} />
                </Route>
                <Route element={<ProtectedRouteRol redirectTo="/login" roleAccess="admin" />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/profile" element={<AdminProfile />} />
                  <Route path="/admin/users" element={<AdminUsers />} />
                  <Route path="/admin/users/new" element={<AdminAddUser />} />
                  <Route path="/admin/users/:id" element={<AdminUserDetails />} />
                  <Route path="/admin/facilities" element={<AdminFacilities />} />
                  <Route path="/admin/facilities/:facilityId" element={<AdminFacilityDetails />} />
                  <Route path="/admin/facilities/:facilityId/contacts" element={<AdminFacilityContacts />} />
                  <Route path="/admin/facilities/new" element={<AdminAddFacility />} />
                  <Route path="/admin/facilities/:facilityId/internal_notes" element={<AdminFacilityInternalNotes />} />
                  <Route path="/admin/facilities/:facilityId/jobs" element={<AdminFacilityJobs />} />
                  <Route path="/admin/facilities/:facilityId/jobs/new" element={<AdminFacilityAddJob />} />
                  <Route path="/admin/facilities/:facilityId/jobs/:jobId" element={<AdminFacilityJobDetails />} />
                  <Route path="/admin/facilities/:facilityId/images" element={<AdminFacilityImages />} />
                  <Route path="/admin/facilities/:facilityId/licenses" element={<AdminFacilityLicenses />} />
                  <Route path="/admin/jobs" element={<AdminJobs />} />
                  <Route path="/admin/jobs/new" element={<AdminAddJob />} />
                  <Route path="/admin/jobs/:id" element={<AdminJobDetails />} />
                  <Route path="/admin/learn" element={<AdminDashboardLearn />} />
                  <Route path="/admin/learn/categories" element={<AdminCategoryLearn />} />
                  <Route path="/admin/learn/categories/:idCategory" element={<AdminDetailsCategory />} />
                  <Route path="/admin/learn/categories/new" element={<AdminAddCategory />} />
                  <Route path="/admin/learn/modules" element={<AdminModulesLearn />} />
                  <Route path="/admin/learn/modules/:idModule" element={<AdminDetailsModule />} />
                  <Route path="/admin/learn/modules/new" element={<AdminAddModule />} />
                </Route>
              </Route>
            </Route>
            <Route path="*" element={<Error404 />} />
          </Routes>
        </BrowserRouter>
      </AdminProvider>
    </AuthProvider >
  )
}