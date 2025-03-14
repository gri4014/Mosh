import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SurveyQuestion {
  id: string;
  question: string;
  placeholder?: string;
}

const DynamicSurvey: React.FC = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentAnswer, setCurrentAnswer] = useState('');

  // TODO: In production, these questions will be fetched from the ChatGPT API
  const questions: SurveyQuestion[] = [
    {
      id: 'brand_description',
      question: 'Describe your brand in a few sentences.',
      placeholder: 'e.g., We are a sustainable fashion brand focused on...'
    },
    {
      id: 'target_audience',
      question: 'Who is your target audience?',
      placeholder: 'e.g., Fashion-conscious women aged 25-35 who care about sustainability'
    },
    {
      id: 'brand_voice',
      question: "How would you describe your brand's voice?",
      placeholder: 'e.g., Professional and authoritative, Friendly and casual, etc.'
    },
    {
      id: 'content_preferences',
      question: 'What type of content resonates most with your audience?',
      placeholder: 'e.g., Behind-the-scenes content, Product showcases, etc.'
    }
  ];

  const handleNext = () => {
    if (!currentAnswer.trim()) return;

    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestionIndex].id]: currentAnswer
    }));

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setCurrentAnswer('');
    } else {
      // TODO: In production, send answers to backend
      console.log('Survey answers:', { ...answers, [questions[currentQuestionIndex].id]: currentAnswer });
      navigate('/dashboard');
    }
  };

  return (
    <div className="dynamic-survey">
      <h2>Help Us Understand Your Brand</h2>
      <p className="question-counter">
        Question {currentQuestionIndex + 1} of {questions.length}
      </p>

      <div className="question-container">
        <h3>{questions[currentQuestionIndex].question}</h3>
        <textarea
          value={currentAnswer}
          onChange={(e) => setCurrentAnswer(e.target.value)}
          placeholder={questions[currentQuestionIndex].placeholder}
          rows={4}
        />
      </div>

      <button 
        onClick={handleNext}
        disabled={!currentAnswer.trim()}
      >
        {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Complete'}
      </button>
    </div>
  );
};

export default DynamicSurvey;
