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
import ResetSuccess from './pages/auth/ResetSuccess'
import Signup from './pages/auth/SignupForm'

/** Employee Pages */
import EmployeeDashboard from './pages/employees/dashboard'
import EmployeeJobs from './pages/employees/jobs'
import JobDetailView from './pages/employees/jobs/JobDetailView'
import EmployeeProfile from './pages/employees/EmployeeProfile'

/** Learn Pages */
import { Learn } from './pages/learn/Learn'
import { Modules } from './pages/learn/modules/Modules'
import { Units } from './pages/learn/units/Units'
import { UnitDetail } from './pages/learn/units/UnitDetail'

/** Client Pages */
import ClientOnboarding from './pages/client/onboarding'
import ClientDashboard from './pages/client/dashboard'
import Facilities from './pages/client/facilities'
import ClientFacilityDetails from './pages/client/facilities/ClientFacilityDetails'
import ClientAddFacility from './pages/client/facilities/ClientAddFacility'
import Jobs from './pages/client/jobs'
import ClientAddJob from './pages/client/jobs/addJob/ClientAddJob'
import ClientEditJob from './pages/client/jobs/editJob/ClientEditJob'
import ClientProfile from './pages/client/ClientProfile'
import JobDetailViewClient from './pages/client/jobs/JobDetailViewClient'

/** Sales Pages */
import SalesDashboard from './pages/sales/dashboard'
import SalesProfile from './pages/sales/profile/SalesProfile'
import Products from './pages/sales/products'
import ProductDetail from './pages/sales/products/ProductDetail'

/** Admin Pages */
import AdminDashboard from './pages/admin/dashboard'
import AdminProfile from './pages/admin/profile/AdminProfile'
import AdminUsers from './pages/admin/users'
import AdminInviteUser from './pages/admin/users/AdminInviteUser'
import AdminUserDetails from './pages/admin/users/AdminUserDetails'
import AdminFacilities from './pages/admin/facilities'
import AdminFacilityDetails from './pages/admin/facilities/AdminFacilityDetails'
import AdminFacilityContacts from './pages/admin/facilities/AdminFacilityContacts'
import AdminJobs from './pages/admin/jobs'
import AdminJobDetails from './pages/admin/jobs/AdminJobDetails'
import AdminAddFacility from './pages/admin/facilities/AdminAddFacility'
import AdminFacilityInternalNotes from './pages/admin/facilities/AdminFacilityInternalNotes'
import AdminAddJob from './pages/admin/jobs/AdminAddJob'
import { AdminAddCategory } from './pages/admin/HTU/AdminAddCategory'
import { AdminAddModule } from './pages/admin/HTU/AdminAddModule'
import { AdminCategoryLearn } from './pages/admin/HTU/AdminCategoryLearn'
import { AdminDashboardLearn } from './pages/admin/HTU/AdminDashboardLearn'
import { AdminModulesLearn } from './pages/admin/HTU/AdminModulesLearn'
import AdminFacilityImages from './pages/admin/facilities/AdminFacilityImages'
import AdminFacilityLicenses from './pages/admin/facilities/AdminFacilityLicenses'
import { AdminDetailsCategory } from './pages/admin/HTU/AdminDetailsCategory'
import { AdminDetailsModule } from './pages/admin/HTU/AdminDetailsModule'
import AdminFacilityJobs from './pages/admin/facilities/AdminFacilityJobs'
import AdminFacilityAddJob from './pages/admin/facilities/AdminFacilityAddJob'
import AdminFacilityJobDetails from './pages/admin/facilities/AdminFacilityJobDetails'
import { AdminUnitsLearn } from './pages/admin/HTU/AdminUnitsLearn'
import AdminFacilityActivity from './pages/admin/facilities/AdminFacilityActivity'
import { AdminAddUnit } from './pages/admin/HTU/AdminAddUnit'
import { AdminDetailsUnit } from './pages/admin/HTU/AdminDetailsUnit'
import { AdminAddAssessment } from './pages/admin/HTU/AdminAddAssessment'
import { AdminDetailsAssessment } from './pages/admin/HTU/AdminDetailsAssessment'

const admin_role = process.env.REACT_APP_ADMIN_ROLE as string
const client_role = process.env.REACT_APP_CLIENT_ROLE as string
const employee_role = process.env.REACT_APP_EMPLOYEE_ROLE as string
const sales_role = process.env.REACT_APP_SALES_ROLE as string

export const App = () => {
  return (
    <AuthProvider>
      <AdminProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Auth />} path="/" />
            <Route element={<Auth />} path="/login" />
            <Route element={<NewPasswordForm />} path="/reset/:id/:at" />
            <Route element={<ResetSuccess />} path="/reset-success" />
            <Route element={<Signup />} path="/invite/:email/:role" />
            <Route element={<Layout />}>
              <Route element={<ProtectedRouteAuth redirectTo="/login" />}>
                <Route element={<EmployeeDashboard />} path="/employee/dashboard" />
                <Route element={<EmployeeJobs />} path="/employee/jobs" />
                <Route element={<JobDetailView />} path="/employee/jobs/:id" />
                <Route element={<EmployeeProfile />} path="/employee/profile" />
                {/* LMS Module */}
                <Route element={<Learn />} path="/learn" />
                <Route element={<Modules />} path="/learn/category/:categoryId" />
                <Route element={<Units />} path="/learn/module/:moduleId" />
                <Route element={<UnitDetail />} path="/learn/module/:moduleId/unit/:unitId" />
                <Route element={<ProtectedRouteRol redirectTo="/notFound" roleAccess={admin_role} />}>
                  <Route element={<ClientOnboarding />} path="/client/onboarding" />
                  <Route element={<ClientDashboard />} path="/client/dashboard" />
                  <Route element={<ClientProfile />} path="/client/profile" />
                  <Route element={<Facilities />} path="/client/facilities" />
                  <Route element={<ClientAddFacility />} path="/client/facilities/new" />
                  <Route element={<ClientFacilityDetails />} path="/client/facilities/:facilityId" />
                  <Route element={<Jobs />} path="/client/jobs" />
                  <Route element={<ClientAddJob />} path="/client/jobs/new" />
                  <Route element={<ClientEditJob />} path="/client/jobs/:id/edit" />
                  <Route element={<JobDetailViewClient />} path="/client/jobs/:id" />
                </Route>
                <Route element={<ProtectedRouteRol redirectTo="/notFound" roleAccess={sales_role} />}>
                  <Route element={<SalesDashboard />} path="/sales/dashboard" />
                  <Route element={<ClientProfile />} path="/sales/profile" />
                  <Route element={<AdminFacilities />} path="/sales/facilities" />
                  <Route element={<ClientAddFacility />} path="/sales/facilities/new" />
                  <Route element={<AdminFacilityDetails />} path="/sales/facilities/:facilityId" />
                  <Route element={<AdminFacilityContacts />} path="/sales/facilities/:facilityId/contacts" />
                  <Route element={<AdminFacilityImages />} path="/sales/facilities/:facilityId/images" />
                  <Route element={<AdminFacilityJobs />} path="/sales/facilities/:facilityId/jobs" />
                  <Route element={<AdminFacilityInternalNotes />} path="/sales/facilities/:facilityId/internal_notes" />
                  <Route element={<AdminFacilityLicenses />} path="/sales/facilities/:facilityId/licenses" />
                  <Route element={<AdminFacilityActivity />} path="/sales/facilities/:facilityId/activity" />
                  <Route element={<Products />} path="/sales/products" />
                  <Route element={<ProductDetail />} path="/sales/products/:id" />
                </Route>
                <Route element={<ProtectedRouteRol redirectTo="/notFound" roleAccess={admin_role} />}>
                  <Route element={<AdminDashboard />} path="/admin/dashboard" />
                  <Route element={<AdminProfile />} path="/admin/profile" />
                  <Route element={<AdminUsers />} path="/admin/users" />
                  <Route element={<AdminInviteUser />} path="/admin/users/invite" />
                  <Route element={<AdminUserDetails />} path="/admin/users/:id" />
                  <Route element={<AdminFacilities />} path="/admin/facilities" />
                  <Route element={<AdminFacilityDetails />} path="/admin/facilities/:facilityId" />
                  <Route element={<AdminFacilityActivity />} path="/admin/facilities/:facilityId/activity" />
                  <Route element={<AdminFacilityContacts />} path="/admin/facilities/:facilityId/contacts" />
                  <Route element={<AdminAddFacility />} path="/admin/facilities/new" />
                  <Route element={<AdminFacilityInternalNotes />} path="/admin/facilities/:facilityId/internal_notes" />
                  <Route element={<AdminFacilityJobs />} path="/admin/facilities/:facilityId/jobs" />
                  <Route element={<AdminFacilityAddJob />} path="/admin/facilities/:facilityId/jobs/new" />
                  <Route element={<AdminFacilityJobDetails />} path="/admin/facilities/:facilityId/jobs/:jobId" />
                  <Route element={<AdminFacilityImages />} path="/admin/facilities/:facilityId/images" />
                  <Route element={<AdminFacilityLicenses />} path="/admin/facilities/:facilityId/licenses" />
                  <Route element={<AdminJobs />} path="/admin/jobs" />
                  <Route element={<AdminAddJob />} path="/admin/jobs/new" />
                  <Route element={<AdminJobDetails />} path="/admin/jobs/:id" />
                  <Route element={<AdminDashboardLearn />} path="/admin/learn" />
                  <Route element={<AdminCategoryLearn />} path="/admin/learn/categories" />
                  <Route element={<AdminDetailsCategory />} path="/admin/learn/categories/:categoryId" />
                  <Route element={<AdminAddCategory />} path="/admin/learn/categories/new" />
                  <Route element={<AdminModulesLearn />} path="/admin/learn/modules" />
                  <Route element={<AdminDetailsModule />} path="/admin/learn/modules/:moduleId" />
                  <Route element={<AdminUnitsLearn />} path="/admin/learn/modules/:moduleId/units" />
                  <Route element={<AdminAddUnit />} path="/admin/learn/modules/:moduleId/units/new" />
                  <Route element={<AdminDetailsUnit />} path="/admin/learn/modules/:moduleId/units/:unitId" />
                  <Route element={<AdminAddAssessment />} path="/admin/learn/modules/:moduleId/units/:unitId/assessment" />
                  <Route element={<AdminDetailsAssessment />} path="/admin/learn/modules/:moduleId/units/:unitId/assessment/:assessmentId" />
                  <Route element={<AdminAddModule />} path="/admin/learn/modules/new" />
                </Route>
              </Route>
            </Route>
            <Route element={<Error404 />} path="*" />
          </Routes>
        </BrowserRouter>
      </AdminProvider>
    </AuthProvider>
  )
}
