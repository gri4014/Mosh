import { useContext } from 'react';
import { InstagramContext } from '../context/InstagramContext';
import { InstagramContextType } from '../types/instagram.types';

export const useInstagram = (): InstagramContextType => {
  const context = useContext(InstagramContext);
  if (context === undefined) {
    throw new Error('useInstagram must be used within an InstagramProvider');
  }
  return context;
};

export default useInstagram;
