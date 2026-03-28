const admin = require('../config/firebase');
const User  = require('../models/user.model');
const { getRedis } = require('../config/redis');

const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const redis = await getRedis();
    const cacheKey = `jwt:${token.slice(-32)}`;

    // 1. Verify token — use Redis cache to avoid hitting Firebase every request
    let decoded;
    const cachedToken = await redis.get(cacheKey);
    if (cachedToken) {
      decoded = JSON.parse(cachedToken);
    } else {
      decoded = await admin.auth().verifyIdToken(token);
      await redis.setEx(cacheKey, 300, JSON.stringify(decoded));
    }

    // 2. Get user — also cached so MongoDB isn't hit on every request
    const userKey = `user:${decoded.uid}`;
    const cachedUser = await redis.get(userKey);
    if (cachedUser) {
      req.user = JSON.parse(cachedUser);
      return next();
    }

    let user = await User.findOne({ firebaseUid: decoded.uid });
    if (!user) {
      user = await User.create({
        firebaseUid: decoded.uid,
        email:       decoded.email,
        name:        decoded.name || decoded.email.split('@')[0],
        photoUrl:    decoded.picture || '',
      });
    }
    await redis.setEx(userKey, 300, JSON.stringify(user.toObject()));
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = { protect };