const router = require('express').Router();
const { testProtect: protect } = require('../middleware/testAuth.middleware');
const { getCurrentWeather, getForecastWeather, getWeatherAlerts } = require('../controllers/weather.controller');

router.get('/current',  protect, getCurrentWeather);
router.get('/forecast', protect, getForecastWeather);
router.get('/alerts',   protect, getWeatherAlerts);

module.exports = router;