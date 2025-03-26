import express from 'express';
import { connectInstagram, disconnectInstagram } from '../controllers/instagram';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Instagram connection routes (requires authentication)
router.get('/connect/callback', authMiddleware, connectInstagram);
router.delete('/disconnect/:accountId', authMiddleware, disconnectInstagram);

export default router;
