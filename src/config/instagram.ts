export const instagramConfig = {
  clientId: process.env.INSTAGRAM_CLIENT_ID || '',
  clientSecret: process.env.INSTAGRAM_CLIENT_SECRET || '',
  redirectUri: 'https://mosh.ngrok.app/auth/instagram/callback',
  baseUrl: 'https://graph.facebook.com',
  graphApiVersion: 'v17.0',
  webhookVerifyToken: process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN || '',
  tokenEncryptionKey: process.env.INSTAGRAM_TOKEN_ENCRYPTION_KEY || '',
  scopes: [
    'instagram_business_basic',
    'instagram_business_manage_messages',
    'instagram_business_manage_comments',
    'instagram_business_content_publish',
    'instagram_business_manage_insights'
  ],

  getAccessTokenUrl(): string {
    return `${this.baseUrl}/${this.graphApiVersion}/oauth/access_token`;
  },

  getTokenExchangeBody(code: string): URLSearchParams {
    return new URLSearchParams({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: 'authorization_code',
      redirect_uri: this.redirectUri,
      code: code
    });
  },

  getLongLivedTokenUrl(shortLivedToken: string): string {
    return `${this.baseUrl}/${this.graphApiVersion}/oauth/access_token?grant_type=fb_exchange_token&client_id=${this.clientId}&client_secret=${this.clientSecret}&fb_exchange_token=${shortLivedToken}`;
  },

  getUserInfoUrl(accessToken: string): string {
    return `${this.baseUrl}/${this.graphApiVersion}/me?fields=id,username,account_type,instagram_business_account&access_token=${accessToken}`;
  },

  getWebhookUrl(): string {
    return 'https://mosh.ngrok.app/api/webhooks/instagram';
  },

  // Required environment variables validation
  validateConfig(): void {
    const requiredVars = [
      'INSTAGRAM_CLIENT_ID',
      'INSTAGRAM_CLIENT_SECRET',
      'INSTAGRAM_WEBHOOK_VERIFY_TOKEN',
      'INSTAGRAM_TOKEN_ENCRYPTION_KEY'
    ];

    requiredVars.forEach(varName => {
      if (!process.env[varName]) {
        throw new Error(`Missing required environment variable: ${varName}`);
      }
    });
  }
};

// Validate configuration on startup
instagramConfig.validateConfig();
