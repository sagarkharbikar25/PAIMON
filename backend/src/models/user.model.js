/* =============================================
   user.model.js
   Pravas — User Model
   ============================================= */

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, unique: true, sparse: true }, // optional now, used later for Firebase
  email:       { type: String, required: true, unique: true, lowercase: true },
  name:        { type: String, required: true },
  password:    { type: String, select: false },              // hidden by default, only fetched when needed
  photoUrl:    { type: String, default: '' },
  fcmToken:    { type: String, default: '' },
  preferences: {
    currency: { type: String, default: 'INR' },
    language: { type: String, default: 'en' },
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);