import {
  CSidebar,
  CSidebarHeader,
  CSidebarNav,
  CNavItem,
  CNavTitle,
} from '@coreui/react';
import { NavLink } from 'react-router-dom';



type SidebarProps = {
  visible: boolean;
  onVisibleChange: (val: boolean) => void;
  isMobile?: boolean;
};

export const Sidebar = ({ visible }: SidebarProps) => {
  // Handle close button click

  return (
    <CSidebar
      className="border-end text-white flex-shrink-0"
      style={{
        backgroundColor: '#1e1e2f',
        transition: 'transform 0.3s ease',
        transform: visible ? 'translateX(0)' : 'translateX(-100%)',
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: '250px',
        zIndex: 1040,
        pointerEvents: visible ? 'auto' : 'none', // 👈 prevents "ghost touches"
      }}
      visible={visible} // ✅ important
    >


      <CSidebarHeader className="d-flex justify-content-center align-items-center py-3">
        <img
          src="/Walky Logo_Duotone.svg"
          alt="Walky Logo"
          style={{ maxHeight: '40px', objectFit: 'contain' }}
        />
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

</CSidebarNav>
    </CSidebar>
  );
};