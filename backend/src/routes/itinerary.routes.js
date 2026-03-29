const router  = require('express').Router();
const { protect } = require('../middleware/auth.middleware');
const { createItinerary } = require('../controllers/itinerary.controller');

router.post('/generate', protect, createItinerary);

module.exports = router;