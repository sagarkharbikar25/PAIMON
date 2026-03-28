const mongoose = require('mongoose');

const splitSchema = new mongoose.Schema({
  user:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  paid:   { type: Boolean, default: false },
});

const expenseSchema = new mongoose.Schema({
  trip:      { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
  title:     { type: String, required: true },
  amount:    { type: Number, required: true },
  currency:  { type: String, default: 'INR' },
  category:  { type: String, enum: ['food','transport','accommodation','activity','shopping','other'], default: 'other' },
  paidBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  splitType: { type: String, enum: ['equal','custom','percentage'], default: 'equal' },
  splits:    [splitSchema],
  date:      { type: Date, default: Date.now },
  notes:     { type: String, default: '' },
}, { timestamps: true });

expenseSchema.index({ trip: 1, date: -1 });

module.exports = mongoose.model('Expense', expenseSchema);