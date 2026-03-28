const { sendBudgetAlert, sendWeatherAlerts, sendTripReminder } = require('../services/notification.service');
const { AppError } = require('../middleware/error.middleware');

const triggerBudgetAlert  = async (req, res, next) => {
  try {
    await sendBudgetAlert(req.user._id, req.body);
    res.json({ success: true });
  } catch (err) { next(err); }
};

const triggerWeatherAlert = async (req, res, next) => {
  try {
    await sendWeatherAlerts(req.user._id, req.body.destination);
    res.json({ success: true });
  } catch (err) { next(err); }
};

const triggerTripReminder = async (req, res, next) => {
  try {
    await sendTripReminder(req.user._id, req.body);
    res.json({ success: true });
  } catch (err) { next(err); }
};

module.exports = { triggerBudgetAlert, triggerWeatherAlert, triggerTripReminder };