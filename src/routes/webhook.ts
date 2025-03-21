import express from 'express';
import { verifyWebhook, handleWebhook } from '../controllers/webhook';

const router = express.Router();

/**
 * GET /api/webhooks/instagram
 * Handles webhook verification requests from Instagram
 */
router.get('/instagram', verifyWebhook);

/**
 * POST /api/webhooks/instagram
 * Handles incoming webhook events from Instagram
 */
router.post('/instagram', handleWebhook);

export default router;
