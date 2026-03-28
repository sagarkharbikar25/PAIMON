const User = require('../models/user.model');

const testProtect = async (req, res, next) => {
  const uid = req.headers['x-test-uid'];
  if (!uid) return res.status(401).json({ message: 'No X-Test-UID header' });

  const user = await User.findOne({ firebaseUid: uid });
  if (!user) return res.status(404).json({ message: `No user found: ${uid}` });

  req.user = user;
  next();
};

module.exports = { testProtect };