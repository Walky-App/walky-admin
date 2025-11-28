import React, { useState, useEffect } from "react";
import {
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from "@coreui/react";
import { AssetIcon } from "../AssetIcon/AssetIcon";
import { IconName } from "../AssetIcon/AssetIcon.types";
import "./ActionDropdown.css";

export interface DropdownItem {
  label: string;
  icon?: IconName;
  iconSize?: number;
  onClick: (e: React.MouseEvent) => void;
  variant?: "default" | "danger";
  isDivider?: boolean;
}

interface ActionDropdownProps {
  items: DropdownItem[];
  testId?: string;
}

export const ActionDropdown: React.FC<ActionDropdownProps> = ({
  items,
  testId = "action-dropdown",
}) => {
  const handleItemClick = (item: DropdownItem, e: React.MouseEvent) => {
    e.stopPropagation();
    item.onClick(e);
  };

  // State to track dark mode
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.getAttribute("data-theme") === "dark";
  });

  // Listen for theme changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.getAttribute("data-theme") === "dark");
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  const iconColor = isDark ? "#e0e0e0" : "#1D1B20";

  return (
    <CDropdown
      alignment="end"
      className="action-dropdown-container"
      autoClose={true}
      portal
    >
      <CDropdownToggle
        as="button"
        className="action-dropdown-toggle"
        caret={false}
        data-testid={`${testId}-toggle-btn`}
      >
        <AssetIcon name="vertical-3-dots-icon" size={24} color={iconColor} />
      </CDropdownToggle>
      <CDropdownMenu className="action-dropdown-menu">
        {items.map((item, index) => {
          if (item.isDivider) {
            return <div key={index} className="action-dropdown-divider" />;
          }

          return (
            <CDropdownItem
              key={index}
              className={`action-dropdown-item${
                item.variant === "danger" ? " action-dropdown-item-danger" : ""
              }`}
              onClick={(e) => handleItemClick(item, e)}
            >
              {item.icon && (
                <AssetIcon
                  name={item.icon}
                  size={item.iconSize || 18}
                  color={item.variant === "danger" ? "#d53425" : iconColor}
                />
              )}
              <span>{item.label}</span>
            </CDropdownItem>
          );
        })}
      </CDropdownMenu>
    </CDropdown>
  );
};
