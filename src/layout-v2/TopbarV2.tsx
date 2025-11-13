import React, { useState } from "react";
import {
  CContainer,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CBadge,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilChevronBottom } from "@coreui/icons";
import { useSchool } from "../contexts/SchoolContext";
import { useCampus } from "../contexts/CampusContext";
import "./TopbarV2/TopbarV2.css";

// SVG Icons
const HamburgerIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <line x1="0" y1="2" x2="16" y2="2" stroke="#1D1B20" strokeWidth="2" />
    <line x1="0" y1="8" x2="16" y2="8" stroke="#1D1B20" strokeWidth="2" />
    <line x1="0" y1="14" x2="16" y2="14" stroke="#1D1B20" strokeWidth="2" />
  </svg>
);

const SchoolIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 3L1 9L5 11.18V17.18L12 21L19 17.18V11.18L21 10.09V17H23V9L12 3ZM18.82 9L12 12.72L5.18 9L12 5.28L18.82 9ZM17 15.99L12 18.72L7 15.99V12.27L12 15L17 12.27V15.99Z"
      fill="#1D1B20"
    />
  </svg>
);

const CampusIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2L2 7V9H22V7L12 2ZM4 11V18H6V11H4ZM10 11V18H12V11H10ZM16 11V18H18V11H16ZM2 20V22H22V20H2Z"
      fill="#1D1B20"
    />
  </svg>
);

const BellIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 2C8.9 2 8 2.9 8 4V4.29C6.03 5.17 4.75 7.08 4.75 9.25V13.5L3 15.25V16H17V15.25L15.25 13.5V9.25C15.25 7.08 13.97 5.17 12 4.29V4C12 2.9 11.1 2 10 2ZM10 18C11.1 18 12 17.1 12 16H8C8 17.1 8.9 18 10 18Z"
      fill="#1D1B20"
    />
  </svg>
);

interface TopbarV2Props {
  onToggleSidebar?: () => void;
}

const TopbarV2: React.FC<TopbarV2Props> = ({ onToggleSidebar }) => {
  const { selectedSchool } = useSchool();
  const { selectedCampus } = useCampus();
  const [notificationCount] = useState(0); // Replace with actual notification count

  // Mock user data - replace with actual user context
  const currentUser = {
    name: "Admin Name",
    avatar:
      "https://www.figma.com/api/mcp/asset/de3560b0-471d-4d73-bc23-658476275f11",
  };

  return (
    <div className="topbar-v2">
      <CContainer fluid className="topbar-container">
        {/* Hamburger Menu */}
        <button
          className="hamburger-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <HamburgerIcon />
        </button>

        {/* Main Container */}
        <div className="topbar-main">
          {/* School and Campus Selectors */}
          <div className="selector-container">
            {/* School Selector */}
            <div className="selector-group">
              <div className="selector-icon">
                <SchoolIcon />
              </div>
              <div className="selector-info">
                <span className="selector-label">Your school</span>
                <CDropdown className="selector-dropdown">
                  <CDropdownToggle color="link" className="selector-toggle">
                    {selectedSchool?.school_name || "FIU"}
                    <CIcon icon={cilChevronBottom} size="sm" className="ms-2" />
                  </CDropdownToggle>
                  <CDropdownMenu>
                    <CDropdownItem>FIU</CDropdownItem>
                    <CDropdownItem>University of Miami</CDropdownItem>
                    <CDropdownItem>FAU</CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>
              </div>
            </div>

            {/* Campus Selector */}
            <div className="selector-group">
              <div className="selector-icon">
                <CampusIcon />
              </div>
              <div className="selector-info">
                <span className="selector-label">Your campus</span>
                <CDropdown className="selector-dropdown">
                  <CDropdownToggle color="link" className="selector-toggle">
                    {selectedCampus?.campus_name || "Miami Campus"}
                    <CIcon icon={cilChevronBottom} size="sm" className="ms-2" />
                  </CDropdownToggle>
                  <CDropdownMenu>
                    <CDropdownItem>Miami Campus</CDropdownItem>
                    <CDropdownItem>Biscayne Bay Campus</CDropdownItem>
                    <CDropdownItem>Engineering Campus</CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>
              </div>
            </div>
          </div>

          {/* User Actions */}
          <div className="user-actions">
            {/* Notifications */}
            <CDropdown className="notification-dropdown">
              <CDropdownToggle color="link" className="notification-btn">
                <div className="notification-icon-wrapper">
                  <BellIcon />
                  {notificationCount > 0 && (
                    <CBadge color="danger" className="notification-badge">
                      {notificationCount}
                    </CBadge>
                  )}
                </div>
              </CDropdownToggle>
              <CDropdownMenu>
                <div className="dropdown-header px-3 py-2">Notifications</div>
                <CDropdownItem>No new notifications</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>

            {/* User Dropdown */}
            <CDropdown className="user-dropdown">
              <CDropdownToggle color="link" className="user-toggle">
                <span className="user-name">{currentUser.name}</span>
                <CIcon icon={cilChevronBottom} size="sm" className="ms-2" />
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="user-avatar"
                  width="38"
                  height="38"
                />
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem href="/profile">Profile</CDropdownItem>
                <CDropdownItem href="/settings">Settings</CDropdownItem>
                <div className="dropdown-divider" />
                <CDropdownItem href="/logout">Logout</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          </div>
        </div>
      </CContainer>

      {/* Bottom Border */}
      <div className="topbar-border" />
    </div>
  );
};

export default TopbarV2;
