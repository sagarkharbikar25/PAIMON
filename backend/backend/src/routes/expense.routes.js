const router = require('express').Router();
const { testProtect: protect } = require('../middleware/testAuth.middleware');
const { getExpenses, createExpense, deleteExpense, getSettlementSummary } = require('../controllers/expense.controller');

router.get('/:tripId',         protect, getExpenses);
router.post('/:tripId',        protect, createExpense);
router.delete('/:id',          protect, deleteExpense);
router.get('/:tripId/summary', protect, getSettlementSummary);

module.exports = router;