import React from 'react';
import { CButton, CProgress } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilArrowLeft } from '@coreui/icons';
import { useTheme } from '../hooks/useTheme';

interface ProfileEnhancementLayoutProps {
  children: React.ReactNode;
  title: string;
  instructions?: string;
  currentStep: number;
  totalSteps: number;
  onNext?: () => void;
  onBack?: () => void;
  nextDisabled?: boolean;
  nextLoading?: boolean;
  buttonText?: string;
  showBackButton?: boolean;
  showNextButton?: boolean;
}

const ProfileEnhancementLayout: React.FC<ProfileEnhancementLayoutProps> = ({
  children,
  title,
  instructions,
  currentStep,
  totalSteps,
  onNext,
  onBack,
  nextDisabled = false,
  nextLoading = false,
  buttonText = 'Continue',
  showBackButton = true,
  showNextButton = true,
}) => {
  const { theme } = useTheme();
  const progressValue = (currentStep / totalSteps) * 100;

  return (
    <div className="d-flex flex-column vh-100" style={{ backgroundColor: theme.colors.bodyBg }}>
      <div className="p-4" style={{ backgroundColor: theme.colors.cardBg, borderBottom: `1px solid ${theme.colors.borderColor}` }}>
        {showBackButton && onBack && (
          <CButton
            variant="ghost"
            className="mb-3 p-2"
            onClick={onBack}
            style={{ color: theme.colors.bodyColor }}
          >
            <CIcon icon={cilArrowLeft} size="lg" />
          </CButton>
        )}
        
        <div className="mb-3">
          <CProgress value={progressValue} color="primary" />
          <small className="text-muted mt-1 d-block">
            Step {currentStep} of {totalSteps}
          </small>
        </div>

        <h2 className="mb-2" style={{ color: theme.colors.bodyColor }}>
          {title}
        </h2>
        {instructions && (
          <p className="mb-0" style={{ color: theme.colors.textMuted }}>
            {instructions}
          </p>
        )}
      </div>

      <div className="flex-grow-1 p-4 d-flex flex-column">
        <div className="flex-grow-1">
          {children}
        </div>

        {showNextButton && onNext && (
          <div className="mt-4">
            <CButton
              color="primary"
              size="lg"
              className="w-100"
              onClick={onNext}
              disabled={nextDisabled || nextLoading}
            >
              {nextLoading ? 'Loading...' : buttonText}
            </CButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileEnhancementLayout;
