import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import SidebarV2 from "./SidebarV2/SidebarV2";
import TopbarV2 from "./TopbarV2/TopbarV2";
import "./LayoutV2.css";

const LayoutV2: React.FC = () => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 992);
  const [sidebarVisible, setSidebarVisible] = useState(window.innerWidth > 992);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 992;
      setIsMobile(mobile);

      // Auto-open on desktop, close on mobile
      if (!mobile) {
        setSidebarVisible(true);
      } else {
        setSidebarVisible(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close sidebar on route change ONLY on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarVisible(false);
    }
  }, [location.pathname, isMobile]);

  // Close sidebar when entering Administrator Settings page
  useEffect(() => {
    if (location.pathname.includes("/admin/settings")) {
      setSidebarVisible(false);
    }
  }, [location.pathname]);

  return (
    <div className="layout-v2">
      {/* Sidebar */}
      <div className={`layout-sidebar ${sidebarVisible ? "show" : "hide"}`}>
        <SidebarV2 />
      </div>

      {/* Main Content Area */}
      <div
        className={`layout-main ${
          sidebarVisible ? "with-sidebar" : "full-width"
        }`}
      >
        {/* Topbar */}
        <TopbarV2 onToggleSidebar={toggleSidebar} />

        {/* Page Content */}
        <div className="layout-content">
          <Outlet />
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobile && (
        <div
          className={`layout-overlay ${sidebarVisible ? "visible" : ""}`}
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default LayoutV2;
