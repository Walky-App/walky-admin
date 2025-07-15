import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileEnhancementLayout from '../components/ProfileEnhancementLayout';
import RelationshipStatusStep from '../components/profile-enhancement/RelationshipStatusStep';
import ParentStatusStep from '../components/profile-enhancement/ParentStatusStep';
import DogOwnerStep from '../components/profile-enhancement/DogOwnerStep';
import QAStep from '../components/profile-enhancement/QAStep';
import CompletionStep from '../components/profile-enhancement/CompletionStep';

interface ProfileData {
  relationshipStatus: string;
  isParent: boolean | null;
  isDogOwner: boolean | null;
  qaAnswers: Record<string, string>;
}

const ProfileEnhancement: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  
  const [profileData, setProfileData] = useState<ProfileData>({
    relationshipStatus: '',
    isParent: null,
    isDogOwner: null,
    qaAnswers: {},
  });

  const stepTitles = {
    1: 'Relationship Status',
    2: 'Are You a Parent?',
    3: 'Do you have a dog?',
    4: 'Questions & Answers',
    5: 'Profile Complete!',
  };

  const stepInstructions = {
    1: 'Help us understand your relationship status',
    2: 'This helps us connect you with other parents',
    3: 'Connect with fellow dog lovers',
    4: 'Tell us more about yourself',
    5: 'You\'re all set to get the most out of your experience.',
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log('Profile enhancement completed:', profileData);
      navigate('/settings');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/settings');
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return profileData.relationshipStatus !== '';
      case 2:
        return profileData.isParent !== null;
      case 3:
        return profileData.isDogOwner !== null;
      case 4:
        return Object.keys(profileData.qaAnswers).length > 0;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <RelationshipStatusStep
            value={profileData.relationshipStatus}
            onChange={(value) => setProfileData({ ...profileData, relationshipStatus: value })}
          />
        );
      case 2:
        return (
          <ParentStatusStep
            value={profileData.isParent}
            onChange={(value) => setProfileData({ ...profileData, isParent: value })}
          />
        );
      case 3:
        return (
          <DogOwnerStep
            value={profileData.isDogOwner}
            onChange={(value) => setProfileData({ ...profileData, isDogOwner: value })}
          />
        );
      case 4:
        return (
          <QAStep
            answers={profileData.qaAnswers}
            onChange={(answers) => setProfileData({ ...profileData, qaAnswers: answers })}
          />
        );
      case 5:
        return <CompletionStep />;
      default:
        return null;
    }
  };

  return (
    <ProfileEnhancementLayout
      title={stepTitles[currentStep as keyof typeof stepTitles]}
      instructions={stepInstructions[currentStep as keyof typeof stepInstructions]}
      currentStep={currentStep}
      totalSteps={totalSteps}
      onNext={handleNext}
      onBack={handleBack}
      nextDisabled={!isStepValid()}
      buttonText={currentStep === totalSteps ? 'View your profile' : 'Continue'}
      showBackButton={true}
      showNextButton={true}
    >
      {renderStepContent()}
    </ProfileEnhancementLayout>
  );
};

export default ProfileEnhancement;
