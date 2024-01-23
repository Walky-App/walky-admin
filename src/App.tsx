import * as React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Layout from './layout'
import Login from './pages/login'

import './App.css'
import { UserContextProvider, UserContext } from './contexts/User.context'

function App() {
  const { user } = React.useContext(UserContext)

  return (
    <BrowserRouter>
      <UserContextProvider>
        {user ? (
          <Layout>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </Layout>
        ) : (
          <Routes>
            <Route path="/" element={<Login />} />
          </Routes>
        )}
      </UserContextProvider>
    </BrowserRouter>
  )
}

export default App
