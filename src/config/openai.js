export const openaiConfig = {
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID,
  // Model configurations
  textModel: 'gpt-4-turbo-preview',
  imageModel: 'dall-e-3',
  // Default parameters
  temperature: 0.7,
  maxTokens: 2000,
  imageSize: '1024x1024',
  imageQuality: 'standard',
  imageStyle: 'natural',
};
