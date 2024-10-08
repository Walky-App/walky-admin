import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { ProtectedRouteAuth, ProtectedRouteRol } from './utils/ProtectedRoute'

import { AdminProvider } from './contexts/AdminContext'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'

import { Layout } from './components/layout/'

import { Error404 } from './pages/Error404'

/******************************************* Auth Pages ************************************/
import { Auth } from './pages/auth'
import { NewPasswordForm } from './pages/auth/NewPasswordForm'
import { Otp } from './pages/auth/Otp'
import { SignupClientInvited } from './pages/auth/SignupClientInvited'
import { Signup } from './pages/auth/SignupForm'

/******************************************* HTU Pages ************************************/
import { Learn } from './pages/learn/Learn'
import { Assessment } from './pages/learn/assessment/Assessment'
import { Modules } from './pages/learn/modules/Modules'
import { UnitDetail } from './pages/learn/units/UnitDetail'
import { Units } from './pages/learn/units/Units'

/******************************************* Client Pages ************************************/
import { ClientDashboard } from './pages/client/dashboard/ClientDashboard'
import { ClientFacilities } from './pages/client/facilities'
import ClientAddFacility from './pages/client/facilities/ClientAddFacility'
import { ClientJobs } from './pages/client/jobs'
import { JobDetailViewClient } from './pages/client/jobs/JobDetailViewClient'
import { ClientMessages } from './pages/client/messages'
import { ClientOnboarding } from './pages/client/onboarding/ClientOnboardingPage'

/******************************************* Sales Pages ************************************/
import { SalesDashboard } from './pages/sales/dashboard'
import { ProductList as Products } from './pages/sales/products'
import { ProductCategories } from './pages/sales/products/ProductCategories'
import ProductDetail from './pages/sales/products/ProductDetail'

/******************************************* Admin Pages ************************************/
import { AdminDashboard } from './pages/admin/dashboard/AdminDashboard'

import { AdminEmployeeActiveListPage } from './pages/admin/users/AdminEmployeesActiveListPage'
import { AdminEmployeeInactiveListPage } from './pages/admin/users/AdminEmployeesInactiveListPage'
import { AdminTimesheetsPage } from './pages/admin/users/AdminTimesheetsPage'
import { AdminUserClientsListPage } from './pages/admin/users/AdminUserClientsListPage'
import { AdminUserEmployeesListPage } from './pages/admin/users/AdminUserEmployeesListPage'
import { AdminUserListPage } from './pages/admin/users/AdminUserListPage'
import { AdminInviteUser } from './pages/admin/users/components'

import { AdminFacilities } from './pages/admin/facilities'
import { AdminAddFacility } from './pages/admin/facilities/AdminAddFacility'
import { AdminFacilityActivity } from './pages/admin/facilities/AdminFacilityActivity'
import { AdminFacilityAddJob } from './pages/admin/facilities/AdminFacilityAddJob'
import { AdminFacilityContacts } from './pages/admin/facilities/AdminFacilityContacts'
import { AdminFacilityDNR } from './pages/admin/facilities/AdminFacilityDNR'
import { AdminFacilityImages } from './pages/admin/facilities/AdminFacilityImages'
import { AdminFacilityInternalNotes } from './pages/admin/facilities/AdminFacilityInternalNotes'
import { AdminFacilityJobs } from './pages/admin/facilities/AdminFacilityJobs'
import { AdminFacilityLicenses } from './pages/admin/facilities/AdminFacilityLicenses'
import { FacilityDetailsPage } from './pages/admin/facilities/FacilityDetailsPage'

import { AdminAddAssessment } from './pages/admin/HTU/AdminAddAssessment'
import { AdminAddCategory } from './pages/admin/HTU/AdminAddCategory'
import { AdminAddModule } from './pages/admin/HTU/AdminAddModule'
import { AdminAddUnit } from './pages/admin/HTU/AdminAddUnit'
import { AdminCategoryLearn } from './pages/admin/HTU/AdminCategoryLearn'
import { AdminDashboardLearn } from './pages/admin/HTU/AdminDashboardLearn'
import { AdminDetailsAssessment } from './pages/admin/HTU/AdminDetailsAssessment'
import { AdminDetailsCategory } from './pages/admin/HTU/AdminDetailsCategory'
import { AdminDetailsModule } from './pages/admin/HTU/AdminDetailsModule'
import { AdminDetailsUnit } from './pages/admin/HTU/AdminDetailsUnit'
import { AdminModulesLearn } from './pages/admin/HTU/AdminModulesLearn'
import { AdminUnitsLearn } from './pages/admin/HTU/AdminUnitsLearn'

import { AdminJobs } from './pages/admin/jobs/AdminJobs'
import { AdminJobsPastWeek } from './pages/admin/jobs/AdminJobsPastWeek'
import { AdminOpenShifsWeek } from './pages/admin/jobs/AdminOpenShiftsWeek'
import { JobDetailViewAdmin } from './pages/admin/jobs/JobDetailViewAdmin'

import { AdminAnnouncementsPage } from './pages/admin/announcements/AdminAnnouncementsPage'
import { AdminAddCompany } from './pages/admin/companies/AdminAddCompany'
import { AdminCompanyListPage } from './pages/admin/companies/AdminCompanyListPage'
import { AdminMessages } from './pages/admin/messages'
import { Settings } from './pages/admin/settings'
import { StateSettings } from './pages/admin/settings/StateSettings'

import { LayoutPublic } from './components/layoutPublic'
import { AddEditJobPage } from './components/shared/jobs/AddEditJobPage'
import { Pricing } from './pages/Pricing'

/******************************************* Employee Pages ************************************/
import { EmployeeDashboard } from './pages/employee/dashboard/EmployeeDashboard'
import { EmployeeJobs } from './pages/employee/jobs'
import { EmployeeMyJobs } from './pages/employee/jobs/MyJobs'
import { JobDetailView } from './pages/employee/jobs/jobDetailView'
import { EmployeeMessages } from './pages/employee/messages/EmployeeMessages'
import { EmployeeOnboarding } from './pages/employee/onboarding/EmployeeOnboardingPage'
import { EmployeeTimesheets } from './pages/employee/timesheets/EmployeeTimesheetsPage'
import { ChangelogApiPage } from './pages/shared/changeLog/changeLogApi'
import { ChangelogAppPage } from './pages/shared/changeLog/changeLogApp'
import { CompanyDetailView } from './pages/shared/companyDetailView'
import { AllInvoicesListPage } from './pages/shared/invoices/AllInvoicesListPage'
import { ServiceInvoicePage } from './pages/shared/invoices/ServiceInvoicePage'
import { AllServiceOrdersListPage } from './pages/shared/serviceOrders/AllServiceOrdersListPage'
import { AuthorizedInvoicedServiceOrdersListPage } from './pages/shared/serviceOrders/AuthorizedInvoicedServiceOrdersListPage'
import { AuthorizedServiceOrdersListPage } from './pages/shared/serviceOrders/AuthorizedServiceOrdersListPage'
import { AuthorizedUninvoicedServiceOrdersListPage } from './pages/shared/serviceOrders/AuthorizedUninvoicedServiceOrdersListPage'
import { PendingServiceOrdersListPage } from './pages/shared/serviceOrders/PendingServiceOrdersListPage'
import { ServiceOrderPage } from './pages/shared/serviceOrders/ServiceOrderPage'
import { UserProfile } from './pages/shared/userProfile'

const admin_role = process.env.REACT_APP_ADMIN_ROLE as string
const client_role = process.env.REACT_APP_CLIENT_ROLE as string
const sales_role = process.env.REACT_APP_SALES_ROLE as string

export const App = () => {
  return (
    <ThemeProvider initialTheme="walky-light">
      <AuthProvider>
        <AdminProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<Auth />} path="/" />
              <Route element={<Auth />} path="/login" />
              <Route element={<LayoutPublic />}>
                <Route element={<NewPasswordForm />} path="/reset/:id/:at" />
                <Route element={<SignupClientInvited />} path="/invite-client/:invite_id" />
                <Route element={<Signup />} path="/signup" />
                <Route element={<Otp />} path="/otp/:id" />
                <Route element={<Pricing />} path="/pricing" />
              </Route>
              <Route element={<NewPasswordForm />} path="/reset/:id/:at" />
              <Route element={<Signup />} path="/signup" />
              <Route element={<Otp />} path="/otp/:id" />
              <Route element={<Signup />} path="/invite/:email/:role" />
              <Route element={<Layout />}>
                <Route element={<ProtectedRouteAuth redirectTo="/login" />}>
                  <Route element={<EmployeeOnboarding />} path="/employee/onboarding" />
                  <Route element={<EmployeeDashboard />} path="/employee/dashboard" />
                  <Route element={<EmployeeJobs />} path="/employee/jobs" />
                  <Route element={<EmployeeMyJobs />} path="/employee/myjobs" />
                  <Route element={<JobDetailView />} path="/employee/jobs/:id" />
                  <Route element={<UserProfile />} path="/employee/profile" />
                  <Route element={<EmployeeMessages />} path="/employee/messages" />
                  <Route element={<EmployeeTimesheets />} path="/employee/timesheets" />
                  {/* LMS Module */}
                  <Route element={<Learn />} path="/learn" />
                  <Route element={<Modules />} path="/learn/category/:categoryId" />
                  <Route element={<Units />} path="/learn/module/:moduleId" />
                  <Route element={<UnitDetail />} path="/learn/module/:moduleId/unit/:unitId" />
                  <Route element={<Assessment />} path="/learn/module/:moduleId/unit/:unitId/assesment" />
                  <Route element={<ProtectedRouteRol redirectTo="/notFound" roleAccess={client_role} />}>
                    <Route element={<ClientOnboarding />} path="/client/onboarding" />
                    <Route element={<ClientDashboard />} path="/client/dashboard" />
                    <Route element={<ClientMessages />} path="/client/messages" />
                    <Route element={<UserProfile />} path="/client/profile" />
                    <Route element={<ClientFacilities />} path="/client/facilities" />
                    <Route element={<AdminAddFacility />} path="/client/facilities/new" />
                    <Route element={<FacilityDetailsPage />} path="/client/facilities/:facilityId" />
                    <Route element={<AdminFacilityContacts />} path="/client/facilities/:facilityId/contacts" />
                    <Route element={<AdminFacilityImages />} path="/client/facilities/:facilityId/images" />
                    <Route element={<AdminFacilityJobs />} path="/client/facilities/:facilityId/jobs" />
                    <Route
                      element={<AdminFacilityInternalNotes />}
                      path="/client/facilities/:facilityId/internal_notes"
                    />
                    <Route element={<AdminFacilityLicenses />} path="/client/facilities/:facilityId/licenses" />
                    <Route element={<AdminFacilityActivity />} path="/client/facilities/:facilityId/activity" />
                    <Route element={<ClientJobs />} path="/client/jobs" />
                    <Route element={<AddEditJobPage />} path="/client/jobs/new" />
                    <Route element={<JobDetailViewClient />} path="/client/jobs/:id" />
                    <Route element={<ServiceOrderPage />} path="/client/jobs/:id/service-order/:serviceOrderId" />
                    <Route element={<ServiceOrderPage />} path="/client/jobs/service-orders/:serviceOrderId" />
                    <Route element={<ServiceOrderPage />} path="/client/jobs/service-orders/pending/:serviceOrderId" />
                    <Route
                      element={<ServiceOrderPage />}
                      path="/client/jobs/service-orders/authorized/:serviceOrderId"
                    />
                    <Route element={<ServiceOrderPage />} path="/client/jobs/service-orders/pending/:serviceOrderId" />
                    <Route element={<AllServiceOrdersListPage />} path="/client/jobs/service-orders" />
                    <Route element={<PendingServiceOrdersListPage />} path="/client/jobs/service-orders/pending" />
                    <Route
                      element={<AuthorizedServiceOrdersListPage />}
                      path="/client/jobs/service-orders/authorized"
                    />
                    <Route
                      element={<AuthorizedUninvoicedServiceOrdersListPage />}
                      path="/client/jobs/service-orders/authorized-uninvoiced"
                    />
                    <Route
                      element={<AuthorizedInvoicedServiceOrdersListPage />}
                      path="/client/jobs/service-orders/authorized-invoiced"
                    />
                    <Route element={<ServiceInvoicePage />} path="/client/invoices/:invoiceId" />
                    <Route element={<AllInvoicesListPage />} path="/client/invoices" />
                    <Route element={<AdminCompanyListPage />} path="/client/companies" />
                    <Route element={<AdminAddCompany />} path="/client/companies/new" />
                    <Route element={<CompanyDetailView />} path="/client/companies/:id" />
                  </Route>
                  <Route element={<ProtectedRouteRol redirectTo="/notFound" roleAccess={sales_role} />}>
                    <Route element={<SalesDashboard />} path="/sales/dashboard" />
                    <Route element={<UserProfile />} path="/sales/profile" />
                    <Route element={<AdminFacilities />} path="/sales/facilities" />
                    <Route element={<ClientAddFacility />} path="/sales/facilities/new" />
                    <Route element={<FacilityDetailsPage />} path="/sales/facilities/:facilityId" />
                    <Route element={<AdminFacilityContacts />} path="/sales/facilities/:facilityId/contacts" />
                    <Route element={<AdminFacilityImages />} path="/sales/facilities/:facilityId/images" />
                    <Route element={<AdminFacilityJobs />} path="/sales/facilities/:facilityId/jobs" />
                    <Route
                      element={<AdminFacilityInternalNotes />}
                      path="/sales/facilities/:facilityId/internal_notes"
                    />
                    <Route element={<AdminFacilityLicenses />} path="/sales/facilities/:facilityId/licenses" />
                    <Route element={<AdminFacilityActivity />} path="/sales/facilities/:facilityId/activity" />
                    <Route element={<Products />} path="/sales/products" />
                    <Route element={<ProductDetail />} path="/sales/products/:id" />
                  </Route>
                  <Route element={<ProtectedRouteRol redirectTo="/notFound" roleAccess={admin_role} />}>
                    <Route element={<AdminDashboard />} path="/admin/dashboard" />
                    <Route element={<UserProfile />} path="/admin/profile" />
                    <Route element={<Settings />} path="/admin/settings" />
                    <Route element={<StateSettings />} path="/admin/settings/:state" />
                    <Route element={<AdminMessages />} path="/admin/messages" />
                    <Route element={<AdminUserListPage />} path="/admin/users" />
                    <Route element={<AdminUserEmployeesListPage />} path="/admin/users/employees" />
                    <Route element={<AdminTimesheetsPage />} path="/admin/users/employees/timesheets" />
                    <Route element={<AdminEmployeeActiveListPage />} path="/admin/users/employees/active" />
                    <Route element={<UserProfile />} path="/admin/users/employees/active/:id" />
                    <Route element={<AdminEmployeeInactiveListPage />} path="/admin/users/employees/inactive" />
                    <Route element={<UserProfile />} path="/admin/users/employees/inactive/:id" />
                    <Route element={<AdminUserClientsListPage />} path="/admin/users/clients" />
                    <Route element={<AdminInviteUser />} path="/admin/users/invite" />
                    <Route element={<UserProfile />} path="/admin/users/:id" />
                    <Route element={<UserProfile />} path="/admin/users/:id/timesheets" />
                    <Route element={<UserProfile />} path="/admin/users/:usertype?/:id" />
                    <Route element={<AdminCompanyListPage />} path="/admin/companies" />
                    <Route element={<AdminAddCompany />} path="/admin/companies/new" />
                    <Route element={<CompanyDetailView />} path="/admin/companies/:id" />
                    <Route element={<AdminFacilities />} path="/admin/facilities" />
                    <Route element={<FacilityDetailsPage />} path="/admin/facilities/:facilityId" />
                    <Route element={<AdminFacilityActivity />} path="/admin/facilities/:facilityId/activity" />
                    <Route element={<AdminFacilityContacts />} path="/admin/facilities/:facilityId/contacts" />
                    <Route element={<AdminAddFacility />} path="/admin/facilities/new" />
                    <Route
                      element={<AdminFacilityInternalNotes />}
                      path="/admin/facilities/:facilityId/internal_notes"
                    />
                    <Route element={<AdminFacilityJobs />} path="/admin/facilities/:facilityId/jobs" />
                    <Route element={<AdminFacilityAddJob />} path="/admin/facilities/:facilityId/jobs/new" />
                    <Route element={<JobDetailViewAdmin />} path="/admin/facilities/:facilityId/jobs/:id" />
                    <Route element={<AdminFacilityImages />} path="/admin/facilities/:facilityId/images" />
                    <Route element={<AdminFacilityLicenses />} path="/admin/facilities/:facilityId/licenses" />
                    <Route element={<AdminFacilityDNR />} path="/admin/facilities/:facilityId/dnr" />
                    <Route element={<AdminJobs />} path="/admin/jobs" />
                    <Route element={<AdminJobsPastWeek />} path="/admin/jobs/past-week" />
                    <Route element={<AddEditJobPage />} path="/admin/jobs/new" />
                    <Route element={<JobDetailViewAdmin />} path="/admin/jobs/:id" />
                    <Route element={<AddEditJobPage />} path="/admin/jobs/:id/edit" />
                    <Route element={<ServiceOrderPage />} path="/admin/jobs/:id/service-order/:serviceOrderId" />
                    <Route element={<ServiceOrderPage />} path="/admin/jobs/service-order/pending/:serviceOrderId" />
                    <Route element={<ServiceOrderPage />} path="/admin/jobs/service-orders/:serviceOrderId" />
                    <Route
                      element={<ServiceOrderPage />}
                      path="/admin/jobs/service-orders/authorized/:serviceOrderId"
                    />
                    <Route element={<ServiceOrderPage />} path="/admin/jobs/service-orders/pending/:serviceOrderId" />
                    <Route element={<AllServiceOrdersListPage />} path="/admin/jobs/service-orders" />
                    <Route element={<PendingServiceOrdersListPage />} path="/admin/jobs/service-orders/pending" />
                    <Route element={<AuthorizedServiceOrdersListPage />} path="/admin/jobs/service-orders/authorized" />
                    <Route element={<AdminOpenShifsWeek />} path="/admin/jobs/week" />
                    <Route
                      element={<AuthorizedUninvoicedServiceOrdersListPage />}
                      path="/admin/jobs/service-orders/authorized-uninvoiced"
                    />
                    <Route
                      element={<AuthorizedInvoicedServiceOrdersListPage />}
                      path="/admin/jobs/service-orders/authorized-invoiced"
                    />
                    <Route element={<ServiceInvoicePage />} path="/admin/invoices/:invoiceId" />
                    <Route element={<AllInvoicesListPage />} path="/admin/invoices" />
                    <Route element={<AdminDashboardLearn />} path="/admin/learn" />
                    <Route element={<AdminCategoryLearn />} path="/admin/learn/categories" />
                    <Route element={<AdminDetailsCategory />} path="/admin/learn/categories/:categoryId" />
                    <Route element={<AdminAddCategory />} path="/admin/learn/categories/new" />
                    <Route element={<AdminModulesLearn />} path="/admin/learn/modules" />
                    <Route element={<AdminDetailsModule />} path="/admin/learn/modules/:moduleId" />
                    <Route element={<AdminUnitsLearn />} path="/admin/learn/modules/:moduleId/units" />
                    <Route element={<AdminAddUnit />} path="/admin/learn/modules/:moduleId/units/new" />
                    <Route element={<AdminDetailsUnit />} path="/admin/learn/modules/:moduleId/units/:unitId" />
                    <Route
                      element={<AdminAddAssessment />}
                      path="/admin/learn/modules/:moduleId/units/:unitId/assessment"
                    />
                    <Route
                      element={<AdminDetailsAssessment />}
                      path="/admin/learn/modules/:moduleId/units/:unitId/assessment/:assessmentId"
                    />
                    <Route element={<AdminAddModule />} path="/admin/learn/modules/new" />
                    <Route element={<Products />} path="/admin/products" />
                    <Route element={<ProductCategories />} path="/admin/products/categories" />
                    <Route element={<ProductDetail />} path="/admin/products/:id" />
                    <Route element={<ChangelogApiPage />} path="/admin/changelog/api" />
                    <Route element={<ChangelogAppPage />} path="/admin/changelog/app" />
                    <Route element={<AdminAnnouncementsPage />} path="/admin/announcements" />
                  </Route>
                </Route>
              </Route>
              <Route element={<Error404 />} path="*" />
            </Routes>
          </BrowserRouter>
        </AdminProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
