require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const app = express();
const port = process.env.PORT || process.env.SERVER_PORT || 8080;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// In-memory stores for OTP and password reset
const otps = {};

// JWT helper for reset tokens
const JWT_SECRET = process.env.JWT_SECRET || 'otloha-session-secret-jwt-key';

function signToken(payload) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

function verifyToken(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;
    const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
    if (signature !== expectedSig) return null;
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch (e) {
    return null;
  }
}

// Logger endpoint
app.post('/api/logs', (req, res) => {
  const { action, newState } = req.body;
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ACTION: ${action?.type} | Action: ${JSON.stringify(action)} | New State: ${JSON.stringify(newState)}\n`;

  try {
    fs.appendFileSync(path.join(__dirname, 'app.log'), logMessage);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Failed to write to app.log:', err);
    res.status(500).json({ error: 'Failed to write log' });
  }
});

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send OTP endpoint
app.post('/api/auth/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  otps[email] = {
    code,
    expires: Date.now() + 5 * 60 * 1000,
  };

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your Otloha Verification Code',
    text: `Your verification code is: ${code}. It is valid for 5 minutes.`,
    html: `<p>Your verification code is: <strong>${code}</strong></p><p>It is valid for 5 minutes.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (error) {
    console.error('Failed to send email:', error);
    res.status(500).json({ error: 'Failed to send verification code' });
  }
});

// Verify OTP endpoint
app.post('/api/auth/verify-otp', (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) {
    return res.status(400).json({ error: 'Email and code are required' });
  }

  const record = otps[email];
  if (!record) {
    return res.status(400).json({ error: 'No verification code sent to this email' });
  }

  if (Date.now() > record.expires) {
    delete otps[email];
    return res.status(400).json({ error: 'Verification code expired' });
  }

  if (record.code !== code.trim()) {
    return res.status(400).json({ error: 'Invalid verification code' });
  }

  delete otps[email];
  res.json({ success: true });
});

// Forgot password endpoint
app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  const token = signToken({ email, exp: Date.now() + 60 * 60 * 1000, purpose: 'reset' });
  const origin = req.headers.origin || (req.get('host') && req.get('host').includes('localhost') ? 'http://localhost:3000' : 'https://otloha-app-185798045507.us-central1.run.app');
  const resetLink = `${origin}/reset-password?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Reset Password Request',
    text: `To reset your password, please click the following link: ${resetLink}. It is valid for 1 hour.`,
    html: `<p>To reset your password, please click the following link:</p><p><a href="${resetLink}">${resetLink}</a></p><p>It is valid for 1 hour.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (error) {
    console.error('Failed to send reset email:', error);
    res.status(500).json({ error: 'Failed to send reset email' });
  }
});

// Reset password endpoint
app.post('/api/auth/reset-password', (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) {
    return res.status(400).json({ error: 'Token and password are required' });
  }
  const payload = verifyToken(token);
  if (!payload || payload.purpose !== 'reset') {
    return res.status(400).json({ error: 'Invalid or expired password reset token' });
  }
  res.json({ success: true, email: payload.email });
});

// Google OAuth Login / Code Exchange
app.post('/api/auth/google-login', async (req, res) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ error: 'Code is required' });
  }

  const redirectUri = req.body.redirectUri || req.headers.origin || (req.get('host') && req.get('host').includes('localhost') ? 'http://localhost:3000' : 'https://otloha-app-185798045507.us-central1.run.app');

  try {
    const tokenRes = await fetch(process.env.GOOGLE_TOKEN_URI || 'https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID || '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenRes.ok) {
      const errorText = await tokenRes.text();
      console.error('Google token exchange error:', errorText);
      return res.status(tokenRes.status).json({ error: 'Failed to exchange Google code' });
    }

    const tokens = await tokenRes.json();

    const profileRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    if (!profileRes.ok) {
      return res.status(profileRes.status).json({ error: 'Failed to fetch Google profile' });
    }

    const profile = await profileRes.json();
    const userId = profile.email ? profile.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').toLowerCase() : `google_${profile.sub}`;

    return res.json({
      registered: false,
      id: userId,
      profile: {
        name: profile.name || '',
        email: profile.email || '',
        avatar: profile.picture || '',
        sub: profile.sub,
      },
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ error: 'Internal server error during Google login' });
  }
});

// Facebook OAuth Login / Code Exchange
app.post('/api/auth/facebook-login', async (req, res) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ error: 'Code is required' });
  }

  const redirectUri = req.body.redirectUri || req.headers.origin || (req.get('host') && req.get('host').includes('localhost') ? 'http://localhost:3000' : 'https://otloha-app-185798045507.us-central1.run.app');

  try {
    const tokenRes = await fetch('https://graph.facebook.com/v18.0/oauth/access_token?' + new URLSearchParams({
      client_id: process.env.FACEBOOK_APP_ID || '',
      redirect_uri: redirectUri,
      client_secret: process.env.FACEBOOK_APP_SECRET || '',
      code,
    }));

    if (!tokenRes.ok) {
      const errorText = await tokenRes.text();
      console.error('Facebook token exchange error:', errorText);
      return res.status(tokenRes.status).json({ error: 'Failed to exchange Facebook code' });
    }

    const tokenData = await tokenRes.json();

    const profileRes = await fetch('https://graph.facebook.com/me?fields=id,name,email,picture.width(400).height(400)&access_token=' + tokenData.access_token);
    if (!profileRes.ok) {
      return res.status(profileRes.status).json({ error: 'Failed to fetch Facebook profile' });
    }

    const profile = await profileRes.json();
    const userId = profile.email ? profile.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').toLowerCase() : `fb_${profile.id}`;

    return res.json({
      registered: false,
      id: userId,
      profile: {
        name: profile.name || '',
        email: profile.email || '',
        avatar: profile.picture?.data?.url || '',
      },
    });
  } catch (error) {
    console.error('Facebook login error:', error);
    res.status(500).json({ error: 'Internal server error during Facebook login' });
  }
});

// Twitter OAuth Login / Code Exchange
app.post('/api/auth/twitter-login', async (req, res) => {
  const { code, codeVerifier } = req.body;
  if (!code || !codeVerifier) {
    return res.status(400).json({ error: 'Code and codeVerifier are required' });
  }

  const redirectUri = req.body.redirectUri || req.headers.origin || (req.get('host') && req.get('host').includes('localhost') ? 'http://localhost:3000' : 'https://otloha-app-185798045507.us-central1.run.app');

  try {
    const authHeader = 'Basic ' + Buffer.from(`${process.env.TWITTER_CLIENT_ID || ''}:${process.env.TWITTER_CLIENT_SECRET || ''}`).toString('base64');

    const tokenRes = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': authHeader,
      },
      body: new URLSearchParams({
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      }),
    });

    if (!tokenRes.ok) {
      const errorText = await tokenRes.text();
      console.error('Twitter token exchange error:', errorText);
      return res.status(tokenRes.status).json({ error: 'Failed to exchange Twitter code' });
    }

    const tokenData = await tokenRes.json();

    const profileRes = await fetch('https://api.twitter.com/2/users/me?user.fields=profile_image_url,description', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    if (!profileRes.ok) {
      return res.status(profileRes.status).json({ error: 'Failed to fetch Twitter profile' });
    }

    const profile = await profileRes.json();
    const userId = profile.data?.username ? profile.data.username.toLowerCase() : `twitter_${profile.data?.id}`;

    return res.json({
      registered: false,
      id: userId,
      profile: {
        name: profile.data?.name || '',
        email: profile.data?.username ? `${profile.data.username}@twitter.com` : '',
        avatar: (profile.data?.profile_image_url || '').replace('_normal', ''),
      },
    });
  } catch (error) {
    console.error('Twitter login error:', error);
    res.status(500).json({ error: 'Internal server error during Twitter login' });
  }
});

// Serve frontend static build
app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
