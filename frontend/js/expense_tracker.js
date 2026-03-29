/* =============================================
   expense_tracker.js — Pravas Expense Tracker
   FIXES:
   1. Tailwind config moved to top (must load before CDN)
   2. Balance cards — inline styles applied directly (Tailwind purge workaround)
   3. Profile avatar loaded from localStorage
   4. Bottom nav wired to actual page routes
   5. Notification btn → notifications_screen.html
   6. See All btn → shows all expenses (no cap)
   7. Owed/Owe card clicks → settlement breakdown modal
   8. All console.log placeholders replaced with real logic
   ============================================= */

/* ── Tailwind Config — MUST be before CDN loads ── */
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

function getTripId() {
  // Support both localStorage and URL param (e.g. ?tripId=xxx)
  const urlParam = new URLSearchParams(window.location.search).get('tripId');
  return urlParam || localStorage.getItem('activeTripId') || '';
}

function formatCurrency(amount) {
  const currency = localStorage.getItem('pref_currency') || 'INR';
  const symbol   = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '₹';
  return symbol + parseFloat(amount || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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
  food:      'restaurant',
  transport: 'directions_subway',
  hotel:     'hotel',
  shopping:  'shopping_bag',
  activity:  'local_activity',
  default:   'payments'
};

/* ── FIX 1: Load profile avatar from localStorage ── */
function loadProfileAvatar() {
  const photoUrl = localStorage.getItem('userPhotoUrl');
  const name     = localStorage.getItem('userName');
  const avatarImg = document.querySelector('header img[alt="Profile"]');
  if (avatarImg) {
    if (photoUrl) avatarImg.src = photoUrl;
    if (name)     avatarImg.alt = name;
  }
}

/* ── Balance cards now use inline styles in HTML — no JS rebuild needed ── */

/* ── Render expenses into activity list ── */
let allExpenses = []; // store for "see all" toggle
let showingAll  = false;

function renderExpenses(expenses, showAll = false) {
  allExpenses = expenses;
  const list    = document.getElementById('activity-list');
  const display = showAll ? expenses : expenses.slice(0, 5);

  if (!expenses.length) {
    list.innerHTML = `
      <div style="text-align:center;padding:2rem;color:#434653;">
        <span class="material-symbols-outlined" style="font-size:3rem;opacity:0.3;">receipt_long</span>
        <p style="margin-top:0.5rem;font-size:0.875rem;">No expenses yet. Tap + to add one.</p>
      </div>`;
    return;
  }

  list.innerHTML = display.map(exp => {
    const icon      = categoryIcons[exp.category] || categoryIcons.default;
    const payer     = exp.paidBy?.name || 'You';
    const splitWith = exp.splits?.length > 1
      ? `Split with ${exp.splits.map(s => s.user?.name || '').filter(Boolean).join(' & ')}`
      : 'Personal expense';
    const date = new Date(exp.date || exp.createdAt).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric'
    });

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
      </div>`;
  }).join('');

  // "See all" / "See less" button label
  const seeAllBtn = document.getElementById('see-all-btn');
  if (seeAllBtn) {
    if (expenses.length <= 5) {
      seeAllBtn.style.display = 'none';
    } else {
      seeAllBtn.style.display = 'inline';
      seeAllBtn.textContent = showAll ? 'See less' : `See all (${expenses.length})`;
    }
  }

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
  const spent       = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const remaining   = totalBudget - spent;
  const percentage  = Math.min(Math.round((spent / totalBudget) * 100), 100);

  // Store for other pages (notifications, dashboard)
  localStorage.setItem('activeTripSpent', spent.toString());

  const pctEl  = document.getElementById('budget-percentage');
  const spentEl = document.getElementById('spent-amount');
  const remEl  = document.getElementById('remaining-amount');
  const bar    = document.getElementById('progress-bar');

  if (pctEl)   pctEl.textContent   = percentage + '%';
  if (spentEl) spentEl.textContent = formatCurrency(spent);
  if (remEl)   remEl.textContent   = formatCurrency(Math.max(remaining, 0));

  // Change bar color when over budget
  if (bar) {
    bar.style.width = '0%';
    setTimeout(() => {
      bar.style.transition = 'width 1s ease-out';
      bar.style.width = percentage + '%';
      if (percentage >= 90) {
        bar.style.background = 'linear-gradient(to right, #ba1a1a, #93000a)';
      } else if (percentage >= 70) {
        bar.style.background = 'linear-gradient(to right, #602400, #843500)';
      }
    }, 300);
  }
}

/* ── FIX 3: Update owed/owe from settlement — re-query IDs after styleBalanceCards ── */
function updateSettlementUI(balances, currentUserId) {
  let owed = 0;
  let owe  = 0;

  Object.entries(balances).forEach(([uid, balance]) => {
    if (uid === currentUserId) {
      if (balance > 0) owed = balance;
      else             owe  = Math.abs(balance);
    }
  });

  // Re-query after styleBalanceCards() has rebuilt the DOM
  const owedEl = document.getElementById('owed-amount');
  const oweEl  = document.getElementById('owe-amount');
  if (owedEl) owedEl.textContent = formatCurrency(owed);
  if (oweEl)  oweEl.textContent  = formatCurrency(owe);
}

/* ── Settlement breakdown modal ── */
function showSettlementModal(balances) {
  const existing = document.getElementById('settlement-modal');
  if (existing) existing.remove();

  const entries = Object.entries(balances);
  if (!entries.length) {
    showToast('No settlement data available', 'error');
    return;
  }

  const rows = entries.map(([uid, balance]) => {
    const color  = balance > 0 ? '#00327d' : balance < 0 ? '#602400' : '#434653';
    const label  = balance > 0 ? 'is owed' : balance < 0 ? 'owes' : 'settled';
    const amount = formatCurrency(Math.abs(balance));
    const name   = uid === localStorage.getItem('userId') ? 'You' : `Member (${uid.slice(-4)})`;
    return `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:0.75rem 0;border-bottom:1px solid #c3c6d5;">
        <span style="font-weight:600;color:#171c1f;">${name}</span>
        <span style="color:${color};font-weight:700;">${label} ${amount}</span>
      </div>`;
  }).join('');

  const modal = document.createElement('div');
  modal.id = 'settlement-modal';
  modal.style.cssText = 'position:fixed;inset:0;z-index:300;display:flex;align-items:flex-end;justify-content:center;background:rgba(0,0,0,0.4);backdrop-filter:blur(4px);';
  modal.innerHTML = `
    <div style="width:100%;max-width:32rem;background:#fff;border-radius:2rem 2rem 0 0;padding:2rem;box-shadow:0 -20px 60px rgba(0,0,0,0.15);">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;">
        <h3 style="font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;font-size:1.25rem;color:#00327d;">Settlement Summary</h3>
        <button id="close-settlement" class="material-symbols-outlined" style="color:#737784;cursor:pointer;background:none;border:none;">close</button>
      </div>
      <div>${rows}</div>
      <p style="margin-top:1rem;font-size:0.75rem;color:#737784;text-align:center;">Balances are calculated from all trip expenses</p>
    </div>`;

  document.body.appendChild(modal);
  document.getElementById('close-settlement').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
}

/* ── Fetch expenses ── */
async function loadExpenses() {
  const tripId = getTripId();
  const token  = getToken();
  if (!tripId || !token) {
    showToast('No active trip. Please open a trip first.', 'error');
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/expenses/${tripId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to load expenses');

    const { expenses } = await res.json();
    renderExpenses(expenses, showingAll);
    updateBudgetUI(expenses);
  } catch (err) {
    showToast(err.message || 'Could not load expenses.', 'error');
  }
}

/* ── Fetch settlement summary ── */
let cachedBalances = {};
async function loadSummary() {
  const tripId = getTripId();
  const token  = getToken();
  if (!tripId || !token) return;

  try {
    const res = await fetch(`${API_BASE}/api/expenses/${tripId}/summary`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error();

    const { balances } = await res.json();
    cachedBalances = balances;
    const currentUserId = localStorage.getItem('userId') || '';
    updateSettlementUI(balances, currentUserId);
  } catch (err) {
    console.warn('Could not load settlement summary:', err.message);
  }
}

/* ── Delete expense ── */
async function deleteExpense(id) {
  const token = getToken();
  if (!confirm('Delete this expense?')) return;

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
  modal.style.cssText = 'position:fixed;inset:0;z-index:200;display:flex;align-items:flex-end;justify-content:center;background:rgba(0,0,0,0.4);backdrop-filter:blur(4px);';
  modal.innerHTML = `
    <div style="width:100%;max-width:32rem;background:#fff;border-radius:2rem 2rem 0 0;padding:2rem;box-shadow:0 -20px 60px rgba(0,0,0,0.15);">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;">
        <h3 style="font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;font-size:1.25rem;color:#00327d;">Add Expense</h3>
        <button id="close-modal-btn" class="material-symbols-outlined" style="color:#737784;cursor:pointer;background:none;border:none;">close</button>
      </div>

      <div style="display:flex;flex-direction:column;gap:0.75rem;">
        <input id="exp-title" type="text" placeholder="Expense title (e.g. Dinner)"
          style="width:100%;height:3rem;padding:0 1rem;background:#e4e9ed;border:none;border-radius:0.75rem;outline:none;font-size:0.9rem;box-sizing:border-box;"/>

        <input id="exp-amount" type="number" placeholder="Amount"
          style="width:100%;height:3rem;padding:0 1rem;background:#e4e9ed;border:none;border-radius:0.75rem;outline:none;font-size:0.9rem;box-sizing:border-box;"/>

        <select id="exp-category"
          style="width:100%;height:3rem;padding:0 1rem;background:#e4e9ed;border:none;border-radius:0.75rem;outline:none;font-size:0.9rem;box-sizing:border-box;">
          <option value="food">Food & Dining</option>
          <option value="transport">Transport</option>
          <option value="hotel">Accommodation</option>
          <option value="shopping">Shopping</option>
          <option value="activity">Activity</option>
        </select>

        <select id="exp-split"
          style="width:100%;height:3rem;padding:0 1rem;background:#e4e9ed;border:none;border-radius:0.75rem;outline:none;font-size:0.9rem;box-sizing:border-box;">
          <option value="equal">Split Equally</option>
          <option value="none">Personal (No Split)</option>
        </select>

        <input id="exp-currency" type="text" value="${localStorage.getItem('pref_currency') || 'INR'}" placeholder="Currency"
          style="width:100%;height:3rem;padding:0 1rem;background:#e4e9ed;border:none;border-radius:0.75rem;outline:none;font-size:0.9rem;box-sizing:border-box;"/>

        <button id="submit-expense-btn"
          style="width:100%;height:3.5rem;background:linear-gradient(to right,#00327d,#0047ab);color:#fff;border:none;border-radius:0.75rem;font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:0.5rem;">
          <span class="material-symbols-outlined">add_circle</span> Save Expense
        </button>
      </div>
    </div>`;

  document.body.appendChild(modal);

  document.getElementById('close-modal-btn').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });

  document.getElementById('submit-expense-btn').addEventListener('click', async () => {
    const title     = document.getElementById('exp-title').value.trim();
    const amount    = parseFloat(document.getElementById('exp-amount').value);
    const category  = document.getElementById('exp-category').value;
    const splitType = document.getElementById('exp-split').value;
    const currency  = document.getElementById('exp-currency').value.trim() || 'INR';
    const tripId    = getTripId();
    const token     = getToken();

    if (!title)              { showToast('Please enter a title.', 'error');       return; }
    if (!amount || amount <= 0) { showToast('Please enter a valid amount.', 'error'); return; }
    if (!tripId)             { showToast('No active trip found.', 'error');       return; }

    const btn = document.getElementById('submit-expense-btn');
    btn.disabled = true;
    btn.innerHTML = `<svg class="animate-spin" style="width:1.25rem;height:1.25rem;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg><span>Saving...</span>`;

    try {
      const res = await fetch(`${API_BASE}/api/expenses/${tripId}`, {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, amount, currency, category, splitType })
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

/* ── FIX 4: Bottom nav routing ── */
const NAV_ROUTES = {
  itinerary: '../html/itinerary_planner.html',
  expenses:  null, // current page
  tickets:   '../html/tickets.html',
  explore:   '../html/map_explore.html',
};

function wireBottomNav() {
  document.querySelectorAll('.bottom-nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const nav   = link.dataset.nav;
      const route = NAV_ROUTES[nav];

      if (!route) return; // already on this page

      // Active style on current
      document.querySelectorAll('.bottom-nav-link').forEach(l => {
        l.classList.remove('text-[#00327d]', 'bg-[#0047AB]/10', 'rounded-2xl');
        l.classList.add('text-slate-400');
      });
      link.classList.remove('text-slate-400');
      link.classList.add('text-[#00327d]', 'bg-[#0047AB]/10', 'rounded-2xl');

      setTimeout(() => { window.location.href = route; }, 150);
    });
  });
}

/* ── DOMContentLoaded ── */
document.addEventListener('DOMContentLoaded', function () {

  // FIX: Load profile avatar
  loadProfileAvatar();

  // Load backend data
  loadExpenses();
  loadSummary();

  // FIX: Notification → notifications screen
  const notificationBtn = document.querySelector('.notification-btn');
  if (notificationBtn) {
    notificationBtn.addEventListener('click', () => {
      window.location.href = '../html/notifications_screen.html';
    });
  }

  // FIX: See all → toggle full list
  const seeAllBtn = document.getElementById('see-all-btn');
  if (seeAllBtn) {
    seeAllBtn.addEventListener('click', () => {
      showingAll = !showingAll;
      renderExpenses(allExpenses, showingAll);
    });
  }

  // FIX: Owed card → show settlement breakdown
  document.getElementById('owed-card').addEventListener('click', () => {
    if (Object.keys(cachedBalances).length) {
      showSettlementModal(cachedBalances);
    } else {
      loadSummary().then(() => showSettlementModal(cachedBalances));
    }
  });

  // FIX: Owe card → show settlement breakdown
  document.getElementById('owe-card').addEventListener('click', () => {
    if (Object.keys(cachedBalances).length) {
      showSettlementModal(cachedBalances);
    } else {
      loadSummary().then(() => showSettlementModal(cachedBalances));
    }
  });

  // FAB → add expense
  const fabBtn = document.getElementById('fab-btn');
  if (fabBtn) fabBtn.addEventListener('click', openAddExpenseModal);

  // Bottom nav routing
  wireBottomNav();
});