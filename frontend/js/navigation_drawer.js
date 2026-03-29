/* =============================================
   navigation_drawer.js — Pravas Dashboard
   Backend connected:
     GET /api/auth/me           → user profile
     GET /api/trips             → active trip
     GET /api/weather/current   → weather card
   ============================================= */

/* ── Tailwind Config ── */
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "surface":                      "#f6fafe",
        "secondary-fixed-dim":          "#afcbd8",
        "outline-variant":              "#c3c6d5",
        "on-secondary-container":       "#4e6874",
        "surface-tint":                 "#2559bd",
        "surface-container":            "#eaeef2",
        "on-surface-variant":           "#434653",
        "background":                   "#f6fafe",
        "surface-container-high":       "#e4e9ed",
        "inverse-on-surface":           "#edf1f5",
        "surface-bright":               "#f6fafe",
        "on-primary-fixed":             "#001946",
        "on-background":                "#171c1f",
        "secondary-container":          "#cbe7f5",
        "on-surface":                   "#171c1f",
        "surface-dim":                  "#d6dade",
        "on-tertiary-fixed":            "#341100",
        "on-primary-container":         "#a5bdff",
        "tertiary-fixed-dim":           "#ffb692",
        "surface-container-lowest":     "#ffffff",
        "surface-container-low":        "#f0f4f8",
        "on-secondary":                 "#ffffff",
        "secondary-fixed":              "#cbe7f5",
        "on-primary":                   "#ffffff",
        "error-container":              "#ffdad6",
        "secondary":                    "#48626e",
        "on-primary-fixed-variant":     "#00419e",
        "primary-fixed":                "#dae2ff",
        "on-tertiary-container":        "#ffaa80",
        "error":                        "#ba1a1a",
        "on-secondary-fixed-variant":   "#304a55",
        "on-secondary-fixed":           "#021f29",
        "on-tertiary":                  "#ffffff",
        "inverse-primary":              "#b1c5ff",
        "tertiary-container":           "#843500",
        "tertiary":                     "#602400",
        "on-error":                     "#ffffff",
        "outline":                      "#737784",
        "surface-container-highest":    "#dfe3e7",
        "on-tertiary-fixed-variant":    "#7a3000",
        "primary-fixed-dim":            "#b1c5ff",
        "inverse-surface":              "#2c3134",
        "on-error-container":           "#93000a",
        "primary-container":            "#0047ab",
        "tertiary-fixed":               "#ffdbcb",
        "primary":                      "#00327d",
        "surface-variant":              "#dfe3e7"
      },
      fontFamily: {
        "headline": ["Plus Jakarta Sans"],
        "body":     ["Inter"],
        "label":    ["Inter"]
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg":      "1rem",
        "xl":      "1.5rem",
        "full":    "9999px"
      }
    }
  }
};

/* ── Config ── */
const API_BASE = 'http://localhost:5000';

/* ── Helpers ── */
function getToken() {
  return localStorage.getItem('token') || localStorage.getItem('authToken') || null;
}

function showToast(message, type = 'error') {
  const existing = document.getElementById('pravas-toast');
  if (existing) existing.remove();

  const colors = type === 'success' ? 'bg-primary text-white' : 'bg-error text-on-error';
  const icon   = type === 'success' ? 'check_circle' : 'error';

  const toast = document.createElement('div');
  toast.id = 'pravas-toast';
  toast.className = `fixed top-20 left-1/2 -translate-x-1/2 z-[9999] px-6 py-3 rounded-2xl shadow-xl font-bold text-sm flex items-center gap-2 ${colors}`;
  toast.innerHTML = `<span class="material-symbols-outlined text-base">${icon}</span>${message}`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

/* ── Drawer Toggle (preserved) ── */
function toggleDrawer() {
  const drawer = document.getElementById('navDrawer');
  drawer.classList.toggle('drawer-hidden');
}

/* ── 1. Load user profile → populate drawer header ── */
async function loadUserProfile() {
  const token = getToken();
  if (!token) {
    window.location.href = '../html/login.html';
    return;
  }

  try {
    const res  = await fetch(`${API_BASE}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();

    if (!res.ok) {
      if (res.status === 401) {
        localStorage.clear();
        window.location.href = '../html/login.html';
      }
      return;
    }

    const user = data.user || data;

    // Store for other pages
    localStorage.setItem('userId',       user._id);
    localStorage.setItem('userName',     user.name  || '');
    localStorage.setItem('userEmail',    user.email || '');
    localStorage.setItem('userPhotoUrl', user.photoUrl || '');

    // Drawer: name
    const drawerName = document.querySelector('#navDrawer h2.font-headline');
    if (drawerName) drawerName.textContent = user.name || 'Traveller';

    // Drawer: avatar (both drawer + header)
    const avatarImgs = document.querySelectorAll(
      '#navDrawer img, header .rounded-full img'
    );
    avatarImgs.forEach(img => {
      if (user.photoUrl) img.src = user.photoUrl;
      if (user.name)     img.alt = user.name;
    });

    // Drawer: member badge
    const badge = document.querySelector('#navDrawer .bg-tertiary-fixed');
    if (badge) badge.textContent = user.memberTier || 'Explorer';

    // Drawer: status
    const statusEl = document.querySelector('#navDrawer .bg-slate-50 .font-bold');
    if (statusEl) statusEl.textContent = user.status || 'Active Traveller';

    // Header greeting
    const headerGreeting = document.querySelector('main header h1');
    if (headerGreeting && user.name) {
      headerGreeting.textContent = `Welcome back, ${user.name.split(' ')[0]}`;
    }

  } catch (err) {
    console.error('Profile load error:', err);
  }
}

/* ── 2. Load active trip → populate main canvas ── */
async function loadActiveTrip() {
  const token = getToken();
  if (!token) return;

  try {
    const res  = await fetch(`${API_BASE}/api/trips`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) return;

    // Trips come back as array — pick the most recent / in-progress one
    const trips = data.trips || data.data || [];
    if (!trips.length) return;

    // Prefer ongoing trip; fallback to latest
    const now    = new Date();
    const active = trips.find(t => {
      const start = new Date(t.departureDate || t.startDate);
      const end   = new Date(t.returnDate    || t.endDate);
      return start <= now && now <= end;
    }) || trips[0];

    // Store for other pages to use
    localStorage.setItem('activeTripId',          active._id);
    localStorage.setItem('activeTripDestination', active.destination     || '');
    localStorage.setItem('activeTripBudget',      active.budget          || 0);
    localStorage.setItem('activeTripDays',
      active.days || Math.ceil(
        (new Date(active.returnDate || active.endDate) -
         new Date(active.departureDate || active.startDate)) / 86400000
      ) || 6
    );

    // Format date range string
    const fmt  = d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const range = `${fmt(active.departureDate || active.startDate)} — ${fmt(active.returnDate || active.endDate)}`;
    localStorage.setItem('activeTripDateRange',
      `${range} • ${active.members?.length || 1} Traveler${(active.members?.length || 1) > 1 ? 's' : ''}`
    );

    // ── Update main canvas ──

    // Destination heading
    const destH2 = document.querySelector('main .absolute.bottom-0 h2');
    if (destH2) destH2.textContent = active.destination || destH2.textContent;

    // Date badge
    const dateBadge = document.querySelector('main header .bg-secondary-container');
    if (dateBadge) dateBadge.textContent = range;

    // Sub-heading
    const subHead = document.querySelector('main header p.text-on-surface-variant');
    if (subHead && active.destination) {
      subHead.textContent = `Managing the details for your ${active.destination} Expedition.`;
    }

    // Budget progress bar
    updateBudgetCard(active);

    // Map label
    const mapLabel = document.querySelector('[data-location]');
    if (mapLabel && active.destination) mapLabel.dataset.location = active.destination;

    // Load weather for this destination
    if (active.destination) {
      loadWeather(active.destination);
    }

  } catch (err) {
    console.error('Trip load error:', err);
  }
}

/* ── 3. Load weather → weather card ── */
async function loadWeather(city) {
  const token = getToken();
  if (!token) return;

  try {
    const res  = await fetch(
      `${API_BASE}/api/weather/current?city=${encodeURIComponent(city)}`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    const data = await res.json();
    if (!res.ok) return;

    const w = data.weather;

    // Temperature
    const tempEl = document.querySelector('.bg-secondary-container .text-4xl');
    if (tempEl && w.temperature !== undefined) {
      tempEl.textContent = `${Math.round(w.temperature)}°C`;
    }

    // Description
    const descEl = document.querySelector('.bg-secondary-container .text-sm.font-medium');
    if (descEl && w.description) {
      descEl.textContent = w.description.charAt(0).toUpperCase() + w.description.slice(1) + '.';
    }

    // Weather icon (material symbol swap)
    const iconEl = document.querySelector('.bg-secondary-container .material-symbols-outlined.absolute');
    if (iconEl && w.icon) {
      const iconMap = {
        'clear':       'wb_sunny',
        'clouds':      'cloud',
        'rain':        'rainy',
        'drizzle':     'rainy',
        'thunderstorm':'thunderstorm',
        'snow':        'ac_unit',
        'mist':        'foggy',
        'fog':         'foggy',
      };
      const key    = (w.description || '').toLowerCase();
      const symbol = Object.keys(iconMap).find(k => key.includes(k));
      if (symbol) iconEl.textContent = iconMap[symbol];
    }

    // Weather heading (city name)
    const weatherTitle = document.querySelector('.bg-secondary-container h3');
    if (weatherTitle) weatherTitle.textContent = `${city} Weather`;

  } catch (err) {
    console.error('Weather load error:', err);
  }
}

/* ── Budget card helper ── */
function updateBudgetCard(trip) {
  const budget = parseFloat(trip.budget) || 0;

  // Spent = we don't have it here; use localStorage from expense page if set
  const spent  = parseFloat(localStorage.getItem('activeTripSpent') || '0');
  const pct    = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;

  const spentEl  = document.querySelector('.bg-white .text-xl.font-bold.text-\\[\\#00327d\\]');
  const barEl    = document.querySelector('.bg-white .bg-primary.h-full');
  const labelEl  = document.querySelector('.bg-white .text-xs.text-slate-400');

  if (spentEl)  spentEl.textContent  = `₹${spent.toLocaleString('en-IN')}`;
  if (barEl)    barEl.style.width    = `${pct}%`;
  if (labelEl)  labelEl.textContent  = `${Math.round(pct)}% of your ₹${budget.toLocaleString('en-IN')} travel budget used`;
}

/* ── Logout helper (for Settings nav item) ── */
function logout() {
  localStorage.clear();
  window.location.href = '../html/login.html';
}

/* ── Wire logout to Settings link ── */
function wireLogout() {
  const settingsLink = document.querySelector('#navDrawer a[href="#"]:last-of-type');
  // Better: find by text content
  document.querySelectorAll('#navDrawer nav a').forEach(link => {
    if (link.textContent.trim().includes('Settings')) {
      // Settings page navigation — keep as href, don't hijack
    }
  });

  // Wire AI Concierge FAB → chatbot page
  const fab = document.querySelector('button.fixed.bottom-8.right-8');
  if (fab) {
    fab.addEventListener('click', () => {
      window.location.href = '../html/chatbot.html';
    });
  }
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', async () => {
  await loadUserProfile();
  await loadActiveTrip();   // also triggers loadWeather() internally
  wireLogout();
});