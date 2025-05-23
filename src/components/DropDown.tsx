import React, { ChangeEvent } from 'react';
import { CFormSelect, CFormLabel, CFormText } from '@coreui/react';
import { useTheme } from '../hooks/useTheme';

interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

interface OptGroup {
  label: string;
  options: Option[];
}

interface DropDownProps {
  id?: string;
  label?: string;
  options: (Option | OptGroup)[];
  value: string;
  onChange: (value: string) => void;
  name?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  helpText?: string;
  className?: string;
  size?: 'sm' | 'lg';
}

const DropDown: React.FC<DropDownProps> = ({
  id,
  label,
  options,
  value,
  onChange,
  name,
  placeholder,
  required = false,
  disabled = false,
  invalid = false,
  helpText,
  className = '',
  size,
}) => {
  const { theme } = useTheme();
  
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  // Check if an item is an OptGroup
  const isOptGroup = (item: Option | OptGroup): item is OptGroup => {
    return (item as OptGroup).options !== undefined;
  };

  // Create dropdown CSS classes
  const selectClasses = [
    className,
    theme.isDark ? 'dark-theme-select' : '',
  ].filter(Boolean).join(' ');
  
  // Set select style based on theme for custom control
  const customStyle = {
    backgroundColor: theme.isDark ? theme.colors.cardBg : undefined,
    color: theme.isDark ? theme.colors.bodyColor : undefined,
    borderColor: theme.colors.borderColor,
  };

  return (
    <div className="mb-3">
      {label && (
        <CFormLabel 
          htmlFor={id} 
          className={required ? 'required-label' : ''}
          style={{ color: theme.colors.bodyColor }}
        >
          {label}
        </CFormLabel>
      )}
      <CFormSelect
        id={id}
        value={value}
        onChange={handleChange}
        name={name}
        required={required}
        disabled={disabled}
        invalid={invalid}
        aria-describedby={helpText && id ? `${id}Help` : undefined}
        className={selectClasses}
        size={size}
        style={customStyle}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        
        {options.map((item, index) => {
          if (isOptGroup(item)) {
            return (
              <optgroup 
                key={`group-${index}`} 
                label={item.label}
                style={{ color: theme.colors.textMuted }}
              >
                {item.options.map((option, optionIndex) => (
                  <option 
                    key={`option-${index}-${optionIndex}`} 
                    value={option.value}
                    disabled={option.disabled}
                  >
                    {option.label}
                  </option>
                ))}
              </optgroup>
            );
          } else {
            return (
              <option 
                key={`option-${index}`} 
                value={item.value}
                disabled={item.disabled}
              >
                {item.label}
              </option>
            );
          }
        })}
      </CFormSelect>
      
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

export default DropDown; 