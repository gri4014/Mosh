export interface User {
  id: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface AuthContextType {
  state: AuthState;
  loginWithInstagram: () => void;
  handleInstagramCallback: (code: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}
