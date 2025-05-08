import React from 'react';
import { Topbar } from './Topbar'
import { Sidebar } from './NavSideBar';
import { useTheme } from '../hooks/useTheme';

type Props = {
  children: React.ReactNode
}

function ExampleAdminLayout({ children }: Props) {
  const { theme } = useTheme();

  // Dynamic styles based on theme
  const containerStyle = {
    backgroundColor: theme.colors.bodyBg,
    color: theme.colors.bodyColor
  };

  const footerStyle = {
    backgroundColor: theme.isDark ? theme.colors.cardBg : '#ffffff',
    borderColor: theme.colors.borderColor
  };

  return (
    <div className="d-flex flex-column vh-100" style={containerStyle}>
      <Topbar/>
      
      <div className="d-flex flex-grow-1">
        <Sidebar/>

        {/* Main Content Area */}
        <div className="content flex-grow-1 p-4" style={{ overflowY: 'auto' }}>
          {children}
        </div>
      </div>

      {/* Footer */}
      <footer className="footer py-3 border-top" style={footerStyle}>
        <div className="container-fluid text-center">
          <span style={{ color: theme.colors.textMuted }} className="small">
            Walky Admin © 2023 | Built with CoreUI
          </span>
        </div>
      </footer>
    </div>
  )
}

export default ExampleAdminLayout
