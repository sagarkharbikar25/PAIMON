const router = require('express').Router();
const { testProtect: protect } = require('../middleware/testAuth.middleware');
const { nearbyPlaces, searchPlaces, offlineTile } = require('../controllers/maps.controller');

router.get('/nearby',        protect, nearbyPlaces);
router.get('/search',        protect, searchPlaces);
router.get('/offline-tile',  protect, offlineTile);

module.exports = router;