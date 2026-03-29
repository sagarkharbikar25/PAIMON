/* =============================================
   add_expense_form_2.js
   Pravas — Add Expense Form 2 (connected to backend)
   ============================================= */

import { guardRoute } from './auth.js';
import { api } from './api.js';

guardRoute(null, '/html/login.html');

// Get tripId from URL ?tripId=xxx
const params  = new URLSearchParams(window.location.search);
const TRIP_ID = params.get('tripId');

// ── DOM References ─────────────────────────────────────────────────────────
const amountInput     = document.getElementById('amount-input');
const descInput       = document.getElementById('description-input');
const categoryBtns    = document.querySelectorAll('[data-category]');
const splitEquallyBtn = document.getElementById('split-equally');
const splitPercentBtn = document.getElementById('split-percent');
const splitAmounts    = document.querySelectorAll('.split-amount');
const saveBtn         = document.getElementById('save-btn');
const cancelBtn       = document.getElementById('cancel-btn');

// ── State ──────────────────────────────────────────────────────────────────
const MEMBER_COUNT     = 3;
let currentSplitMethod = 'equal';
let selectedCategory   = 'dining';

// ── Set today's date ───────────────────────────────────────────────────────
const dateEl = document.querySelector('.font-semibold');
if (dateEl && dateEl.textContent.includes('Oct')) {
  dateEl.textContent = new Date().toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
}

// ── Category Selection ─────────────────────────────────────────────────────
categoryBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    categoryBtns.forEach(b => {
      b.classList.remove('bg-primary', 'text-on-primary', 'shadow-lg', 'shadow-primary/20');
      b.classList.add('bg-surface-container-low', 'text-on-surface-variant');
    });
    btn.classList.remove('bg-surface-container-low', 'text-on-surface-variant');
    btn.classList.add('bg-primary', 'text-on-primary', 'shadow-lg', 'shadow-primary/20');
    selectedCategory = btn.dataset.category;
  });
});

// ── Split Method Toggle ────────────────────────────────────────────────────
splitEquallyBtn.addEventListener('click', () => {
  splitEquallyBtn.classList.add('bg-surface-container-lowest', 'text-primary');
  splitEquallyBtn.classList.remove('text-on-surface-variant');
  splitPercentBtn.classList.remove('bg-surface-container-lowest', 'text-primary');
  splitPercentBtn.classList.add('text-on-surface-variant');
  currentSplitMethod = 'equal';
  recalculateSplit();
});

splitPercentBtn.addEventListener('click', () => {
  splitPercentBtn.classList.add('bg-surface-container-lowest', 'text-primary');
  splitPercentBtn.classList.remove('text-on-surface-variant');
  splitEquallyBtn.classList.remove('bg-surface-container-lowest', 'text-primary');
  splitEquallyBtn.classList.add('text-on-surface-variant');
  currentSplitMethod = 'percentage';
  recalculateSplit();
});

// ── Live Split Recalculation ───────────────────────────────────────────────
amountInput.addEventListener('input', recalculateSplit);

function recalculateSplit() {
  const total     = parseFloat(amountInput.value) || 0;
  const perPerson = (total / MEMBER_COUNT).toFixed(2);
  splitAmounts.forEach(el => { el.textContent = `₹ ${perPerson}`; });
}

// ── Category map → backend values ─────────────────────────────────────────
const categoryMap = {
  dining:    'Food',
  transport: 'Transport',
  stay:      'Hotel',
  shopping:  'Shopping',
  tickets:   'Sightseeing',
};

// ── Save Expense → POST /api/expenses/:tripId ──────────────────────────────
saveBtn.addEventListener('click', async () => {
  const amount         = parseFloat(amountInput.value);
  const description    = descInput.value.trim();
  const activeCategory = document.querySelector('[data-category].bg-primary');
  const category       = activeCategory ? activeCategory.dataset.category : selectedCategory;

  if (!amount || amount <= 0) {
    showToast('Please enter a valid amount.', 'error'); return;
  }
  if (!description) {
    showToast('Please enter a description.', 'error'); return;
  }
  if (!TRIP_ID) {
    showToast('No trip found. Go back and open a trip first.', 'error'); return;
  }

  saveBtn.disabled  = true;
  saveBtn.innerHTML = `<span class="material-symbols-outlined">progress_activity</span> Saving...`;

  try {
    await api.createExpense(TRIP_ID, {
      title:     description,
      amount,
      currency:  'INR',
      category:  categoryMap[category] || 'Other',
      splitType: currentSplitMethod,
      date:      new Date().toISOString(),
    });

    showToast('Expense saved!', 'success');
    setTimeout(() => {
      window.location.href = `/html/expense_tracker.html?tripId=${TRIP_ID}`;
    }, 1000);

  } catch (err) {
    console.error(err);
    showToast(err.message || 'Failed to save expense.', 'error');
  } finally {
    saveBtn.disabled  = false;
    saveBtn.innerHTML = `<span class="material-symbols-outlined">save</span> Save Expense`;
  }
});

// ── Cancel ─────────────────────────────────────────────────────────────────
cancelBtn.addEventListener('click', () => {
  if (confirm('Discard this expense?')) history.back();
});

// ── Init ───────────────────────────────────────────────────────────────────
recalculateSplit();

// ── Toast helper ───────────────────────────────────────────────────────────
function showToast(message, type = 'success') {
  const existing = document.getElementById('pravas-toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.id = 'pravas-toast';
  toast.className = `fixed top-24 left-1/2 -translate-x-1/2 z-[999] px-6 py-3 rounded-xl
    font-bold text-sm shadow-xl transition-all
    ${type === 'error' ? 'bg-red-500 text-white' : 'bg-primary text-white'}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}