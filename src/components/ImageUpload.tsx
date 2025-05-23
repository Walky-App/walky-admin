import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import { CFormLabel, CButton, CCard, CCardBody, CImage } from '@coreui/react';
import { cilCloudUpload, cilX } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { useTheme } from '../hooks/useTheme';

interface ImageUploadProps {
  id?: string;
  label?: string;
  onChange: (file: File | null) => void;
  value?: File | null;
  initialPreview?: string;
  maxSizeMB?: number;
  acceptedFormats?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  id,
  label,
  onChange,
  value = null,
  initialPreview = null,
  maxSizeMB = 5,
  acceptedFormats = 'image/jpeg, image/png, image/gif',
  placeholder = 'Drag and drop an image here or click to browse',
  required = false,
  disabled = false,
  className = '',
}) => {
  const { theme } = useTheme();
  const [preview, setPreview] = useState<string | null>(initialPreview);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Set preview if value changes externally
  useEffect(() => {
    if (value && !preview) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(value);
    } else if (!value && preview && !initialPreview) {
      setPreview(null);
    }
  }, [value, preview, initialPreview]);

  // Use initialPreview if provided
  useEffect(() => {
    if (initialPreview) {
      setPreview(initialPreview);
    }
  }, [initialPreview]);

  // Handle file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    processFile(file);
  };

  // Process the selected file
  const processFile = (file: File | null) => {
    setError(null);
    
    // Clear if no file
    if (!file) {
      setPreview(null);
      onChange(null);
      return;
    }
    
    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds ${maxSizeMB}MB limit`);
      return;
    }
    
    // Validate file type
    const formats = acceptedFormats.split(',').map(format => format.trim());
    if (!formats.includes(file.type)) {
      setError(`File type not supported. Please use ${acceptedFormats}`);
      return;
    }
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    // Call onChange with the file
    onChange(file);
  };

  // Handle drag events
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (disabled) return;
    
    const file = e.dataTransfer.files?.[0] || null;
    processFile(file);
  };

  // Clear the selected image
  const handleClear = () => {
    setPreview(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Trigger the file input click
  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Create component CSS classes
  const cardClasses = [
    'image-upload-card',
    theme.isDark ? 'dark-theme-card' : '',
    isDragging ? 'dragging' : ''
  ].filter(Boolean).join(' ');

  // Component styles with theme-specific adjustments
  const cardStyle = {
    backgroundColor: theme.colors.cardBg,
    borderColor: isDragging ? theme.colors.primary : theme.colors.borderColor,
    borderStyle: 'dashed',
    borderWidth: '2px',
    transition: 'all 0.2s',
    minHeight: '200px',
    boxShadow: theme.isDark ? '0 2px 6px rgba(0, 0, 0, 0.2)' : '0 1px 3px rgba(0, 0, 0, 0.1)'
  };

  // Placeholder text color based on theme
  const placeholderStyle = {
    color: theme.colors.textMuted,
    marginBottom: 0
  };

  // Error message style
  const errorStyle = {
    color: theme.colors.danger,
    marginTop: '0.5rem',
    fontSize: '0.875rem'
  };

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
      
      <div 
        className={`position-relative ${disabled ? 'opacity-50' : ''}`}
        style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
      >
        <input
          type="file"
          ref={fileInputRef}
          id={id}
          accept={acceptedFormats}
          onChange={handleFileChange}
          disabled={disabled}
          required={required}
          className="d-none"
        />
        
        <CCard
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cardClasses}
          style={cardStyle}
        >
          <CCardBody className="d-flex flex-column align-items-center justify-content-center p-4">
            {preview ? (
              <div className="position-relative w-100 text-center">
                <CImage
                  src={preview}
                  className="img-fluid mb-2"
                  style={{ 
                    maxHeight: '150px',
                    // Add a subtle border for images on dark mode to improve visibility
                    border: theme.isDark ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
                  }}
                />
                <CButton 
                  color="danger" 
                  variant={theme.isDark ? 'ghost' : 'outline'} 
                  size="sm" 
                  className="position-absolute top-0 end-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClear();
                  }}
                  disabled={disabled}
                  style={{
                    // Ensure the button is visible in dark mode
                    backgroundColor: theme.isDark ? 'rgba(0, 0, 0, 0.3)' : undefined
                  }}
                >
                  <CIcon icon={cilX} />
                </CButton>
              </div>
            ) : (
              <>
                <CIcon 
                  icon={cilCloudUpload} 
                  size="3xl" 
                  className="mb-3" 
                  style={{ color: theme.colors.primary }}
                />
                <p className="text-center" style={placeholderStyle}>
                  {placeholder}
                </p>
              </>
            )}
          </CCardBody>
        </CCard>
        
        {error && (
          <div style={errorStyle}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload; 