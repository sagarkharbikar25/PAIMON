const router  = require('express').Router();
const { protect } = require('../middleware/auth.middleware');
const { askQuestion } = require('../controllers/chatbot.controller');

router.post('/ask', protect, askQuestion);

module.exports = router;