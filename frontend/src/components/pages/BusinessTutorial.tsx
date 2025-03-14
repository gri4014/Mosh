import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface TutorialStep {
  title: string;
  content: string;
  image?: string; // TODO: Add tutorial images
}

const BusinessTutorial: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps: TutorialStep[] = [
    {
      title: "Welcome to Mosh!",
      content: "Before we begin, let's make sure your Instagram account is ready for automation."
    },
    {
      title: "Convert to Business Account",
      content: `
        To use Mosh, you'll need a Business or Creator account on Instagram.
        Here's how to convert your account:
        1. Go to your Instagram profile
        2. Tap the menu icon and select Settings
        3. Tap Account
        4. Select 'Switch to Professional Account'
        5. Choose 'Business' or 'Creator'
      `
    },
    {
      title: "Ready to Start?",
      content: "Have you completed converting your account to a Business or Creator account?"
    }
  ];

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleComplete = (hasConverted: boolean) => {
    if (hasConverted) {
      navigate('/survey');
    } else {
      // Stay on the tutorial page
      setCurrentStep(1);
    }
  };

  return (
    <div className="business-tutorial">
      <div className="tutorial-step">
        <h2>{tutorialSteps[currentStep].title}</h2>
        <div className="content">
          {tutorialSteps[currentStep].content}
        </div>
        
        {currentStep === tutorialSteps.length - 1 ? (
          <div className="action-buttons">
            <button onClick={() => handleComplete(true)}>
              Yes, I have a Business/Creator account
            </button>
            <button onClick={() => handleComplete(false)}>
              No, I need to convert my account
            </button>
          </div>
        ) : (
          <button onClick={handleNext}>Next</button>
        )}
      </div>
    </div>
  );
};

export default BusinessTutorial;
