/* =============================================
   add-expenses-form-1.js
   Pravas — Add Expense Form (connected to backend)
   ============================================= */

import { guardRoute } from './auth.js';
import { api } from './api.js';

guardRoute(null, '/html/login.html');

// Get tripId from URL ?tripId=xxx
const params  = new URLSearchParams(window.location.search);
const TRIP_ID = params.get('tripId');

// ── Tailwind config ────────────────────────────────────────────────────────
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "on-tertiary": "#ffffff",
        "on-secondary-fixed-variant": "#304a55",
        "primary-fixed-dim": "#b1c5ff",
        "surface-dim": "#d6dade",
        "surface": "#f6fafe",
        "outline": "#737784",
        "on-tertiary-container": "#ffaa80",
        "background": "#f6fafe",
        "surface-tint": "#2559bd",
        "on-tertiary-fixed": "#341100",
        "error": "#ba1a1a",
        "on-secondary-fixed": "#021f29",
        "surface-container-high": "#e4e9ed",
        "on-primary-fixed": "#001946",
        "error-container": "#ffdad6",
        "outline-variant": "#c3c6d5",
        "secondary-container": "#cbe7f5",
        "surface-bright": "#f6fafe",
        "secondary-fixed": "#cbe7f5",
        "primary": "#00327d",
        "secondary-fixed-dim": "#afcbd8",
        "on-primary": "#ffffff",
        "surface-variant": "#dfe3e7",
        "on-error-container": "#93000a",
        "on-secondary-container": "#4e6874",
        "primary-container": "#0047ab",
        "inverse-on-surface": "#edf1f5",
        "inverse-surface": "#2c3134",
        "on-primary-container": "#a5bdff",
        "inverse-primary": "#b1c5ff",
        "on-background": "#171c1f",
        "surface-container-highest": "#dfe3e7",
        "surface-container-low": "#f0f4f8",
        "tertiary-fixed": "#ffdbcb",
        "tertiary-fixed-dim": "#ffb692",
        "tertiary": "#602400",
        "on-tertiary-fixed-variant": "#7a3000",
        "surface-container": "#eaeef2",
        "tertiary-container": "#843500",
        "primary-fixed": "#dae2ff",
        "on-secondary": "#ffffff",
        "on-error": "#ffffff",
        "surface-container-lowest": "#ffffff",
        "on-surface": "#171c1f",
        "on-primary-fixed-variant": "#00419e",
        "on-surface-variant": "#434653",
        "secondary": "#48626e"
      },
      fontFamily: {
        "headline": ["Plus Jakarta Sans"],
        "body": ["Inter"],
        "label": ["Inter"]
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      }
    }
  }
};

// ── DOM References ─────────────────────────────────────────────────────────
const amountInput  = document.getElementById('amountInput');
const descInput    = document.getElementById('descriptionInput');
const categoryBtns = document.querySelectorAll('.category-btn');
const splitBtns    = document.querySelectorAll('.split-btn');
const splitAmounts = document.querySelectorAll('.split-amount');
const splitLabels  = document.querySelectorAll('.split-label');
const saveBtn      = document.getElementById('saveBtn');
const cancelBtn    = document.getElementById('cancelBtn');

// ── State ──────────────────────────────────────────────────────────────────
const MEMBER_COUNT = 3;
let currentSplitMethod = 'equally';
let selectedCategory   = 'dining';

// ── Set today's date ───────────────────────────────────────────────────────
const dateDisplay = document.getElementById('dateDisplay');
if (dateDisplay) {
  dateDisplay.textContent = new Date().toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
}

// ── Category Selection ─────────────────────────────────────────────────────
categoryBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    categoryBtns.forEach(b => {
      b.classList.remove('active', 'bg-primary', 'text-on-primary', 'shadow-lg', 'shadow-primary/20');
      b.classList.add('bg-surface-container-low', 'text-on-surface-variant');
    });
    btn.classList.add('active', 'bg-primary', 'text-on-primary', 'shadow-lg', 'shadow-primary/20');
    btn.classList.remove('bg-surface-container-low', 'text-on-surface-variant');
    selectedCategory = btn.dataset.category;
  });
});

// ── Split Method Toggle ────────────────────────────────────────────────────
splitBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    splitBtns.forEach(b => b.classList.remove('active', 'bg-surface-container-lowest', 'text-primary'));
    btn.classList.add('active', 'bg-surface-container-lowest', 'text-primary');
    currentSplitMethod = btn.dataset.split;
    updateSplitPreview();
  });
});

// ── Split Preview Calculation ──────────────────────────────────────────────
function updateSplitPreview() {
  const total = parseFloat(amountInput.value) || 0;
  const share = total / MEMBER_COUNT;

  if (currentSplitMethod === 'equally') {
    splitAmounts.forEach(el => { el.textContent = `₹ ${share.toFixed(2)}`; });
    splitLabels.forEach(el  => { el.textContent = `1/${MEMBER_COUNT} Share`; });
  } else {
    const pct = (100 / MEMBER_COUNT).toFixed(1);
    splitAmounts.forEach(el => { el.textContent = `₹ ${share.toFixed(2)}`; });
    splitLabels.forEach(el  => { el.textContent = `${pct}%`; });
  }
}

amountInput.addEventListener('input', updateSplitPreview);

// ── Save Expense → POST /api/expenses/:tripId ──────────────────────────────
saveBtn.addEventListener('click', async () => {
  const amount      = parseFloat(amountInput.value);
  const description = descInput.value.trim();

  if (!amount || amount <= 0) {
    showToast('Please enter a valid amount.', 'error');
    return;
  }
  if (!description) {
    showToast('Please add a description.', 'error');
    return;
  }
  if (!TRIP_ID) {
    showToast('No trip found. Go back and open a trip first.', 'error');
    return;
  }

  // Map category names to backend expected values
  const categoryMap = {
    dining:    'Food',
    transport: 'Transport',
    stay:      'Hotel',
    shopping:  'Shopping',
    tickets:   'Sightseeing',
  };

  saveBtn.disabled    = true;
  saveBtn.innerHTML   = `<span class="material-symbols-outlined animate-spin">progress_activity</span> Saving...`;

  try {
    await api.createExpense(TRIP_ID, {
      title:     description,
      amount,
      currency:  'INR',
      category:  categoryMap[selectedCategory] || 'Other',
      splitType: currentSplitMethod === 'equally' ? 'equal' : 'percentage',
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
  if (confirm('Discard this expense?')) {
    history.back();
  }
});

// ── Init ───────────────────────────────────────────────────────────────────
updateSplitPreview();

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