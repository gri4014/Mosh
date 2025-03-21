export interface InstagramTokenResponse {
  access_token: string;
  user_id: string;
}

export interface InstagramUserResponse {
  id: string;
  username: string;
  account_type: 'PERSONAL' | 'BUSINESS' | 'CREATOR';
}
