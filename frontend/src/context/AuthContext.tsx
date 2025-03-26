import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import { axiosInstance } from '../config/axios';
import { AuthContextState, AuthContextValue, RegisterRequest, LoginRequest, User } from '../types/auth.types';

const initialState: AuthContextState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  token: null,
  error: null,
};

type Action =
  | { type: 'SET_LOADING' }
  | { type: 'SET_AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'LOGOUT' };

const authReducer = (state: AuthContextState, action: Action): AuthContextState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: true, error: null };
    case 'SET_AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'LOGOUT':
      return { ...initialState };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const register = useCallback(async (data: RegisterRequest) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const response = await axiosInstance.post('/auth/register', data);
      
      const { token, ...user } = response.data;
      
      // Set token in axios headers
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      dispatch({ type: 'SET_AUTH_SUCCESS', payload: { user, token } });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Registration failed',
      });
      throw error;
    }
  }, []);

  const login = useCallback(async (data: LoginRequest) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const response = await axiosInstance.post('/auth/login', data);
      
      const { token, ...user } = response.data;
      
      // Set token in axios headers
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      dispatch({ type: 'SET_AUTH_SUCCESS', payload: { user, token } });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Login failed',
      });
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING' });
      await axiosInstance.post('/auth/logout');
      
      // Remove token from axios headers
      delete axiosInstance.defaults.headers.common['Authorization'];
      
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Logout failed',
      });
      throw error;
    }
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value: AuthContextValue = {
    ...state,
    register,
    login,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
