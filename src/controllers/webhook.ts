import { Response } from 'express';
import { logger } from '../utils/logger';
import {
  InstagramWebhookRequest,
  InstagramWebhookEvent,
  InstagramMediaChange,
  InstagramCommentChange
} from '../types/webhook';

/**
 * Handles the webhook verification request from Instagram
 */
export const verifyWebhook = (req: InstagramWebhookRequest, res: Response): void => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN) {
    logger.info('Webhook verified successfully');
    res.status(200).send(challenge);
  } else {
    logger.error('Failed to verify webhook', { mode, token });
    res.sendStatus(403);
  }
};

/**
 * Handles incoming webhook events from Instagram
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

  // TODO: Implement media update handling
  // For example:
  // - Update local database with new media
  // - Trigger notifications
  // - Update analytics
}

/**
 * Handles updates to Instagram comments
 */
async function handleCommentUpdate(change: InstagramCommentChange): Promise<void> {
  logger.info('Processing comment update', {
    commentId: change.value.id,
    timestamp: change.value.timestamp
  });

  // TODO: Implement comment update handling
  // For example:
  // - Store comment in database
  // - Process for sentiment analysis
  // - Trigger automated responses
}
