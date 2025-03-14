import React, { createContext, useReducer, useCallback } from 'react';
import { InstagramState, InstagramContextType, InstagramAccount } from '../types/instagram.types';

const initialState: InstagramState = {
  account: null,
  isConnected: false,
  loading: false,
  error: null,
};

type InstagramAction =
  | { type: 'CONNECT_REQUEST' }
  | { type: 'CONNECT_SUCCESS'; payload: InstagramAccount }
  | { type: 'CONNECT_FAILURE'; payload: string }
  | { type: 'DISCONNECT_SUCCESS' }
  | { type: 'CLEAR_ERROR' };

function instagramReducer(state: InstagramState, action: InstagramAction): InstagramState {
  switch (action.type) {
    case 'CONNECT_REQUEST':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'CONNECT_SUCCESS':
      return {
        ...state,
        account: action.payload,
        isConnected: true,
        loading: false,
        error: null,
      };
    case 'CONNECT_FAILURE':
      return {
        ...state,
        account: null,
        isConnected: false,
        loading: false,
        error: action.payload,
      };
    case 'DISCONNECT_SUCCESS':
      return {
        ...state,
        account: null,
        isConnected: false,
        loading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}

export const InstagramContext = createContext<InstagramContextType | undefined>(undefined);

export const InstagramProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(instagramReducer, initialState);

  const connectAccount = useCallback(async (code: string) => {
    try {
      dispatch({ type: 'CONNECT_REQUEST' });
      // TODO: Implement actual API call here
      const response = await fetch('/api/instagram/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error('Instagram connection failed');
      }

      const data = await response.json();
      dispatch({ type: 'CONNECT_SUCCESS', payload: data.account });
    } catch (error) {
      dispatch({
        type: 'CONNECT_FAILURE',
        payload: error instanceof Error ? error.message : 'Failed to connect Instagram account',
      });
    }
  }, []);

  const disconnectAccount = useCallback(async () => {
    try {
      // TODO: Implement actual API call here
      await fetch('/api/instagram/disconnect', {
        method: 'POST',
      });
      dispatch({ type: 'DISCONNECT_SUCCESS' });
    } catch (error) {
      console.error('Failed to disconnect Instagram account:', error);
      // Still disconnect on client side even if API call fails
      dispatch({ type: 'DISCONNECT_SUCCESS' });
    }
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value: InstagramContextType = {
    state,
    connectAccount,
    disconnectAccount,
    clearError,
  };

  return <InstagramContext.Provider value={value}>{children}</InstagramContext.Provider>;
};
