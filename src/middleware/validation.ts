import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../utils/errors';

type ValidatorFunction = (data: any) => void | Promise<void>;
type RequestSource = 'body' | 'query' | 'params';

export const validate = (validatorFn: ValidatorFunction, source: RequestSource = 'body') => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await validatorFn(req[source]);
      next();
    } catch (error) {
      if (error instanceof ValidationError) {
        next(error);
      } else {
        next(new ValidationError((error as Error).message));
      }
    }
  };
};

export const sanitize = (allowedFields: string[], source: RequestSource = 'body') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const sanitized: Record<string, any> = {};

    allowedFields.forEach((key) => {
      if (req[source] && key in req[source]) {
        sanitized[key] = req[source][key];
      }
    });

    // Replace request data with sanitized data
    req[source] = sanitized;
    next();
  };
};

export const requireFields = (requiredFields: string[], source: RequestSource = 'body') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const missingFields = requiredFields.filter((field) => {
      if (!req[source]) return true;
      const value = req[source][field];
      return value === undefined || value === null || value === '';
    });

    if (missingFields.length > 0) {
      next(
        new ValidationError(
          `Missing required fields: ${missingFields.join(', ')}`
        )
      );
      return;
    }

    next();
  };
};

interface PaginationQuery {
  page?: string;
  limit?: string;
  sort?: string;
}

export const validatePagination = (req: Request, res: Response, next: NextFunction): void => {
  const { page, limit, sort } = req.query as PaginationQuery;

  // Validate page number
  if (page && (!Number.isInteger(+page) || +page < 1)) {
    next(new ValidationError('Page must be a positive integer'));
    return;
  }

  // Validate limit
  if (limit && (!Number.isInteger(+limit) || +limit < 1 || +limit > 100)) {
    next(new ValidationError('Limit must be a positive integer between 1 and 100'));
    return;
  }

  // Validate sort
  if (sort && typeof sort !== 'string') {
    next(new ValidationError('Sort must be a string'));
    return;
  }

  // Add defaults if not provided
  req.query.page = page || '1';
  req.query.limit = limit || '10';
  req.query.sort = sort || '-createdAt';

  next();
};

interface DateRangeQuery {
  startDate?: string;
  endDate?: string;
}

export const validateDateRange = (req: Request, res: Response, next: NextFunction): void => {
  const { startDate, endDate } = req.query as DateRangeQuery;

  if (startDate && !isValidDate(startDate)) {
    next(new ValidationError('Invalid start date format'));
    return;
  }

  if (endDate && !isValidDate(endDate)) {
    next(new ValidationError('Invalid end date format'));
    return;
  }

  if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
    next(new ValidationError('Start date must be before end date'));
    return;
  }

  next();
};

const isValidDate = (dateStr: string): boolean => {
  const date = new Date(dateStr);
  return date instanceof Date && !isNaN(date.getTime());
};
