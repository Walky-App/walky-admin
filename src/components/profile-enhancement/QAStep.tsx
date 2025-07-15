import React from 'react';
import Input from '../Input';
import { useTheme } from '../../hooks/useTheme';

interface QAStepProps {
  answers: Record<string, string>;
  onChange: (answers: Record<string, string>) => void;
}

const QAStep: React.FC<QAStepProps> = ({
  answers,
  onChange,
}) => {
  const { theme } = useTheme();

  const questions = [
    {
      id: 'hobby',
      label: 'What is your favorite hobby?',
      placeholder: 'Tell us about your favorite hobby...'
    },
    {
      id: 'weekend',
      label: 'How do you like to spend your weekends?',
      placeholder: 'Describe your ideal weekend...'
    },
    {
      id: 'travel',
      label: 'What is your dream travel destination?',
      placeholder: 'Where would you love to visit?'
    }
  ];

  const handleAnswerChange = (questionId: string, value: string) => {
    onChange({
      ...answers,
      [questionId]: value
    });
  };

  return (
    <div>
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
            ❓
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        {questions.map((question) => (
          <div key={question.id} className="mb-4">
            <Input
              id={question.id}
              label={question.label}
              placeholder={question.placeholder}
              value={answers[question.id] || ''}
              onChange={(value) => handleAnswerChange(question.id, value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default QAStep;
