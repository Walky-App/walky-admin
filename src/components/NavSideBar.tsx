import React from 'react'
import {
  CBadge,
  CSidebar,
  CSidebarBrand,
  CSidebarHeader,
  CSidebarNav,
  CSidebarToggler,
  CNavGroup,
  CNavItem,
  CNavTitle,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import { cilCloudDownload, cilLayers, cilPuzzle, cilSpeedometer } from '@coreui/icons'

// Default Sidebar
// NavSideBar.tsx
export const Sidebar = () => {
  return (
    <>
      <CSidebarHeader className="border-bottom" style={{ minHeight: '56px' }} />
      
      <CSidebar
        className="border-end text-white"
        style={{ backgroundColor: '#1e1e2f' }}
        visible
      >
        <CSidebarNav>
          {/* Spacer */}
          <div style={{ height: '48px' }} />

          {/* Dashboard */}
          <CNavItem href="#" active className="px-3 py-2">
            Dashboard
          </CNavItem>

          {/* PAGES Header */}
          <CNavTitle className="text-white-50 px-3">
            <div style={{ width: '100%', textAlign: 'left' }}>PAGES</div>
          </CNavTitle>

          {/* Students Group */}
          <CNavGroup toggler="Students" className="px-3 py-2">
            {/* Submenu items go here */}
          </CNavGroup>

          {/* Engagement Group */}
          <CNavGroup toggler="Engagement" className="px-3 py-2">
            {/* Submenu items go here */}
          </CNavGroup>

          {/* Review Group */}
          <CNavGroup toggler="Review" className="px-3 py-2">
            {/* Submenu items go here */}
          </CNavGroup>

          {/* My Walky Group */}
          <CNavGroup toggler="My Walky" className="px-3 py-2">
            <CNavItem href="#" className="ms-4 px-3 py-1">
              My Walky Item 1
            </CNavItem>
            <CNavItem href="#" className="ms-4 px-3 py-1">
              My Walky Item 2
            </CNavItem>
          </CNavGroup>

          {/* Compliance */}
          <CNavItem href="#" className="px-3 py-2">
            Compliance
          </CNavItem>

          {/* Settings */}
          <CNavItem href="#" className="px-3 py-2">
            Settings
          </CNavItem>
        </CSidebarNav>

        <CSidebarHeader className="border-bottom" />
      </CSidebar>
    </>
  )
}