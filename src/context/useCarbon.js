import { useContext } from 'react';
import { CarbonContext } from './carbonContextDefinition';

export function useCarbon() {
  const context = useContext(CarbonContext);
  if (!context) {
    throw new Error('useCarbon must be used within a CarbonProvider');
  }
  return context;
}
