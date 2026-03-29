/* =============================================
   notification_pop_up.js — Pravas Notification Popup
   Backend connected:
     GET  /api/trips              → trip reminder data
     GET  /api/weather/current    → weather alert data
     GET  /api/expenses/:tripId   → budget alert data
     POST /api/notifications/reminder → trigger trip reminder
     POST /api/notifications/weather  → trigger weather alert
     POST /api/notifications/budget   → trigger budget alert
   ============================================= */

/* ── Tailwind Config ── */
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "error-container":              "#ffdad6",
        "tertiary-fixed":               "#ffdbcb",
        "secondary-container":          "#cbe7f5",
        "primary":                      "#00327d",
        "on-primary-container":         "#a5bdff",
        "tertiary-fixed-dim":           "#ffb692",
        "on-secondary-container":       "#4e6874",
        "error":                        "#ba1a1a",
        "primary-fixed":                "#dae2ff",
        "inverse-surface":              "#2c3134",
        "surface-container-high":       "#e4e9ed",
        "secondary-fixed":              "#cbe7f5",
        "surface-container":            "#eaeef2",
        "on-primary-fixed":             "#001946",
        "on-tertiary-fixed-variant":    "#7a3000",
        "on-tertiary":                  "#ffffff",
        "on-tertiary-container":        "#ffaa80",
        "primary-container":            "#0047ab",
        "on-primary":                   "#ffffff",
        "on-surface":                   "#171c1f",
        "inverse-on-surface":           "#edf1f5",
        "background":                   "#f6fafe",
        "surface-tint":                 "#2559bd",
        "surface-container-highest":    "#dfe3e7",
        "secondary-fixed-dim":          "#afcbd8",
        "on-surface-variant":           "#434653",
        "outline":                      "#737784",
        "on-secondary-fixed":           "#021f29",
        "primary-fixed-dim":            "#b1c5ff",
        "outline-variant":              "#c3c6d5",
        "surface-variant":              "#dfe3e7",
        "surface-container-low":        "#f0f4f8",
        "on-error-container":           "#93000a",
        "surface-dim":                  "#d6dade",
        "surface":                      "#f6fafe",
        "on-tertiary-fixed":            "#341100",
        "on-primary-fixed-variant":     "#00419e",
        "inverse-primary":              "#b1c5ff",
        "on-background":                "#171c1f",
        "surface-bright":               "#f6fafe",
        "secondary":                    "#48626e",
        "tertiary-container":           "#843500",
        "tertiary":                     "#602400",
        "on-error":                     "#ffffff",
        "on-secondary-fixed-variant":   "#304a55",
        "surface-container-lowest":     "#ffffff",
        "on-secondary":                 "#ffffff"
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

/* ── Config ── */
const API_BASE = 'http://localhost:5000';

/* ── Helpers ── */
function getToken() {
  return localStorage.getItem('token') || localStorage.getItem('authToken') || null;
}

function timeAgo(dateStr) {
  if (!dateStr) return 'Just now';
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60)       return 'Just now';
  if (diff < 3600)     return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400)    return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

/* ── Close notification dropdown (preserved) ── */
function closeNotifications() {
  const dropdown = document.getElementById('notificationDropdown');
  if (dropdown) dropdown.classList.add('hidden');
}

/* ── Mark all as read (preserved + backend call) ── */
async function markAllRead() {
  // Update UI immediately
  document.querySelectorAll('#notificationDropdown .unread-dot').forEach(d => d.remove());

  const btn = document.querySelector("[onclick='markAllRead()']");
  if (btn) {
    btn.textContent = 'All caught up ✓';
    btn.disabled = true;
    btn.classList.add('opacity-50', 'cursor-default');
  }

  // Clear local unread cache
  localStorage.setItem('unreadNotifications', '[]');
}

/* ── Build a notification row HTML ── */
function buildNotificationRow(type, title, message, time, isFirst = false) {
  const configs = {
    trip: {
      bgColor:   'bg-primary-container',
      iconColor: 'text-white',
      icon:      'flight_takeoff',
      titleColor:'text-primary',
    },
    budget: {
      bgColor:   'bg-tertiary-container',
      iconColor: 'text-white',
      icon:      'account_balance_wallet',
      titleColor:'text-tertiary',
      iconFill:  true,
    },
    weather: {
      bgColor:   'bg-secondary-container',
      iconColor: 'text-on-secondary-container',
      icon:      'rainy',
      titleColor:'text-on-secondary-fixed-variant',
    },
  };

  const cfg    = configs[type] || configs.trip;
  const border = isFirst ? '' : 'border-t border-outline-variant/5';
  const fill   = cfg.iconFill ? "style=\"font-variation-settings: 'FILL' 1;\"" : '';

  return `
    <div class="px-6 py-5 flex gap-4 hover:bg-white/50 transition-colors cursor-pointer group ${border}">
      <div class="shrink-0 w-12 h-12 rounded-2xl ${cfg.bgColor} flex items-center justify-center shadow-md">
        <span class="material-symbols-outlined ${cfg.iconColor}" ${fill}>${cfg.icon}</span>
      </div>
      <div class="flex flex-col gap-1 flex-1">
        <div class="flex justify-between items-center">
          <span class="font-headline font-bold text-[15px] ${cfg.titleColor}">${title}</span>
          <span class="text-[10px] font-medium text-on-surface-variant uppercase tracking-wider">${time}</span>
        </div>
        <p class="text-sm text-on-surface leading-snug">${message}</p>
      </div>
    </div>`;
}

/* ── Render all notifications into the list ── */
function renderNotifications(notifications) {
  const list = document.querySelector('#notificationDropdown .flex.flex-col');
  if (!list) return;

  if (!notifications.length) {
    list.innerHTML = `
      <div class="px-6 py-10 flex flex-col items-center gap-3 text-on-surface-variant">
        <span class="material-symbols-outlined text-4xl">notifications_none</span>
        <p class="text-sm font-medium">You're all caught up!</p>
      </div>`;
    return;
  }

  list.innerHTML = notifications
    .map((n, i) => buildNotificationRow(n.type, n.title, n.message, n.time, i === 0))
    .join('');
}

/* ── Fetch active trip and build trip reminder notification ── */
async function fetchTripNotification(token) {
  try {
    const res  = await fetch(`${API_BASE}/api/trips`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) return null;

    const trips = data.trips || data.data || [];
    if (!trips.length) return null;

    const now    = new Date();
    const active = trips.find(t => {
      const start = new Date(t.departureDate || t.startDate);
      return start > now; // upcoming trip
    }) || trips[0];

    if (!active) return null;

    const dest      = active.destination || 'your destination';
    const departure = new Date(active.departureDate || active.startDate);
    const hoursAway = Math.round((departure - now) / 3600000);

    let message;
    if (hoursAway > 0 && hoursAway <= 24) {
      message = `Your trip to ${dest} departs in ${hoursAway} hour${hoursAway !== 1 ? 's' : ''}. Check-in is now open.`;
    } else if (hoursAway <= 0) {
      message = `Your trip to ${dest} is underway. Have a great journey!`;
    } else {
      const daysAway = Math.round(hoursAway / 24);
      message = `${daysAway} day${daysAway !== 1 ? 's' : ''} until your ${dest} adventure begins.`;
    }

    // Trigger backend reminder (fire and forget)
    fetch(`${API_BASE}/api/notifications/reminder`, {
      method:  'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body:    JSON.stringify({ tripId: active._id, destination: dest }),
    }).catch(() => {});

    return {
      type:    'trip',
      title:   `${dest} Calling`,
      message,
      time:    'Just now',
    };
  } catch (err) {
    console.error('Trip notification error:', err);
    return null;
  }
}

/* ── Fetch weather and build weather alert notification ── */
async function fetchWeatherNotification(token) {
  const city = localStorage.getItem('activeTripDestination');
  if (!city) return null;

  try {
    const res  = await fetch(
      `${API_BASE}/api/weather/current?city=${encodeURIComponent(city)}`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    const data = await res.json();
    if (!res.ok || !data.weather) return null;

    const w           = data.weather;
    const desc        = (w.description || '').toLowerCase();
    const alertTypes  = ['rain', 'drizzle', 'thunderstorm', 'snow', 'storm', 'fog', 'mist'];
    const isAlert     = alertTypes.some(t => desc.includes(t));

    if (!isAlert) return null;

    // Trigger backend weather alert (fire and forget)
    fetch(`${API_BASE}/api/notifications/weather`, {
      method:  'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body:    JSON.stringify({ destination: city }),
    }).catch(() => {});

    return {
      type:    'weather',
      title:   'Weather Update',
      message: `${w.description.charAt(0).toUpperCase() + w.description.slice(1)} expected in ${city}. Plan your outdoor activities accordingly.`,
      time:    'Just now',
    };
  } catch (err) {
    console.error('Weather notification error:', err);
    return null;
  }
}

/* ── Fetch expenses and build budget alert notification ── */
async function fetchBudgetNotification(token) {
  const tripId = localStorage.getItem('activeTripId');
  const budget = parseFloat(localStorage.getItem('activeTripBudget') || '0');
  if (!tripId || !budget) return null;

  try {
    const res  = await fetch(`${API_BASE}/api/expenses/${tripId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) return null;

    const expenses = data.expenses || [];
    const spent    = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const pct      = budget > 0 ? (spent / budget) * 100 : 0;

    // Store for other pages
    localStorage.setItem('activeTripSpent', spent.toString());

    if (pct < 70) return null; // only alert at 70%+

    const dest = localStorage.getItem('activeTripDestination') || 'your trip';

    // Trigger backend budget alert (fire and forget)
    fetch(`${API_BASE}/api/notifications/budget`, {
      method:  'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body:    JSON.stringify({ tripId, spent, budget, percentage: pct }),
    }).catch(() => {});

    return {
      type:    'budget',
      title:   'Budget Alert',
      message: `You've spent ${Math.round(pct)}% of your ${dest} budget (₹${Math.round(spent).toLocaleString('en-IN')} of ₹${budget.toLocaleString('en-IN')}). Consider nearby free attractions.`,
      time:    '2h ago',
    };
  } catch (err) {
    console.error('Budget notification error:', err);
    return null;
  }
}

/* ── Main: load all notifications ── */
async function loadNotifications() {
  const token = getToken();
  if (!token) return;

  // Show skeleton loading state
  const list = document.querySelector('#notificationDropdown .flex.flex-col');
  if (list) {
    list.innerHTML = `
      <div class="px-6 py-5 flex gap-4 animate-pulse">
        <div class="shrink-0 w-12 h-12 rounded-2xl bg-surface-container-high"></div>
        <div class="flex-1 space-y-2 py-1">
          <div class="h-3 bg-surface-container-high rounded w-3/4"></div>
          <div class="h-3 bg-surface-container-high rounded w-full"></div>
          <div class="h-3 bg-surface-container-high rounded w-1/2"></div>
        </div>
      </div>`.repeat(3);
  }

  // Fetch all three notification types in parallel
  const [tripNotif, weatherNotif, budgetNotif] = await Promise.all([
    fetchTripNotification(token),
    fetchWeatherNotification(token),
    fetchBudgetNotification(token),
  ]);

  // Build ordered list (trip first, budget second, weather third)
  const notifications = [tripNotif, budgetNotif, weatherNotif].filter(Boolean);

  renderNotifications(notifications);
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
  loadNotifications();
});