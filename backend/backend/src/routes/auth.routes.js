const router = require('express').Router();
const { protect } = require('../middleware/auth.middleware');
const { syncUser, getMe, updateProfile } = require('../controllers/auth.controller');

router.post('/sync',   protect, syncUser);
router.get('/me',      protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;