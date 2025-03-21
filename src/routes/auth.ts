import { Router } from 'express';
import { instagramCallback, logout, getUser } from '../controllers/auth';
import { requireAuth } from '../middleware/auth';
import { verifyInstagramToken } from '../middleware/instagram-auth';

const router = Router();

// Public routes
router.get('/instagram/callback', instagramCallback); // Changed from POST to GET

// Protected routes that only require session auth
router.post('/logout', requireAuth, logout);

// Protected routes that require both session and Instagram token auth
router.get('/me', requireAuth, verifyInstagramToken, getUser);

// Export types from shared auth types
export { AuthenticatedRequest, InstagramAuthenticatedRequest } from '../types/auth';

export default router;
