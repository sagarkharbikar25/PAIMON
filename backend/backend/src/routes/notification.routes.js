const router = require('express').Router();
const { protect } = require('../middleware/auth.middleware');
const { triggerBudgetAlert, triggerWeatherAlert, triggerTripReminder } = require('../controllers/notification.controller');

router.post('/budget',   protect, triggerBudgetAlert);
router.post('/weather',  protect, triggerWeatherAlert);
router.post('/reminder', protect, triggerTripReminder);

module.exports = router;