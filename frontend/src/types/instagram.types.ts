export interface InstagramAccount {
  id: string;
  username: string;
  accountType: "BUSINESS" | "CREATOR";
  accessToken: string;
  connectedAt: string;
}

export interface InstagramState {
  account: InstagramAccount | null;
  isConnected: boolean;
  loading: boolean;
  error: string | null;
}

export interface InstagramContextType {
  state: InstagramState;
  connectAccount: (code: string) => Promise<void>;
  disconnectAccount: () => Promise<void>;
  clearError: () => void;
}
