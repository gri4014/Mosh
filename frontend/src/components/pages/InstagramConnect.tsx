import React from 'react';
import { useNavigate } from 'react-router-dom';

const InstagramConnect: React.FC = () => {
  const navigate = useNavigate();

  const handleConnect = () => {
    // TODO: Implement Instagram OAuth flow
    // For MVP, simulate successful connection
    navigate('/subscription');
  };

  return (
    <div className="instagram-connect">
      <h2>Connect Your Instagram</h2>
      <p>First, let's connect your Instagram account to get started.</p>
      <button onClick={handleConnect}>Connect Instagram</button>
    </div>
  );
};

export default InstagramConnect;
