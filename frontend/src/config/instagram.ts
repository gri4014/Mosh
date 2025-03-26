interface InstagramConfig {
  clientId: string;
  redirectUri: string;
  getAuthUrl: () => string;
}

const instagramConfig: InstagramConfig = {
  clientId: process.env.REACT_APP_INSTAGRAM_CLIENT_ID || '',
  redirectUri: `${process.env.REACT_APP_API_URL}/api/instagram/connect/callback`,
  
  getAuthUrl: function() {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: 'basic,instagram_content_publish',
      response_type: 'code'
    });
    
    return `https://api.instagram.com/oauth/authorize?${params.toString()}`;
  }
};

export { instagramConfig };
export type { InstagramConfig };
