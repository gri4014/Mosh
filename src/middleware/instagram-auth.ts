import { Response, NextFunction } from 'express';
import { instagramTokenService } from '../services/instagram/token.service';
import { logger } from '../utils/logger';
import { InstagramAuthenticatedRequest } from '../types/auth';

export const verifyInstagramToken = async (
  req: InstagramAuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.session.userId) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  try {
    const isExpired = await instagramTokenService.isTokenExpired(req.session.userId);
    
    if (isExpired) {
      logger.info('Instagram token expired, attempting refresh', {
        userId: req.session.userId,
      });
      
      const newTokens = await instagramTokenService.refreshAccessToken(req.session.userId);
      
      if (!newTokens) {
        logger.error('Failed to refresh Instagram token', {
          userId: req.session.userId,
        });
        res.status(401).json({ error: 'Instagram authentication expired' });
        return;
      }

      req.instagramToken = newTokens.accessToken;
    } else {
      const tokens = await instagramTokenService.getTokens(req.session.userId);
      
      if (!tokens) {
        logger.error('No Instagram tokens found', {
          userId: req.session.userId,
        });
        res.status(401).json({ error: 'Instagram authentication required' });
        return;
      }

      req.instagramToken = tokens.accessToken;
    }

    next();
  } catch (error) {
    logger.error('Instagram token verification failed', {
      userId: req.session.userId,
      error,
    });
    res.status(500).json({ error: 'Instagram authentication failed' });
  }
};
