import * as React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { UserContextProvider } from './contexts/UserContext'

import './App.css'

import Layout from './components/layout'
import Login from './pages/login'

import EmployeeDashboard from './pages/employee/dashboard'

export default function App() {
  return (
    <UserContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<Layout />}>
            <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserContextProvider>
  )
}
