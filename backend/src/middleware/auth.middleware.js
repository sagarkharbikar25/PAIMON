/* =============================================
   auth.middleware.js
   Pravas — JWT Protect Middleware
   ============================================= */

const jwt  = require('jsonwebtoken');
const User = require('../models/user.model');

const protect = async (req, res, next) => {
  try {
    /* 1. Pull token from Authorization: Bearer <token> */
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer '))
      return res.status(401).json({ message: 'No token provided.' });

    const token = authHeader.split('Bearer ')[1];

    /* 2. Verify signature + expiry */
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ message: 'Invalid or expired token.' });
    }

    /* 3. Find user in MongoDB */
    const user = await User.findById(decoded.id);
    if (!user)
      return res.status(401).json({ message: 'User no longer exists.' });

    req.user = user;
    next();
  } catch (err) {
    console.error('protect middleware error:', err);
    return res.status(500).json({ message: 'Server error in auth check.' });
  }
};

module.exports = { protect };