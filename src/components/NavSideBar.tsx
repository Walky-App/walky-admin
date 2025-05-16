import {
  CSidebar,
  CSidebarHeader,
  CSidebarNav,
  CNavGroup,
  CNavItem,
  CNavTitle,
  CCloseButton,
} from '@coreui/react';
import { NavLink } from 'react-router-dom';


type SidebarProps = { 
  visible: boolean; 
  onVisibleChange: (val: boolean) => void;
  isMobile?: boolean;
};

export const Sidebar = ({ visible, onVisibleChange, isMobile = false }: SidebarProps) => {  
  // Handle close button click
  const handleClose = () => {
    onVisibleChange(false);
  };

  return (
    <CSidebar
  className="border-end text-white flex-shrink-0"
  style={{ 
    backgroundColor: '#1e1e2f',
    transition: 'transform 0.3s ease',
    transform: visible ? 'translateX(0)' : 'translateX(-100%)',
    position: 'fixed',
    top: 0,                // 👈 At very top
    left: 0,
    height: '100vh',       // 👈 Full screen height
    width: '250px',
    zIndex: 1040,
  }}
  visible={visible}
>

      <CSidebarHeader className="d-flex justify-content-between align-items-center px-3 py-2">
        <div className="text-white fw-bold">Walky Admin</div>
        {isMobile && (
          <CCloseButton onClick={handleClose} />
        )}
      </CSidebarHeader>

      <CSidebarNav>
  {/* Dashboard */}
  <CNavItem className="px-3 py-2"> 
    <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
      Dashboard
    </NavLink>
  </CNavItem>

  <CNavTitle className="text-white-50 px-3" style={{ textAlign: 'left' }}>
  PAGES
</CNavTitle>

  {/* Students */}
  <CNavItem className="px-3 py-2">
    <NavLink to="/students" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
      Students
    </NavLink>
  </CNavItem>

  {/* Engagement */}
  <CNavItem className="px-3 py-2">
    <NavLink to="/engagement" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
      Engagement
    </NavLink>
  </CNavItem>

  {/* Review */}
  <CNavItem className="px-3 py-2">
    <NavLink to="/review" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
      Review
    </NavLink>
  </CNavItem>

  {/* My Walky */}
  <CNavGroup toggler="My Walky" className="px-3 py-2">
    <CNavItem className="ms-4 px-3 py-1">
      <NavLink to="/walky/item1" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
        My Walky Item 1
      </NavLink>
    </CNavItem>
    <CNavItem className="ms-4 px-3 py-1">
      <NavLink to="/walky/item2" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
        My Walky Item 2
      </NavLink>
    </CNavItem>
  </CNavGroup>

  {/* Compliance - */}
  <CNavItem className="px-3 py-2">
    <NavLink to="/compliance" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
      Compliance
    </NavLink>
  </CNavItem>

  {/* Settings - only once */}
  <CNavItem className="px-3 py-2">
    <NavLink to="/settings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
      Settings
    </NavLink>
  </CNavItem>
</CSidebarNav>
    </CSidebar>
  );
};