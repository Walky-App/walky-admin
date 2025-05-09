import {
  CSidebar,
  CSidebarHeader,
  CSidebarNav,
  CNavGroup,
  CNavItem,
  CNavTitle,
  CCloseButton,
} from '@coreui/react';


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

  // Only render the sidebar if it's visible (for mobile) or always render it for desktop
  

  return (
    <CSidebar
      className="border-end text-white flex-shrink-0"
      style={{ 
        backgroundColor: '#1e1e2f',
        transition: 'transform 0.3s ease',
        transform: visible ? 'translateX(0)' : 'translateX(-100%)',
        position: isMobile ? 'fixed' : 'relative',
        height: '100%',
        zIndex: 1030,
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
        <CNavItem href="#" active className="px-3 py-2">Dashboard</CNavItem>
        <CNavTitle className="text-white-50 px-3">PAGES</CNavTitle>
        <CNavGroup toggler="Students" className="px-3 py-2" />
        <CNavGroup toggler="Engagement" className="px-3 py-2" />
        <CNavGroup toggler="Review" className="px-3 py-2" />
        <CNavGroup toggler="My Walky" className="px-3 py-2">
          <CNavItem href="#" className="ms-4 px-3 py-1">My Walky Item 1</CNavItem>
          <CNavItem href="#" className="ms-4 px-3 py-1">My Walky Item 2</CNavItem>
        </CNavGroup>
        <CNavItem href="#" className="px-3 py-2">Compliance</CNavItem>
        <CNavItem href="#" className="px-3 py-2">Settings</CNavItem>
      </CSidebarNav>
    </CSidebar>
  );
};