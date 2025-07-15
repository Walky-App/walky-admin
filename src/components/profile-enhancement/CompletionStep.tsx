import React from 'react';
import { useTheme } from '../../hooks/useTheme';

const CompletionStep: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="text-center">
      <div className="mb-4">
        <div className="d-flex justify-content-center mb-3">
          <div 
            style={{ 
              width: '120px', 
              height: '120px', 
              backgroundColor: theme.colors.success, 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem'
            }}
          >
            ✅
          </div>
        </div>
      </div>
      
      <h3 className="mb-3" style={{ color: theme.colors.bodyColor }}>
        Profile Enhanced!
      </h3>
      
      <p className="mb-4" style={{ color: theme.colors.textMuted }}>
        Great! Your profile has been enhanced with additional information. 
        This will help us provide you with a more personalized experience.
      </p>
      
      <div className="text-center">
        <small style={{ color: theme.colors.textMuted }}>
          You can update this information anytime from your profile settings.
        </small>
      </div>
    </div>
  );
};

export default CompletionStep;
