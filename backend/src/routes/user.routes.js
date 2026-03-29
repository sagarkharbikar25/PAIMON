/* =============================================
   user.routes.js
   Pravas — User Routes
   ============================================= */

const router = require('express').Router();
const { protect } = require('../middleware/auth.middleware'); // Import your JWT middleware
const { getUserProfile, updateProfile, updatePhotoUrl } = require('../controllers/user.controller');

// Public endpoint (optional, for user lookup if needed)
router.get('/me', protect, getUserProfile);
router.put('/me', protect, updateProfile);
router.patch('/photo', protect, updatePhotoUrl);

module.exports = router;