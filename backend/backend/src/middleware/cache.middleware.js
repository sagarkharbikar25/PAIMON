const { redisGet, redisSet } = require('../config/redis');

const cache = (ttl = 60) => async (req, res, next) => {
  if (req.method !== 'GET') return next();
  const key = `route:${req.user?._id}:${req.originalUrl}`;
  const cached = await redisGet(key);
  if (cached) return res.json({ ...cached, __cached: true });
  const originalJson = res.json.bind(res);
  res.json = async (data) => {
    if (res.statusCode === 200) await redisSet(key, data, ttl);
    originalJson(data);
  };
  next();
};

module.exports = { cache };