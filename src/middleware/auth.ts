import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/auth';

export const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  if (!req.session.userId) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }
  next();
};
