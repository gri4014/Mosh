import { Response, NextFunction } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { logger } from '../utils/logger';
import { InstagramUserResponse } from '../types/instagram';
import { LogMeta } from '../types/logger';
import { instagramTokenService } from '../services/instagram/token.service';
import { AuthenticatedRequest } from '../types/auth';

const prisma = new PrismaClient();

interface InstagramTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
}

export const instagramCallback = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Get code from query parameters instead of body
  const { code } = req.query;

  if (!code) {
    res.status(400).json({ error: 'Authorization code is required' });
    return;
  }

  try {
    // Exchange code for access token using Instagram's OAuth endpoint
    const tokenResponse = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.INSTAGRAM_CLIENT_ID || '',
        client_secret: process.env.INSTAGRAM_CLIENT_SECRET || '',
        grant_type: 'authorization_code',
        redirect_uri: process.env.INSTAGRAM_REDIRECT_URI || '',
        code: code.toString(),
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      logger.error('Token exchange failed', { error: errorData });
      throw new Error('Failed to exchange code for access token');
    }

    const tokenData = await tokenResponse.json() as InstagramTokenResponse;

    // Exchange short-lived token for long-lived token
    const longLivedTokenResponse = await fetch(
      `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${
        process.env.INSTAGRAM_CLIENT_SECRET
      }&access_token=${tokenData.access_token}`
    );

    if (!longLivedTokenResponse.ok) {
      throw new Error('Failed to exchange for long-lived token');
    }

    const longLivedTokenData = await longLivedTokenResponse.json() as InstagramTokenResponse;

    // Get user details from Instagram
    const userResponse = await fetch(
      `https://graph.instagram.com/me?fields=id,username,account_type&access_token=${longLivedTokenData.access_token}`
    );

    if (!userResponse.ok) {
      throw new Error('Failed to get user details from Instagram');
    }

    const userData = (await userResponse.json()) as InstagramUserResponse;

    // Begin transaction
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Check if Instagram account already exists
      const existingAccount = await tx.instagramAccount.findUnique({
        where: { username: userData.username },
        include: { user: true },
      });

      if (existingAccount) {
        // Update existing account
        // Store the tokens securely
        await instagramTokenService.storeTokens(existingAccount.user.id, {
          accessToken: longLivedTokenData.access_token,
          refreshToken: longLivedTokenData.refresh_token,
          expiresAt: new Date(Date.now() + longLivedTokenData.expires_in * 1000),
        });

        const updatedAccount = await tx.instagramAccount.update({
          where: { id: existingAccount.id },
          data: {
            accountType: userData.account_type,
          },
          include: { user: true },
        });

        return { user: updatedAccount.user, account: updatedAccount };
      }

      // Create new user and Instagram account
      const newUser = await tx.user.create({
        data: {},
      });

      // Store tokens for new user
      await instagramTokenService.storeTokens(newUser.id, {
        accessToken: longLivedTokenData.access_token,
        refreshToken: longLivedTokenData.refresh_token,
        expiresAt: new Date(Date.now() + longLivedTokenData.expires_in * 1000),
      });

      const newAccount = await tx.instagramAccount.create({
        data: {
          accountType: userData.account_type,
          username: userData.username,
          userId: newUser.id,
          accessToken: longLivedTokenData.access_token,
          refreshToken: longLivedTokenData.refresh_token,
          tokenExpiresAt: new Date(Date.now() + longLivedTokenData.expires_in * 1000),
          lastRefreshed: new Date()
        },
      });

      return { user: newUser, account: newAccount };
    });

    // Set session
    req.session.userId = result.user.id;

    // Redirect to frontend dashboard after successful authentication
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  } catch (error) {
    const logMeta: LogMeta = {
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    logger.error('Instagram callback error', logMeta);
    // Redirect to frontend error page
    res.redirect(`${process.env.FRONTEND_URL}/error?message=${encodeURIComponent('Authentication failed')}`);
  }
};

export const logout = (req: AuthenticatedRequest, res: Response): void => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ error: 'Failed to logout' });
      return;
    }
    res.json({ message: 'Logged out successfully' });
  });
};

export const getUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        instagramAccounts: {
          select: {
            id: true,
            username: true,
            accountType: true,
            businessId: true,
            followerCount: true,
            followingCount: true,
            mediaCount: true,
          },
        },
      },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};
