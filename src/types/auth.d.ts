import { Request } from 'express';
import { Session } from 'express-session';

export interface AuthenticatedRequest extends Request {
  session: Session & {
    userId?: string;
  };
}

export interface InstagramAuthenticatedRequest extends AuthenticatedRequest {
  instagramToken?: string;
}
