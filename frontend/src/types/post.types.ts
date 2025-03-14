import { PostPlan } from './strategy.types';

export interface PostImage {
  url: string;
  description: string;
  order: number;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  images: PostImage[];
  hashtags: string[];
  scheduledFor: string;
  publishedAt?: string;
  status: "DRAFT" | "PENDING_REVIEW" | "APPROVED" | "PUBLISHED" | "FAILED";
}

export interface AdCampaign {
  id: string;
  postId: string;
  budget: number;
  status: "ACTIVE" | "PAUSED" | "COMPLETED" | "FAILED";
  startDate: string;
  endDate: string;
  performanceData: {
    reach: number;
    impressions: number;
    engagement: number;
  };
}

export interface PostState {
  posts: Post[];
  currentPost: Post | null;
  adCampaigns: AdCampaign[];
  loading: boolean;
  error: string | null;
}

export interface PostContextType {
  state: PostState;
  generatePost: (postPlan: PostPlan) => Promise<void>;
  reviewPost: (postId: string, approved: boolean, modifications?: Partial<Post>) => Promise<void>;
  publishPost: (postId: string) => Promise<void>;
  createAdCampaign: (postId: string, budget: number) => Promise<void>;
  clearError: () => void;
}
