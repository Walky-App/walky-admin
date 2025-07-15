import React from 'react';
import DropDown from '../DropDown';

interface RelationshipStatusStepProps {
  value: string;
  onChange: (value: string) => void;
}

const RelationshipStatusStep: React.FC<RelationshipStatusStepProps> = ({
  value,
  onChange,
}) => {
  const relationshipOptions = [
    { value: '', label: 'Select your relationship status' },
    { value: 'single', label: 'Single' },
    { value: 'in_relationship', label: 'In a relationship' },
    { value: 'married', label: 'Married' },
    { value: 'divorced', label: 'Divorced' },
    { value: 'widowed', label: 'Widowed' },
    { value: 'prefer_not_to_say', label: 'Prefer not to say' },
  ];

  return (
    <div className="text-center">
      <div className="mb-4">
        <div className="d-flex justify-content-center mb-3">
          <div 
            style={{ 
              width: '80px', 
              height: '80px', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem'
            }}
          >
            💕
          </div>
        </div>
      </div>
      
      <DropDown
        id="relationshipStatus"
        options={relationshipOptions}
        value={value}
        onChange={onChange}
        placeholder="Select your relationship status"
        required
      />
    </div>
  );
};

export default RelationshipStatusStep;
