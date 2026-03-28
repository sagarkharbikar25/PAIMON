const router = require('express').Router();
const { testProtect: protect } = require('../middleware/testAuth.middleware');
const { triggerBudgetAlert, triggerWeatherAlert, triggerTripReminder } = require('../controllers/notification.controller');

router.post('/budget',   protect, triggerBudgetAlert);
router.post('/weather',  protect, triggerWeatherAlert);
router.post('/reminder', protect, triggerTripReminder);

module.exports = router;