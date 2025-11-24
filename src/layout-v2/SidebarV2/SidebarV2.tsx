import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { AssetIcon } from "../../components-v2";
import "./SidebarV2.css";

// Walky Logo component
const WalkyLogo = () => (
  <div className="sidebar-logo">
    <AssetIcon name="menu-logo-walky" />
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
  isSubmenuItem?: boolean;
  onToggle?: () => void;
  isOpen?: boolean;
}

const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({
  item,
  isSubmenuItem = false,
  onToggle,
  isOpen = false,
}) => {
  const location = useLocation();
  const hasSubmenu = item.submenu !== undefined;

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
    // Check if any submenu item is active
    const isAnySubmenuActive = item.submenu?.some(
      (subItem) => subItem.path && location.pathname === subItem.path
    );

    return (
      <div className="sidebar-menu-item-wrapper">
        <div
          className={`sidebar-menu-item ${isOpen ? "open" : ""} ${
            isAnySubmenuActive ? "active" : ""
          }`}
          onClick={() => {
            if (onToggle) {
              onToggle();
            }
          }}
        >
          {isAnySubmenuActive && <div className="sidebar-indicator" />}
          <span className="menu-label">{item.label}</span>
          <div
            className="menu-icon-wrapper"
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              e.stopPropagation();
              if (onToggle) {
                onToggle();
              }
            }}
          >
            <AssetIcon
              name={isOpen ? "arrow-up" : "arrow-down"}
              className="menu-icon"
              size={16}
              color="currentColor"
            />
          </div>
        </div>
        {isOpen && item.submenu && item.submenu.length > 0 && (
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
      {({ isActive: navIsActive }) => (
        <>
          {navIsActive && <div className="sidebar-indicator" />}
          <span className="menu-label">{item.label}</span>
        </>
      )}
    </NavLink>
  );
};

const SidebarV2: React.FC = () => {
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const menuSections: MenuSection[] = [
    {
      title: "DASHBOARD",
      items: [
        {
          label: "Campus Analytics",
          submenu: [
            { label: "Engagement", path: "/v2/dashboard/engagement" },
            {
              label: "Popular Features",
              path: "/v2/dashboard/popular-features",
            },
            {
              label: "User Interactions",
              path: "/v2/dashboard/user-interactions",
            },
            { label: "Community", path: "/v2/dashboard/community" },
            { label: "Student safety", path: "/v2/dashboard/student-safety" },
            {
              label: "Student Behavior",
              path: "/v2/dashboard/student-behavior",
            },
          ],
        },
      ],
    },
    {
      title: "CAMPUS",
      items: [
        {
          label: "Manage Students",
          submenu: [
            { label: "Active", path: "/v2/manage-students/active" },
            { label: "Banned", path: "/v2/manage-students/banned" },
            { label: "Deactivated", path: "/v2/manage-students/deactivated" },
            { label: "Disengaged", path: "/v2/manage-students/disengaged" },
          ],
        },

        {
          label: "Events",
          submenu: [
            { label: "Events Manager", path: "/v2/events" },
            { label: "Events Insights", path: "/v2/events/insights" },
          ],
        },
        {
          label: "Spaces",
          submenu: [
            { label: "Spaces Manager", path: "/v2/spaces" },
            { label: "Spaces Insights", path: "/v2/spaces/insights" },
          ],
        },
        {
          label: "Ideas",
          submenu: [
            { label: "Ideas Manager", path: "/v2/ideas" },
            { label: "Ideas Insights", path: "/v2/ideas/insights" },
          ],
        },
      ],
    },
    {
      title: "MODERATION",
      items: [
        {
          label: "Report & Safety",
          path: "/v2/report-safety",
        },
        {
          label: "Report History",
          path: "/v2/report-history",
        },
      ],
    },
    {
      title: "ADMIN",
      items: [
        {
          label: "Campuses",
          path: "/v2/admin/campuses",
        },
        {
          label: "Ambassadors",
          path: "/v2/admin/ambassadors",
        },
        {
          label: "Role Management",
          path: "/v2/admin/role-management",
        },
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
