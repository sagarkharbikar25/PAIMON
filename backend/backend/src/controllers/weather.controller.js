const { getWeather, getForecast, checkWeatherAlerts } = require('../services/weather.service');
const { AppError } = require('../middleware/error.middleware');

const getCurrentWeather  = async (req, res, next) => {
  try {
    if (!req.query.city) return next(new AppError('city required', 400));
    const weather = await getWeather(req.query.city);
    res.json({ success: true, weather });
  } catch (err) { next(err); }
};

const getForecastWeather = async (req, res, next) => {
  try {
    if (!req.query.city) return next(new AppError('city required', 400));
    const forecast = await getForecast(req.query.city);
    res.json({ success: true, forecast });
  } catch (err) { next(err); }
};

const getWeatherAlerts = async (req, res, next) => {
  try {
    if (!req.query.city) return next(new AppError('city required', 400));
    const alerts = await checkWeatherAlerts(req.query.city);
    res.json({ success: true, alerts });
  } catch (err) { next(err); }
};

module.exports = { getCurrentWeather, getForecastWeather, getWeatherAlerts };