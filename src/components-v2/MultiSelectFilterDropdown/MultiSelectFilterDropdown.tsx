import React, { useState, useRef, useEffect } from "react";
import { AssetIcon } from "../AssetIcon/AssetIcon";
import { IconName } from "../AssetIcon/AssetIcon.types";
import "./MultiSelectFilterDropdown.css";

export interface MultiSelectOption {
  value: string;
  label: string;
}

export interface MultiSelectFilterDropdownProps {
  selectedValues: string[];
  onChange: (selectedValues: string[]) => void;
  options: MultiSelectOption[];
  placeholder?: string;
  icon?: IconName;
  className?: string;
  testId?: string;
  ariaLabel?: string;
  width?: string;
}

export const MultiSelectFilterDropdown: React.FC<
  MultiSelectFilterDropdownProps
> = ({
  selectedValues,
  onChange,
  options,
  placeholder = "Filter",
  icon = "grid-icon",
  className = "",
  testId = "multi-select-filter",
  ariaLabel,
  width = "auto",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleCheckboxChange = (value: string) => {
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    onChange(newSelectedValues);
  };

  const getDisplayText = () => {
    if (selectedValues.length === 0) {
      return placeholder;
    }
    if (selectedValues.length === options.length) {
      return placeholder;
    }
    if (selectedValues.length === 1) {
      const selectedOption = options.find(
        (opt) => opt.value === selectedValues[0]
      );
      return selectedOption?.label || placeholder;
    }
    return `${selectedValues.length} selected`;
  };

  return (
    <div
      className={`multi-select-filter-dropdown ${className}`}
      ref={dropdownRef}
      style={{ width }}
    >
      <button
        className="multi-select-filter-toggle"
        onClick={handleToggle}
        data-testid={testId}
        aria-label={ariaLabel || placeholder}
        aria-expanded={isOpen}
        type="button"
      >
        <div className="multi-select-filter-toggle-content">
          <AssetIcon name={icon} size={24} color="#5b6168" />
          <span className="multi-select-filter-label">{getDisplayText()}</span>
        </div>
      </button>

      {isOpen && (
        <div
          className="multi-select-filter-menu"
          data-testid={`${testId}-menu`}
        >
          {options.map((option) => {
            const isChecked = selectedValues.includes(option.value);
            return (
              <React.Fragment key={option.value}>
                <label
                  className="multi-select-filter-item"
                  data-testid={`${testId}-option-${option.value}`}
                >
                  <div className="multi-select-checkbox-wrapper">
                    <input
                      type="checkbox"
                      aria-label={option.label}
                      checked={isChecked}
                      onChange={() => handleCheckboxChange(option.value)}
                      className="multi-select-checkbox-input"
                      data-testid={`multi-select-checkbox-${option.value}`}
                    />
                    <div
                      className={`multi-select-checkbox ${
                        isChecked ? "checked" : ""
                      }`}
                    >
                      {isChecked && (
                        <AssetIcon
                          name="check-icon"
                          size={12}
                          color="#ffffff"
                        />
                      )}
                    </div>
                  </div>
                  <span className="multi-select-option-label">
                    {option.label}
                  </span>
                </label>
                <div className="multi-select-divider" />
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
};
