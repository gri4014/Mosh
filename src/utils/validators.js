import { ValidationError } from './errors.js';

// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation (min 8 chars, at least 1 number, 1 letter)
export const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return passwordRegex.test(password);
};

// Instagram handle validation
export const isValidInstagramHandle = (handle) => {
  const handleRegex = /^[a-zA-Z0-9._]{1,30}$/;
  return handleRegex.test(handle);
};

// User input validation
export const validateUserInput = ({
  email,
  password,
  instagramHandle,
  subscriptionTier,
}) => {
  const errors = [];

  if (email && !isValidEmail(email)) {
    errors.push('Invalid email format');
  }

  if (password && !isValidPassword(password)) {
    errors.push(
      'Password must be at least 8 characters long and contain at least one letter and one number'
    );
  }

  if (instagramHandle && !isValidInstagramHandle(instagramHandle)) {
    errors.push('Invalid Instagram handle format');
  }

  if (
    subscriptionTier &&
    !['baseline', 'promotion'].includes(subscriptionTier.toLowerCase())
  ) {
    errors.push('Invalid subscription tier');
  }

  if (errors.length > 0) {
    throw new ValidationError(errors.join(', '));
  }

  return true;
};

// Strategy validation
export const validateStrategy = (strategy) => {
  const requiredFields = ['brand', 'tone', 'frequency', 'themes'];
  const missingFields = requiredFields.filter((field) => !strategy[field]);

  if (missingFields.length > 0) {
    throw new ValidationError(
      `Missing required strategy fields: ${missingFields.join(', ')}`
    );
  }

  if (strategy.frequency < 1 || strategy.frequency > 30) {
    throw new ValidationError('Posting frequency must be between 1 and 30 posts per month');
  }

  return true;
};

// Post validation
export const validatePost = (post) => {
  const requiredFields = ['title', 'description', 'scheduledFor'];
  const missingFields = requiredFields.filter((field) => !post[field]);

  if (missingFields.length > 0) {
    throw new ValidationError(
      `Missing required post fields: ${missingFields.join(', ')}`
    );
  }

  if (post.images && (!Array.isArray(post.images) || post.images.length > 5)) {
    throw new ValidationError('Posts can have up to 5 images');
  }

  if (post.hashtags && (!Array.isArray(post.hashtags) || post.hashtags.length > 30)) {
    throw new ValidationError('Posts can have up to 30 hashtags');
  }

  return true;
};

// Ad campaign validation
export const validateAdCampaign = (campaign) => {
  const requiredFields = ['budget', 'startDate', 'endDate'];
  const missingFields = requiredFields.filter((field) => !campaign[field]);

  if (missingFields.length > 0) {
    throw new ValidationError(
      `Missing required ad campaign fields: ${missingFields.join(', ')}`
    );
  }

  if (campaign.budget < 5) {
    throw new ValidationError('Minimum ad campaign budget is $5');
  }

  const startDate = new Date(campaign.startDate);
  const endDate = new Date(campaign.endDate);

  if (startDate >= endDate) {
    throw new ValidationError('Campaign end date must be after start date');
  }

  return true;
};
