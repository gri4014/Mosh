import { ValidationError } from '../utils/errors.js';

/**
 * Creates a middleware function that validates request data against a schema
 * @param {Function} validatorFn - Validation function to run
 * @param {string} source - Request property to validate ('body', 'query', or 'params')
 */
export const validate = (validatorFn, source = 'body') => {
  return (req, res, next) => {
    try {
      validatorFn(req[source]);
      next();
    } catch (error) {
      if (error instanceof ValidationError) {
        next(error);
      } else {
        next(new ValidationError(error.message));
      }
    }
  };
};

/**
 * Sanitizes request data by removing unwanted fields
 * @param {Array} allowedFields - Array of field names to keep
 * @param {string} source - Request property to sanitize ('body', 'query', or 'params')
 */
export const sanitize = (allowedFields, source = 'body') => {
  return (req, res, next) => {
    const sanitized = {};
    
    Object.keys(req[source]).forEach(key => {
      if (allowedFields.includes(key)) {
        sanitized[key] = req[source][key];
      }
    });

    req[source] = sanitized;
    next();
  };
};

/**
 * Ensures required fields are present in the request
 * @param {Array} requiredFields - Array of required field names
 * @param {string} source - Request property to check ('body', 'query', or 'params')
 */
export const requireFields = (requiredFields, source = 'body') => {
  return (req, res, next) => {
    const missingFields = requiredFields.filter(field => {
      return !(field in req[source]);
    });

    if (missingFields.length > 0) {
      next(new ValidationError(
        `Missing required fields: ${missingFields.join(', ')}`
      ));
      return;
    }

    next();
  };
};

/**
 * Validates pagination parameters in the query string
 */
export const validatePagination = (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);

  if (isNaN(pageNum) || pageNum < 1) {
    next(new ValidationError('Page must be a positive integer'));
    return;
  }

  if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
    next(new ValidationError('Limit must be between 1 and 100'));
    return;
  }

  req.pagination = {
    page: pageNum,
    limit: limitNum,
    skip: (pageNum - 1) * limitNum
  };

  next();
};

/**
 * Validates date range parameters in the query string
 */
export const validateDateRange = (req, res, next) => {
  const { startDate, endDate } = req.query;

  if (!startDate && !endDate) {
    next();
    return;
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (startDate && isNaN(start.getTime())) {
    next(new ValidationError('Invalid start date format'));
    return;
  }

  if (endDate && isNaN(end.getTime())) {
    next(new ValidationError('Invalid end date format'));
    return;
  }

  if (startDate && endDate && start >= end) {
    next(new ValidationError('End date must be after start date'));
    return;
  }

  req.dateRange = {
    startDate: startDate ? start : null,
    endDate: endDate ? end : null
  };

  next();
};
