/* =============================================
   auth.routes.js
   Pravas — Auth Routes
   ============================================= */

const router  = require('express').Router();
const { protect } = require('../middleware/auth.middleware');
const {
  register,
  login,
  syncUser,
  getMe,
  updateProfile,
} = require('../controllers/auth.controller');

/* ── Public routes (no token needed) ── */
router.post('/register', register);
router.post('/login',    login);

/* ── Protected routes (JWT required) ── */
router.post('/sync',    protect, syncUser);
router.get('/me',       protect, getMe);
router.put('/profile',  protect, updateProfile);

module.exports = router;