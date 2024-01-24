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
import Facilities from './pages/client/facilities'
import FacilityDetail from './pages/client/facilities/DetailView'
import Jobs from './pages/client/jobs'
import AddJob from './pages/client/jobs/AddJob'

import AdminDashboard from './pages/admin/dashboard'
import AdminUsers from './pages/admin/users'
import AdminFacilities from './pages/admin/facilities'

import NewFacility from './pages/client/facilities/NewFacility'
import { AuthProvider } from './contexts/AuthContext'


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
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<h2>Page cannot be found </h2>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
