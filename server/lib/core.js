const crypto = require('crypto');
const { cacheProvider } = require('./cache/init.js');

class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

function errorHandler(err, req, res, _next) {
  const appErr = err instanceof AppError ? err : new AppError(err.message || 'Server error', err.statusCode || 500, false);
  console.error(JSON.stringify({ timestamp: new Date().toISOString(), level: 'ERROR', message: appErr.message, path: req.originalUrl }));
  return res.status(appErr.isOperational ? appErr.statusCode : 500).json({ error: appErr.isOperational ? appErr.message : 'Internal server error' });
}

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

function securityHeaders(_req, res, next) {
  res.removeHeader('X-Powered-By');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
}

function correlationId(req, res, next) {
  const id = String(req.headers['x-correlation-id'] || crypto.randomUUID());
  res.setHeader('X-Correlation-Id', id);
  next();
}

function createRateLimiter({ windowMs = 60_000, max = 100, message = 'Too many requests.', prefix = 'otloha:rl' } = {}) {
  const windowSec = Math.max(1, Math.ceil(windowMs / 1000));
  return async (req, res, next) => {
    const key = `${prefix}:${req.ip || 'unknown'}`;
    try {
      const count = await cacheProvider.incr(key);
      if (count === 1) await cacheProvider.expire(key, windowSec);
      if (count > max) return res.status(429).json({ error: message });
    } catch (err) {
      console.warn('[rate-limit] Redis unavailable, failing open:', err.message);
    }
    next();
  };
}

module.exports = { AppError, errorHandler, asyncHandler, securityHeaders, correlationId, createRateLimiter };

