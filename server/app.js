const express = require('express');
const cors = require('cors');
const { env } = require('./lib/config/env');
const { securityHeaders, correlationId, createRateLimiter, errorHandler } = require('./lib/core');
const { routes } = require('./routes');

function createApp() {
  const app = express();
  app.set('trust proxy', 1);
  app.use(securityHeaders);
  app.use(cors({ origin: env.cors.origins, credentials: true }));
  app.use(express.json({ limit: '5mb' }));
  app.use(correlationId);
  app.use('/api', createRateLimiter({ windowMs: 60_000, max: 120 }), routes);
  app.use(errorHandler);
  return app;
}

module.exports = { createApp };

