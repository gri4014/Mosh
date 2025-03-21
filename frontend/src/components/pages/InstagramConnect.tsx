import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const InstagramConnect: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state: { loading, error }, handleInstagramCallback } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const searchParams = new URLSearchParams(location.search);
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      if (error) {
        console.error('Instagram OAuth error:', error);
        navigate('/', { replace: true });
        return;
      }

      if (!code) {
        console.error('No authorization code found in URL');
        navigate('/', { replace: true });
        return;
      }

      try {
        await handleInstagramCallback(code);
        // Redirect to dashboard on successful authentication
        navigate('/dashboard', { replace: true });
      } catch (err) {
        console.error('Failed to handle Instagram callback:', err);
        navigate('/', { replace: true });
      }
    };

    handleCallback();
  }, [location, handleInstagramCallback, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-600" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            Connecting to Instagram...
          </h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            Failed to connect to Instagram
          </h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={() => navigate('/', { replace: true })}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default InstagramConnect;
