// Base custom error class
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Authentication related errors
export class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401);
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Not authorized') {
    super(message, 403);
  }
}

// Resource errors
export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed') {
    super(message, 400);
  }
}

// Instagram specific errors
export class InstagramAPIError extends AppError {
  constructor(message = 'Instagram API error', statusCode = 500) {
    super(message, statusCode);
  }
}

// OpenAI specific errors
export class AIServiceError extends AppError {
  constructor(message = 'AI service error', statusCode = 500) {
    super(message, statusCode);
  }
}

// Rate limiting errors
export class RateLimitError extends AppError {
  constructor(message = 'Rate limit exceeded') {
    super(message, 429);
  }
}
