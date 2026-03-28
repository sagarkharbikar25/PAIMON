const router = require('express').Router();
const { testProtect: protect } = require('../middleware/testAuth.middleware');
const { createItinerary } = require('../controllers/itinerary.controller');

router.post('/generate', protect, createItinerary);

module.exports = router;