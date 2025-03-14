export interface UserPreferences {
  reviewModeEnabled: boolean;
  timeZone: string;
  emailNotifications: boolean;
  language: string;
}

export interface Settings {
  preferences: UserPreferences;
  lastUpdated: string;
}

export interface SettingsState {
  settings: Settings | null;
  loading: boolean;
  error: string | null;
}

export interface SettingsContextType {
  state: SettingsState;
  updateSettings: (settings: Partial<Settings>) => Promise<void>;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
  toggleReviewMode: () => Promise<void>;
  clearError: () => void;
}
