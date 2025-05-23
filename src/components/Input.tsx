import React, { ChangeEvent } from 'react';
import { CFormInput, CFormLabel, CFormText } from '@coreui/react';
import { useTheme } from '../hooks/useTheme';

interface InputProps {
  id?: string;
  label?: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  invalid?: boolean;
  helpText?: string;
  className?: string;
  autoComplete?: string;
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  name,
  required = false,
  disabled = false,
  readOnly = false,
  invalid = false,
  helpText,
  className = '',
  autoComplete,
}) => {
  const { theme } = useTheme();
  
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  // Create input CSS classes
  const inputClasses = [
    className,
    theme.isDark ? 'dark-theme-input' : '',
  ].filter(Boolean).join(' ');
  
  // Set input style based on theme
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
      <CFormInput
        type={type}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        name={name}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        invalid={invalid}
        aria-describedby={helpText && id ? `${id}Help` : undefined}
        className={inputClasses}
        autoComplete={autoComplete}
        style={customStyle}
      />
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

export default Input; 