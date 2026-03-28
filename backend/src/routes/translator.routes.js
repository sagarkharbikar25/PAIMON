const router = require('express').Router();
const { testProtect: protect } = require('../middleware/testAuth.middleware');
const { translateText, wordMeaning } = require('../controllers/translator.controller');

router.post('/text',         protect, translateText);
router.get('/word-meaning',  protect, wordMeaning);

module.exports = router;