import { CIcon } from "@coreui/icons-react";
import { cilHamburgerMenu, cilSun, cilMoon } from "@coreui/icons";
import {
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CAvatar,
  CNavbar,
  CContainer,
  CButton,
} from "@coreui/react";
import { useTheme } from "../hooks/useTheme";
import React, { useState } from "react";
import { cilAccountLogout, cilSchool } from "@coreui/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getCurrentUserRole } from "../utils/UserRole";
import { Role } from "../types/Role";
import { schoolService } from "../services/schoolService";
import { useSelectedSchool } from "../hooks/useSelectedSchool";

type TopbarProps = {
  onToggleSidebar: () => void;
  isMobile: boolean;
  sidebarVisible: boolean;
};

export const Topbar = ({
  onToggleSidebar,
  isMobile,
  sidebarVisible,
}: TopbarProps) => {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const isDarkMode = theme.isDark;
  const role = getCurrentUserRole();
  const isAdmin = role === Role.ADMIN;
  const { selectedSchoolName } = useSelectedSchool();

  const [hovered, setHovered] = useState<string | null>(null);
  const [themeHovered, setThemeHovered] = useState(false);

  const iconColor = isDarkMode ? "#f8f9fa" : "#212529";

  const iconBtnStyle: React.CSSProperties = {
    backgroundColor: "transparent",
    border: "none",
    padding: "0.5rem",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: iconColor,
  };

  const iconBtnHoverStyle: React.CSSProperties = {
    ...iconBtnStyle,
    backgroundColor: isDarkMode
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(0, 0, 0, 0.1)",
  };

  const navigate = useNavigate();

  const handleChangeSchool = () => {
    // Clear the selected school and navigate to school selection
    schoolService.clearSelectedSchool();
    navigate("/school-selection");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <CNavbar
      className="shadow-sm px-4"
      style={{
        backgroundColor: theme.colors.cardBg,
        height: "56px",
        position: "fixed",
        top: 0,
        left: !isMobile && sidebarVisible ? "250px" : 0,
        right: 0,
        zIndex: 1050,
        transition: "left 0.3s ease",
      }}
    >
      <CContainer fluid>
        <div className="d-flex w-100 justify-content-between align-items-center">
          {/* Hamburger Button */}
          <button
            onClick={onToggleSidebar}
            style={hovered === "menu" ? iconBtnHoverStyle : iconBtnStyle}
            onMouseEnter={() => setHovered("menu")}
            onMouseLeave={() => setHovered(null)}
            aria-label="Toggle Sidebar"
          >
            <CIcon
              icon={cilHamburgerMenu}
              size="lg"
              style={{ color: iconColor }}
            />
          </button>

          {/* Right-side Icons */}
          <div className="d-flex align-items-center" style={{ gap: "1.5rem" }}>
            {/* Selected School Display for Admins */}
            {isAdmin && selectedSchoolName && (
              <div
                className="d-flex align-items-center px-3"
                style={{
                  borderRight: `1px solid var(--app-borderColor)`,
                  height: "32px",
                  color: iconColor,
                  fontSize: "0.875rem",
                  fontWeight: "500",
                }}
              >
                <CIcon icon={cilSchool} className="me-2" size="sm" />
                {selectedSchoolName}
              </div>
            )}

            {/* Theme Toggle */}
            <div
              className="d-flex align-items-center px-3"
              style={{
                borderRight: `1px solid var(--app-borderColor)`,
                height: "32px",
                backgroundColor: themeHovered
                  ? isDarkMode
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(0, 0, 0, 0.1)"
                  : "transparent",
                borderRadius: "0px",
                transition: "background-color 0.2s ease",
                cursor: "pointer",
              }}
              onMouseEnter={() => setThemeHovered(true)}
              onMouseLeave={() => setThemeHovered(false)}
            >
              <CButton
                color="link"
                className="p-0"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                style={{ color: iconColor }}
              >
                <CIcon icon={isDarkMode ? cilMoon : cilSun} size="lg" />
              </CButton>
            </div>
            <CDropdown variant="nav-item" className="d-flex align-items-center">
              <CDropdownToggle
                caret={false}
                className="p-0 border-0 bg-transparent"
              >
                <CAvatar
                  src="/fiu-logo.png"
                  size="lg"
                  style={{ width: "35px" }}
                />
              </CDropdownToggle>
              <CDropdownMenu>
                {isAdmin && (
                  <CDropdownItem onClick={handleChangeSchool}>
                    <CIcon icon={cilSchool} className="me-2" />
                    Change School
                  </CDropdownItem>
                )}
                <CDropdownItem onClick={handleLogout}>
                  <CIcon icon={cilAccountLogout} className="me-2" />
                  Logout
                </CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          </div>
        </div>
      </CContainer>
    </CNavbar>
  );
};
