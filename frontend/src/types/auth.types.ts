export interface User {
  id: string;
  email: string;
  instagramAccounts?: InstagramAccount[];
}

export interface InstagramAccount {
  id: string;
  username: string;
  accountType: 'PERSONAL' | 'BUSINESS' | 'CREATOR';
  businessId?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  id: string;
  email: string;
  token: string;
}

export interface AuthContextState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  error: string | null;
}

export interface AuthContextValue extends AuthContextState {
  register: (data: RegisterRequest) => Promise<void>;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}
