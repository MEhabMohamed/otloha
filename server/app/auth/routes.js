const { Router } = require('express');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { AppError, asyncHandler, createRateLimiter } = require('../../lib/core');
const { env } = require('../../lib/config/env');
const { db } = require('../../lib/knex/knex');
const { signJwt, verifyJwt, generateSecureOtp } = require('../../pkg/crypto/tokens');
const { createMailer } = require('../../pkg/mailer/nodemailer');

const authRouter = Router();
const mailer = createMailer(env.email);
const MAX_OTP_ATTEMPTS = 5;

const otpLimiter = createRateLimiter({ windowMs: 15 * 60_000, max: 10, message: 'Too many verification attempts.' });
const oauthLimiter = createRateLimiter({ windowMs: 15 * 60_000, max: 20, message: 'Too many OAuth attempts.' });
const logPath = path.join(__dirname, '../../../app.log');

function resolveRedirectUri(req) {
  return req.body.redirectUri || req.headers.origin || env.publicOrigin;
}

authRouter.post('/send-otp', otpLimiter, asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())) {
    throw new AppError('Valid email is required', 400);
  }
  const normalized = String(email).trim().toLowerCase();
  const code = generateSecureOtp();
  const expiresAt = new Date(Date.now() + 5 * 60_000);
  await db('otps')
    .insert({ email: normalized, code, attempts: 0, expires_at: expiresAt })
    .onConflict('email')
    .merge(['code', 'attempts', 'expires_at']);

  await mailer.sendMail({
    to: normalized,
    subject: 'Your Otloha Verification Code',
    text: `Your verification code is: ${code}. It is valid for 5 minutes.`,
    html: `<p>Your verification code is: <strong>${code}</strong></p><p>It is valid for 5 minutes.</p>`,
  });
  res.json({ success: true });
}));

authRouter.post('/verify-otp', otpLimiter, asyncHandler(async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) throw new AppError('Email and code are required', 400);

  const normalized = String(email).trim().toLowerCase();
  const record = await db('otps').where({ email: normalized }).first();
  if (!record) throw new AppError('No verification code sent to this email', 400);
  if (Date.now() > new Date(record.expires_at).getTime()) {
    await db('otps').where({ email: normalized }).del();
    throw new AppError('Verification code expired', 400);
  }
  const nextAttempts = record.attempts + 1;
  if (nextAttempts > MAX_OTP_ATTEMPTS) {
    await db('otps').where({ email: normalized }).del();
    throw new AppError('Too many failed attempts. Please request a new code.', 429);
  }
  const supplied = Buffer.from(String(code).trim());
  const expected = Buffer.from(record.code);
  if (supplied.length !== expected.length || !crypto.timingSafeEqual(supplied, expected)) {
    await db('otps').where({ email: normalized }).update({ attempts: nextAttempts });
    throw new AppError('Invalid verification code', 400);
  }
  await db('otps').where({ email: normalized }).del();
  return res.json({ success: true });
}));

authRouter.post('/forgot-password', otpLimiter, asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new AppError('Email is required', 400);
  const token = signJwt({ email: String(email).trim().toLowerCase(), purpose: 'reset' }, env.auth.jwtSecret, 60 * 60_000);
  const origin = req.headers.origin || env.publicOrigin;
  const resetLink = `${origin}/reset-password?token=${token}`;

  await mailer.sendMail({
    to: email,
    subject: 'Reset Password Request',
    text: `To reset your password, please click: ${resetLink}. Valid for 1 hour.`,
    html: `<p>To reset your password, please click:</p><p><a href="${resetLink}">${resetLink}</a></p><p>Valid for 1 hour.</p>`,
  });
  res.json({ success: true });
}));

authRouter.post('/reset-password', otpLimiter, (req, res, next) => {
  const { token, password } = req.body;
  if (!token || !password) return next(new AppError('Token and password are required', 400));
  const payload = verifyJwt(token, env.auth.jwtSecret);
  if (!payload || payload.purpose !== 'reset') {
    return next(new AppError('Invalid or expired password reset token', 400));
  }
  return res.json({ success: true, email: payload.email });
});

authRouter.post('/google-login', oauthLimiter, asyncHandler(async (req, res) => {
  const { code } = req.body;
  if (!code) throw new AppError('Code is required', 400);
  const redirectUri = resolveRedirectUri(req);

  const tokenRes = await fetch(env.oauth.googleTokenUri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: env.oauth.googleClientId,
      client_secret: env.oauth.googleClientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  });
  if (!tokenRes.ok) throw new AppError('Failed to exchange Google code', tokenRes.status);
  const tokens = await tokenRes.json();

  const profileRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });
  if (!profileRes.ok) throw new AppError('Failed to fetch Google profile', profileRes.status);
  const profile = await profileRes.json();
  const userId = profile.email ? profile.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').toLowerCase() : `google_${profile.sub}`;
  return res.json({
    registered: false,
    id: userId,
    profile: { name: profile.name || '', email: profile.email || '', avatar: profile.picture || '', sub: profile.sub },
  });
}));

authRouter.post('/facebook-login', oauthLimiter, asyncHandler(async (req, res) => {
  const { code } = req.body;
  if (!code) throw new AppError('Authorization code is required', 400);
  if (!env.oauth.facebookAppId || !env.oauth.facebookAppSecret) {
    throw new AppError('Facebook OAuth is not configured on the server', 503);
  }
  const redirectUri = resolveRedirectUri(req);
  let tokenRes = await fetch('https://graph.facebook.com/v18.0/oauth/access_token?' + new URLSearchParams({
    client_id: env.oauth.facebookAppId,
    redirect_uri: redirectUri,
    client_secret: env.oauth.facebookAppSecret,
    code,
  }));
  if (!tokenRes.ok) {
    const altUri = redirectUri.endsWith('/') ? redirectUri.slice(0, -1) : `${redirectUri}/`;
    tokenRes = await fetch('https://graph.facebook.com/v18.0/oauth/access_token?' + new URLSearchParams({
      client_id: env.oauth.facebookAppId,
      redirect_uri: altUri,
      client_secret: env.oauth.facebookAppSecret,
      code,
    }));
  }
  if (!tokenRes.ok) throw new AppError('Failed to obtain Facebook access token', 400);
  const { access_token: accessToken } = await tokenRes.json();

  const profileRes = await fetch(`https://graph.facebook.com/me?fields=id,name,email,picture.width(400).height(400)&access_token=${encodeURIComponent(accessToken)}`);
  if (!profileRes.ok) throw new AppError('Failed to fetch Facebook profile', profileRes.status);
  const profile = await profileRes.json();
  const userId = profile.email ? profile.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').toLowerCase() : `fb_${profile.id}`;
  return res.json({
    registered: false,
    id: userId,
    profile: { name: profile.name || '', email: profile.email || '', avatar: profile.picture?.data?.url || '' },
  });
}));

authRouter.post('/twitter-login', oauthLimiter, asyncHandler(async (req, res) => {
  const { code, codeVerifier } = req.body;
  if (!code || !codeVerifier) throw new AppError('Code and codeVerifier are required', 400);
  const redirectUri = resolveRedirectUri(req);
  const authHeader = 'Basic ' + Buffer.from(`${env.oauth.twitterClientId}:${env.oauth.twitterClientSecret}`).toString('base64');

  const tokenRes = await fetch('https://api.twitter.com/2/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: authHeader },
    body: new URLSearchParams({ code, grant_type: 'authorization_code', redirect_uri: redirectUri, code_verifier: codeVerifier }),
  });
  if (!tokenRes.ok) throw new AppError('Failed to exchange Twitter code', tokenRes.status);
  const tokenData = await tokenRes.json();

  const profileRes = await fetch('https://api.twitter.com/2/users/me?user.fields=profile_image_url,description', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  if (!profileRes.ok) throw new AppError('Failed to fetch Twitter profile', profileRes.status);
  const profile = await profileRes.json();
  const userId = profile.data?.username ? profile.data.username.toLowerCase() : `twitter_${profile.data?.id}`;
  return res.json({
    registered: false,
    id: userId,
    profile: { name: profile.data?.name || '', email: '', avatar: profile.data?.profile_image_url || '' },
  });
}));

authRouter.post('/request-data-deletion', otpLimiter, (req, res, next) => {
  const { email, provider, reason } = req.body;
  if (!email) return next(new AppError('Email is required', 400));
  const confirmationCode = 'DEL-' + crypto.randomBytes(3).toString('hex').toUpperCase();
  const line = `[${new Date().toISOString()}] DATA_DELETION_REQUEST | Email: ${email} | Provider: ${provider || 'unknown'} | Reason: ${String(reason || 'N/A').slice(0, 200)} | Code: ${confirmationCode}\n`;
  fs.appendFile(logPath, line, () => {});
  return res.json({
    success: true,
    confirmationCode,
    message: 'Data deletion request registered successfully. All associated data will be deleted within 30 days.',
  });
});

authRouter.post('/facebook-data-deletion', otpLimiter, (req, res) => {
  const confirmationCode = 'FB-DEL-' + crypto.randomBytes(3).toString('hex').toUpperCase();
  const origin = req.headers.origin || env.publicOrigin;
  const statusUrl = `${origin}/user-data-deletion?code=${confirmationCode}`;
  fs.appendFile(logPath, `[${new Date().toISOString()}] META_DATA_DELETION_CALLBACK | Code: ${confirmationCode}\n`, () => {});
  return res.json({ url: statusUrl, confirmation_code: confirmationCode });
});

module.exports = { authRouter };
