import React, { createContext, useReducer, useCallback } from 'react';
import {
  SubscriptionState,
  SubscriptionContextType,
  SubscriptionTier,
  Subscription,
  SubscriptionPlan,
} from '../types/subscription.types';

const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    tier: "BASELINE",
    price: 30,
    features: [
      "Automated post creation",
      "AI-powered content generation",
      "Monthly strategy planning",
      "Basic analytics",
    ],
  },
  {
    tier: "PROMOTION",
    price: 49,
    features: [
      "All Baseline features",
      "Automated Instagram ads management",
      "Advanced analytics",
      "Priority support",
    ],
  },
];

const initialState: SubscriptionState = {
  currentPlan: null,
  availablePlans: SUBSCRIPTION_PLANS,
  loading: false,
  error: null,
};

type SubscriptionAction =
  | { type: 'SELECT_PLAN_REQUEST' }
  | { type: 'SELECT_PLAN_SUCCESS'; payload: Subscription }
  | { type: 'SELECT_PLAN_FAILURE'; payload: string }
  | { type: 'CANCEL_SUBSCRIPTION_SUCCESS' }
  | { type: 'CLEAR_ERROR' };

function subscriptionReducer(state: SubscriptionState, action: SubscriptionAction): SubscriptionState {
  switch (action.type) {
    case 'SELECT_PLAN_REQUEST':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'SELECT_PLAN_SUCCESS':
      return {
        ...state,
        currentPlan: action.payload,
        loading: false,
        error: null,
      };
    case 'SELECT_PLAN_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case 'CANCEL_SUBSCRIPTION_SUCCESS':
      return {
        ...state,
        currentPlan: null,
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

export const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(subscriptionReducer, initialState);

  const selectPlan = useCallback(async (tier: SubscriptionTier) => {
    try {
      dispatch({ type: 'SELECT_PLAN_REQUEST' });
      // TODO: Implement actual API call here
      const response = await fetch('/api/subscriptions/select', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tier }),
      });

      if (!response.ok) {
        throw new Error('Failed to select subscription plan');
      }

      const data = await response.json();
      dispatch({ type: 'SELECT_PLAN_SUCCESS', payload: data.subscription });
    } catch (error) {
      dispatch({
        type: 'SELECT_PLAN_FAILURE',
        payload: error instanceof Error ? error.message : 'Failed to select subscription plan',
      });
    }
  }, []);

  const cancelSubscription = useCallback(async () => {
    try {
      // TODO: Implement actual API call here
      await fetch('/api/subscriptions/cancel', {
        method: 'POST',
      });
      dispatch({ type: 'CANCEL_SUBSCRIPTION_SUCCESS' });
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      // Still cancel on client side even if API call fails
      dispatch({ type: 'CANCEL_SUBSCRIPTION_SUCCESS' });
    }
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value: SubscriptionContextType = {
    state,
    selectPlan,
    cancelSubscription,
    clearError,
  };

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
};
