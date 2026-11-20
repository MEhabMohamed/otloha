const crypto = require('crypto');
require('dotenv').config();

const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv === 'production';

function resolveJwtSecret() {
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.trim().length >= 16) {
    return process.env.JWT_SECRET.trim();
  }
  if (isProd) throw new Error('FATAL: JWT_SECRET must be set (min 16 chars) in production.');
  console.warn('[CONFIG] JWT_SECRET not set; using ephemeral dev secret.');
  return crypto.randomBytes(32).toString('hex');
}

function parseOrigins(raw) {
  if (!raw) return ['http://localhost:3000', 'http://localhost:5000'];
  return raw.split(',').map((o) => o.trim()).filter(Boolean);
}

module.exports = {
  env: {
    nodeEnv,
    isProd,
    port: parseInt(process.env.PORT || process.env.SERVER_PORT || '5000', 10),
    db: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'otloha_db',
    },
    publicOrigin: process.env.PUBLIC_ORIGIN || 'http://localhost:3000',
    auth: { jwtSecret: resolveJwtSecret() },
    email: { user: process.env.EMAIL_USER || '', pass: process.env.EMAIL_PASS || '' },
    oauth: {
      googleTokenUri: process.env.GOOGLE_TOKEN_URI || 'https://oauth2.googleapis.com/token',
      googleClientId: process.env.GOOGLE_CLIENT_ID || '',
      googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      facebookAppId: process.env.FACEBOOK_APP_ID || '',
      facebookAppSecret: process.env.FACEBOOK_APP_SECRET || '',
      twitterClientId: process.env.TWITTER_CLIENT_ID || '',
      twitterClientSecret: process.env.TWITTER_CLIENT_SECRET || '',
    },
    cors: { origins: parseOrigins(process.env.CORS_ORIGINS) },
  },
};
