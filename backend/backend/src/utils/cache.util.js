const NodeCache = require('node-cache');
const responseCache = new NodeCache({ stdTTL: 300 });

const cacheMiddleware = (ttl = 300) => (req, res, next) => {
  if (req.method !== 'GET') return next();
  const key = `${req.user?._id}_${req.originalUrl}`;
  const cached = responseCache.get(key);
  if (cached) return res.json({ ...cached, fromCache: true });
  const originalJson = res.json.bind(res);
  res.json = (data) => { responseCache.set(key, data, ttl); originalJson(data); };
  next();
};

module.exports = { cacheMiddleware };