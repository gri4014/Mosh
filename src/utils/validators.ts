import { ValidationError } from './errors';

// Types
interface UserInput {
  email?: string;
  password?: string;
  instagramHandle?: string;
  subscriptionTier?: string;
}

interface StrategyInput {
  brandIdentity: Record<string, unknown>;
  toneOfVoice: Record<string, unknown>;
  postFrequency: number;
  contentThemes: string[];
  visualStyles: string[];
  narrative: string;
}

interface PostInput {
  title: string;
  description: string;
  content: Record<string, unknown>;
  images: string[];
  hashtags: string[];
  scheduledFor: string;
}

interface AdCampaignInput {
  budget: number;
  targeting: Record<string, unknown>;
  startDate: string;
  endDate: string;
}

// Validators
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return passwordRegex.test(password);
};

export const isValidInstagramHandle = (handle: string): boolean => {
  // 1-30 characters, letters, numbers, periods, and underscores
  const handleRegex = /^[a-zA-Z0-9_.]{1,30}$/;
  return handleRegex.test(handle);
};

export const validateUserInput = (input: UserInput): void => {
  const errors: string[] = [];

  if (input.email && !isValidEmail(input.email)) {
    errors.push('Invalid email format');
  }

  if (input.password && !isValidPassword(input.password)) {
    errors.push(
      'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number'
    );
  }

  if (input.instagramHandle && !isValidInstagramHandle(input.instagramHandle)) {
    errors.push(
      'Instagram handle must be 1-30 characters long and contain only letters, numbers, periods, and underscores'
    );
  }

  if (input.subscriptionTier && !['BASELINE', 'PROMOTION'].includes(input.subscriptionTier)) {
    errors.push('Invalid subscription tier');
  }

  if (errors.length > 0) {
    throw new ValidationError(errors.join('. '));
  }
};

export const validateStrategy = (strategy: StrategyInput): void => {
  const errors: string[] = [];

  if (!strategy.brandIdentity || Object.keys(strategy.brandIdentity).length === 0) {
    errors.push('Brand identity is required');
  }

  if (!strategy.toneOfVoice || Object.keys(strategy.toneOfVoice).length === 0) {
    errors.push('Tone of voice is required');
  }

  if (typeof strategy.postFrequency !== 'number' || strategy.postFrequency < 1) {
    errors.push('Post frequency must be a positive number');
  }

  if (!Array.isArray(strategy.contentThemes) || strategy.contentThemes.length === 0) {
    errors.push('At least one content theme is required');
  }

  if (!Array.isArray(strategy.visualStyles) || strategy.visualStyles.length === 0) {
    errors.push('At least one visual style is required');
  }

  if (!strategy.narrative || strategy.narrative.trim().length === 0) {
    errors.push('Narrative is required');
  }

  if (errors.length > 0) {
    throw new ValidationError(errors.join('. '));
  }
};

export const validatePost = (post: PostInput): void => {
  const errors: string[] = [];

  if (!post.title || post.title.trim().length === 0) {
    errors.push('Title is required');
  }

  if (!post.description || post.description.trim().length === 0) {
    errors.push('Description is required');
  }

  if (!post.content || Object.keys(post.content).length === 0) {
    errors.push('Content is required');
  }

  if (!Array.isArray(post.images) || post.images.length === 0) {
    errors.push('At least one image is required');
  }

  if (!Array.isArray(post.hashtags) || post.hashtags.length === 0) {
    errors.push('At least one hashtag is required');
  }

  if (!post.scheduledFor || isNaN(Date.parse(post.scheduledFor))) {
    errors.push('Valid scheduled date is required');
  }

  if (errors.length > 0) {
    throw new ValidationError(errors.join('. '));
  }
};

export const validateAdCampaign = (campaign: AdCampaignInput): void => {
  const errors: string[] = [];

  if (typeof campaign.budget !== 'number' || campaign.budget <= 0) {
    errors.push('Budget must be a positive number');
  }

  if (!campaign.targeting || Object.keys(campaign.targeting).length === 0) {
    errors.push('Targeting criteria are required');
  }

  const startDate = new Date(campaign.startDate);
  const endDate = new Date(campaign.endDate);

  if (isNaN(startDate.getTime())) {
    errors.push('Valid start date is required');
  }

  if (isNaN(endDate.getTime())) {
    errors.push('Valid end date is required');
  }

  if (startDate >= endDate) {
    errors.push('End date must be after start date');
  }

  if (errors.length > 0) {
    throw new ValidationError(errors.join('. '));
  }
};
