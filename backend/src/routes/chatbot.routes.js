const router = require('express').Router();
const { testProtect: protect } = require('../middleware/testAuth.middleware');
const { askQuestion } = require('../controllers/chatbot.controller');

router.post('/ask', protect, askQuestion);

module.exports = router;