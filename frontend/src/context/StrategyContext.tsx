import React, { createContext, useReducer, useCallback } from 'react';
import {
  StrategyState,
  StrategyContextType,
  GlobalStrategy,
  SurveyResponse,
  MonthlyStrategy,
} from '../types/strategy.types';

const initialState: StrategyState = {
  surveyResponses: [],
  globalStrategy: null,
  monthlyStrategy: null,
  loading: false,
  error: null,
};

type StrategyAction =
  | { type: 'SUBMIT_SURVEY_REQUEST' }
  | { type: 'SUBMIT_SURVEY_SUCCESS'; payload: SurveyResponse }
  | { type: 'SUBMIT_SURVEY_FAILURE'; payload: string }
  | { type: 'GENERATE_GLOBAL_STRATEGY_REQUEST' }
  | { type: 'GENERATE_GLOBAL_STRATEGY_SUCCESS'; payload: GlobalStrategy }
  | { type: 'GENERATE_GLOBAL_STRATEGY_FAILURE'; payload: string }
  | { type: 'GENERATE_MONTHLY_STRATEGY_REQUEST' }
  | { type: 'GENERATE_MONTHLY_STRATEGY_SUCCESS'; payload: MonthlyStrategy }
  | { type: 'GENERATE_MONTHLY_STRATEGY_FAILURE'; payload: string }
  | { type: 'UPDATE_GLOBAL_STRATEGY_SUCCESS'; payload: GlobalStrategy }
  | { type: 'CLEAR_ERROR' };

function strategyReducer(state: StrategyState, action: StrategyAction): StrategyState {
  switch (action.type) {
    case 'SUBMIT_SURVEY_REQUEST':
    case 'GENERATE_GLOBAL_STRATEGY_REQUEST':
    case 'GENERATE_MONTHLY_STRATEGY_REQUEST':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'SUBMIT_SURVEY_SUCCESS':
      return {
        ...state,
        surveyResponses: [...state.surveyResponses, action.payload],
        loading: false,
        error: null,
      };
    case 'GENERATE_GLOBAL_STRATEGY_SUCCESS':
    case 'UPDATE_GLOBAL_STRATEGY_SUCCESS':
      return {
        ...state,
        globalStrategy: action.payload,
        loading: false,
        error: null,
      };
    case 'GENERATE_MONTHLY_STRATEGY_SUCCESS':
      return {
        ...state,
        monthlyStrategy: action.payload,
        loading: false,
        error: null,
      };
    case 'SUBMIT_SURVEY_FAILURE':
    case 'GENERATE_GLOBAL_STRATEGY_FAILURE':
    case 'GENERATE_MONTHLY_STRATEGY_FAILURE':
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

export const StrategyContext = createContext<StrategyContextType | undefined>(undefined);

export const StrategyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(strategyReducer, initialState);

  const submitSurveyResponse = useCallback(async (question: string, answer: string) => {
    try {
      dispatch({ type: 'SUBMIT_SURVEY_REQUEST' });
      // TODO: Implement actual API call here
      const response = await fetch('/api/strategy/survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question, answer }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit survey response');
      }

      const data = await response.json();
      dispatch({ type: 'SUBMIT_SURVEY_SUCCESS', payload: data.surveyResponse });
    } catch (error) {
      dispatch({
        type: 'SUBMIT_SURVEY_FAILURE',
        payload: error instanceof Error ? error.message : 'Failed to submit survey response',
      });
    }
  }, []);

  const generateGlobalStrategy = useCallback(async () => {
    try {
      dispatch({ type: 'GENERATE_GLOBAL_STRATEGY_REQUEST' });
      // TODO: Implement actual API call here
      const response = await fetch('/api/strategy/global', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to generate global strategy');
      }

      const data = await response.json();
      dispatch({ type: 'GENERATE_GLOBAL_STRATEGY_SUCCESS', payload: data.strategy });
    } catch (error) {
      dispatch({
        type: 'GENERATE_GLOBAL_STRATEGY_FAILURE',
        payload: error instanceof Error ? error.message : 'Failed to generate global strategy',
      });
    }
  }, []);

  const generateMonthlyStrategy = useCallback(async () => {
    try {
      dispatch({ type: 'GENERATE_MONTHLY_STRATEGY_REQUEST' });
      // TODO: Implement actual API call here
      const response = await fetch('/api/strategy/monthly', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to generate monthly strategy');
      }

      const data = await response.json();
      dispatch({ type: 'GENERATE_MONTHLY_STRATEGY_SUCCESS', payload: data.strategy });
    } catch (error) {
      dispatch({
        type: 'GENERATE_MONTHLY_STRATEGY_FAILURE',
        payload: error instanceof Error ? error.message : 'Failed to generate monthly strategy',
      });
    }
  }, []);

  const updateGlobalStrategy = useCallback(async (strategy: Partial<GlobalStrategy>) => {
    try {
      // TODO: Implement actual API call here
      const response = await fetch('/api/strategy/global', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(strategy),
      });

      if (!response.ok) {
        throw new Error('Failed to update global strategy');
      }

      const data = await response.json();
      dispatch({ type: 'UPDATE_GLOBAL_STRATEGY_SUCCESS', payload: data.strategy });
    } catch (error) {
      console.error('Failed to update global strategy:', error);
    }
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value: StrategyContextType = {
    state,
    submitSurveyResponse,
    generateGlobalStrategy,
    generateMonthlyStrategy,
    updateGlobalStrategy,
    clearError,
  };

  return <StrategyContext.Provider value={value}>{children}</StrategyContext.Provider>;
};
