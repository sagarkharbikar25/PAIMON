const User = require('../models/user.model');

const syncUser = async (req, res) => {
  try {
    const { fcmToken } = req.body;
    if (fcmToken) await User.findByIdAndUpdate(req.user._id, { fcmToken });
    res.json({ success: true, user: req.user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMe = (req, res) => res.json({ success: true, user: req.user });

const updateProfile = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.user._id, { name: req.body.name, preferences: req.body.preferences },
      { new: true }
    );
    res.json({ success: true, user: updated });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { syncUser, getMe, updateProfile };