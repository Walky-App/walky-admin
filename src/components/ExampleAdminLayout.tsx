<<<<<<< HEAD
import React from 'react'

//// imported - lauren
import { 
  CSidebar,
  CSidebarHeader,
  CSidebarNav,
  CNavTitle,
  CNavItem,
  CNavGroup,
} from '@coreui/react'
// ^^^
=======
import React from 'react';
import { Topbar } from './Topbar'
>>>>>>> e8f4245fa4b9718fe634a4bc6e63b55284991c64

type Props = {
  children: React.ReactNode
}
function ExampleAdminLayout({ children }: Props) {
  return (
<<<<<<< HEAD
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Header */}
      <header className="header py-3 px-4 shadow-sm bg-white">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <div className="header-brand">
            <h4 className="m-0 fw-bold text-primary">Walky Admin</h4>
          </div>
          <div className="header-nav d-flex align-items-center">
            <div className="mx-3 text-muted">
              <i className="fa fa-bell"></i>
            </div>
            <div className="mx-3 text-muted">
              <i className="fa fa-cog"></i>
            </div>
            <div className="dropdown ms-2">
              <button
                className="btn btn-sm btn-outline-secondary dropdown-toggle d-flex align-items-center"
                type="button"
              >
                <div
                  className="me-2 rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                  style={{ width: '30px', height: '30px' }}
                >
                  A
                </div>
                <span>Admin</span>
              </button>
            </div>
          </div>
        </div>
      </header>

=======
    <div className="d-flex flex-column vh-100 bg-light">
      <Topbar/>
      
>>>>>>> e8f4245fa4b9718fe634a4bc6e63b55284991c64
      <div className="d-flex flex-grow-1">



        {/* Sidebar */}
<CSidebarHeader className="border-bottom" style={{ minHeight: '56px' }} />
<CSidebar
  className="border-end text-white"
  style={{ backgroundColor: '#1e1e2f' }}
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
    <CNavGroup
      toggler={
        <>
          Students
        </>
      }
      className="px-3 py-2"
    >
      {/* Submenu items can be added here */}
    </CNavGroup>

    {/* Engagement Group */}
    <CNavGroup
      toggler={
        <>
          Engagement
        </>
      }
      className="px-3 py-2"
    >
      {/* Submenu items can be added here */}
    </CNavGroup>

    {/* Review Group */}
    <CNavGroup
      toggler={
        <>
          Review
        </>
      }
      className="px-3 py-2"
    >
      {/* Submenu items can be added here */}
    </CNavGroup>

    {/* My Walky Group */}
    <CNavGroup
      toggler={
        <>
          My Walky
        </>
      }
      className="px-3 py-2"
    >
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


        {/* Main Content Area */}
        <div className="content flex-grow-1 p-4" style={{ overflowY: 'auto' }}>
          {children}
        </div>
      </div>

      {/* Footer */}
      <footer className="footer py-3 bg-white border-top">
        <div className="container-fluid text-center">
          <span className="text-muted small">Walky Admin © 2023 | Built with CoreUI</span>
        </div>
      </footer>
    </div>
  )
}

export default ExampleAdminLayout
