import React, { createContext, useReducer, useCallback } from 'react';
import {
  SettingsState,
  SettingsContextType,
  Settings,
  UserPreferences,
} from '../types/settings.types';

const initialState: SettingsState = {
  settings: {
    preferences: {
      reviewModeEnabled: true, // Default to review mode enabled
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Default to user's timezone
      emailNotifications: true,
      language: 'en', // Default to English
    },
    lastUpdated: new Date().toISOString(),
  },
  loading: false,
  error: null,
};

type SettingsAction =
  | { type: 'UPDATE_SETTINGS_REQUEST' }
  | { type: 'UPDATE_SETTINGS_SUCCESS'; payload: Settings }
  | { type: 'UPDATE_SETTINGS_FAILURE'; payload: string }
  | { type: 'UPDATE_PREFERENCES_REQUEST' }
  | { type: 'UPDATE_PREFERENCES_SUCCESS'; payload: Settings }
  | { type: 'UPDATE_PREFERENCES_FAILURE'; payload: string }
  | { type: 'TOGGLE_REVIEW_MODE_SUCCESS'; payload: Settings }
  | { type: 'CLEAR_ERROR' };

function settingsReducer(state: SettingsState, action: SettingsAction): SettingsState {
  switch (action.type) {
    case 'UPDATE_SETTINGS_REQUEST':
    case 'UPDATE_PREFERENCES_REQUEST':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'UPDATE_SETTINGS_SUCCESS':
    case 'UPDATE_PREFERENCES_SUCCESS':
    case 'TOGGLE_REVIEW_MODE_SUCCESS':
      return {
        ...state,
        settings: action.payload,
        loading: false,
        error: null,
      };
    case 'UPDATE_SETTINGS_FAILURE':
    case 'UPDATE_PREFERENCES_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
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

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(settingsReducer, initialState);

  const updateSettings = useCallback(async (settings: Partial<Settings>) => {
    try {
      dispatch({ type: 'UPDATE_SETTINGS_REQUEST' });
      // TODO: Implement actual API call here
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }

      const data = await response.json();
      dispatch({ type: 'UPDATE_SETTINGS_SUCCESS', payload: data.settings });
    } catch (error) {
      dispatch({
        type: 'UPDATE_SETTINGS_FAILURE',
        payload: error instanceof Error ? error.message : 'Failed to update settings',
      });
    }
  }, []);

  const updatePreferences = useCallback(async (preferences: Partial<UserPreferences>) => {
    try {
      dispatch({ type: 'UPDATE_PREFERENCES_REQUEST' });
      // TODO: Implement actual API call here
      const response = await fetch('/api/settings/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        throw new Error('Failed to update preferences');
      }

      const data = await response.json();
      dispatch({ type: 'UPDATE_PREFERENCES_SUCCESS', payload: data.settings });
    } catch (error) {
      dispatch({
        type: 'UPDATE_PREFERENCES_FAILURE',
        payload: error instanceof Error ? error.message : 'Failed to update preferences',
      });
    }
  }, []);

  const toggleReviewMode = useCallback(async () => {
    if (!state.settings) return;

    const newPreferences: UserPreferences = {
      ...state.settings.preferences,
      reviewModeEnabled: !state.settings.preferences.reviewModeEnabled,
    };

    try {
      await updatePreferences(newPreferences);
    } catch (error) {
      console.error('Failed to toggle review mode:', error);
    }
  }, [state.settings, updatePreferences]);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value: SettingsContextType = {
    state,
    updateSettings,
    updatePreferences,
    toggleReviewMode,
    clearError,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};
