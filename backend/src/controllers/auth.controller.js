/* =============================================
   auth.controller.js
   Pravas — Auth Controller
   ============================================= */

const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const User   = require('../models/user.model');

/* ── Helper: sign a JWT ──────────────────────── */
function signToken(userId) {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

/* ─────────────────────────────────────────────
   POST /api/auth/register
   Body: { name, email, password }
   ───────────────────────────────────────────── */
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    /* Basic validation */
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Name, email and password are required.' });

    if (password.length < 8)
      return res.status(400).json({ message: 'Password must be at least 8 characters.' });

    /* Check duplicate */
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing)
      return res.status(409).json({ message: 'An account with this email already exists.' });

    /* Hash password and create user */
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      firebaseUid: `local_${Date.now()}`, // placeholder so the unique index is satisfied
      name,
      email:    email.toLowerCase(),
      password: hashedPassword,
    });

    const token = signToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id:      user._id,
        name:     user.name,
        email:    user.email,
        photoUrl: user.photoUrl,
      },
    });
  } catch (err) {
    console.error('register error:', err);
    res.status(500).json({ message: err.message });
  }
};

/* ─────────────────────────────────────────────
   POST /api/auth/login
   Body: { email, password }
   ───────────────────────────────────────────── */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required.' });

    /* Find user — explicitly select password (it's not selected by default) */
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !user.password)
      return res.status(401).json({ message: 'Incorrect email or password.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: 'Incorrect email or password.' });

    const token = signToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        _id:      user._id,
        name:     user.name,
        email:    user.email,
        photoUrl: user.photoUrl,
      },
    });
  } catch (err) {
    console.error('login error:', err);
    res.status(500).json({ message: err.message });
  }
};

/* ─────────────────────────────────────────────
   POST /api/auth/sync  (kept for Firebase later)
   ───────────────────────────────────────────── */
const syncUser = async (req, res) => {
  try {
    const { fcmToken } = req.body;
    if (fcmToken) await User.findByIdAndUpdate(req.user._id, { fcmToken });
    res.json({ success: true, user: req.user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ─────────────────────────────────────────────
   GET /api/auth/me
   ───────────────────────────────────────────── */
const getMe = (req, res) => res.json({ success: true, user: req.user });

/* ─────────────────────────────────────────────
   PUT /api/auth/profile
   ───────────────────────────────────────────── */
const updateProfile = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { name: req.body.name, preferences: req.body.preferences },
      { new: true }
    );
    res.json({ success: true, user: updated });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { register, login, syncUser, getMe, updateProfile };