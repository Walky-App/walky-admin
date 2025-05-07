import React from 'react';
import { Topbar } from './Topbar'
import { Sidebar } from './NavSideBar'
//// imported - lauren


type Props = {
  children: React.ReactNode
}
function ExampleAdminLayout({ children }: Props) {
  return (
    <div className="d-flex flex-column vh-100 bg-light">
      <Topbar/>
      
      <div className="d-flex flex-grow-1">

        <Sidebar/>

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
