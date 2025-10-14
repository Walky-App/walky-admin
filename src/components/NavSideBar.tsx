import {
  CNavItem,
  CNavTitle,
} from "@coreui/react";
import { NavLink } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../hooks/useAuth";

type SidebarProps = {
  visible: boolean;
};

export const Sidebar = ({ visible }: SidebarProps) => {
  const { theme } = useTheme();
  const { user, hasRole } = useAuth();

  // Close sidebar when a link is clicked (disabled to prevent auto-close)
  const handleLinkClick = () => {
    // No auto-close behavior - user controls sidebar manually via button
  };

  // Define role access levels
  const isSuperAdmin = user?.role === 'super_admin';
  const isCampusAdminOrAbove = hasRole(['super_admin', 'campus_admin']);
  const isStaffOrAbove = hasRole(['super_admin', 'campus_admin', 'editor', 'moderator', 'staff']);

  // Handle close button click

  return (
    <div
      className={`border-end flex-shrink-0 sidebar ${visible ? "show" : ""}`}
      style={{
        backgroundColor: theme.isDark ? "#1e1e2f" : "#f8f9fa", // Dark in dark mode, light gray in light mode
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "250px",
        zIndex: 1040,
        borderRight: `1px solid ${theme.isDark ? "#495057" : "#dee2e6"}`, // Dark border in dark mode, light border in light mode
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="d-flex justify-content-center align-items-center py-3">
        <img
          src={theme.isDark ? "/Walky Logo_Duotone.svg" : "/walky_logo_-_orange_with_purple_.png"}
          alt="Walky Logo"
          style={{ maxHeight: "40px", objectFit: "contain" }}
        />
      </div>

      <nav style={{ flex: 1, overflowY: "auto" }}>
        {/* Dashboard - visible to all authenticated admins */}
        <CNavItem className="px-3 py-2">
          <NavLink
            to="/"
            onClick={handleLinkClick}
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Dashboard
          </NavLink>
        </CNavItem>

        {/* CAMPUS section - visible to staff and above */}
        {isStaffOrAbove && (
          <>
            <CNavTitle className="px-3 sidebar-title">
              CAMPUS
            </CNavTitle>

            <CNavItem className="px-3 py-2">
              <NavLink
                to="/students"
                onClick={handleLinkClick}
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              >
                Students
              </NavLink>
            </CNavItem>

            <CNavItem className="px-3 py-2">
              <NavLink
                to="/engagement"
                onClick={handleLinkClick}
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              >
                Engagement
              </NavLink>
            </CNavItem>
          </>
        )}

        {/* ANALYTICS section - visible to staff and above */}
        {isStaffOrAbove && (
          <>
            <CNavTitle className="px-3 sidebar-title">
              ANALYTICS
            </CNavTitle>

            <CNavItem className="px-3 py-2">
              <NavLink
                to="/social-health"
                onClick={handleLinkClick}
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              >
                Social Health
              </NavLink>
            </CNavItem>

            <CNavItem className="px-3 py-2">
              <NavLink
                to="/student-management"
                onClick={handleLinkClick}
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              >
                Student Management
              </NavLink>
            </CNavItem>

            <CNavItem className="px-3 py-2">
              <NavLink
                to="/events-activities"
                onClick={handleLinkClick}
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              >
                Events & Activities
              </NavLink>
            </CNavItem>

            <CNavItem className="px-3 py-2">
              <NavLink
                to="/wellbeing-stats"
                onClick={handleLinkClick}
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              >
                Wellbeing Stats
              </NavLink>
            </CNavItem>
          </>
        )}

        {/* ADMIN section - mixed permissions */}
        {isCampusAdminOrAbove && (
          <>
            <CNavTitle className="px-3 sidebar-title">
              ADMIN
            </CNavTitle>

            <CNavItem className="px-3 py-2">
              <NavLink
                to="/campuses"
                onClick={handleLinkClick}
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              >
                Campuses
              </NavLink>
            </CNavItem>

            <CNavItem className="px-3 py-2">
              <NavLink
                to="/ambassadors"
                onClick={handleLinkClick}
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              >
                Ambassadors
              </NavLink>
            </CNavItem>
          </>
        )}

        {/* Super Admin only items */}
        {isSuperAdmin && (
          <>
            <CNavItem className="px-3 py-2">
              <NavLink
                to="/campus-sync"
                onClick={handleLinkClick}
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              >
                Campus Sync
              </NavLink>
            </CNavItem>

            <CNavItem className="px-3 py-2">
              <NavLink
                to="/roles"
                onClick={handleLinkClick}
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              >
                Roles & Permissions
              </NavLink>
            </CNavItem>

            <CNavItem className="px-3 py-2">
              <NavLink
                to="/users-roles"
                onClick={handleLinkClick}
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              >
                Users & Roles
              </NavLink>
            </CNavItem>
          </>
        )}

        {/* MODERATION section - visible to campus admin and above */}
        {isCampusAdminOrAbove && (
          <>
            <CNavTitle className="px-3 sidebar-title">
              MODERATION
            </CNavTitle>

            <CNavItem className="px-3 py-2">
              <NavLink
                to="/reports"
                onClick={handleLinkClick}
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              >
                Reports & Safety
              </NavLink>
            </CNavItem>

            <CNavItem className="px-3 py-2">
              <NavLink
                to="/banned-users"
                onClick={handleLinkClick}
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              >
                Banned Users
              </NavLink>
            </CNavItem>

            <CNavItem className="px-3 py-2">
              <NavLink
                to="/locked-users"
                onClick={handleLinkClick}
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              >
                Locked Users
              </NavLink>
            </CNavItem>
          </>
        )}

        {/* SETTINGS section - visible to all authenticated admins */}
        <CNavTitle className="px-3 sidebar-title">
          SETTINGS
        </CNavTitle>

        <CNavItem className="px-3 py-2">
          <NavLink
            to="/admin-settings"
            onClick={handleLinkClick}
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Admin Settings
          </NavLink>
        </CNavItem>

        <CNavItem className="px-3 py-2">
          <NavLink
            to="/settings"
            onClick={handleLinkClick}
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            General Settings
          </NavLink>
        </CNavItem>
      </nav>
    </div>
  );
};
