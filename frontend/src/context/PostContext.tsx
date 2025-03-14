import React, { createContext, useReducer, useCallback } from 'react';
import { PostState, PostContextType, Post, AdCampaign } from '../types/post.types';
import { PostPlan } from '../types/strategy.types';

const initialState: PostState = {
  posts: [],
  currentPost: null,
  adCampaigns: [],
  loading: false,
  error: null,
};

type PostAction =
  | { type: 'GENERATE_POST_REQUEST' }
  | { type: 'GENERATE_POST_SUCCESS'; payload: Post }
  | { type: 'GENERATE_POST_FAILURE'; payload: string }
  | { type: 'REVIEW_POST_REQUEST' }
  | { type: 'REVIEW_POST_SUCCESS'; payload: Post }
  | { type: 'REVIEW_POST_FAILURE'; payload: string }
  | { type: 'PUBLISH_POST_REQUEST' }
  | { type: 'PUBLISH_POST_SUCCESS'; payload: Post }
  | { type: 'PUBLISH_POST_FAILURE'; payload: string }
  | { type: 'CREATE_AD_CAMPAIGN_REQUEST' }
  | { type: 'CREATE_AD_CAMPAIGN_SUCCESS'; payload: AdCampaign }
  | { type: 'CREATE_AD_CAMPAIGN_FAILURE'; payload: string }
  | { type: 'CLEAR_ERROR' };

function postReducer(state: PostState, action: PostAction): PostState {
  switch (action.type) {
    case 'GENERATE_POST_REQUEST':
    case 'REVIEW_POST_REQUEST':
    case 'PUBLISH_POST_REQUEST':
    case 'CREATE_AD_CAMPAIGN_REQUEST':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'GENERATE_POST_SUCCESS':
      return {
        ...state,
        posts: [...state.posts, action.payload],
        currentPost: action.payload,
        loading: false,
        error: null,
      };
    case 'REVIEW_POST_SUCCESS':
    case 'PUBLISH_POST_SUCCESS':
      return {
        ...state,
        posts: state.posts.map(post =>
          post.id === action.payload.id ? action.payload : post
        ),
        currentPost: action.payload,
        loading: false,
        error: null,
      };
    case 'CREATE_AD_CAMPAIGN_SUCCESS':
      return {
        ...state,
        adCampaigns: [...state.adCampaigns, action.payload],
        loading: false,
        error: null,
      };
    case 'GENERATE_POST_FAILURE':
    case 'REVIEW_POST_FAILURE':
    case 'PUBLISH_POST_FAILURE':
    case 'CREATE_AD_CAMPAIGN_FAILURE':
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

export const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(postReducer, initialState);

  const generatePost = useCallback(async (postPlan: PostPlan) => {
    try {
      dispatch({ type: 'GENERATE_POST_REQUEST' });
      // TODO: Implement actual API call here
      const response = await fetch('/api/posts/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postPlan),
      });

      if (!response.ok) {
        throw new Error('Failed to generate post');
      }

      const data = await response.json();
      dispatch({ type: 'GENERATE_POST_SUCCESS', payload: data.post });
    } catch (error) {
      dispatch({
        type: 'GENERATE_POST_FAILURE',
        payload: error instanceof Error ? error.message : 'Failed to generate post',
      });
    }
  }, []);

  const reviewPost = useCallback(async (postId: string, approved: boolean, modifications?: Partial<Post>) => {
    try {
      dispatch({ type: 'REVIEW_POST_REQUEST' });
      // TODO: Implement actual API call here
      const response = await fetch(`/api/posts/${postId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ approved, modifications }),
      });

      if (!response.ok) {
        throw new Error('Failed to review post');
      }

      const data = await response.json();
      dispatch({ type: 'REVIEW_POST_SUCCESS', payload: data.post });
    } catch (error) {
      dispatch({
        type: 'REVIEW_POST_FAILURE',
        payload: error instanceof Error ? error.message : 'Failed to review post',
      });
    }
  }, []);

  const publishPost = useCallback(async (postId: string) => {
    try {
      dispatch({ type: 'PUBLISH_POST_REQUEST' });
      // TODO: Implement actual API call here
      const response = await fetch(`/api/posts/${postId}/publish`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to publish post');
      }

      const data = await response.json();
      dispatch({ type: 'PUBLISH_POST_SUCCESS', payload: data.post });
    } catch (error) {
      dispatch({
        type: 'PUBLISH_POST_FAILURE',
        payload: error instanceof Error ? error.message : 'Failed to publish post',
      });
    }
  }, []);

  const createAdCampaign = useCallback(async (postId: string, budget: number) => {
    try {
      dispatch({ type: 'CREATE_AD_CAMPAIGN_REQUEST' });
      // TODO: Implement actual API call here
      const response = await fetch('/api/ads/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId, budget }),
      });

      if (!response.ok) {
        throw new Error('Failed to create ad campaign');
      }

      const data = await response.json();
      dispatch({ type: 'CREATE_AD_CAMPAIGN_SUCCESS', payload: data.campaign });
    } catch (error) {
      dispatch({
        type: 'CREATE_AD_CAMPAIGN_FAILURE',
        payload: error instanceof Error ? error.message : 'Failed to create ad campaign',
      });
    }
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value: PostContextType = {
    state,
    generatePost,
    reviewPost,
    publishPost,
    createAdCampaign,
    clearError,
  };

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};
