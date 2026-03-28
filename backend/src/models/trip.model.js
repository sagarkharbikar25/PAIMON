const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  user:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role:   { type: String, enum: ['admin','member'], default: 'member' },
  status: { type: String, enum: ['invited','accepted','declined'], default: 'invited' },
});

const tripSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  destination: { type: String, required: true },
  startDate:   { type: Date,   required: true },
  endDate:     { type: Date,   required: true },
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members:     [memberSchema],
  budget:      { type: Number, default: 0 },
  currency:    { type: String, default: 'INR' },
  status:      { type: String, enum: ['upcoming','current','past'], default: 'upcoming' },
}, { timestamps: true });

tripSchema.pre('save', function (next) {
  const now = new Date();
  if (this.endDate < now)        this.status = 'past';
  else if (this.startDate <= now) this.status = 'current';
  else                           this.status = 'upcoming';
  next();
});

tripSchema.index({ createdBy: 1, status: 1 });
tripSchema.index({ 'members.user': 1 });

module.exports = mongoose.model('Trip', tripSchema);