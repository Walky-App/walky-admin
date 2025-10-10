import {
  CSidebar,
  CSidebarHeader,
  CSidebarNav,
  CNavItem,
  CNavTitle,
} from "@coreui/react";
import { NavLink } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";

type SidebarProps = {
  visible: boolean;
  onVisibleChange: (val: boolean) => void;
  isMobile?: boolean;
};

export const Sidebar = ({ visible }: SidebarProps) => {
  const { theme } = useTheme();

  // Handle close button click

  return (
    <CSidebar
      className="border-end flex-shrink-0 sidebar"
      style={{
        backgroundColor: theme.isDark ? "#1e1e2f" : "#f8f9fa", // Dark in dark mode, light gray in light mode
        transition: "transform 0.3s ease",
        transform: visible ? "translateX(0)" : "translateX(-100%)",
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "250px",
        zIndex: 1040,
        pointerEvents: visible ? "auto" : "none", // 👈 prevents "ghost touches"
        borderRight: `1px solid ${theme.isDark ? "#495057" : "#dee2e6"}`, // Dark border in dark mode, light border in light mode
      }}
      visible={visible} // ✅ important
    >
      <CSidebarHeader className="d-flex justify-content-center align-items-center py-3">
        <img
          src={theme.isDark ? "/Walky Logo_Duotone.svg" : "/walky_logo_-_orange_with_purple_.png"}
          alt="Walky Logo"
          style={{ maxHeight: "40px", objectFit: "contain" }}
        />
      </CSidebarHeader>

      <CSidebarNav>
        {/* Dashboard */}
        <CNavItem className="px-3 py-2">
          <NavLink
            to="/"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Dashboard
          </NavLink>
        </CNavItem>

        <CNavTitle className="px-3 sidebar-title">
          CAMPUS
        </CNavTitle>

        {/* Students */}
        <CNavItem className="px-3 py-2">
          <NavLink
            to="/students"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Students
          </NavLink>
        </CNavItem>

        {/* Engagement */}
        <CNavItem className="px-3 py-2">
          <NavLink
            to="/engagement"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Engagement
          </NavLink>
        </CNavItem>

        <CNavTitle className="px-3 sidebar-title">
          ANALYTICS
        </CNavTitle>

        {/* Social Health Overview */}
        <CNavItem className="px-3 py-2">
          <NavLink
            to="/social-health"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Social Health
          </NavLink>
        </CNavItem>

        {/* Student Management */}
        <CNavItem className="px-3 py-2">
          <NavLink
            to="/student-management"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Student Management
          </NavLink>
        </CNavItem>

        {/* Events & Activities */}
        <CNavItem className="px-3 py-2">
          <NavLink
            to="/events-activities"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Events & Activities
          </NavLink>
        </CNavItem>

        {/* Reports & Safety */}
        <CNavItem className="px-3 py-2">
          <NavLink
            to="/reports-safety"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Reports & Safety
          </NavLink>
        </CNavItem>

        {/* Wellbeing Statistics */}
        <CNavItem className="px-3 py-2">
          <NavLink
            to="/wellbeing-stats"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Wellbeing Stats
          </NavLink>
        </CNavItem>

        <CNavTitle className="px-3 sidebar-title">
          ADMIN
        </CNavTitle>

        {/* Campuses */}
        <CNavItem className="px-3 py-2">
          <NavLink
            to="/campuses"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Campuses
          </NavLink>
        </CNavItem>

        {/* Ambassadors */}
        <CNavItem className="px-3 py-2">
          <NavLink
            to="/ambassadors"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Ambassadors
          </NavLink>
        </CNavItem>

        {/* Campus Sync */}
        <CNavItem className="px-3 py-2">
          <NavLink
            to="/campus-sync"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Campus Sync
          </NavLink>
        </CNavItem>

        {/* Roles & Permissions */}
        <CNavItem className="px-3 py-2">
          <NavLink
            to="/roles"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Roles & Permissions
          </NavLink>
        </CNavItem>

        {/* Users & Roles */}
        <CNavItem className="px-3 py-2">
          <NavLink
            to="/users-roles"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Users & Roles
          </NavLink>
        </CNavItem>

        <CNavTitle className="px-3 sidebar-title">
          MODERATION
        </CNavTitle>

        {/* Reports (Old) */}
        <CNavItem className="px-3 py-2">
          <NavLink
            to="/reports"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Reports
          </NavLink>
        </CNavItem>

        {/* Banned Users */}
        <CNavItem className="px-3 py-2">
          <NavLink
            to="/banned-users"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Banned Users
          </NavLink>
        </CNavItem>

        {/* Locked Users */}
        <CNavItem className="px-3 py-2">
          <NavLink
            to="/locked-users"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Locked Users
          </NavLink>
        </CNavItem>

        <CNavTitle className="px-3 sidebar-title">
          SETTINGS
        </CNavTitle>

        {/* Admin Settings */}
        <CNavItem className="px-3 py-2">
          <NavLink
            to="/admin-settings"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Admin Settings
          </NavLink>
        </CNavItem>

        {/* General Settings */}
        <CNavItem className="px-3 py-2">
          <NavLink
            to="/settings"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            General Settings
          </NavLink>
        </CNavItem>
      </CSidebarNav>
    </CSidebar>
  );
};
