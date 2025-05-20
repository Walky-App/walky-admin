import React, { useState, useEffect } from 'react';
import { Sidebar } from './NavSideBar';
import { Topbar } from './Topbar';
import { useTheme } from '../hooks/useTheme';
import { BreadcrumbDividersExample } from './examples/BreadCrumbs';
import { CHeader } from '@coreui/react';
import { useLocation } from 'react-router-dom';


const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/students': 'Students',
  '/engagement': 'Engagement',
  '/review': 'Review',
  '/mywalky': 'My Walky',
  '/compliance': 'Compliance',
  '/settings': 'Settings',
};




type Props = { children: React.ReactNode };

function ExampleAdminLayout({ children }: Props) {
  const { theme } = useTheme();
  const location = useLocation();
  const pageTitle = pageTitles[location.pathname] || 'Page';
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(prev => !prev);
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSidebarVisible(!mobile);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      className="d-flex flex-column vh-100"
      style={{ backgroundColor: theme.colors.bodyBg, color: theme.colors.text }}
    >

      
     



      {/* Sidebar + Main Section */}
<div className="d-flex flex-grow-1">
  {/* Sidebar */}
  <Sidebar
    visible={sidebarVisible}
    onVisibleChange={setSidebarVisible}
    isMobile={isMobile}
  />

  {isMobile && sidebarVisible && (
    <div
      className="sidebar-overlay active"
      onClick={() => setSidebarVisible(false)}
    />
  )}

  {/* Main area */}
  <div className="d-flex flex-column flex-grow-1" style={{ backgroundColor: theme.colors.bodyBg }}>
    {/* Topbar - move it OUTSIDE of <main> */}
    <Topbar onToggleSidebar={toggleSidebar} />
    

    {/* Main content */}
    <main
      className="d-flex flex-column flex-grow-1"
      style={{
        backgroundColor: theme.colors.bodyBg,
        color: theme.colors.text,
        overflowY: 'auto',
        padding: '1.5rem',
      }}
    >
      {/* Gray separator line */}
      <div style={{ height: '1px', backgroundColor: '#e0e0e0', width: '100%' }} />

      {/* Breadcrumb header */}
      <CHeader
        className="px-4 py-2 border-bottom"
        style={{
          backgroundColor: theme.colors.cardBg,
          borderBottom: `1px solid ${theme.colors.border}`,
          margin: '-1.5rem',
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem',
          paddingBottom: '0',
        }}
      >
        <BreadcrumbDividersExample />
      </CHeader>

      {/* Page Title */}
      <div className="d-sm-flex justify-content-between align-items-center mt-4 mb-3">
        <h2 className="mb-0" style={{ color: theme.colors.text }}>
          {pageTitle}
        </h2>
      </div>

      {children}
    </main>
  </div>
</div>

        

      {/* Footer */}
      <footer
        className="footer py-3 border-top text-center"
        style={{
          backgroundColor: theme.colors.cardBg,
          color: theme.colors.text,
          borderTop: `1px solid ${theme.colors.border}`,
        }}
      >
        <span className="small">Walky Admin © 2023 | Built with CoreUI</span>
      </footer>
    </div>
  );
}

export default ExampleAdminLayout;
