import { Request } from 'express';
import { ParsedQs } from 'qs';

export interface WebhookVerificationQuery extends ParsedQs {
  'hub.mode'?: string;
  'hub.verify_token'?: string;
  'hub.challenge'?: string;
}

export type InstagramWebhookRequest = Request<{}, any, any, WebhookVerificationQuery>;

export interface InstagramWebhookEvent {
  object: 'instagram';
  entry: Array<{
    id: string;
    time: number;
    changes: Array<{
      field: string;
      value: any;
    }>;
  }>;
}

export interface InstagramMediaChange {
  field: 'media';
  value: {
    id: string;
    media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
    media_url?: string;
    permalink?: string;
    timestamp?: string;
  };
}

export interface InstagramCommentChange {
  field: 'comments';
  value: {
    id: string;
    text: string;
    timestamp: string;
    username?: string;
  };
}
