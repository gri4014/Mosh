import { useInstagram as useInstagramContext } from '../context/InstagramContext';

export const useInstagram = () => {
  return useInstagramContext();
};
