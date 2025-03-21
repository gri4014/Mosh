import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { PrismaClient } from '@prisma/client';
import { logger } from '../../utils/logger';

const prisma = new PrismaClient();

// Instagram tokens should be encrypted at rest using a 32-byte key
const ENCRYPTION_KEY = process.env.INSTAGRAM_TOKEN_ENCRYPTION_KEY;
const MIN_KEY_LENGTH = 32;

if (!ENCRYPTION_KEY) {
  throw new Error('INSTAGRAM_TOKEN_ENCRYPTION_KEY is required');
}

let key: Buffer;
try {
  // Try to decode from base64 first
  key = Buffer.from(ENCRYPTION_KEY, 'base64');
} catch {
  // Fallback to raw string
  key = Buffer.from(ENCRYPTION_KEY);
}

if (key.length < MIN_KEY_LENGTH) {
  throw new Error(`INSTAGRAM_TOKEN_ENCRYPTION_KEY must be at least ${MIN_KEY_LENGTH} bytes when decoded`);
}

// Use only the first 32 bytes if key is longer
key = key.slice(0, MIN_KEY_LENGTH);

interface InstagramTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
}

interface TokenData {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
}

class InstagramTokenService {
  private static instance: InstagramTokenService;
  private algorithm = 'aes-256-cbc';

  private constructor() {}

  static getInstance(): InstagramTokenService {
    if (!this.instance) {
      this.instance = new InstagramTokenService();
    }
    return this.instance;
  }

  private encrypt(text: string): { encryptedData: string; iv: string } {
    const iv = randomBytes(16);
    const cipher = createCipheriv(
      this.algorithm,
      key,
      iv
    );
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return {
      encryptedData: encrypted,
      iv: iv.toString('hex')
    };
  }

  private decrypt(encryptedData: string, iv: string): string {
    const decipher = createDecipheriv(
      this.algorithm,
      key,
      Buffer.from(iv, 'hex')
    );
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  async storeTokens(userId: string, tokens: TokenData): Promise<void> {
    try {
      const { encryptedData: encryptedAccessToken, iv: accessTokenIv } = this.encrypt(
        tokens.accessToken
      );

      let encryptedRefreshToken: string | null = null;
      let refreshTokenIv: string | null = null;

      if (tokens.refreshToken) {
        const refreshTokenEncryption = this.encrypt(tokens.refreshToken);
        encryptedRefreshToken = refreshTokenEncryption.encryptedData;
        refreshTokenIv = refreshTokenEncryption.iv;
      }

      await prisma.instagramAccount.update({
        where: { userId },
        data: {
          accessToken: tokens.accessToken, // Keep unencrypted version for immediate use
          encryptedToken: JSON.stringify({
            access: { token: encryptedAccessToken, iv: accessTokenIv },
            refresh: refreshTokenIv
              ? { token: encryptedRefreshToken, iv: refreshTokenIv }
              : null
          }),
          refreshToken: tokens.refreshToken,
          tokenExpiresAt: tokens.expiresAt,
          lastRefreshed: new Date()
        }
      });
    } catch (error) {
      logger.error('Failed to store Instagram tokens', { error });
      throw new Error('Failed to store Instagram tokens');
    }
  }

  async getTokens(userId: string): Promise<TokenData | null> {
    try {
      const account = await prisma.instagramAccount.findUnique({
        where: { userId },
        select: {
          encryptedToken: true,
          tokenExpiresAt: true
        }
      });

      if (!account?.encryptedToken) {
        return null;
      }

      const tokenData = JSON.parse(account.encryptedToken);
      
      const accessToken = this.decrypt(
        tokenData.access.token,
        tokenData.access.iv
      );

      let refreshToken: string | undefined;
      if (tokenData.refresh) {
        refreshToken = this.decrypt(
          tokenData.refresh.token,
          tokenData.refresh.iv
        );
      }

      return {
        accessToken,
        refreshToken,
        expiresAt: account.tokenExpiresAt || undefined
      };
    } catch (error) {
      logger.error('Failed to retrieve Instagram tokens', { error });
      throw new Error('Failed to retrieve Instagram tokens');
    }
  }

  async isTokenExpired(userId: string): Promise<boolean> {
    try {
      const account = await prisma.instagramAccount.findUnique({
        where: { userId },
        select: { tokenExpiresAt: true }
      });

      if (!account?.tokenExpiresAt) {
        return true;
      }

      // Consider token expired if less than 1 hour remaining
      const expirationBuffer = 60 * 60 * 1000; // 1 hour in milliseconds
      return account.tokenExpiresAt.getTime() - expirationBuffer < Date.now();
    } catch (error) {
      logger.error('Failed to check token expiration', { error });
      throw new Error('Failed to check token expiration');
    }
  }

  async refreshAccessToken(userId: string): Promise<TokenData | null> {
    try {
      const currentTokens = await this.getTokens(userId);
      
      if (!currentTokens?.refreshToken) {
        return null;
      }

      const response = await fetch('https://api.instagram.com/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: currentTokens.refreshToken,
          client_id: process.env.INSTAGRAM_CLIENT_ID || '',
          client_secret: process.env.INSTAGRAM_CLIENT_SECRET || '',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh access token');
      }

      const data = await response.json() as InstagramTokenResponse;
      
      const newTokens: TokenData = {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: new Date(Date.now() + data.expires_in * 1000),
      };

      await this.storeTokens(userId, newTokens);
      
      return newTokens;
    } catch (error) {
      logger.error('Failed to refresh Instagram access token', { error });
      throw new Error('Failed to refresh Instagram access token');
    }
  }
}

export const instagramTokenService = InstagramTokenService.getInstance();
