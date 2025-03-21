interface InstagramConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  baseUrl: string;
  apiVersion: string;
  scopes: string[];
  tokenRefreshInterval: number; // milliseconds
  tokenExpirationBuffer: number; // milliseconds
}

export const instagramConfig: InstagramConfig = {
  clientId: process.env.INSTAGRAM_CLIENT_ID || '',
  clientSecret: process.env.INSTAGRAM_CLIENT_SECRET || '',
  redirectUri: process.env.INSTAGRAM_REDIRECT_URI || 'http://localhost:3000/auth/instagram/callback',
  baseUrl: 'https://graph.instagram.com',
  apiVersion: 'v12.0',
  scopes: [
    'instagram_business_basic',
    'instagram_business_manage_messages',
    'instagram_business_manage_comments',
    'instagram_business_content_publish',
    'instagram_business_manage_insights'
  ],
  tokenRefreshInterval: 24 * 60 * 60 * 1000, // 24 hours
  tokenExpirationBuffer: 60 * 60 * 1000, // 1 hour
};

// Required environment variables
const requiredEnvVars = [
  'INSTAGRAM_CLIENT_ID',
  'INSTAGRAM_CLIENT_SECRET',
  'INSTAGRAM_REDIRECT_URI',
  'INSTAGRAM_TOKEN_ENCRYPTION_KEY',
] as const;

// Type-safe check for required environment variables
requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});

// Validate encryption key length
const encryptionKey = process.env.INSTAGRAM_TOKEN_ENCRYPTION_KEY;
if (!encryptionKey || Buffer.from(encryptionKey).length !== 32) {
  throw new Error('INSTAGRAM_TOKEN_ENCRYPTION_KEY must be a 32-byte string');
}

export const getInstagramAuthUrl = (): string => {
  const params = new URLSearchParams({
    client_id: instagramConfig.clientId,
    redirect_uri: instagramConfig.redirectUri,
    scope: instagramConfig.scopes.join(','),
    response_type: 'code',
    enable_fb_login: '0',
    force_authentication: '1'
  });

  return `https://www.instagram.com/oauth/authorize?${params.toString()}`;
};
