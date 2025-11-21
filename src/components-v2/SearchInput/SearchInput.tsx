import React from "react";
import { AssetIcon } from "../AssetIcon/AssetIcon";
import "./SearchInput.css";

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  variant?: "primary" | "secondary";
  className?: string;
  testId?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = "Search",
  variant = "primary",
  className = "",
  testId = "search-input",
}) => {
  return (
    <div className={`search-input-container ${variant} ${className}`}>
      <div className="container-lupa">
        <AssetIcon name="search-icon" size={24} color="#676d70" />
      </div>
      <input
        data-testid={testId}
        type="text"
        placeholder={placeholder}
        value={value}
        aria-label={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="search-input-field"
      />
    </div>
  );
};
