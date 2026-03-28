const admin = require('../config/firebase');
const User = require('../models/user.model');
const { checkWeatherAlerts } = require('./weather.service');

// ✅ BASE PUSH FUNCTION
const sendPush = async (fcmToken, { title, body, data = {} }) => {
  if (!fcmToken) return;

  try {
    await admin.messaging().send({
      token: fcmToken,
      notification: { title, body },
      data,
    });
  } catch (err) {
    console.error('FCM Error:', err.message);
  }
};

// ✅ BUDGET ALERT
const sendBudgetAlert = async (userId, { spent, budget, tripName }) => {
  try {
    const user = await User.findById(userId);
    if (!user || !user.fcmToken) return;

    const pct = Math.round((spent / budget) * 100);

    if (pct >= 80) {
      await sendPush(user.fcmToken, {
        title: '💸 Budget Alert',
        body: `You've used ${pct}% of ${tripName} budget!`,
      });
    }

  } catch (err) {
    console.error('Budget Alert Error:', err.message);
  }
};

// ✅ WEATHER ALERT NOTIFICATIONS
const sendWeatherAlerts = async (userId, destination) => {
  try {
    const user = await User.findById(userId);
    if (!user || !user.fcmToken) return;

    const alerts = await checkWeatherAlerts(destination);

    for (const alert of alerts) {
      await sendPush(user.fcmToken, {
        title: `🌦️ Weather — ${destination}`,
        body: alert.message,
      });
    }

  } catch (err) {
    console.error('Weather Alert Error:', err.message);
  }
};

// ✅ TRIP REMINDER
const sendTripReminder = async (userId, { tripName, daysLeft }) => {
  try {
    const user = await User.findById(userId);
    if (!user || !user.fcmToken) return;

    await sendPush(user.fcmToken, {
      title: '✈️ Trip Reminder',
      body: `${tripName} starts in ${daysLeft} day(s)!`,
    });

  } catch (err) {
    console.error('Trip Reminder Error:', err.message);
  }
};

module.exports = {
  sendPush,
  sendBudgetAlert,
  sendWeatherAlerts,
  sendTripReminder,
};