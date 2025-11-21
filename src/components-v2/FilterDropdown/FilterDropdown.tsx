import React from "react";
import {
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from "@coreui/react";
import { AssetIcon } from "../AssetIcon/AssetIcon";
import "./FilterDropdown.css";

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  placeholder?: string;
  className?: string;
  testId?: string;
  ariaLabel?: string;
  width?: string;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  value,
  onChange,
  options,
  placeholder = "Select",
  className = "",
  testId = "filter-dropdown",
  ariaLabel,
  width = "auto",
}) => {
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <CDropdown
      className={`filter-dropdown-container ${className}`}
      style={{ width }}
    >
      <CDropdownToggle
        color="light"
        className="filter-dropdown-toggle"
        data-testid={testId}
        aria-label={ariaLabel || placeholder}
      >
        {selectedOption?.label || placeholder}
        <div className="filter-dropdown-icon">
          <AssetIcon name="arrow-down" size={24} color="#1D1B20" />
        </div>
      </CDropdownToggle>
      <CDropdownMenu className="filter-dropdown-menu">
        {options.map((option) => (
          <CDropdownItem
            key={option.value}
            onClick={() => onChange(option.value)}
            active={option.value === value}
            data-testid={`${testId}-option-${option.value}`}
          >
            {option.label}
          </CDropdownItem>
        ))}
      </CDropdownMenu>
    </CDropdown>
  );
};
