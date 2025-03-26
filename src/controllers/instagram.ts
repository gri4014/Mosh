import { Response } from 'express';
import { logger } from '../utils/logger';
import { PrismaClient, AccountType } from '@prisma/client';
import { instagramConfig } from '../config/instagram';
import { instagramTokenService } from '../services/instagram/token.service';
import { AuthenticatedRequest } from '../types/auth';

const prisma = new PrismaClient();

interface InstagramTokenResponse {
  access_token: string;
  user_id: string;
}

interface InstagramUserResponse {
  id: string;
  username: string;
  account_type: string;
  instagram_business_account?: {
    id: string;
  };
}

export const connectInstagram = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { code } = req.query;
    
    if (!code || typeof code !== 'string') {
      logger.error('Instagram callback received without code');
      res.status(400).json({ error: 'No code provided' });
      return;
    }

    // Exchange code for access token
    const response = await fetch(instagramConfig.getAccessTokenUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: instagramConfig.getTokenExchangeBody(code)
    });

    if (!response.ok) {
      const errorData = await response.text();
      logger.error('Token exchange failed', { error: errorData });
      throw new Error('Failed to exchange code for access token');
    }

    const tokenData = await response.json() as InstagramTokenResponse;

    // Get user details
    const userResponse = await fetch(instagramConfig.getUserInfoUrl(tokenData.access_token));
    
    if (!userResponse.ok) {
      throw new Error('Failed to get user details from Instagram');
    }

    const userData = await userResponse.json() as InstagramUserResponse;

    // Check if account already connected
    const existingAccount = await prisma.instagramAccount.findUnique({
      where: { username: userData.username }
    });

    if (existingAccount) {
      res.status(400).json({ error: 'Instagram account already connected to another user' });
      return;
    }

    // Store Instagram tokens
    await instagramTokenService.storeTokens(req.user!.id, {
      accessToken: tokenData.access_token,
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
    });

    // Create new Instagram account
    const newAccount = await prisma.instagramAccount.create({
      data: {
        username: userData.username,
        accountType: userData.account_type as AccountType,
        businessId: userData.instagram_business_account?.id,
        userId: req.user!.id,
        accessToken: tokenData.access_token,
        tokenExpiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        lastRefreshed: new Date()
      }
    });

    res.status(200).json({
      success: true,
      account: {
        id: newAccount.id,
        username: newAccount.username,
        accountType: newAccount.accountType
      }
    });

  } catch (error) {
    logger.error('Instagram connection error', { 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
    res.status(500).json({ error: 'Failed to connect Instagram account' });
  }
};

export const disconnectInstagram = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { accountId } = req.params;

    const account = await prisma.instagramAccount.findFirst({
      where: {
        id: accountId,
        userId: req.user!.id
      }
    });

    if (!account) {
      res.status(404).json({ error: 'Instagram account not found' });
      return;
    }

    await prisma.instagramAccount.delete({
      where: { id: accountId }
    });

    res.status(200).json({ message: 'Instagram account disconnected successfully' });
  } catch (error) {
    logger.error('Instagram disconnection error', { error });
    res.status(500).json({ error: 'Failed to disconnect Instagram account' });
  }
};
