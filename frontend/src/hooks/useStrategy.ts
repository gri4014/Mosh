import { useContext } from 'react';
import { StrategyContext } from '../context/StrategyContext';
import { StrategyContextType } from '../types/strategy.types';

export const useStrategy = (): StrategyContextType => {
  const context = useContext(StrategyContext);
  if (context === undefined) {
    throw new Error('useStrategy must be used within a StrategyProvider');
  }
  return context;
};

export default useStrategy;
