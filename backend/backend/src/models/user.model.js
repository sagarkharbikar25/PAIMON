const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true, index: true },
  email:       { type: String, required: true, unique: true },
  name:        { type: String, required: true },
  photoUrl:    { type: String, default: '' },
  fcmToken:    { type: String, default: '' },
  preferences: {
    currency: { type: String, default: 'INR' },
    language: { type: String, default: 'en' },
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);