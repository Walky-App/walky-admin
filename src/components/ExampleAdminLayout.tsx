import React from 'react';
import { BreadcrumbDividersExample } from './examples/BreadCrumbs';

type Props = {
  children: React.ReactNode;
};

/**
 * Enhanced admin layout component with better styling
 */
function ExampleAdminLayout({ children }: Props) {
  return (
    
      <div className="d-flex" style={{ minHeight: '100vh' }}>
        {/* Sidebar */}
        <div className="sidebar bg-dark text-white" style={{ width: '230px', minHeight: '100vh' }}>
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
        <div className="d-flex flex-column flex-grow-1 bg-light">

      {/* Header */}
      <header className="header py-3 px-4 shadow-sm bg-white">
        <div className="container-fluid d-flex justify-content-between align-items-center">
        
          <div className="header-brand">
            
          </div>

          <div className="header-nav d-flex align-items-center">
            <div className="mx-3 text-muted">
              <i className="fa fa-bell"></i>
            </div>
            <div className="mx-3 text-muted">
              <i className="fa fa-cog"></i>
            </div>
            <div className="dropdown ms-2">
              <button className="btn btn-sm btn-outline-secondary dropdown-toggle d-flex align-items-center" type="button">
                <div className="me-2 rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: '30px', height: '30px' }}>
                  A
                </div>
                <span>Admin</span>
              </button>
            </div>
          </div>
        <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Header */}
      <header className="header py-3 px-4 shadow-sm bg-white">
        <div className="container-fluid d-flex justify-content-between align-items-center">
        
          <div className="header-brand">
            
          </div>

          <div className="header-nav d-flex align-items-center">
            <div className="mx-3 text-muted">
              <i className="fa fa-bell"></i>
            </div>
            <div className="mx-3 text-muted">
              <i className="fa fa-cog"></i>
            </div>
            <div className="dropdown ms-2">
              <button className="btn btn-sm btn-outline-secondary dropdown-toggle d-flex align-items-center" type="button">
                <div className="me-2 rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: '30px', height: '30px' }}>
                  A
                </div>
                <span>Admin</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      <div className="bg-white p-3 shadow-sm w-100 px-4" style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
  <BreadcrumbDividersExample />
</div>

        
        {/* Main content */}
    <main className="d-flex flex-column flex-grow-1 bg-light px-4 pt-3 pb-2" style={{ overflowY: 'auto' }}>
      {children}
    </main>

    {/* Footer */}
    <footer className="py-3 bg-white border-top">
      <div className="text-center text-muted small">Walky Admin © 2023 | Built with CoreUI</div>
    </footer>
  </div>
</div>
      </header>
      <div className="bg-white p-3 shadow-sm w-100 px-4" style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
  <BreadcrumbDividersExample />
</div>

        
        {/* Main content */}
    <main className="flex-grow-1 px-4 pt-3 pb-5 bg-light" style={{ overflowY: 'auto' }}>
      {children}
    </main>

    {/* Footer */}
    <footer className="py-3 bg-white border-top">
      <div className="text-center text-muted small">Walky Admin © 2023 | Built with CoreUI</div>
    </footer>
  </div>
</div>
  );
}

export default ExampleAdminLayout; 