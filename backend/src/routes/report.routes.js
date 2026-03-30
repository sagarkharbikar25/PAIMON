const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const Expense = require('../models/expense.model');

// Get trip reports
router.get('/:tripId', protect, async (req, res) => {
  try {
    const expenses = await Expense.find({ trip: req.params.tripId });
    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    const categories = expenses.reduce((acc, exp) => {
      const existing = acc.find(c => c.name === exp.category);
      if (existing) {
        existing.amount += exp.amount;
      } else {
        acc.push({
          name: exp.category,
          amount: exp.amount,
          color: getCategoryColor(exp.category),
          insight: getInsight(exp.category, exp.amount),
          insightType: getInsightType(exp.category, exp.amount),
          insightTitle: getInsightTitle(exp.category)
        });
      }
      return acc;
    }, []);

    res.json({ totalSpent, categories });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

function getCategoryColor(category) {
  const colors = {
    food: 'bg-amber-500',
    transport: 'bg-blue-500',
    accommodation: 'bg-emerald-500',
    shopping: 'bg-rose-500',
    activity: 'bg-purple-500',
    other: 'bg-gray-500'
  };
  return colors[category] || 'bg-gray-500';
}

function getInsight(category, amount) {
  const insights = {
    food: amount > 1000 ? 'You\'ve spent more than average on food. Consider local markets.' : 'Your food spending is within average limits.',
    accommodation: amount < 2000 ? 'Your accommodation costs are lower than average. Great job!' : 'Your stay expenses are higher than similar trips.'
  };
  return insights[category] || '';
}

function getInsightType(category, amount) {
  return amount > 1000 ? 'negative' : 'positive';
}

function getInsightTitle(category) {
  const titles = {
    food: 'Food Alert',
    accommodation: 'Accommodation',
    transport: 'Transport',
    shopping: 'Shopping',
    activity: 'Activity'
  };
  return titles[category] || category;
}

module.exports = router;