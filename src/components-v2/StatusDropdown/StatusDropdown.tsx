import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { AssetIcon } from "../AssetIcon/AssetIcon";
import "./StatusDropdown.css";

export interface StatusDropdownProps {
  value: string;
  onChange: (value: string) => void;
  onNoteRequired?: (value: string, note: string) => void;
  options: string[];
  testId?: string;
}

export const StatusDropdown: React.FC<StatusDropdownProps> = ({
  value,
  onChange,
  onNoteRequired,
  options,
  testId = "status-dropdown",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLDivElement>(null);
  const [menuPosition, setMenuPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  useEffect(() => {
    if (isOpen && toggleRef.current) {
      const rect = toggleRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        toggleRef.current &&
        !toggleRef.current.contains(event.target as Node)
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

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleSelect = (option: string) => {
    const requiresNote = option === "Resolved" || option === "Dismissed";

    if (requiresNote && onNoteRequired) {
      // Let the parent component handle opening the modal
      onNoteRequired(option, "");
      setIsOpen(false);
    } else {
      onChange(option);
      setIsOpen(false);
    }
  };

  return (
    <div className="status-dropdown-wrapper">
      <div
        ref={toggleRef}
        className="status-dropdown-cell"
        onClick={handleToggle}
        data-testid={testId}
      >
        <span>{value}</span>
        <AssetIcon name="arrow-down" size={10} color="#5b6168" />
      </div>

      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            className={`status-dropdown-menu${
              isOpen ? " status-dropdown-menu--open" : ""
            }`}
            style={{
              position: "absolute",
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`,
              minWidth: `${menuPosition.width}px`,
            }}
            data-testid={`${testId}-menu`}
          >
            {options.map((option) => (
              <div
                key={option}
                className={`status-dropdown-item ${
                  option === value ? "active" : ""
                }`}
                onClick={() => handleSelect(option)}
                data-testid={`${testId}-option-${option}`}
              >
                {option}
              </div>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
};
