import { useAuthContext } from '../context/AuthContext';
import type { AuthContextType } from '../types/auth.types';

export const useAuth = (): AuthContextType => {
  return useAuthContext();
};

export default useAuth;
