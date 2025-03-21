interface InstagramConfig {
  clientId: string;
  redirectUri: string;
  baseUrl: string;
  apiVersion: string;
  scopes: string[];
}

if (!process.env.REACT_APP_INSTAGRAM_CLIENT_ID) {
  console.warn('REACT_APP_INSTAGRAM_CLIENT_ID is not defined in environment variables');
}

if (!process.env.REACT_APP_INSTAGRAM_REDIRECT_URI) {
  console.warn('REACT_APP_INSTAGRAM_REDIRECT_URI is not defined in environment variables');
}

export const instagramConfig: InstagramConfig = {
  clientId: '28944675988512536',
  // Match the URL from Meta Developer Console
  redirectUri: 'https://989d-128-237-82-86.ngrok-free.app/auth/instagram/callback',
  baseUrl: 'https://graph.instagram.com',
  apiVersion: 'v12.0',
  scopes: [
    'instagram_business_basic',
    'instagram_business_manage_messages',
    'instagram_business_manage_comments',
    'instagram_business_content_publish',
    'instagram_business_manage_insights'
  ],
};

export const getInstagramAuthUrl = (): string => {
  const params = new URLSearchParams({
    enable_fb_login: '0',
    force_authentication: '1',
    client_id: instagramConfig.clientId,
    redirect_uri: instagramConfig.redirectUri,
    response_type: 'code',
    scope: instagramConfig.scopes.join(',')
  });

  return `https://www.instagram.com/oauth/authorize?${params.toString()}`;
};
