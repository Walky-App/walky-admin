import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import CIcon from "@coreui/icons-react";
import { cilChevronBottom, cilChevronTop } from "@coreui/icons";
import "./SidebarV2.css";

// Walky Logo component
const WalkyLogo = () => (
  <div className="sidebar-logo">
    <img
      src="https://www.figma.com/api/mcp/asset/db751427-2b25-477b-b060-13ec024b9795"
      alt="Walky Logo"
    />
  </div>
);

interface MenuItem {
  label: string;
  path?: string;
  submenu?: MenuItem[];
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

interface SidebarMenuItemProps {
  item: MenuItem;
  isActive?: boolean;
  isSubmenuItem?: boolean;
  onToggle?: () => void;
  isOpen?: boolean;
}

const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({
  item,
  isActive = false,
  isSubmenuItem = false,
  onToggle,
  isOpen = false,
}) => {
  const hasSubmenu = item.submenu && item.submenu.length > 0;

  if (isSubmenuItem) {
    return (
      <NavLink
        to={item.path || "#"}
        className={({ isActive: navIsActive }) =>
          `sidebar-submenu-item ${navIsActive ? "active" : ""}`
        }
      >
        {item.label}
      </NavLink>
    );
  }

  if (hasSubmenu) {
    return (
      <div className="sidebar-menu-item-wrapper">
        <div
          className={`sidebar-menu-item ${isActive ? "active" : ""} ${
            isOpen ? "open" : ""
          }`}
          onClick={onToggle}
        >
          {isActive && <div className="sidebar-indicator" />}
          <span className="menu-label">{item.label}</span>
          <CIcon
            icon={isOpen ? cilChevronTop : cilChevronBottom}
            className="menu-icon"
          />
        </div>
        {isOpen && item.submenu && (
          <div className="sidebar-submenu">
            {item.submenu.map((subItem, index) => (
              <SidebarMenuItem key={index} item={subItem} isSubmenuItem />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink
      to={item.path || "#"}
      className={({ isActive: navIsActive }) =>
        `sidebar-menu-item ${navIsActive ? "active" : ""}`
      }
    >
      {isActive && <div className="sidebar-indicator" />}
      <span className="menu-label">{item.label}</span>
    </NavLink>
  );
};

const SidebarV2: React.FC = () => {
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({
    "Campus Analytics": true,
  });

  const menuSections: MenuSection[] = [
    {
      title: "DASHBOARD",
      items: [
        {
          label: "Campus Analytics",
          submenu: [
            { label: "Engagement", path: "/v2/engagement" },
            { label: "Popular Features", path: "/v2/popular-features" },
            { label: "User Interactions", path: "/v2/user-interactions" },
            { label: "Community", path: "/v2/community" },
            { label: "Student safety", path: "/v2/student-safety" },
            { label: "Student Behavior", path: "/v2/student-behavior" },
          ],
        },
      ],
    },
    {
      title: "CAMPUS",
      items: [
        { label: "Manage Students", path: "/v2/manage-students" },
        { label: "Reported Content", path: "/v2/reported-content" },
        { label: "Events", path: "/v2/events" },
        { label: "Spaces", path: "/v2/spaces" },
        { label: "Ideas", path: "/v2/ideas" },
      ],
    },
    {
      title: "ADMIN",
      items: [
        { label: "Campuses", path: "/v2/campuses" },
        { label: "Ambassadors", path: "/v2/ambassadors" },
      ],
    },
    {
      title: "SETTINGS",
      items: [
        { label: "Administrators Roles", path: "/v2/administrators-roles" },
      ],
    },
  ];

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <div className="sidebar-v2">
      <WalkyLogo />

      <div className="sidebar-menu">
        {menuSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="menu-section">
            <div className="menu-section-header">{section.title}</div>
            <div className="menu-items">
              {section.items.map((item, itemIndex) => (
                <SidebarMenuItem
                  key={itemIndex}
                  item={item}
                  isActive={openMenus[item.label]}
                  isOpen={openMenus[item.label]}
                  onToggle={() => item.submenu && toggleMenu(item.label)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SidebarV2;
