export interface SurveyResponse {
  id: string;
  question: string;
  answer: string;
  createdAt: string;
}

export interface GlobalStrategy {
  id: string;
  brandIdentity: string;
  toneOfVoice: string;
  postingFrequency: string;
  contentThemes: string[];
  visualStyle: string;
  narrative: string;
  createdAt: string;
  updatedAt: string;
}

export interface PostPlan {
  title: string;
  description: string;
  imageCount: number;
  imageThemes: string[];
  imageDescriptions: string[];
  scheduledDate: string;
  hashtags: string[];
}

export interface MonthlyStrategy {
  id: string;
  globalStrategyId: string;
  month: number;
  year: number;
  posts: PostPlan[];
  createdAt: string;
}

export interface StrategyState {
  surveyResponses: SurveyResponse[];
  globalStrategy: GlobalStrategy | null;
  monthlyStrategy: MonthlyStrategy | null;
  loading: boolean;
  error: string | null;
}

export interface StrategyContextType {
  state: StrategyState;
  submitSurveyResponse: (question: string, answer: string) => Promise<void>;
  generateGlobalStrategy: () => Promise<void>;
  generateMonthlyStrategy: () => Promise<void>;
  updateGlobalStrategy: (strategy: Partial<GlobalStrategy>) => Promise<void>;
  clearError: () => void;
}
