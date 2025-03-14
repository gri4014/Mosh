import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <h1>Welcome to Mosh</h1>
      <p>Automate your Instagram content with AI</p>
      <button onClick={() => navigate('/connect')}>Continue</button>
    </div>
  );
};

export default Landing;
