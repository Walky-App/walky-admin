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
// import { Otp } from './pages/auth/Otp'
import { SignupClientInvited } from './pages/auth/SignupClientInvited'
import { Signup } from './pages/auth/SignupForm'

/******************************************* Client Pages ************************************/
import { ClientDashboard } from './pages/client/dashboard/ClientDashboard'
import { ClientFacilities } from './pages/client/facilities'
import { ClientMessages } from './pages/client/messages'
import { ClientOnboarding } from './pages/client/onboarding/ClientOnboardingPage'

/******************************************* Admin Pages ************************************/
import { AdminDashboard } from './pages/admin/dashboard/AdminDashboard'

import { AdminEmployeeActiveListPage } from './pages/admin/users/AdminEmployeesActiveListPage'
import { AdminEmployeeInactiveListPage } from './pages/admin/users/AdminEmployeesInactiveListPage'
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

import { AdminAnnouncementsPage } from './pages/admin/announcements/AdminAnnouncementsPage'
import { AdminAddCompany } from './pages/admin/companies/AdminAddCompany'
import { AdminCompanyListPage } from './pages/admin/companies/AdminCompanyListPage'
import { AdminMessages } from './pages/admin/messages'
import { Settings } from './pages/admin/settings'
import { StateSettings } from './pages/admin/settings/StateSettings'

import { LayoutPublic } from './components/layoutPublic'
import { AddEditJobPage } from './components/shared/jobs/AddEditJobPage'
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

/******************************************* Employee Pages ************************************/
import { EmployeeDashboard } from './pages/students/dashboard/EmployeeDashboard'
import { EmployeeMessages } from './pages/students/messages/EmployeeMessages'

const admin_role = process.env.REACT_APP_ADMIN_ROLE as string
const client_role = process.env.REACT_APP_CLIENT_ROLE as string

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
              </Route>
              <Route element={<NewPasswordForm />} path="/reset/:id/:at" />
              <Route element={<Signup />} path="/signup" />

              <Route element={<Signup />} path="/invite/:email/:role" />
              <Route element={<Layout />}>
                <Route element={<ProtectedRouteAuth redirectTo="/login" />}>
                  <Route element={<EmployeeDashboard />} path="/employee/dashboard" />
                  <Route element={<UserProfile />} path="/employee/profile" />
                  <Route element={<EmployeeMessages />} path="/employee/messages" />

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
                    <Route element={<AddEditJobPage />} path="/client/jobs/new" />
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
                  <Route element={<ProtectedRouteRol redirectTo="/notFound" roleAccess={admin_role} />}>
                    <Route element={<AdminDashboard />} path="/admin/dashboard" />
                    <Route element={<UserProfile />} path="/admin/profile" />
                    <Route element={<Settings />} path="/admin/settings" />
                    <Route element={<StateSettings />} path="/admin/settings/:state" />
                    <Route element={<AdminMessages />} path="/admin/messages" />
                    <Route element={<AdminUserListPage />} path="/admin/users" />
                    <Route element={<AdminUserEmployeesListPage />} path="/admin/users/employees" />
                    <Route element={<AdminEmployeeActiveListPage />} path="/admin/users/employees/active" />
                    <Route element={<UserProfile />} path="/admin/users/employees/active/:id" />
                    <Route element={<AdminEmployeeInactiveListPage />} path="/admin/users/employees/inactive" />
                    <Route element={<UserProfile />} path="/admin/users/employees/inactive/:id" />
                    <Route element={<AdminUserClientsListPage />} path="/admin/users/clients" />
                    <Route element={<AdminInviteUser />} path="/admin/users/invite" />
                    <Route element={<UserProfile />} path="/admin/users/:id" />
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
                    <Route element={<AdminFacilityImages />} path="/admin/facilities/:facilityId/images" />
                    <Route element={<AdminFacilityLicenses />} path="/admin/facilities/:facilityId/licenses" />
                    <Route element={<AdminFacilityDNR />} path="/admin/facilities/:facilityId/dnr" />

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
