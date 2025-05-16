import React, { useState, useEffect } from 'react';
import { Sidebar } from './NavSideBar.tsx';
import { Topbar } from './Topbar.tsx';
import { useTheme } from '../hooks/useTheme';
import { BreadcrumbDividersExample } from './examples/BreadCrumbs.tsx';


type Props = { children: React.ReactNode };

function ExampleAdminLayout({ children }: Props) {
  const { theme } = useTheme();
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Toggle sidebar manually (for button clicks)
  const toggleSidebar = () => {
    setSidebarVisible(prev => !prev);
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
  
      if (mobile) {
        setSidebarVisible(false);
      } else {
        setSidebarVisible(true);
      }
    };
  
    window.addEventListener('resize', handleResize);
    handleResize();  // Run once on mount
  
    return () => window.removeEventListener('resize', handleResize);
  }, []);  // ✅ Important: no dependencies
  
  
 
  return (
    <div className="d-flex flex-column vh-100" style={{ backgroundColor: theme.colors.bodyBg }}>
      <Topbar onToggleSidebar={toggleSidebar}
              isMobile={isMobile}
              sidebarVisible={sidebarVisible}/>
      
      <div className="d-flex flex-grow-1">
        
        
        {/* Only render sidebar if it should be visible */}
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

     
  <div className=" d-sm-flex justify-content-between align-items-center mt-0"></div>
      
  <main
  className="d-flex flex-column flex-grow-1 bg-light px-4 pt-0 pb-2"
  style={{
    marginTop: '56px',
    marginLeft: !isMobile && sidebarVisible ? '250px' : 0, // 👈 Push right of sidebar
    transition: 'margin-left 0.3s ease',
    overflowY: 'auto',
  }}
>

 {/*old content */}
       <div className="bg-white px-3 py-2 mb-3 border " 
       style={{
      margin: '0 -1.5rem',
      paddingLeft: '1.5rem',
      paddingRight: '1.5rem',
      paddingBottom: '0',
    }}>
    <BreadcrumbDividersExample />
  </div>

 
  <div className=" d-sm-flex justify-content-between align-items-center mt-0">
    

    <div className="d-sm-flex justify-content-between align-items-center">
    <h2 className="mb-0">Dashboard</h2>
  </div>
    <div className="mt-3 mt-sm-0">
      {/* Add actions/buttons if needed */}
    </div>
  </div>
  {children}
</main>

      </div>
      <footer className="footer py-3 border-top text-center">
        <span className="small">Walky Admin © 2023 | Built with CoreUI</span>
      </footer>
    </div>
  );
}

export default ExampleAdminLayout;