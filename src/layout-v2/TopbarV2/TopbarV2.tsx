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
import { useSchool } from "../../contexts/SchoolContext";
import { useCampus } from "../../contexts/CampusContext";
import { AssetIcon } from "../../components-v2";
import "./TopbarV2.css";

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
          <AssetIcon name="hamburguer-icon" size={16} color="#1d1b20" />
        </button>

        {/* Main Container */}
        <div className="topbar-main">
          {/* School and Campus Selectors */}
          <div className="selector-container">
            {/* School Selector */}
            <div className="selector-group">
              <div className="selector-icon">
                <AssetIcon name="school-icon" size={24} color="#1d1b20" />
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
                <AssetIcon name="campus-icon" size={24} color="#1d1b20" />
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
                <div style={{ position: "relative" }}>
                  {/* Icon removed - add new icon later */}
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
