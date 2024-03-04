import { BrowserRouter, Route, Routes } from 'react-router-dom'

/** Utilities Pages */
import Layout from './components/layout/'
import { AdminProvider } from './contexts/AdminContext'
import { AuthProvider } from './contexts/AuthContext'
/** Admin Pages */
import AdminDashboard from './pages/admin/dashboard'
import AdminFacilities from './pages/admin/facilities'
import AdminAddFacility from './pages/admin/facilities/AdminAddFacility'
import AdminFacilityActivity from './pages/admin/facilities/AdminFacilityActivity'
import AdminFacilityAddJob from './pages/admin/facilities/AdminFacilityAddJob'
import AdminFacilityContacts from './pages/admin/facilities/AdminFacilityContacts'
import AdminFacilityDetails from './pages/admin/facilities/AdminFacilityDetails'
import AdminFacilityImages from './pages/admin/facilities/AdminFacilityImages'
import AdminFacilityInternalNotes from './pages/admin/facilities/AdminFacilityInternalNotes'
import AdminFacilityJobDetails from './pages/admin/facilities/AdminFacilityJobDetails'
import AdminFacilityJobs from './pages/admin/facilities/AdminFacilityJobs'
import AdminFacilityLicenses from './pages/admin/facilities/AdminFacilityLicenses'
import AdminAddCategory from './pages/admin/HTU/AdminAddCategory'
import AdminAddModule from './pages/admin/HTU/AdminAddModule'
import AdminAddUnit from './pages/admin/HTU/AdminAddUnit'
import AdminCategoryLearn from './pages/admin/HTU/AdminCategoryLearn'
import AdminDashboardLearn from './pages/admin/HTU/AdminDashboardLearn'
import AdminDetailsCategory from './pages/admin/HTU/AdminDetailsCategory'
import AdminDetailsModule from './pages/admin/HTU/AdminDetailsModule'
import AdminDetailsUnit from './pages/admin/HTU/AdminDetailsUnit'
import AdminModulesLearn from './pages/admin/HTU/AdminModulesLearn'
import AdminUnitsLearn from './pages/admin/HTU/AdminUnitsLearn'
import AdminJobs from './pages/admin/jobs'
import AdminAddJob from './pages/admin/jobs/AdminAddJob'
import AdminJobDetails from './pages/admin/jobs/AdminJobDetails'
import AdminProfile from './pages/admin/profile/AdminProfile'
import AdminUsers from './pages/admin/users'
import AdminInviteUser from './pages/admin/users/AdminInviteUser'
import AdminUserDetails from './pages/admin/users/AdminUserDetails'
/** Auth Pages */
import Auth from './pages/auth'
import NewPasswordForm from './pages/auth/NewPasswordForm'
import ResetSuccess from './pages/auth/ResetSuccess'
import Signup from './pages/auth/SignupForm'
import ClientProfile from './pages/client/ClientProfile'
import ClientDashboard from './pages/client/dashboard'
import Facilities from './pages/client/facilities'
import ClientAddFacility from './pages/client/facilities/ClientAddFacility'
import ClientFacilityDetails from './pages/client/facilities/ClientFacilityDetails'
import Jobs from './pages/client/jobs'
import ClientAddJob from './pages/client/jobs/addJob/ClientAddJob'
import ClientEditJob from './pages/client/jobs/editJob/ClientEditJob'
import JobDetailViewClient from './pages/client/jobs/JobDetailViewClient'
/** Client Pages */
import { ClientOnboarding } from './pages/client/onboarding/ClientOnboardingPage'
/** Employee Pages */
import EmployeeDashboard from './pages/employees/dashboard'
import EmployeeProfile from './pages/employees/EmployeeProfile'
import EmployeeJobs from './pages/employees/jobs'
import JobDetailView from './pages/employees/jobs/JobDetailView'
import Error404 from './pages/Error404'
/** Learn Pages */
import Learn from './pages/learn'
import Modules from './pages/learn/modules'
import Units from './pages/learn/units'
import UnitDetail from './pages/learn/units/UnitDetail'
/** Sales Pages */
import SalesDashboard from './pages/sales/dashboard'
import Products from './pages/sales/products'
import ProductDetail from './pages/sales/products/ProductDetail'
import SalesProfile from './pages/sales/profile/SalesProfile'
import { ProtectedRouteAuth, ProtectedRouteRol } from './utils/ProtectedRoute'

const admin_role = process.env.REACT_APP_ADMIN_ROLE as string
const client_role = process.env.REACT_APP_CLIENT_ROLE as string
const employee_role = process.env.REACT_APP_EMPLOYEE_ROLE as string
const sales_role = process.env.REACT_APP_SALES_ROLE as string

export default function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/reset/:id/:at" element={<NewPasswordForm />} />
            <Route path="/reset-success" element={<ResetSuccess />} />
            <Route path="/invite/:email/:role" element={<Signup />} />
            <Route element={<Layout />}>
              <Route element={<ProtectedRouteAuth redirectTo="/login" />}>
                <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
                <Route path="/employee/jobs" element={<EmployeeJobs />} />
                <Route path="/employee/jobs/:id" element={<JobDetailView />} />
                <Route path="/employee/profile" element={<EmployeeProfile />} />
                {/* LMS Module */}
                <Route path="/learn" element={<Learn />} />
                <Route path="/learn/category/:categoryId" element={<Modules />} />
                <Route path="/learn/module/:moduleId" element={<Units />} />
                <Route path="/learn/module/:moduleId/unit/:unitId" element={<UnitDetail />} />
                <Route element={<ProtectedRouteRol redirectTo="/notFound" roleAccess={client_role} />}>
                  <Route path="/client/onboarding" element={<ClientOnboarding />} />
                  <Route path="/client/dashboard" element={<ClientDashboard />} />
                  <Route path="/client/profile" element={<ClientProfile />} />
                  <Route path="/client/facilities" element={<Facilities />} />
                  <Route path="/client/facilities/new" element={<ClientAddFacility />} />
                  <Route path="/client/facilities/:facilityId" element={<ClientFacilityDetails />} />
                  <Route path="/client/jobs" element={<Jobs />} />
                  <Route path="/client/jobs/new" element={<ClientAddJob />} />
                  <Route path="/client/jobs/:id/edit" element={<ClientEditJob />} />
                  <Route path="/client/jobs/:id" element={<JobDetailViewClient />} />
                </Route>

                <Route element={<ProtectedRouteRol redirectTo="/notFound" roleAccess={sales_role} />}>
                  <Route path="/sales/dashboard" element={<SalesDashboard />} />
                  <Route path="/sales/profile" element={<ClientProfile />} />
                  <Route path="/sales/facilities" element={<AdminFacilities />} />
                  <Route path="/sales/facilities/new" element={<ClientAddFacility />} />
                  <Route path="/sales/facilities/:facilityId" element={<AdminFacilityDetails />} />
                  <Route path="/sales/facilities/:facilityId/contacts" element={<AdminFacilityContacts />} />
                  <Route path="/sales/facilities/:facilityId/images" element={<AdminFacilityImages />} />
                  <Route path="/sales/facilities/:facilityId/jobs" element={<AdminFacilityJobs />} />
                  <Route path="/sales/facilities/:facilityId/internal_notes" element={<AdminFacilityInternalNotes />} />
                  <Route path="/sales/facilities/:facilityId/licenses" element={<AdminFacilityLicenses />} />
                  <Route path="/sales/facilities/:facilityId/activity" element={<AdminFacilityActivity />} />
                  <Route path="/sales/products" element={<Products />} />
                  <Route path="/sales/products/:id" element={<ProductDetail />} />
                </Route>

                <Route element={<ProtectedRouteRol redirectTo="/notFound" roleAccess={admin_role} />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/profile" element={<AdminProfile />} />
                  <Route path="/admin/users" element={<AdminUsers />} />
                  <Route path="/admin/users/invite" element={<AdminInviteUser />} />
                  <Route path="/admin/users/:id" element={<AdminUserDetails />} />
                  <Route path="/admin/facilities" element={<AdminFacilities />} />
                  <Route path="/admin/facilities/:facilityId" element={<AdminFacilityDetails />} />
                  <Route path="/admin/facilities/:facilityId/activity" element={<AdminFacilityActivity />} />
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
                  <Route path="/admin/learn/categories/:categoryId" element={<AdminDetailsCategory />} />
                  <Route path="/admin/learn/categories/new" element={<AdminAddCategory />} />
                  <Route path="/admin/learn/modules" element={<AdminModulesLearn />} />
                  <Route path="/admin/learn/modules/:moduleId" element={<AdminDetailsModule />} />
                  <Route path="/admin/learn/modules/:moduleId/units" element={<AdminUnitsLearn />} />
                  <Route path="/admin/learn/modules/:moduleId/units/new" element={<AdminAddUnit />} />
                  <Route path="/admin/learn/modules/:moduleId/units/:unitId" element={<AdminDetailsUnit />} />
                  <Route path="/admin/learn/modules/new" element={<AdminAddModule />} />
                </Route>
              </Route>
            </Route>
            <Route path="*" element={<Error404 />} />
          </Routes>
        </BrowserRouter>
      </AdminProvider>
    </AuthProvider>
  )
}
