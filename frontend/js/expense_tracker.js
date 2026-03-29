/* =============================================
   expense_tracker.js — Pravas Expense Tracker Scripts
   ============================================= */

/* ── Tailwind Config ── */
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary-fixed":                "#dae2ff",
        "background":                   "#f6fafe",
        "surface-dim":                  "#d6dade",
        "secondary":                    "#48626e",
        "on-surface":                   "#171c1f",
        "tertiary":                     "#602400",
        "tertiary-fixed":               "#ffdbcb",
        "primary":                      "#00327d",
        "on-tertiary-fixed":            "#341100",
        "surface-bright":               "#f6fafe",
        "on-secondary-container":       "#4e6874",
        "secondary-fixed":              "#cbe7f5",
        "surface-tint":                 "#2559bd",
        "on-primary-fixed":             "#001946",
        "primary-fixed-dim":            "#b1c5ff",
        "on-tertiary-fixed-variant":    "#7a3000",
        "on-primary":                   "#ffffff",
        "on-error":                     "#ffffff",
        "primary-container":            "#0047ab",
        "on-secondary-fixed":           "#021f29",
        "surface-container-highest":    "#dfe3e7",
        "surface-container":            "#eaeef2",
        "surface":                      "#f6fafe",
        "inverse-primary":              "#b1c5ff",
        "error-container":              "#ffdad6",
        "tertiary-fixed-dim":           "#ffb692",
        "surface-variant":              "#dfe3e7",
        "on-surface-variant":           "#434653",
        "on-secondary":                 "#ffffff",
        "on-primary-fixed-variant":     "#00419e",
        "on-tertiary":                  "#ffffff",
        "outline":                      "#737784",
        "surface-container-low":        "#f0f4f8",
        "surface-container-high":       "#e4e9ed",
        "error":                        "#ba1a1a",
        "on-tertiary-container":        "#ffaa80",
        "on-primary-container":         "#a5bdff",
        "outline-variant":              "#c3c6d5",
        "secondary-container":          "#cbe7f5",
        "inverse-on-surface":           "#edf1f5",
        "secondary-fixed-dim":          "#afcbd8",
        "surface-container-lowest":     "#ffffff",
        "inverse-surface":              "#2c3134",
        "on-error-container":           "#93000a",
        "on-secondary-fixed-variant":   "#304a55",
        "on-background":                "#171c1f",
        "tertiary-container":           "#843500"
      },
      fontFamily: {
        "headline": ["Plus Jakarta Sans"],
        "body":     ["Inter"],
        "label":    ["Inter"]
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg":      "0.5rem",
        "xl":      "0.75rem",
        "full":    "9999px"
      }
    }
  }
};

/* ── API Config ── */
const API_BASE = 'http://localhost:5000';

/* ── Helpers ── */
function getToken() {
  return localStorage.getItem('token') || localStorage.getItem('authToken') || '';
}

// tripId stored in localStorage when user opens a trip
function getTripId() {
  return localStorage.getItem('activeTripId') || '';
}

function formatCurrency(amount) {
  return '$' + parseFloat(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function showToast(message, type = 'success') {
  const existing = document.getElementById('pravas-toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.id = 'pravas-toast';
  toast.className = `
    fixed top-20 left-1/2 -translate-x-1/2 z-[100]
    flex items-center gap-3 px-6 py-4 rounded-xl shadow-xl
    text-sm font-semibold transition-all duration-300
    ${type === 'success' ? 'bg-[#00327d] text-white' : 'bg-[#ffdad6] text-[#93000a]'}
  `.trim();
  toast.innerHTML = `
    <span class="material-symbols-outlined text-base">${type === 'success' ? 'check_circle' : 'error'}</span>
    <span>${message}</span>
  `;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translate(-50%, -8px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* ── Category icon map ── */
const categoryIcons = {
  food:        'restaurant',
  transport:   'directions_subway',
  hotel:       'hotel',
  shopping:    'shopping_bag',
  activity:    'local_activity',
  default:     'payments'
};

/* ── Render expenses into activity list ── */
function renderExpenses(expenses) {
  const list = document.getElementById('activity-list');
  if (!expenses.length) {
    list.innerHTML = `<p class="text-center text-on-surface-variant py-8">No expenses yet. Tap + to add one.</p>`;
    return;
  }

  list.innerHTML = expenses.map(exp => {
    const icon  = categoryIcons[exp.category] || categoryIcons.default;
    const payer = exp.paidBy?.name || 'You';
    const splitWith = exp.splits?.length > 1
      ? `Split with ${exp.splits.map(s => s.user?.name || '').filter(Boolean).join(' & ')}`
      : 'Personal expense';
    const date = new Date(exp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    return `
      <div class="bg-surface-container-lowest p-5 rounded-2xl flex items-center justify-between group hover:bg-surface-container transition-colors duration-300 activity-item" data-id="${exp._id}">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
            <span class="material-symbols-outlined">${icon}</span>
          </div>
          <div>
            <p class="font-bold text-on-surface">${exp.title}</p>
            <div class="flex items-center gap-2 text-on-surface-variant text-xs mt-0.5">
              <span class="material-symbols-outlined text-[14px]">groups</span>
              <span>${splitWith}</span>
            </div>
          </div>
        </div>
        <div class="text-right flex items-center gap-3">
          <div>
            <p class="font-bold text-on-surface">${formatCurrency(exp.amount)}</p>
            <p class="text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">${date}</p>
          </div>
          <button class="delete-expense-btn opacity-0 group-hover:opacity-100 transition-opacity text-error hover:bg-error/10 p-1.5 rounded-lg" data-id="${exp._id}">
            <span class="material-symbols-outlined text-sm">delete</span>
          </button>
        </div>
      </div>
    `;
  }).join('');

  // Attach delete handlers
  document.querySelectorAll('.delete-expense-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteExpense(btn.dataset.id);
    });
  });
}

/* ── Update budget card UI ── */
function updateBudgetUI(expenses) {
  const totalBudget = parseFloat(localStorage.getItem('activeTripBudget') || 3500);
  const spent       = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining   = totalBudget - spent;
  const percentage  = Math.min(Math.round((spent / totalBudget) * 100), 100);

  document.getElementById('budget-percentage').textContent = percentage + '%';
  document.getElementById('spent-amount').textContent      = formatCurrency(spent);
  document.getElementById('remaining-amount').textContent  = formatCurrency(remaining);

  // Animate progress bar
  const bar = document.getElementById('progress-bar');
  bar.style.width = '0%';
  setTimeout(() => {
    bar.style.transition = 'width 1s ease-out';
    bar.style.width = percentage + '%';
  }, 300);
}

/* ── Update owed / owe cards from settlement summary ── */
function updateSettlementUI(balances, currentUserId) {
  let owed = 0;
  let owe  = 0;

  Object.entries(balances).forEach(([uid, balance]) => {
    if (uid === currentUserId) {
      if (balance > 0) owed = balance;
      else             owe  = Math.abs(balance);
    }
  });

  document.getElementById('owed-amount').textContent = formatCurrency(owed);
  document.getElementById('owe-amount').textContent  = formatCurrency(owe);
}

/* ── Fetch expenses → GET /api/expenses/:tripId ── */
async function loadExpenses() {
  const tripId = getTripId();
  const token  = getToken();
  if (!tripId || !token) return;

  try {
    const res = await fetch(`${API_BASE}/api/expenses/${tripId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to load expenses');

    const { expenses } = await res.json(); // { success, count, expenses }
    renderExpenses(expenses);
    updateBudgetUI(expenses);
  } catch (err) {
    showToast(err.message || 'Could not load expenses.', 'error');
  }
}

/* ── Fetch settlement summary → GET /api/expenses/:tripId/summary ── */
async function loadSummary() {
  const tripId = getTripId();
  const token  = getToken();
  if (!tripId || !token) return;

  try {
    const res = await fetch(`${API_BASE}/api/expenses/${tripId}/summary`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error();

    const { balances } = await res.json(); // { success, balances }
    const currentUserId = localStorage.getItem('userId') || '';
    updateSettlementUI(balances, currentUserId);
  } catch (err) {
    console.warn('Could not load settlement summary:', err.message);
  }
}

/* ── Delete expense → DELETE /api/expenses/:id ── */
async function deleteExpense(id) {
  const token = getToken();
  try {
    const res = await fetch(`${API_BASE}/api/expenses/${id}`, {
      method:  'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Delete failed');
    showToast('Expense deleted.', 'success');
    loadExpenses();
    loadSummary();
  } catch (err) {
    showToast(err.message || 'Could not delete expense.', 'error');
  }
}

/* ── Add expense modal ── */
function openAddExpenseModal() {
  const existing = document.getElementById('add-expense-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'add-expense-modal';
  modal.className = 'fixed inset-0 z-[200] flex items-end justify-center bg-black/40 backdrop-blur-sm';
  modal.innerHTML = `
    <div class="w-full max-w-lg bg-white rounded-t-[2rem] p-8 space-y-5 shadow-2xl">
      <div class="flex justify-between items-center mb-2">
        <h3 class="font-headline font-bold text-xl text-primary">Add Expense</h3>
        <button id="close-modal-btn" class="material-symbols-outlined text-outline hover:text-on-surface">close</button>
      </div>

      <!-- Title -->
      <input id="exp-title" type="text" placeholder="Expense title (e.g. Dinner)"
        class="w-full h-12 px-4 bg-surface-container-high border-none rounded-xl focus:ring-1 focus:ring-primary text-on-surface placeholder:text-outline"/>

      <!-- Amount -->
      <input id="exp-amount" type="number" placeholder="Amount (e.g. 84.20)"
        class="w-full h-12 px-4 bg-surface-container-high border-none rounded-xl focus:ring-1 focus:ring-primary text-on-surface placeholder:text-outline"/>

      <!-- Category -->
      <select id="exp-category" class="w-full h-12 px-4 bg-surface-container-high border-none rounded-xl focus:ring-1 focus:ring-primary text-on-surface">
        <option value="food">Food & Dining</option>
        <option value="transport">Transport</option>
        <option value="hotel">Accommodation</option>
        <option value="shopping">Shopping</option>
        <option value="activity">Activity</option>
      </select>

      <!-- Split Type -->
      <select id="exp-split" class="w-full h-12 px-4 bg-surface-container-high border-none rounded-xl focus:ring-1 focus:ring-primary text-on-surface">
        <option value="equal">Split Equally</option>
        <option value="none">Personal (No Split)</option>
      </select>

      <!-- Currency (default USD) -->
      <input id="exp-currency" type="text" value="USD" placeholder="Currency"
        class="w-full h-12 px-4 bg-surface-container-high border-none rounded-xl focus:ring-1 focus:ring-primary text-on-surface"/>

      <button id="submit-expense-btn"
        class="w-full h-14 bg-gradient-to-r from-primary to-primary-container text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-all">
        <span class="material-symbols-outlined">add_circle</span> Save Expense
      </button>
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById('close-modal-btn').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });

  document.getElementById('submit-expense-btn').addEventListener('click', async () => {
    const title    = document.getElementById('exp-title').value.trim();
    const amount   = parseFloat(document.getElementById('exp-amount').value);
    const category = document.getElementById('exp-category').value;
    const splitType= document.getElementById('exp-split').value;
    const currency = document.getElementById('exp-currency').value.trim() || 'USD';
    const tripId   = getTripId();
    const token    = getToken();

    if (!title)           { showToast('Please enter a title.', 'error');  return; }
    if (!amount || amount <= 0) { showToast('Please enter a valid amount.', 'error'); return; }
    if (!tripId)          { showToast('No active trip found.', 'error');  return; }

    const btn = document.getElementById('submit-expense-btn');
    btn.disabled = true;
    btn.innerHTML = `<svg class="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg><span>Saving...</span>`;

    try {
      const res = await fetch(`${API_BASE}/api/expenses/${tripId}`, {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, amount, currency, category, splitType })
        // splitType 'equal' → backend uses trip members automatically
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save expense');

      showToast('Expense added!', 'success');
      modal.remove();
      loadExpenses();
      loadSummary();
    } catch (err) {
      showToast(err.message || 'Could not save expense.', 'error');
      btn.disabled = false;
      btn.innerHTML = `<span class="material-symbols-outlined">add_circle</span> Save Expense`;
    }
  });
}

/* ── DOMContentLoaded ── */
document.addEventListener('DOMContentLoaded', function () {

  const notificationBtn  = document.querySelector('.notification-btn');
  const seeAllBtn        = document.getElementById('see-all-btn');
  const fabBtn           = document.getElementById('fab-btn');
  const owedCard         = document.getElementById('owed-card');
  const oweCard          = document.getElementById('owe-card');
  const bottomNavLinks   = document.querySelectorAll('.bottom-nav-link');

  // ── Load data on open ──
  loadExpenses();
  loadSummary();

  // ── Notification ──
  notificationBtn.addEventListener('click', () => console.log('Notifications clicked'));

  // ── See all ──
  seeAllBtn.addEventListener('click', () => console.log('See all clicked'));

  // ── Owed / owe card clicks ──
  owedCard.addEventListener('click', () => console.log('Owed card clicked'));
  oweCard.addEventListener('click',  () => console.log('Owe card clicked'));

  // ── FAB → open add expense modal ──
  fabBtn.addEventListener('click', openAddExpenseModal);

  // ── Bottom nav ──
  bottomNavLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      bottomNavLinks.forEach(function (navLink) {
        navLink.classList.remove('text-[#00327d]', 'bg-[#0047AB]/10', 'rounded-2xl');
        navLink.classList.add('text-slate-400');
        navLink.querySelector('.material-symbols-outlined').style.fontVariationSettings =
          "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24";
      });
      this.classList.remove('text-slate-400');
      this.classList.add('text-[#00327d]', 'bg-[#0047AB]/10', 'rounded-2xl');
      this.querySelector('.material-symbols-outlined').style.fontVariationSettings = "'FILL' 1";
    });
  });

});