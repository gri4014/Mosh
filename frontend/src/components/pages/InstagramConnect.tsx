import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { axiosInstance } from '../../config/axios';

interface ConnectState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

const InstagramConnect: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [state, setState] = useState<ConnectState>({
    isLoading: true,
    error: null,
    success: false
  });

  useEffect(() => {
    // Ensure user is authenticated
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }

    const handleCallback = async () => {
      const searchParams = new URLSearchParams(location.search);
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      if (error) {
        setState({
          isLoading: false,
          error: 'Instagram connection was denied.',
          success: false
        });
        return;
      }

      if (!code) {
        setState({
          isLoading: false,
          error: 'No authorization code found in URL.',
          success: false
        });
        return;
      }

      try {
        // Connect Instagram account
        await axiosInstance.get(`/api/instagram/connect/callback?code=${code}`);
        
        setState({
          isLoading: false,
          error: null,
          success: true
        });

        // Redirect to dashboard after successful connection
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 2000);
      } catch (err) {
        setState({
          isLoading: false,
          error: 'Failed to connect Instagram account. Please try again.',
          success: false
        });
      }
    };

    handleCallback();
  }, [location, navigate, isAuthenticated]);

  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            Connecting Instagram Account...
          </h2>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            Connection Failed
          </h2>
          <p className="mt-2 text-gray-600">{state.error}</p>
          <button
            onClick={() => navigate('/dashboard', { replace: true })}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (state.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-green-600 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            Instagram Account Connected Successfully
          </h2>
          <p className="mt-2 text-gray-600">
            Redirecting to dashboard...
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export default InstagramConnect;
