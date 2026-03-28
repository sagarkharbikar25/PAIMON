const admin = require('../config/firebase');
const User  = require('../models/user.model');
const { checkWeatherAlerts } = require('./weather.service');

const sendPush = async (fcmToken, { title, body, data = {} }) => {
  if (!fcmToken) return;
  try {
    await admin.messaging().send({ token: fcmToken, notification: { title, body }, data });
  } catch (err) { console.error('FCM error:', err.message); }
};

const sendBudgetAlert = async (userId, { spent, budget, tripName }) => {
  const user = await User.findById(userId);
  const pct = Math.round((spent / budget) * 100);
  if (pct >= 80) await sendPush(user.fcmToken, { title: '💸 Budget Alert', body: `You've used ${pct}% of ${tripName} budget!` });
};

const sendWeatherAlerts = async (userId, destination) => {
  const user = await User.findById(userId);
  const alerts = await checkWeatherAlerts(destination);
  for (const a of alerts) await sendPush(user.fcmToken, { title: `🌦️ Weather — ${destination}`, body: a.message });
};

const sendTripReminder = async (userId, { tripName, daysLeft }) => {
  const user = await User.findById(userId);
  await sendPush(user.fcmToken, { title: '✈️ Trip Reminder', body: `${tripName} starts in ${daysLeft} day(s)!` });
};

module.exports = { sendPush, sendBudgetAlert, sendWeatherAlerts, sendTripReminder };