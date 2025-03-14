import { useContext } from 'react';
import { PostContext } from '../context/PostContext';
import { PostContextType } from '../types/post.types';

export const usePost = (): PostContextType => {
  const context = useContext(PostContext);
  if (context === undefined) {
    throw new Error('usePost must be used within a PostProvider');
  }
  return context;
};

export default usePost;
