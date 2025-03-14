export type SubscriptionTier = "BASELINE" | "PROMOTION";

export interface SubscriptionPlan {
  tier: SubscriptionTier;
  price: number;
  features: string[];
}

export interface Subscription {
  id: string;
  tier: SubscriptionTier;
  status: "ACTIVE" | "INACTIVE" | "PENDING";
  createdAt: string;
  expiresAt: string;
}

export interface SubscriptionState {
  currentPlan: Subscription | null;
  availablePlans: SubscriptionPlan[];
  loading: boolean;
  error: string | null;
}

export interface SubscriptionContextType {
  state: SubscriptionState;
  selectPlan: (tier: SubscriptionTier) => Promise<void>;
  cancelSubscription: () => Promise<void>;
  clearError: () => void;
}
