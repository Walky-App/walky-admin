import React, { useState, useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { AssetIcon } from "../../components-v2";
import { usePermissions } from "../../hooks/usePermissions";
import { PermissionResource } from "../../lib/permissions";
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
  /** Required resource permission for this menu item (checked for 'read' action) */
  resource?: PermissionResource;
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
    const isExactMatch = location.pathname === item.path;
    return (
      <NavLink
        to={item.path || "#"}
        className={() => `sidebar-submenu-item ${isExactMatch ? "active" : ""}`}
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

// Define all menu sections with permission resources (moved outside component for performance)
const allMenuSections: MenuSection[] = [
  {
    title: "DASHBOARD",
    items: [
      {
        label: "Campus Analytics",
        submenu: [
          {
            label: "Engagement",
            path: "/dashboard/engagement",
            resource: "engagement",
          },
          {
            label: "Popular Features",
            path: "/dashboard/popular-features",
            resource: "popular_features",
          },
          {
            label: "User Interactions",
            path: "/dashboard/user-interactions",
            resource: "user_interactions",
          },
          {
            label: "Community",
            path: "/dashboard/community",
            resource: "community",
          },
          {
            label: "Student safety",
            path: "/dashboard/student-safety",
            resource: "student_safety",
          },
          {
            label: "Student Behavior",
            path: "/dashboard/student-behavior",
            resource: "student_behavior",
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
          {
            label: "Active",
            path: "/manage-students/active",
            resource: "active_students",
          },
          {
            label: "Banned",
            path: "/manage-students/banned",
            resource: "banned_students",
          },
          {
            label: "Deactivated",
            path: "/manage-students/deactivated",
            resource: "inactive_students",
          },
          {
            label: "Disengaged",
            path: "/manage-students/disengaged",
            resource: "disengaged_students",
          },
        ],
      },

      {
        label: "Events",
        submenu: [
          {
            label: "Events Manager",
            path: "/events",
            resource: "events_manager",
          },
          {
            label: "Events Insights",
            path: "/events/insights",
            resource: "events_insights",
          },
        ],
      },
      {
        label: "Spaces",
        submenu: [
          {
            label: "Spaces Manager",
            path: "/spaces",
            resource: "spaces_manager",
          },
          {
            label: "Spaces Insights",
            path: "/spaces/insights",
            resource: "spaces_insights",
          },
        ],
      },
      {
        label: "Ideas",
        submenu: [
          { label: "Ideas Manager", path: "/ideas", resource: "ideas_manager" },
          {
            label: "Ideas Insights",
            path: "/ideas/insights",
            resource: "ideas_insights",
          },
        ],
      },
    ],
  },
  {
    title: "MODERATION",
    items: [
      {
        label: "Report & Safety",
        path: "/report-safety",
        resource: "report_safety",
      },
      {
        label: "Report History",
        path: "/report-history",
        resource: "report_history",
      },
    ],
  },
  {
    title: "ADMIN",
    items: [
      {
        label: "Campuses",
        path: "/admin/campuses",
        resource: "campuses",
      },
      {
        label: "Ambassadors",
        path: "/admin/ambassadors",
        resource: "ambassadors",
      },
      {
        label: "Role Management",
        path: "/admin/role-management",
        resource: "role_management",
      },
    ],
  },
  {
    title: "PLAYGROUND",
    items: [
      {
        label: "Interest Cloud",
        path: "/playground/interest-cloud",
      },
      {
        label: "Interest Constellation",
        path: "/playground/interest-constellation",
      },
      {
        label: "Interest Chord",
        path: "/playground/interest-chord",
      },
      {
        label: "Interest Pyramid",
        path: "/playground/interest-pyramid",
      },
      {
        label: "Active Spiral",
        path: "/playground/active-spiral",
      },
      {
        label: "Active Heat Grid",
        path: "/playground/active-heat",
      },
      {
        label: "Active Rings",
        path: "/playground/active-rings",
      },
      {
        label: "Active Funnel",
        path: "/playground/active-funnel",
      },
      {
        label: "Active Guitar",
        path: "/playground/active-guitar",
      },
      {
        label: "Active Drums",
        path: "/playground/active-drums",
      },
      {
        label: "Active Chimes",
        path: "/playground/active-chimes",
      },
      {
        label: "Active Waves",
        path: "/playground/active-waves",
      },
      {
        label: "Active Orbs",
        path: "/playground/active-orbs",
      },
      {
        label: "Active Galaxy",
        path: "/playground/active-galaxy",
      },
    ],
  },
];

const SidebarV2: React.FC = () => {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const { canRead } = usePermissions();

  // Filter menu items based on permissions
  const menuSections = useMemo(() => {
    const filterMenuItem = (item: MenuItem): MenuItem | null => {
      // If item has a resource, check permission
      if (item.resource && !canRead(item.resource)) {
        return null;
      }

      // If item has submenu, filter submenu items
      if (item.submenu) {
        const filteredSubmenu = item.submenu
          .map(filterMenuItem)
          .filter((subItem): subItem is MenuItem => subItem !== null);

        // If all submenu items are filtered out, hide the parent item
        if (filteredSubmenu.length === 0) {
          return null;
        }

        return { ...item, submenu: filteredSubmenu };
      }

      return item;
    };

    return allMenuSections
      .map((section) => ({
        ...section,
        items: section.items
          .map(filterMenuItem)
          .filter((item): item is MenuItem => item !== null),
      }))
      .filter((section) => section.items.length > 0);
  }, [canRead]);

  // Initialize open menus from localStorage (persist user choice across reloads)
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("sidebar-open-menus");
      if (saved) {
        const parsed = JSON.parse(saved) as Record<string, boolean>;
        setOpenMenus(parsed);
      }
    } catch (err) {
      console.warn("Failed to load sidebar state", err);
    }
  }, []);

  // Auto-open the parent menu for the current route so the active item stays visible on refresh
  React.useEffect(() => {
    const path = location.pathname;
    const parentsToOpen: Record<string, boolean> = {};

    menuSections.forEach((section) => {
      section.items.forEach((item) => {
        if (
          item.submenu?.some((sub) => sub.path && path.startsWith(sub.path))
        ) {
          parentsToOpen[item.label] = true;
        }
      });
    });

    setOpenMenus((prev) => ({ ...prev, ...parentsToOpen }));
  }, [location.pathname, menuSections]);

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => {
      const next = { ...prev, [label]: !prev[label] };
      try {
        localStorage.setItem("sidebar-open-menus", JSON.stringify(next));
      } catch (err) {
        console.warn("Failed to save sidebar state", err);
      }
      return next;
    });
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
