const { Router } = require('express');
const { asyncHandler, createRateLimiter } = require('../../lib/core');
const { db } = require('../../lib/knex/knex');

const logRouter = Router();
const logLimiter = createRateLimiter({ windowMs: 60_000, max: 30, message: 'Log rate limit exceeded.' });

logRouter.post('/', logLimiter, asyncHandler(async (req, res) => {
  const { action } = req.body || {};
  await db('audit_logs').insert({
    action_type: String(action?.type || 'UNKNOWN').slice(0, 120),
    payload: JSON.stringify({ type: action?.type || 'UNKNOWN' }),
  });
  return res.status(200).json({ success: true });
}));

module.exports = { logRouter };
