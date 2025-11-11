import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SidebarV2 from "./SidebarV2";
import TopbarV2 from "./TopbarV2";
import "./LayoutV2.css";

const LayoutV2: React.FC = () => {
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    console.log('Toggle sidebar clicked, current state:', sidebarVisible);
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div className="layout-v2">
      {/* Sidebar */}
      <div className={`layout-sidebar ${sidebarVisible ? "show" : "hide"}`}>
        <SidebarV2 />
      </div>

      {/* Main Content Area */}
      <div className={`layout-main ${sidebarVisible ? "with-sidebar" : "full-width"}`}>
        {/* Topbar */}
        <TopbarV2 onToggleSidebar={toggleSidebar} />

        {/* Page Content */}
        <div className="layout-content">
          <Outlet />
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarVisible && (
        <div className="layout-overlay" onClick={toggleSidebar} />
      )}
    </div>
  );
};

export default LayoutV2;
