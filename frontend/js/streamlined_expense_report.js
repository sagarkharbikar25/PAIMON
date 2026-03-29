/* =============================================
   streamlined_expense_report.js
   Pravas Expense Report — fully connected to backend
   Endpoints used:
     GET    /api/expenses/:tripId          → load all expenses
     POST   /api/expenses/:tripId          → create new expense
     DELETE /api/expenses/:id              → delete expense
     GET    /api/expenses/:tripId/summary  → settlement balances
   ============================================= */

/* ── Tailwind Config ── */
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
      fontFamily: { "headline": ["Plus Jakarta Sans"], "body": ["Inter"], "label": ["Inter"] },
      borderRadius: { "DEFAULT": "0.25rem", "lg": "1rem", "xl": "1.5rem", "full": "9999px" },
    },
  },
};

/* ══════════════════════════════════════════════
   CONFIG
══════════════════════════════════════════════ */
const BASE_URL = 'http://localhost:5000/api';

/* ── Category config — icon + colour per category string ── */
const CATEGORY_CONFIG = {
  food:          { icon: 'restaurant',      bg: 'bg-secondary-container/40', text: 'text-primary' },
  transport:     { icon: 'local_taxi',      bg: 'bg-tertiary-fixed/30',      text: 'text-tertiary' },
  accommodation: { icon: 'hotel',           bg: 'bg-primary-fixed/30',       text: 'text-primary' },
  sightseeing:   { icon: 'museum',          bg: 'bg-primary-fixed/30',       text: 'text-primary' },
  shopping:      { icon: 'shopping_bag',    bg: 'bg-secondary-container/40', text: 'text-primary' },
  health:        { icon: 'local_pharmacy',  bg: 'bg-error-container/30',     text: 'text-error'   },
  other:         { icon: 'receipt_long',    bg: 'bg-surface-container',      text: 'text-on-surface-variant' },
};

/* ── State ── */
let allExpenses  = [];
let activeFilter = 'all';   // 'all' | 'me' | 'shared'
let currentUser  = null;
let activeTripId = null;

/* ══════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════ */

function getToken() {
  return localStorage.getItem('pravas_token') || null;
}

async function apiFetch(endpoint, options = {}) {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data.message || 'Request failed');
    err.status = res.status;
    throw err;
  }
  return data;
}

function formatCurrency(amount, currency = '₹') {
  return `${currency}${Number(amount).toLocaleString('en-IN')}`;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const today    = new Date();
  const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === today.toDateString())     return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function categoryLabel(cat) {
  const labels = {
    food: 'Food & Drinks', transport: 'Transport', accommodation: 'Accommodation',
    sightseeing: 'Sightseeing', shopping: 'Shopping', health: 'Health', other: 'Other',
  };
  return labels[cat] || cat;
}

/* ══════════════════════════════════════════════
   RENDER — BUDGET SECTION
══════════════════════════════════════════════ */

function renderBudgetSection(expenses) {
  const budget  = parseFloat(localStorage.getItem('activeTripBudget') || '60000');
  const spent   = expenses.reduce((sum, e) => sum + e.amount, 0);
  const pct     = Math.min(Math.round((spent / budget) * 100), 100);
  const remaining = budget - spent;
  const days    = parseInt(localStorage.getItem('activeTripDays') || '7');
  const avgDaily = days > 0 ? Math.round(spent / days) : 0;

  // Update DOM
  const spentEl     = document.getElementById('budget-spent');
  const totalEl     = document.getElementById('budget-total');
  const pctEl       = document.getElementById('budget-pct-badge');
  const barEl       = document.getElementById('budget-bar');
  const remainEl    = document.getElementById('budget-remaining');
  const avgEl       = document.getElementById('budget-avg-daily');

  if (spentEl)   spentEl.textContent   = formatCurrency(spent);
  if (totalEl)   totalEl.textContent   = `/ ${formatCurrency(budget)}`;
  if (pctEl)     pctEl.textContent     = `${pct}% SPENT`;
  if (barEl)     barEl.style.width     = `${pct}%`;
  if (remainEl)  remainEl.textContent  = formatCurrency(remaining);
  if (avgEl)     avgEl.textContent     = formatCurrency(avgDaily);

  // Colour the bar red if over 90%
  if (barEl) {
    barEl.classList.toggle('from-error', pct >= 90);
    barEl.classList.toggle('to-error-container', pct >= 90);
    barEl.classList.toggle('from-primary', pct < 90);
    barEl.classList.toggle('to-primary-container', pct < 90);
  }

  // Persist for nav drawer budget bar
  localStorage.setItem('activeTripSpent', spent.toString());
}

/* ══════════════════════════════════════════════
   RENDER — ACTIVITY LIST
══════════════════════════════════════════════ */

function getFilteredExpenses() {
  if (!currentUser) return allExpenses;
  if (activeFilter === 'me') {
    return allExpenses.filter(e => e.paidBy?._id === currentUser._id || e.paidBy === currentUser._id);
  }
  if (activeFilter === 'shared') {
    return allExpenses.filter(e => e.splits && e.splits.length > 1);
  }
  return allExpenses;
}

function buildActivityItem(expense) {
  const cat    = (expense.category || 'other').toLowerCase();
  const config = CATEGORY_CONFIG[cat] || CATEGORY_CONFIG.other;
  const isMe   = expense.paidBy?._id === currentUser?._id || expense.paidBy === currentUser?._id;

  const avatarHtml = isMe
    ? `<div class="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[8px] text-on-primary font-bold">ME</div>`
    : expense.paidBy?.photoUrl
      ? `<div class="w-6 h-6 rounded-full bg-surface-container overflow-hidden border-2 border-white">
           <img alt="${expense.paidBy.name || ''}" class="w-full h-full object-cover" src="${expense.paidBy.photoUrl}"/>
         </div>`
      : `<div class="w-6 h-6 rounded-full bg-secondary-container flex items-center justify-center text-[8px] font-bold text-on-secondary-container">${(expense.paidBy?.name || '?').charAt(0).toUpperCase()}</div>`;

  return `
    <div class="bg-surface-container-lowest p-4 rounded-xl flex items-center justify-between shadow-sm hover:bg-surface-container-low transition-colors group"
         data-expense-id="${expense._id}">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-full ${config.bg} flex items-center justify-center ${config.text}">
          <span class="material-symbols-outlined">${config.icon}</span>
        </div>
        <div>
          <p class="font-headline font-bold text-on-surface">${expense.title}</p>
          <p class="text-xs text-on-surface-variant font-medium">
            ${formatDate(expense.date)} • ${categoryLabel(expense.category)}
          </p>
        </div>
      </div>
      <div class="flex flex-col items-end gap-1">
        <p class="font-headline font-bold text-on-surface">${formatCurrency(expense.amount, expense.currency || '₹')}</p>
        ${avatarHtml}
        ${isMe ? `<button data-delete-id="${expense._id}" class="opacity-0 group-hover:opacity-100 transition-opacity mt-1 text-error"
                   aria-label="Delete expense">
                    <span class="material-symbols-outlined text-sm">delete</span>
                  </button>` : ''}
      </div>
    </div>`;
}

function renderActivityList() {
  const container = document.getElementById('activity-list');
  if (!container) return;

  const filtered = getFilteredExpenses();

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="text-center py-16 text-on-surface-variant">
        <span class="material-symbols-outlined text-5xl mb-3 block opacity-30">receipt_long</span>
        <p class="font-headline font-semibold">No expenses yet</p>
        <p class="text-sm mt-1">Tap + to add your first expense</p>
      </div>`;
    return;
  }

  container.innerHTML = filtered.map(buildActivityItem).join('');

  // Wire delete buttons
  container.querySelectorAll('[data-delete-id]').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-delete-id');
      await handleDeleteExpense(id);
    });
  });
}

/* ══════════════════════════════════════════════
   RENDER — SKELETON LOADER
══════════════════════════════════════════════ */

function showSkeleton() {
  const container = document.getElementById('activity-list');
  if (!container) return;
  container.innerHTML = Array(3).fill(0).map(() => `
    <div class="bg-surface-container-lowest p-4 rounded-xl flex items-center justify-between shadow-sm animate-pulse">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-full bg-surface-container-high"></div>
        <div class="space-y-2">
          <div class="h-4 w-36 bg-surface-container-high rounded"></div>
          <div class="h-3 w-24 bg-surface-container rounded"></div>
        </div>
      </div>
      <div class="h-5 w-16 bg-surface-container-high rounded"></div>
    </div>`).join('');
}

/* ══════════════════════════════════════════════
   API CALLS
══════════════════════════════════════════════ */

async function loadExpenses() {
  if (!activeTripId) {
    console.warn('No activeTripId found in localStorage');
    return;
  }
  showSkeleton();
  try {
    const data = await apiFetch(`/expenses/${activeTripId}`);
    allExpenses = data.expenses || [];
    renderBudgetSection(allExpenses);
    renderActivityList();
  } catch (err) {
    console.error('Failed to load expenses:', err);
    showToast('Could not load expenses. Please try again.', 'error');
  }
}

async function handleDeleteExpense(id) {
  if (!confirm('Delete this expense?')) return;
  try {
    await apiFetch(`/expenses/${id}`, { method: 'DELETE' });
    allExpenses = allExpenses.filter(e => e._id !== id);
    renderBudgetSection(allExpenses);
    renderActivityList();
    showToast('Expense deleted.', 'success');
  } catch (err) {
    console.error('Delete failed:', err);
    showToast('Could not delete expense.', 'error');
  }
}

async function handleCreateExpense(formData) {
  if (!activeTripId) return;
  try {
    const data = await apiFetch(`/expenses/${activeTripId}`, {
      method: 'POST',
      body: JSON.stringify(formData),
    });
    // Prepend new expense and re-render
    allExpenses = [data.expense, ...allExpenses];
    renderBudgetSection(allExpenses);
    renderActivityList();
    closeAddModal();
    showToast('Expense added!', 'success');
  } catch (err) {
    console.error('Create expense failed:', err);
    showToast(err.message || 'Could not add expense.', 'error');
  }
}

/* ══════════════════════════════════════════════
   ADD EXPENSE MODAL
══════════════════════════════════════════════ */

function openAddModal() {
  let modal = document.getElementById('add-expense-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id        = 'add-expense-modal';
    modal.className = 'fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm';
    modal.innerHTML = `
      <div class="bg-surface-container-lowest w-full max-w-lg rounded-t-[2rem] md:rounded-[2rem] p-8 shadow-2xl">
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-headline font-bold text-xl text-primary">Add Expense</h3>
          <button id="close-add-modal" class="p-2 rounded-full hover:bg-surface-container-high transition-colors">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <form id="add-expense-form" class="space-y-4">
          <!-- Title -->
          <div>
            <label class="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Title</label>
            <input id="exp-title" type="text" required placeholder="e.g. Dinner at Coastal Hut"
              class="w-full px-4 py-3 bg-surface-container-high rounded-lg text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all border-none outline-none"/>
          </div>
          <!-- Amount -->
          <div>
            <label class="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Amount (₹)</label>
            <input id="exp-amount" type="number" required min="1" placeholder="0"
              class="w-full px-4 py-3 bg-surface-container-high rounded-lg text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all border-none outline-none"/>
          </div>
          <!-- Category -->
          <div>
            <label class="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Category</label>
            <select id="exp-category"
              class="w-full px-4 py-3 bg-surface-container-high rounded-lg text-on-surface focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all border-none outline-none">
              <option value="food">Food & Drinks</option>
              <option value="transport">Transport</option>
              <option value="accommodation">Accommodation</option>
              <option value="sightseeing">Sightseeing</option>
              <option value="shopping">Shopping</option>
              <option value="health">Health</option>
              <option value="other">Other</option>
            </select>
          </div>
          <!-- Split Type -->
          <div>
            <label class="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Split</label>
            <select id="exp-split"
              class="w-full px-4 py-3 bg-surface-container-high rounded-lg text-on-surface focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all border-none outline-none">
              <option value="none">Just me</option>
              <option value="equal">Equal split with group</option>
            </select>
          </div>
          <!-- Submit -->
          <button type="submit"
            class="w-full py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-bold rounded-xl shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2">
            <span id="add-btn-text">Add Expense</span>
            <span id="add-btn-spinner" class="hidden material-symbols-outlined animate-spin text-lg">progress_activity</span>
          </button>
        </form>
      </div>`;
    document.body.appendChild(modal);

    document.getElementById('close-add-modal').addEventListener('click', closeAddModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeAddModal(); });

    document.getElementById('add-expense-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const title     = document.getElementById('exp-title').value.trim();
      const amount    = parseFloat(document.getElementById('exp-amount').value);
      const category  = document.getElementById('exp-category').value;
      const splitType = document.getElementById('exp-split').value === 'equal' ? 'equal' : 'none';

      if (!title || !amount || amount <= 0) {
        showToast('Please fill in title and a valid amount.', 'error');
        return;
      }

      // Loading state
      const btnText    = document.getElementById('add-btn-text');
      const btnSpinner = document.getElementById('add-btn-spinner');
      btnText.textContent = 'Adding…';
      btnSpinner.classList.remove('hidden');

      await handleCreateExpense({ title, amount, currency: '₹', category, splitType });

      btnText.textContent = 'Add Expense';
      btnSpinner.classList.add('hidden');
    });
  }
  modal.classList.remove('hidden');
}

function closeAddModal() {
  const modal = document.getElementById('add-expense-modal');
  if (modal) modal.classList.add('hidden');
}

/* ══════════════════════════════════════════════
   TOAST
══════════════════════════════════════════════ */

function showToast(message, type = 'info') {
  const existing = document.getElementById('expense-toast');
  if (existing) existing.remove();

  const toast      = document.createElement('div');
  toast.id         = 'expense-toast';
  const isError    = type === 'error';
  toast.className  = `fixed top-20 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl text-sm font-semibold transition-all
    ${isError ? 'bg-error-container text-on-error-container' : 'bg-secondary-container text-on-secondary-container'}`;
  toast.innerHTML  = `
    <span class="material-symbols-outlined text-base">${isError ? 'error' : 'check_circle'}</span>
    <span>${message}</span>`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

/* ══════════════════════════════════════════════
   FILTER BUTTONS
══════════════════════════════════════════════ */

function initFilterButtons() {
  const filterBtns = document.querySelectorAll('[data-filter]');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      activeFilter = btn.getAttribute('data-filter');

      // Visual active state swap
      filterBtns.forEach(b => {
        b.classList.remove('bg-primary', 'text-on-primary');
        b.classList.add('bg-surface-container-high', 'text-on-surface-variant');
      });
      btn.classList.add('bg-primary', 'text-on-primary');
      btn.classList.remove('bg-surface-container-high', 'text-on-surface-variant');

      renderActivityList();
    });
  });
}

/* ══════════════════════════════════════════════
   DOM READY
══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', async () => {

  /* ── Auth guard ── */
  const token = getToken();
  if (!token) {
    window.location.href = '/login.html';
    return;
  }

  /* ── Load current user + trip from localStorage ── */
  const rawUser = localStorage.getItem('pravas_user');
  currentUser   = rawUser ? JSON.parse(rawUser) : null;
  activeTripId  = localStorage.getItem('activeTripId');

  if (!activeTripId) {
    showToast('No active trip found. Please open a trip first.', 'error');
  }

  /* ── Populate trip name in header if available ── */
  const tripNameEl = document.querySelector('h1');
  const tripName   = localStorage.getItem('activeTripDestination');
  if (tripNameEl && tripName) tripNameEl.textContent = tripName;

  /* ── Wire up user avatar ── */
  const avatarImg = document.querySelector('header img');
  if (avatarImg && currentUser?.photoUrl) avatarImg.src = currentUser.photoUrl;

  /* ── Wire FAB → open add modal ── */
  const fab = document.querySelector('button[class*="bottom-28"]');
  if (fab) fab.addEventListener('click', openAddModal);

  /* ── Wire filter buttons ── */
  initFilterButtons();

  /* ── Load expenses from backend ── */
  await loadExpenses();
});