import React from 'react';
import { CButton, CButtonGroup } from '@coreui/react';
import { useTheme } from '../../hooks/useTheme';

interface DogOwnerStepProps {
  value: boolean | null;
  onChange: (value: boolean) => void;
}

const DogOwnerStep: React.FC<DogOwnerStepProps> = ({
  value,
  onChange,
}) => {
  const { theme } = useTheme();

  return (
    <div className="text-center">
      <div className="mb-4">
        <div className="d-flex justify-content-center mb-3">
          <div 
            style={{ 
              width: '80px', 
              height: '80px', 
              backgroundColor: theme.colors.cardBg, 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              border: `2px solid ${theme.colors.borderColor}`
            }}
          >
            🐕
          </div>
        </div>
      </div>
      
      <div className="d-flex justify-content-center">
        <CButtonGroup role="group" aria-label="Dog owner status">
          <CButton
            color={value === true ? 'primary' : 'outline-primary'}
            onClick={() => onChange(true)}
            size="lg"
            className="px-4"
          >
            Yes
          </CButton>
          <CButton
            color={value === false ? 'primary' : 'outline-primary'}
            onClick={() => onChange(false)}
            size="lg"
            className="px-4"
          >
            No
          </CButton>
        </CButtonGroup>
      </div>
    </div>
  );
};

export default DogOwnerStep;
