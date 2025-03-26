import { Response } from 'express';
import { logger } from '../utils/logger';
import { PrismaClient, Prisma, AccountType } from '@prisma/client';
import { instagramTokenService } from '../services/instagram/token.service';
import {
  InstagramWebhookRequest,
  InstagramWebhookEvent,
  InstagramMediaChange,
  InstagramCommentChange
} from '../types/webhook';
import { instagramConfig } from '../config/instagram';

const prisma = new PrismaClient();

interface InstagramTokenResponse {
  access_token: string;
  user_id: number;
}

interface InstagramUserResponse {
  id: string;
  username: string;
}

/**
 * Handles GET requests for webhook verification
 */
export const verifyWebhook = async (req: InstagramWebhookRequest, res: Response): Promise<void> => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  // Handle webhook verification
  if (mode === 'subscribe' && token === process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN) {
    logger.info('Webhook verified successfully');
    res.status(200).send(challenge);
  } else {
    logger.error('Failed to verify webhook', { mode, token });
    res.sendStatus(403);
  }
};

/**
 * Handles POST requests - webhook events
 */
export const handleWebhook = async (req: InstagramWebhookRequest, res: Response): Promise<void> => {
  const event = req.body as InstagramWebhookEvent;

  // Immediately respond to acknowledge receipt
  res.sendStatus(200);

  try {
    if (event.object !== 'instagram') {
      logger.warn('Received non-Instagram webhook event', { object: event.object });
      return;
    }

    for (const entry of event.entry) {
      for (const change of entry.changes) {
        switch (change.field) {
          case 'media':
            await handleMediaUpdate(change as InstagramMediaChange);
            break;
          case 'comments':
            await handleCommentUpdate(change as InstagramCommentChange);
            break;
          default:
            logger.info('Unhandled webhook field type', { field: change.field });
        }
      }
    }
  } catch (error) {
    logger.error('Error processing webhook event', { error, event });
  }
};

/**
 * Handles updates to Instagram media
 */
async function handleMediaUpdate(change: InstagramMediaChange): Promise<void> {
  logger.info('Processing media update', {
    mediaId: change.value.id,
    mediaType: change.value.media_type
  });
}

/**
 * Handles updates to Instagram comments
 */
async function handleCommentUpdate(change: InstagramCommentChange): Promise<void> {
  logger.info('Processing comment update', {
    commentId: change.value.id,
    timestamp: change.value.timestamp
  });
}
