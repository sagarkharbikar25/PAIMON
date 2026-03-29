/* =============================================
   notifications_screen.js — Pravas Notifications Screen
   Backend connected:
     GET  /api/trips                  → trip reminder card
     GET  /api/weather/current        → weather alert card
     GET  /api/expenses/:tripId       → budget alert card
     POST /api/notifications/reminder → trigger reminder
     POST /api/notifications/weather  → trigger weather alert
     POST /api/notifications/budget   → trigger budget alert
   ============================================= */

/* ── Tailwind Config ── */
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "on-secondary-container":       "#4e6874",
        "error-container":              "#ffdad6",
        "tertiary-container":           "#843500",
        "surface-tint":                 "#2559bd",
        "error":                        "#ba1a1a",
        "background":                   "#f6fafe",
        "primary-fixed-dim":            "#b1c5ff",
        "on-surface":                   "#171c1f",
        "on-secondary":                 "#ffffff",
        "on-primary-fixed":             "#001946",
        "primary":                      "#00327d",
        "surface-dim":                  "#d6dade",
        "on-background":                "#171c1f",
        "inverse-on-surface":           "#edf1f5",
        "surface-container-low":        "#f0f4f8",
        "surface-container-high":       "#e4e9ed",
        "outline":                      "#737784",
        "on-surface-variant":           "#434653",
        "tertiary":                     "#602400",
        "on-primary-fixed-variant":     "#00419e",
        "surface-container-highest":    "#dfe3e7",
        "primary-fixed":                "#dae2ff",
        "inverse-primary":              "#b1c5ff",
        "secondary-container":          "#cbe7f5",
        "secondary":                    "#48626e",
        "on-tertiary-fixed":            "#341100",
        "primary-container":            "#0047ab",
        "surface":                      "#f6fafe",
        "on-primary-container":         "#a5bdff",
        "on-error":                     "#ffffff",
        "inverse-surface":              "#2c3134",
        "surface-bright":               "#f6fafe",
        "on-secondary-fixed":           "#021f29",
        "on-tertiary-container":        "#ffaa80",
        "surface-variant":              "#dfe3e7",
        "tertiary-fixed":               "#ffdbcb",
        "surface-container-lowest":     "#ffffff",
        "on-tertiary":                  "#ffffff",
        "surface-container":            "#eaeef2",
        "on-primary":                   "#ffffff",
        "outline-variant":              "#c3c6d5",
        "secondary-fixed-dim":          "#afcbd8",
        "on-error-container":           "#93000a",
        "secondary-fixed":              "#cbe7f5",
        "on-secondary-fixed-variant":   "#304a55",
        "tertiary-fixed-dim":           "#ffb692",
        "on-tertiary-fixed-variant":    "#7a3000"
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

/* ── Dismiss card with animation (preserved) ── */
function dismissCard(btn) {
  const card = btn.closest('.group');
  if (!card) return;
  card.classList.add('card-dismissing');
  card.addEventListener('animationend', () => card.remove(), { once: true });
}

/* ── Skeleton loader for a section ── */
function showSkeleton(container) {
  container.innerHTML = `
    <div class="group relative bg-surface-container-lowest rounded-xl p-6 shadow-sm overflow-hidden animate-pulse">
      <div class="flex gap-5">
        <div class="h-14 w-14 rounded-xl bg-surface-container-high shrink-0"></div>
        <div class="flex-1 space-y-3">
          <div class="h-4 bg-surface-container-high rounded w-1/3"></div>
          <div class="h-3 bg-surface-container-high rounded w-full"></div>
          <div class="h-3 bg-surface-container-high rounded w-2/3"></div>
        </div>
      </div>
    </div>`.repeat(2);
}

/* ── Update "X New" badge count ── */
function updateBadge(count) {
  const badge = document.querySelector('.bg-tertiary-fixed.text-tertiary');
  if (badge) badge.textContent = `${count} New`;
}

/* ── Render trip reminder card ── */
function renderTripCard(trip) {
  const dest      = trip.destination || 'your destination';
  const departure = new Date(trip.departureDate || trip.startDate);
  const now       = new Date();
  const hoursAway = Math.round((departure - now) / 3600000);
  const daysAway  = Math.ceil(hoursAway / 24);

  let timeLabel, boldText;
  if (hoursAway <= 0) {
    timeLabel = 'Underway';
    boldText  = `Your ${dest} trip is underway!`;
  } else if (hoursAway <= 24) {
    timeLabel = 'Today';
    boldText  = `${hoursAway} hour${hoursAway !== 1 ? 's' : ''} to departure`;
  } else {
    timeLabel = `${daysAway}d away`;
    boldText  = `${daysAway} day${daysAway !== 1 ? 's' : ''} to departure`;
  }

  const fmt = d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return `
    <div class="group relative bg-surface-container-lowest rounded-xl p-6 shadow-[0_12px_40px_rgba(23,28,31,0.06)] overflow-hidden transition-all hover:translate-y-[-2px]">
      <div class="absolute top-0 left-0 w-1.5 h-full bg-primary-container"></div>
      <div class="flex gap-5">
        <div class="h-14 w-14 rounded-xl bg-secondary-container flex items-center justify-center shrink-0">
          <span class="material-symbols-outlined text-primary text-3xl">event_upcoming</span>
        </div>
        <div class="flex-1 space-y-2">
          <div class="flex justify-between items-start">
            <h3 class="font-headline font-bold text-lg leading-none">Upcoming Trip</h3>
            <span class="font-label text-[11px] text-on-surface-variant">${timeLabel}</span>
          </div>
          <p class="text-on-surface-variant text-sm leading-relaxed">
            Your journey to <span class="font-semibold text-on-surface">${dest}</span> begins in
            <span class="text-primary font-bold">${boldText}</span>.
            ${hoursAway > 0 ? "Don't forget to check your boarding pass!" : 'Have a wonderful trip!'}
          </p>
          ${trip.departureDate ? `
          <p class="text-xs text-on-surface-variant">
            ${fmt(trip.departureDate || trip.startDate)} — ${fmt(trip.returnDate || trip.endDate)}
          </p>` : ''}
          <div class="pt-2 flex gap-3">
            <button class="bg-primary text-white text-xs font-bold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              onclick="window.location.href='../html/itinerary_planner.html'">
              View Itinerary
            </button>
            <button class="bg-surface-container-high text-on-surface text-xs font-bold px-4 py-2 rounded-lg hover:bg-surface-container-highest transition-colors"
              onclick="dismissCard(this)">
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>`;
}

/* ── Render weather alert card ── */
function renderWeatherCard(weather, city) {
  const desc     = weather.description || 'adverse weather';
  const temp     = weather.temperature !== undefined ? `${Math.round(weather.temperature)}°C` : '';
  const isRain   = desc.toLowerCase().includes('rain') || desc.toLowerCase().includes('drizzle');
  const icon     = isRain ? 'rainy' : 'thunderstorm';
  const capDesc  = desc.charAt(0).toUpperCase() + desc.slice(1);

  return `
    <div class="group relative bg-surface-container-lowest rounded-xl p-6 shadow-[0_12px_40px_rgba(23,28,31,0.06)] overflow-hidden transition-all hover:translate-y-[-2px]">
      <div class="absolute top-0 left-0 w-1.5 h-full bg-error"></div>
      <div class="flex gap-5">
        <div class="h-14 w-14 rounded-xl bg-error-container flex items-center justify-center shrink-0">
          <span class="material-symbols-outlined text-error text-3xl">${icon}</span>
        </div>
        <div class="flex-1 space-y-2">
          <div class="flex justify-between items-start">
            <h3 class="font-headline font-bold text-lg leading-none">Weather Alert</h3>
            <span class="font-label text-[11px] text-on-surface-variant">${temp}</span>
          </div>
          <p class="text-on-surface-variant text-sm leading-relaxed">
            <span class="font-semibold text-on-surface">${capDesc} expected in ${city}</span>.
            Your outdoor activities might be affected. We recommend indoor alternatives.
          </p>
          <div class="relative w-full h-32 mt-4 rounded-xl overflow-hidden bg-surface-container-high flex items-center justify-center">
            <span class="material-symbols-outlined text-6xl text-on-surface-variant/30">${icon}</span>
            <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-4">
              <span class="text-white text-xs font-medium flex items-center gap-2">
                <span class="material-symbols-outlined text-sm">explore</span>
                Explore Indoor Alternatives
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>`;
}

/* ── Render budget alert card ── */
function renderBudgetCard(spent, budget, dest) {
  const pct      = budget > 0 ? Math.min(Math.round((spent / budget) * 100), 100) : 0;
  const spentFmt = `₹${Math.round(spent).toLocaleString('en-IN')}`;
  const budgFmt  = `₹${Math.round(budget).toLocaleString('en-IN')}`;
  const color    = pct >= 90 ? 'bg-error' : 'bg-tertiary';

  return `
    <div class="group relative bg-surface-container-lowest rounded-xl p-6 shadow-[0_12px_40px_rgba(23,28,31,0.06)] overflow-hidden transition-all hover:translate-y-[-2px]">
      <div class="absolute top-0 left-0 w-1.5 h-full bg-tertiary"></div>
      <div class="flex gap-5">
        <div class="h-14 w-14 rounded-xl bg-tertiary-fixed flex items-center justify-center shrink-0">
          <span class="material-symbols-outlined text-tertiary text-3xl">account_balance_wallet</span>
        </div>
        <div class="flex-1 space-y-3">
          <div class="flex justify-between items-start">
            <h3 class="font-headline font-bold text-lg leading-none">Budget Alert</h3>
            <span class="font-label text-[11px] text-on-surface-variant">Live</span>
          </div>
          <p class="text-on-surface-variant text-sm leading-relaxed">
            Spending threshold reached! You have
            <span class="font-bold text-tertiary">spent ${pct}%</span>
            of your allocated budget for ${dest || 'this trip'}.
          </p>
          <div class="bg-surface-container-high h-4 w-full rounded-full overflow-hidden">
            <div class="${color} h-full rounded-full transition-all duration-700" style="width: ${pct}%"></div>
          </div>
          <div class="flex justify-between text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
            <span>${spentFmt} Spent</span>
            <span>${budgFmt} Total</span>
          </div>
        </div>
      </div>
    </div>`;
}

/* ── Empty state ── */
function emptyCard(message) {
  return `
    <div class="bg-surface-container-lowest rounded-xl p-8 flex flex-col items-center gap-3 text-on-surface-variant shadow-sm">
      <span class="material-symbols-outlined text-4xl">notifications_none</span>
      <p class="text-sm font-medium">${message}</p>
    </div>`;
}

/* ── Fetch & render trip reminder ── */
async function loadTripSection(token) {
  const section = document.querySelector('section.space-y-4:first-of-type');
  if (!section) return 0;

  const cardsArea = section.querySelector('.space-y-4') || section;

  try {
    const res  = await fetch(`${API_BASE}/api/trips`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) return 0;

    const trips = data.trips || data.data || [];
    if (!trips.length) {
      // Replace trip card only
      const tripCard = section.querySelector('.group:first-of-type');
      if (tripCard) tripCard.outerHTML = emptyCard('No upcoming trips found.');
      return 0;
    }

    const now    = new Date();
    const active = trips.find(t => new Date(t.departureDate || t.startDate) > now) || trips[0];

    // Store for other pages
    localStorage.setItem('activeTripId',          active._id);
    localStorage.setItem('activeTripDestination', active.destination || '');
    localStorage.setItem('activeTripBudget',      active.budget || 0);

    // Replace static trip card
    const tripCard = section.querySelector('.group');
    if (tripCard) tripCard.outerHTML = renderTripCard(active);

    // Trigger backend reminder (fire and forget)
    fetch(`${API_BASE}/api/notifications/reminder`, {
      method:  'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body:    JSON.stringify({ tripId: active._id, destination: active.destination }),
    }).catch(() => {});

    return 1;
  } catch (err) {
    console.error('Trip section error:', err);
    return 0;
  }
}

/* ── Fetch & render weather alert ── */
async function loadWeatherSection(token) {
  const city = localStorage.getItem('activeTripDestination');

  // Find weather card (second .group in Priority Alerts section)
  const section   = document.querySelector('section.space-y-4:first-of-type');
  const allCards  = section ? section.querySelectorAll('.group') : [];
  const weatherEl = allCards[1] || null;

  if (!city) {
    if (weatherEl) weatherEl.outerHTML = emptyCard('No destination set for weather alerts.');
    return 0;
  }

  try {
    const res  = await fetch(
      `${API_BASE}/api/weather/current?city=${encodeURIComponent(city)}`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    const data = await res.json();
    if (!res.ok || !data.weather) return 0;

    const w      = data.weather;
    const desc   = (w.description || '').toLowerCase();
    const isAlert = ['rain','drizzle','thunderstorm','snow','storm','fog','mist'].some(t => desc.includes(t));

    if (!isAlert) {
      if (weatherEl) weatherEl.outerHTML = emptyCard(`Clear conditions in ${city} — no weather alerts.`);
      return 0;
    }

    if (weatherEl) weatherEl.outerHTML = renderWeatherCard(w, city);

    // Trigger backend weather alert
    fetch(`${API_BASE}/api/notifications/weather`, {
      method:  'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body:    JSON.stringify({ destination: city }),
    }).catch(() => {});

    return 1;
  } catch (err) {
    console.error('Weather section error:', err);
    return 0;
  }
}

/* ── Fetch & render budget alert ── */
async function loadBudgetSection(token) {
  const tripId = localStorage.getItem('activeTripId');
  const budget = parseFloat(localStorage.getItem('activeTripBudget') || '0');
  const dest   = localStorage.getItem('activeTripDestination') || 'this trip';

  const budgetSection = document.querySelector('section:nth-of-type(2)');
  const budgetCard    = budgetSection ? budgetSection.querySelector('.group') : null;

  if (!tripId || !budget) {
    if (budgetCard) budgetCard.outerHTML = emptyCard('No budget data available yet.');
    return 0;
  }

  try {
    const res  = await fetch(`${API_BASE}/api/expenses/${tripId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) return 0;

    const expenses = data.expenses || [];
    const spent    = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const pct      = budget > 0 ? (spent / budget) * 100 : 0;

    // Store for dashboard
    localStorage.setItem('activeTripSpent', spent.toString());

    if (pct < 70) {
      if (budgetCard) budgetCard.outerHTML = emptyCard(`Budget on track — ${Math.round(pct)}% used.`);
      return 0;
    }

    if (budgetCard) budgetCard.outerHTML = renderBudgetCard(spent, budget, dest);

    // Trigger backend budget alert
    fetch(`${API_BASE}/api/notifications/budget`, {
      method:  'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body:    JSON.stringify({ tripId, spent, budget, percentage: pct }),
    }).catch(() => {});

    return 1;
  } catch (err) {
    console.error('Budget section error:', err);
    return 0;
  }
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', async () => {
  const token = getToken();
  if (!token) {
    window.location.href = '../html/login.html';
    return;
  }

  // Run all 3 fetches in parallel
  const [tripCount, weatherCount, budgetCount] = await Promise.all([
    loadTripSection(token),
    loadWeatherSection(token),
    loadBudgetSection(token),
  ]);

  // Update "X New" badge with real count
  updateBadge(tripCount + weatherCount + budgetCount);
});

/* ── Badge update helper ── */
function updateBadge(count) {
  const badge = document.querySelector('.bg-tertiary-fixed.text-tertiary');
  if (badge) badge.textContent = count > 0 ? `${count} New` : 'All clear';
}