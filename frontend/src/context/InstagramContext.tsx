import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import { axiosInstance } from '../config/axios';

interface InstagramAccount {
  id: string;
  username: string;
  accountType: 'PERSONAL' | 'BUSINESS' | 'CREATOR';
  businessId?: string;
}

interface InstagramState {
  accounts: InstagramAccount[];
  isLoading: boolean;
  error: string | null;
}

interface InstagramContextValue extends InstagramState {
  disconnectAccount: (accountId: string) => Promise<void>;
  clearError: () => void;
}

const initialState: InstagramState = {
  accounts: [],
  isLoading: false,
  error: null,
};

type Action =
  | { type: 'SET_LOADING' }
  | { type: 'SET_ACCOUNTS'; payload: InstagramAccount[] }
  | { type: 'REMOVE_ACCOUNT'; payload: string }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' };

const instagramReducer = (state: InstagramState, action: Action): InstagramState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: true, error: null };
    case 'SET_ACCOUNTS':
      return {
        ...state,
        accounts: action.payload,
        isLoading: false,
        error: null,
      };
    case 'REMOVE_ACCOUNT':
      return {
        ...state,
        accounts: state.accounts.filter(account => account.id !== action.payload),
        isLoading: false,
        error: null,
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

const InstagramContext = createContext<InstagramContextValue | undefined>(undefined);

interface InstagramProviderProps {
  children: ReactNode;
}

export const InstagramProvider: React.FC<InstagramProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(instagramReducer, initialState);

  const disconnectAccount = useCallback(async (accountId: string) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      await axiosInstance.delete(`/api/instagram/disconnect/${accountId}`);
      dispatch({ type: 'REMOVE_ACCOUNT', payload: accountId });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to disconnect Instagram account',
      });
      throw error;
    }
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value: InstagramContextValue = {
    ...state,
    disconnectAccount,
    clearError,
  };

  return <InstagramContext.Provider value={value}>{children}</InstagramContext.Provider>;
};

export const useInstagram = (): InstagramContextValue => {
  const context = useContext(InstagramContext);
  if (context === undefined) {
    throw new Error('useInstagram must be used within an InstagramProvider');
  }
  return context;
};
