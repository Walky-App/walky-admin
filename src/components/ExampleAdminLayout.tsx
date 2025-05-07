import React from 'react';
import { Topbar } from './Topbar'

type Props = {
  children: React.ReactNode;
};

/**
 * Enhanced admin layout component with better styling
 */
function ExampleAdminLayout({ children }: Props) {
  return (
    <div className="d-flex flex-column vh-100 bg-light">
      <Topbar/>
      
      <div className="d-flex flex-grow-1">
        {/* Sidebar */}
        <div className="sidebar bg-dark text-white" style={{ width: '250px', minHeight: '100%' }}>
          <div className="p-3 border-bottom border-secondary">
            <h5 className="text-light m-0">Navigation</h5>
          </div>
          <ul className="nav flex-column p-3">
            <li className="nav-item mb-2">
              <a className="nav-link active px-3 py-2 rounded d-flex align-items-center" 
                 href="#" 
                 style={{ background: 'rgba(255,255,255,0.1)' }}>
                <i className="fa fa-dashboard me-2"></i>
                Dashboard
              </a>
            </li>
            <li className="nav-item mb-2">
              <a className="nav-link text-white px-3 py-2 rounded d-flex align-items-center" href="#">
                <i className="fa fa-users me-2"></i>
                Users
              </a>
            </li>
            <li className="nav-item mb-2">
              <a className="nav-link text-white px-3 py-2 rounded d-flex align-items-center" href="#">
                <i className="fa fa-chart-bar me-2"></i>
                Analytics
              </a>
            </li>
            <li className="nav-item mb-2">
              <a className="nav-link text-white px-3 py-2 rounded d-flex align-items-center" href="#">
                <i className="fa fa-cog me-2"></i>
                Settings
              </a>
            </li>
          </ul>
          
          <div className="mt-4 p-3">
            <div className="bg-primary bg-opacity-25 p-3 rounded">
              <h6 className="text-white mb-3">Need Help?</h6>
              <p className="small text-white-50 mb-2">Check our documentation for help with CoreUI components.</p>
              <a href="https://coreui.io/docs" target="_blank" rel="noopener noreferrer" 
                 className="btn btn-sm btn-primary d-block">
                View Docs
              </a>
            </div>
          </div>
        </div>
        
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
  );
}

export default ExampleAdminLayout; 