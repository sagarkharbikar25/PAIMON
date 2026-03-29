/* =============================================
   models/user.model.js
   Pravas — User Model (Updated for Complete Profile)
   ============================================= */

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firebaseUid: { 
    type: String, 
    unique: true, 
    sparse: true,     // optional now, used later for Firebase
    default: null,
  }, 
  
  email:       { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true 
  },
  
  name:        { 
    type: String, 
    required: true 
  },
  
  password:    { 
    type: String, 
    select: false,              // hidden by default, only fetched when needed
    minlength: 6
  },
  
  photoUrl:    { 
    type: String, 
    default: '' 
  },
  
  fcmToken:    { 
    type: String, 
    default: '' 
  },

  /* --- NEW PROFILE FIELDS --- */
  mobile:      { 
    type: String,
    trim: true,
  },

  dateOfBirth: { 
    type: Date 
  },

  age:         { 
    type: Number,
    min: 0,
    max: 150,
  },

  country:     { 
    type: String,
    enum: [
      'United States',
      'United Kingdom',
      'Canada',
      'Australia'
    ],
    default: 'India'
  },

  state:       { 
    type: String,
    default: '',
  },
  /* --------------------------- */

  preferences: {
    currency: { type: String, default: 'INR' },
    language: { type: String, default: 'en' },
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);