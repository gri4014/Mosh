import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import { instagramConfig } from '../config/instagram';
import { axiosInstance } from '../config/axios';
import type { AuthState, AuthContextType, User } from '../types/auth.types';

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

type Action =
  | { type: 'SET_LOADING' }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' };

const authReducer = (state: AuthState, action: Action): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: true, error: null };
    case 'SET_USER':
      return { ...state, user: action.payload, loading: false, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const loginWithInstagram = useCallback(() => {
    const { clientId, redirectUri, scopes } = instagramConfig;
    const scopeString = scopes.join(',');
    const url = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopeString}&response_type=code`;
    window.location.href = url;
  }, []);

  const handleInstagramCallback = useCallback(async (code: string) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const response = await axiosInstance.post('/auth/instagram/callback', { code });
      dispatch({ type: 'SET_USER', payload: response.data.user });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to authenticate with Instagram',
      });
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING' });
      await axiosInstance.post('/auth/logout');
      dispatch({ type: 'SET_USER', payload: null });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to logout',
      });
    }
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value: AuthContextType = {
    state,
    loginWithInstagram,
    handleInstagramCallback,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
