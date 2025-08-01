import React, { useState, useRef, useEffect } from 'react';
import {
  CFormLabel,
  CFormText,
  CInputGroup,
  CFormInput,
} from '@coreui/react';
import { cilSearch, cilX } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { useTheme } from '../hooks/useTheme';

export interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

interface MultiSelectDropdownProps {
  id?: string;
  label?: string;
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  required?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  helpText?: string;
  className?: string;
  'data-testid'?: string;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  id,
  label,
  options,
  value = [],
  onChange,
  placeholder = 'Select options',
  searchPlaceholder = 'Search...',
  required = false,
  disabled = false,
  invalid = false,
  helpText,
  className = '',
  'data-testid': testId,
}) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownMenuRef = useRef<HTMLDivElement>(null);

  // Filter options based on search text
  const filteredOptions = options.filter(option => 
    option.label.toLowerCase().includes(searchText.toLowerCase())
  );

  // Check if an option is selected
  const isSelected = (optionValue: string) => value.includes(optionValue);

  // Toggle option selection
  const toggleOption = (optionValue: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isSelected(optionValue)) {
      onChange(value.filter(v => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  // Remove a selected item
  const removeItem = (e: React.MouseEvent, optionValue: string) => {
    e.preventDefault();
    e.stopPropagation();
    onChange(value.filter(v => v !== optionValue));
  };

  // Get label for a value
  const getLabelForValue = (optionValue: string) => {
    const option = options.find(opt => opt.value === optionValue);
    return option ? option.label : optionValue;
  };

  // Handle toggle click
  const handleToggleClick = (e: React.MouseEvent) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Handle clicks outside to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Don't close if click is inside dropdown or dropdown menu
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        dropdownMenuRef.current && 
        !dropdownMenuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Reset search when dropdown closes
  useEffect(() => {
    if (!isOpen) {
      setSearchText('');
    }
  }, [isOpen]);

  // Style for dropdown container
  const containerStyle = {
    backgroundColor: theme.colors.cardBg,
    borderColor: invalid ? theme.colors.danger : theme.colors.borderColor,
    color: theme.colors.bodyColor,
    borderRadius: '4px',
    border: '1px solid',
    position: 'relative' as const,
    minHeight: '38px',
    cursor: disabled ? 'not-allowed' : 'pointer',
  };

  // Style for chips
  const chipStyle = {
    backgroundColor: theme.isDark ? '#3b4a5a' : '#e6e8ea',
    color: theme.isDark ? theme.colors.bodyColor : '#333',
    display: 'inline-flex',
    alignItems: 'center',
    margin: '2px 4px 2px 0',
    padding: '2px 8px',
    borderRadius: '16px',
    fontSize: '0.875rem',
  };

  // Style for remove icon on chips
  const removeIconStyle = {
    marginLeft: '5px',
    cursor: 'pointer',
    fontSize: '0.75rem',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    backgroundColor: theme.isDark ? '#4d5d6c' : '#d0d3d6',
  };

  const selectedDisplay = (
    <div className="d-flex flex-wrap align-items-center">
      {value.length === 0 ? (
        <span style={{ color: theme.isDark ? '#6c757d' : '#6c757d' }}>
          {placeholder}
        </span>
      ) : (
        value.map(val => (
          <div key={val} style={chipStyle}>
            <span>{getLabelForValue(val)}</span>
            {!disabled && (
              <span 
                style={removeIconStyle}
                onClick={(e) => removeItem(e, val)}
              >
                <CIcon icon={cilX} size="sm" />
              </span>
            )}
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className={`mb-3 ${className}`}>
      {label && (
        <CFormLabel 
          htmlFor={id} 
          className={required ? 'required-label' : ''}
          style={{ color: theme.colors.bodyColor }}
        >
          {label}
        </CFormLabel>
      )}

      <div ref={dropdownRef} className="position-relative w-100">
        {/* Custom toggle */}
        <div
          style={containerStyle}
          onClick={handleToggleClick}
          data-testid={testId}
          className={`form-select ${disabled ? 'opacity-75' : ''}`}
        >
          {selectedDisplay}
        </div>

        {/* Dropdown menu */}
        {isOpen && (
          <div 
            ref={dropdownMenuRef}
            className="dropdown-menu show w-100" 
            style={{ 
              position: 'absolute',
              inset: '0px auto auto 0px',
              margin: '0px',
              transform: 'translate(0px, 38px)',
              maxHeight: '300px', 
              overflow: 'auto',
              zIndex: 1000,
              backgroundColor: theme.colors.cardBg,
              borderColor: theme.colors.borderColor,
              color: theme.colors.bodyColor
            }}
          >
            <div className="p-2">
              <CInputGroup size="sm">
                <CFormInput
                  ref={searchInputRef}
                  placeholder={searchPlaceholder}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  data-testid={testId ? `${testId}-search` : undefined}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => {
                    // Prevent dropdown from closing on Enter
                    if (e.key === 'Enter') e.preventDefault();
                  }}
                  style={{
                    backgroundColor: theme.isDark ? theme.colors.cardBg : undefined,
                    color: theme.isDark ? theme.colors.bodyColor : undefined,
                    borderColor: theme.colors.borderColor,
                  }}
                />
                <span 
                  className="input-group-text"
                  style={{
                    backgroundColor: theme.isDark ? '#343a40' : '#e9ecef',
                    borderColor: theme.colors.borderColor,
                  }}
                >
                  <CIcon icon={cilSearch} />
                </span>
              </CInputGroup>
            </div>

            <div className="dropdown-divider"></div>

            {filteredOptions.length === 0 ? (
              <button className="dropdown-item disabled">No results found</button>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  className={`dropdown-item ${isSelected(option.value) ? 'active' : ''} ${option.disabled || disabled ? 'disabled' : ''}`}
                  onClick={(e) => toggleOption(option.value, e)}
                  style={{
                    backgroundColor: isSelected(option.value) 
                      ? theme.isDark ? '#375a7f' : '#e9f4ff' 
                      : undefined,
                    color: theme.isDark ? theme.colors.bodyColor : undefined,
                  }}
                >
                  <div className="d-flex align-items-center">
                    <input 
                      type="checkbox" 
                      checked={isSelected(option.value)} 
                      readOnly 
                      className="me-2"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span>{option.label}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>
      
      {helpText && (
        <CFormText 
          id={id ? `${id}Help` : undefined}
          style={{ color: theme.colors.textMuted }}
        >
          {helpText}
        </CFormText>
      )}
    </div>
  );
};

export default MultiSelectDropdown; 