const { Router } = require('express');
const { authRouter } = require('./app/auth/routes');
const { logRouter } = require('./app/audit-log/routes');

const routes = Router();
routes.get('/health', (_req, res) => res.json({ status: 'ok', service: 'otloha', timestamp: new Date().toISOString() }));
routes.use('/auth', authRouter);
routes.use('/logs', logRouter);

module.exports = { routes };

