const Expense = require('../models/expense.model');
const Trip    = require('../models/trip.model');
const { AppError } = require('../middleware/error.middleware');

const getExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.find({ trip: req.params.tripId })
      .populate('paidBy', 'name email photoUrl')
      .populate('splits.user', 'name email photoUrl')
      .sort({ date: -1 });
    res.json({ success: true, count: expenses.length, expenses });
  } catch (err) { next(err); }
};

const createExpense = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const { title, amount, currency, category, splitType, memberIds, customSplits } = req.body;

    const trip = await Trip.findById(tripId);
    if (!trip) return next(new AppError('Trip not found', 404));

    let splits = [];
    if (splitType === 'equal') {
      const people = memberIds || trip.members.filter(m => m.status === 'accepted').map(m => m.user);
      const share = parseFloat((amount / people.length).toFixed(2));
      splits = people.map(uid => ({ user: uid, amount: share }));
    } else if (splitType === 'custom') {
      splits = customSplits.map(s => ({ user: s.userId, amount: s.amount }));
    } else if (splitType === 'percentage') {
      splits = customSplits.map(s => ({ user: s.userId, amount: parseFloat(((s.percentage / 100) * amount).toFixed(2)) }));
    }

    const expense = await Expense.create({ trip: tripId, title, amount, currency, category, paidBy: req.user._id, splitType, splits });
    res.status(201).json({ success: true, expense });
  } catch (err) { next(err); }
};

const deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, paidBy: req.user._id });
    if (!expense) return next(new AppError('Not found or unauthorized', 404));
    res.json({ success: true, message: 'Deleted' });
  } catch (err) { next(err); }
};

const getSettlementSummary = async (req, res, next) => {
  try {
    const expenses = await Expense.find({ trip: req.params.tripId });
    const balances = {};
    for (const exp of expenses) {
      const payer = exp.paidBy.toString();
      balances[payer] = (balances[payer] || 0) + exp.amount;
      for (const split of exp.splits) {
        const uid = split.user.toString();
        balances[uid] = (balances[uid] || 0) - split.amount;
      }
    }
    res.json({ success: true, balances });
  } catch (err) { next(err); }
};

module.exports = { getExpenses, createExpense, deleteExpense, getSettlementSummary };