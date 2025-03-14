import jwt from 'jsonwebtoken';
import { createLogger } from '../utils/logger.js';
import { AuthenticationError, AuthorizationError } from '../utils/errors.js';

const logger = createLogger('AuthMiddleware');

/**
 * Extracts token from request header or query string
 */
const extractToken = (req) => {
  if (req.headers.authorization?.startsWith('Bearer ')) {
    return req.headers.authorization.split(' ')[1];
  }
  if (req.query?.token) {
    return req.query.token;
  }
  return null;
};

/**
 * Protects routes by requiring valid JWT
 */
export const protect = async (req, res, next) => {
  try {
    const token = extractToken(req);

    if (!token) {
      throw new AuthenticationError('Please log in to access this resource');
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user to request object
    req.user = decoded;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      logger.warn('Invalid token', { error: error.message });
      next(new AuthenticationError('Invalid or expired token'));
    } else {
      next(error);
    }
  }
};

/**
 * Restricts access to specific user roles
 * @param {...string} roles - Allowed roles
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AuthenticationError('User not found'));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AuthorizationError('You do not have permission to perform this action')
      );
    }

    next();
  };
};

/**
 * Ensures user can only access their own resources
 * @param {string} userIdPath - Path to user ID in request (e.g., 'params.userId')
 */
export const restrictToOwner = (userIdPath) => {
  return (req, res, next) => {
    const resourceUserId = userIdPath.split('.').reduce((obj, key) => obj?.[key], req);

    if (!resourceUserId) {
      return next(new AuthenticationError('Resource owner not found'));
    }

    // Allow admins to bypass ownership check
    if (req.user.role === 'admin') {
      return next();
    }

    if (req.user.id !== resourceUserId) {
      return next(
        new AuthorizationError('You do not have permission to access this resource')
      );
    }

    next();
  };
};

/**
 * Creates JWT token
 * @param {Object} payload - Data to encode in token
 * @param {string} expiresIn - Token expiration time
 */
export const createToken = (payload, expiresIn = '1d') => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn,
  });
};

/**
 * Refreshes access token using refresh token
 */
export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AuthenticationError('Refresh token is required');
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Create new access token
    const accessToken = createToken({
      id: decoded.id,
      role: decoded.role,
    });

    res.json({
      status: 'success',
      accessToken,
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      logger.warn('Invalid refresh token', { error: error.message });
      next(new AuthenticationError('Invalid or expired refresh token'));
    } else {
      next(error);
    }
  }
};
