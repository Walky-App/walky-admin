import {
    CSidebar,
    CSidebarHeader,
    CSidebarBrand,
    CSidebarNav,
    CSidebarToggler,
    CNavTitle,
    CNavItem,
    CNavGroup,
  } from '@coreui/react'
  
  import CIcon from '@coreui/icons-react'
  import { cilSpeedometer, cilPuzzle } from '@coreui/icons'
  
  export const SidebarExample = () => {
    return (
      <CSidebar className="border-end bg-dark text-white">
        <CSidebarHeader className="border-bottom">
          <CSidebarBrand className="text-white">
            Walky
          </CSidebarBrand>
        </CSidebarHeader>
  
        <CSidebarNav>
          <CNavItem href="#" active>
            <CIcon customClassName="nav-icon" icon={cilSpeedometer} />
            Dashboard
          </CNavItem>
  
          <CNavTitle className="text-white-50">
            PAGES
          </CNavTitle>
  
          <CNavItem href="#">
            <CIcon customClassName="nav-icon" icon={cilSpeedometer} />
            Students
          </CNavItem>
  
          <CNavItem href="#">
            <CIcon customClassName="nav-icon" icon={cilSpeedometer} />
            Engagement
          </CNavItem>
  
          <CNavItem href="#">
            <CIcon customClassName="nav-icon" icon={cilSpeedometer} />
            Review
          </CNavItem>
  
          <CNavGroup
            toggler={
              <>
                <CIcon customClassName="nav-icon" icon={cilPuzzle} />
                My Walky
              </>
            }
          >
            <CNavItem href="#">
              <span className="ms-4">My Walky Item 1</span>
            </CNavItem>
            <CNavItem href="#">
              <span className="ms-4">My Walky Item 2</span>
            </CNavItem>
          </CNavGroup>
  
          <CNavItem href="#">
            <CIcon customClassName="nav-icon" icon={cilSpeedometer} />
            Compliance
          </CNavItem>
  
          <CNavItem href="#">
            <CIcon customClassName="nav-icon" icon={cilSpeedometer} />
            Settings
          </CNavItem>
        </CSidebarNav>
  
        <CSidebarHeader className="border-top">
          <CSidebarToggler />
        </CSidebarHeader>
      </CSidebar>
    )
  }
  