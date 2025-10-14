import React, { useState, useEffect } from "react";
import { Sidebar } from "./NavSideBar.tsx";
import { Topbar } from "./Topbar.tsx";
import { useTheme } from "../hooks/useTheme";
import { useLocation } from "react-router-dom";
import { useSchoolFilter } from "../hooks/useSchoolFilter";

// Removed unused pageTitles constant

type Props = { children: React.ReactNode };

function ExampleAdminLayout({ children }: Props) {
  const { theme } = useTheme();
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  // Initialize school filter interceptor
  useSchoolFilter();

  // Toggle sidebar manually (for button clicks)
  const toggleSidebar = () => {
    setSidebarVisible((prev) => !prev);
  };

  // Handle window resize - set mobile state and manage sidebar visibility
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      // Only auto-close on resize to mobile, don't auto-open on resize to desktop
      if (mobile) {
        setSidebarVisible(false);
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close sidebar on navigation (mobile only)
  useEffect(() => {
    if (isMobile) {
      setSidebarVisible(false);
    }
  }, [location.pathname, isMobile]); // Use location.pathname instead of location object

  return (
    <div
      className="d-flex flex-column vh-100"
      style={{ backgroundColor: theme.colors.bodyBg }}
    >
      <Topbar
        onToggleSidebar={toggleSidebar}
        isMobile={isMobile}
        sidebarVisible={sidebarVisible}
      />

      <div className="d-flex flex-grow-1">
        {/* Only render sidebar if it should be visible */}
        <Sidebar
          visible={sidebarVisible}
        />

        {isMobile && sidebarVisible && (
          <div
            className="sidebar-overlay active"
            onClick={() => setSidebarVisible(false)}
          />
        )}

        <div className=" d-sm-flex justify-content-between align-items-center mt-0"></div>

        <main
          className="d-flex flex-column flex-grow-1 px-4 pt-0 pb-2"
          style={{
            backgroundColor: theme.colors.bodyBg,
            color: theme.colors.bodyColor,
            marginTop: "56px",
            marginLeft: !isMobile && sidebarVisible ? "250px" : 0,
            transition: "margin-left 0.3s ease",
            overflowY: "auto",
          }}
        >
          {/*old content */}
          <div
            className="px-3 py-2 mb-3"
            style={{
              backgroundColor: theme.colors.cardBg,
              color: theme.colors.bodyColor,
              border: `1px solid ${theme.colors.borderColor}`,
              margin: "0 -1.5rem",
              paddingLeft: "1.5rem",
              paddingRight: "1.5rem",
              paddingBottom: "0",
            }}
          >
          </div>

          {children}
        </main>
      </div>
      <footer
        className="footer py-3 border-top text-center d-flex justify-content-center"
        style={{
          backgroundColor: theme.colors.cardBg,
          color: theme.colors.bodyColor,
        }}
      >
        <span className="small">Walky Group Inc © 2025</span>
      </footer>
    </div>
  );
}

export default ExampleAdminLayout;
