import React, { useState, useEffect } from 'react';
import { Sidebar } from './NavSideBar';
import { Topbar } from './Topbar';
import { useTheme } from '../hooks/useTheme';

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
      <Topbar onToggleSidebar={toggleSidebar} />
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
        <main 
          className="flex-grow-1 p-4" 
          style={{ 
            overflowY: 'auto',
            marginLeft: isMobile ? 0 : (sidebarVisible ? 0 : 0) // Add margin if needed
          }}
        >
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