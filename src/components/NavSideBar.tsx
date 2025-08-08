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
      data-testid="sidebar-container"

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
            data-testid="dashboard-link"
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
            data-testid="students-link"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Students
          </NavLink>
        </CNavItem>

        {/* Engagement */}
        <CNavItem className="px-3 py-2">
          <NavLink
            to="/engagement"
            data-testid="engagement-link"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Engagement
          </NavLink>
        </CNavItem>

        {/* Review */}
        <CNavItem className="px-3 py-2">
          <NavLink
            to="/review"
            data-testid="review-link"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Review
          </NavLink>
        </CNavItem>

        <CNavTitle className="px-3 sidebar-title">
          ADMIN
        </CNavTitle>

        {/* Campuses */}
        <CNavItem className="px-3 py-2">
          <NavLink
            to="/campuses"
            data-testid="campuses-link"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Campuses
          </NavLink>
        </CNavItem>

        {/* Ambassadors */}
        <CNavItem className="px-3 py-2">
          <NavLink
            to="/ambassadors"
            data-testid="ambassadors-link"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Ambassadors
          </NavLink>
        </CNavItem>

        {/* Places */}
        <CNavItem className="px-3 py-2">
          <NavLink
            to="/places"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Places
          </NavLink>
        </CNavItem>

        {/* Place Types */}
        <CNavItem className="px-3 py-2">
          <NavLink
            to="/place-types"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Place Types
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

        {/* Settings */}
        <CNavItem className="px-3 py-2">
          <NavLink
            to="/settings"
            data-testid="settings-link"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Settings
          </NavLink>
        </CNavItem>
      </CSidebarNav>
    </CSidebar>
  );
};
