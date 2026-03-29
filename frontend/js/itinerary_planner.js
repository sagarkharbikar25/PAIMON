// =============================================
//  itinerary_planner.js
//  Pravas — Itinerary Planner (Frontend ↔ Backend)
// =============================================

// ── Tailwind Config ──────────────────────────
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary-fixed": "#dae2ff",
        "background": "#f6fafe",
        "surface-dim": "#d6dade",
        "secondary": "#48626e",
        "on-surface": "#171c1f",
        "tertiary": "#602400",
        "tertiary-fixed": "#ffdbcb",
        "primary": "#00327d",
        "on-tertiary-fixed": "#341100",
        "surface-bright": "#f6fafe",
        "on-secondary-container": "#4e6874",
        "secondary-fixed": "#cbe7f5",
        "surface-tint": "#2559bd",
        "on-primary-fixed": "#001946",
        "primary-fixed-dim": "#b1c5ff",
        "on-tertiary-fixed-variant": "#7a3000",
        "on-primary": "#ffffff",
        "on-error": "#ffffff",
        "primary-container": "#0047ab",
        "on-secondary-fixed": "#021f29",
        "surface-container-highest": "#dfe3e7",
        "surface-container": "#eaeef2",
        "surface": "#f6fafe",
        "inverse-primary": "#b1c5ff",
        "error-container": "#ffdad6",
        "tertiary-fixed-dim": "#ffb692",
        "surface-variant": "#dfe3e7",
        "on-surface-variant": "#434653",
        "on-secondary": "#ffffff",
        "on-primary-fixed-variant": "#00419e",
        "on-tertiary": "#ffffff",
        "outline": "#737784",
        "surface-container-low": "#f0f4f8",
        "surface-container-high": "#e4e9ed",
        "error": "#ba1a1a",
        "on-tertiary-container": "#ffaa80",
        "on-primary-container": "#a5bdff",
        "outline-variant": "#c3c6d5",
        "secondary-container": "#cbe7f5",
        "inverse-on-surface": "#edf1f5",
        "secondary-fixed-dim": "#afcbd8",
        "surface-container-lowest": "#ffffff",
        "inverse-surface": "#2c3134",
        "on-error-container": "#93000a",
        "on-secondary-fixed-variant": "#304a55",
        "on-background": "#171c1f",
        "tertiary-container": "#843500"
      },
      fontFamily: {
        "headline": ["Plus Jakarta Sans"],
        "body": ["Inter"],
        "label": ["Inter"]
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "1rem",
        "xl": "1.5rem",
        "full": "9999px"
      },
    },
  },
};

// ── Config ────────────────────────────────────
const API_BASE = 'http://localhost:5000';

// ── Helpers ───────────────────────────────────
function getToken() {
  return localStorage.getItem('token') || localStorage.getItem('authToken') || null;
}

function showToast(message, type = 'success') {
  const existing = document.getElementById('pravas-toast');
  if (existing) existing.remove();

  const colors = type === 'success'
    ? 'bg-primary text-white'
    : 'bg-error text-on-error';

  const toast = document.createElement('div');
  toast.id = 'pravas-toast';
  toast.className = `fixed top-6 left-1/2 -translate-x-1/2 z-[9999] px-6 py-3 rounded-2xl shadow-xl font-bold text-sm flex items-center gap-2 transition-all duration-300 ${colors}`;
  toast.innerHTML = `<span class="material-symbols-outlined text-base">${type === 'success' ? 'check_circle' : 'error'}</span>${message}`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

function setButtonLoading(btn, loading) {
  if (loading) {
    btn.dataset.originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `
      <svg class="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
      </svg>
      Generating...`;
  } else {
    btn.disabled = false;
    btn.innerHTML = btn.dataset.originalText || btn.innerHTML;
  }
}

// ── Load trip context from localStorage ───────
function getTripContext() {
  return {
    tripId:      localStorage.getItem('activeTripId'),
    destination: localStorage.getItem('activeTripDestination') || 'Kyoto',
    days:        parseInt(localStorage.getItem('activeTripDays') || '6'),
    budget:      parseInt(localStorage.getItem('activeTripBudget') || '10000'),
    interests:   JSON.parse(localStorage.getItem('activeTripInterests') || '["sightseeing"]'),
  };
}

// ── Render itinerary days into DOM ─────────────
function renderItinerary(itinerary) {
  // Update hero heading
  const titleEl = document.querySelector('h2.font-headline');
  if (titleEl && itinerary.destination) {
    titleEl.textContent = itinerary.destination;
  }

  // Update date scroller labels from day count
  const dateButtons = document.querySelectorAll('nav.flex.gap-4 button');
  if (itinerary.days && itinerary.days.length > 0) {
    itinerary.days.forEach((dayData, i) => {
      if (dateButtons[i]) {
        dateButtons[i].querySelector('span:last-child').textContent = `D${dayData.day}`;
      }
    });
  }

  // Get the main timeline container
  const mainGrid = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-12');
  if (!mainGrid) return;

  const timelineCol = mainGrid.querySelector('.md\\:col-span-8');
  if (!timelineCol) return;

  // Store original static HTML for fallback
  if (!timelineCol.dataset.originalHtml) {
    timelineCol.dataset.originalHtml = timelineCol.innerHTML;
  }

  // Get day 1 data (currently active day)
  const activeDay = itinerary.days[0];
  if (!activeDay) return;

  timelineCol.innerHTML = `
    <!-- Morning -->
    <div>
      <div class="flex items-center gap-4 mb-6">
        <div class="bg-tertiary-fixed text-on-tertiary-fixed-variant px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase">Morning</div>
        <div class="h-px flex-grow bg-outline-variant/30"></div>
      </div>
      <div class="bg-surface-container-lowest rounded-xl p-6 shadow-sm">
        <h3 class="text-xl font-headline font-bold text-on-surface mb-2">Day ${activeDay.day} — Morning</h3>
        <p class="text-on-surface-variant text-sm leading-relaxed">${activeDay.morning || 'Morning activities not specified.'}</p>
        ${activeDay.places && activeDay.places.length > 0 ? `
          <div class="flex flex-wrap gap-2 mt-4">
            ${activeDay.places.map(p => `
              <span class="text-xs bg-secondary-fixed text-on-secondary-fixed px-3 py-1 rounded-full font-semibold">${p}</span>
            `).join('')}
          </div>
        ` : ''}
      </div>
    </div>

    <!-- Afternoon -->
    <div class="mt-12">
      <div class="flex items-center gap-4 mb-6">
        <div class="bg-secondary-fixed text-on-secondary-fixed-variant px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase">Afternoon</div>
        <div class="h-px flex-grow bg-outline-variant/30"></div>
      </div>
      <div class="bg-surface-container-lowest rounded-xl p-6 shadow-sm">
        <h3 class="text-xl font-headline font-bold text-on-surface mb-2">Day ${activeDay.day} — Afternoon</h3>
        <p class="text-on-surface-variant text-sm leading-relaxed">${activeDay.afternoon || 'Afternoon activities not specified.'}</p>
      </div>
    </div>

    <!-- Evening -->
    <div class="mt-12">
      <div class="flex items-center gap-4 mb-6">
        <div class="bg-primary-fixed text-on-primary-fixed-variant px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase">Evening</div>
        <div class="h-px flex-grow bg-outline-variant/30"></div>
      </div>
      <div class="bg-surface-container-lowest rounded-xl p-6 shadow-sm">
        <h3 class="text-xl font-headline font-bold text-on-surface mb-2">Day ${activeDay.day} — Evening</h3>
        <p class="text-on-surface-variant text-sm leading-relaxed">${activeDay.evening || 'Evening activities not specified.'}</p>
      </div>
    </div>

    <!-- Tips (if any) -->
    ${itinerary.tips && itinerary.tips.length > 0 ? `
    <div class="mt-12 bg-primary p-8 rounded-[2rem] text-on-primary space-y-3">
      <div class="inline-block bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">Concierge Tips</div>
      <ul class="space-y-2 mt-2">
        ${itinerary.tips.map(tip => `
          <li class="text-sm opacity-90 flex items-start gap-2">
            <span class="material-symbols-outlined text-sm mt-0.5">tips_and_updates</span>
            ${tip}
          </li>
        `).join('')}
      </ul>
    </div>
    ` : ''}
  `;

  // Update sidebar Day Summary
  updateDaySummary(activeDay, itinerary.totalEstimatedCost);

  // Wire up date scroller buttons for day switching
  wireupDayScroller(itinerary, timelineCol);
}

// ── Update sidebar day summary ─────────────────
function updateDaySummary(dayData, totalCost) {
  const summaryCards = document.querySelectorAll('.bg-surface-container-low.p-8.rounded-\\[2rem\\]');
  const sidebar = summaryCards[0];
  if (!sidebar) return;

  const spendEl = sidebar.querySelector('.text-tertiary.font-bold');
  if (spendEl && dayData.estimatedCost) {
    spendEl.textContent = `₹${dayData.estimatedCost.toLocaleString('en-IN')}`;
  }
}

// ── Day scroller tab switching ─────────────────
function wireupDayScroller(itinerary, timelineCol) {
  const dateButtons = document.querySelectorAll('nav.flex.gap-4 button');

  dateButtons.forEach((btn, i) => {
    btn.onclick = () => {
      // Update active styles
      dateButtons.forEach(b => {
        b.classList.remove('bg-primary', 'text-on-primary');
        b.classList.add('bg-surface-container-low', 'text-on-surface-variant');
      });
      btn.classList.add('bg-primary', 'text-on-primary');
      btn.classList.remove('bg-surface-container-low', 'text-on-surface-variant');

      // Re-render for selected day
      const selectedDay = itinerary.days[i];
      if (selectedDay) {
        renderDay(selectedDay, timelineCol, itinerary.tips);
        updateDaySummary(selectedDay, itinerary.totalEstimatedCost);
      }
    };
  });
}

// ── Render a single day into timeline col ─────
function renderDay(dayData, container, tips = []) {
  container.innerHTML = `
    <div>
      <div class="flex items-center gap-4 mb-6">
        <div class="bg-tertiary-fixed text-on-tertiary-fixed-variant px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase">Morning</div>
        <div class="h-px flex-grow bg-outline-variant/30"></div>
      </div>
      <div class="bg-surface-container-lowest rounded-xl p-6 shadow-sm">
        <h3 class="text-xl font-headline font-bold text-on-surface mb-2">Day ${dayData.day} — Morning</h3>
        <p class="text-on-surface-variant text-sm leading-relaxed">${dayData.morning || '—'}</p>
        ${dayData.places && dayData.places.length > 0 ? `
          <div class="flex flex-wrap gap-2 mt-4">
            ${dayData.places.map(p => `<span class="text-xs bg-secondary-fixed text-on-secondary-fixed px-3 py-1 rounded-full font-semibold">${p}</span>`).join('')}
          </div>` : ''}
      </div>
    </div>
    <div class="mt-12">
      <div class="flex items-center gap-4 mb-6">
        <div class="bg-secondary-fixed text-on-secondary-fixed-variant px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase">Afternoon</div>
        <div class="h-px flex-grow bg-outline-variant/30"></div>
      </div>
      <div class="bg-surface-container-lowest rounded-xl p-6 shadow-sm">
        <h3 class="text-xl font-headline font-bold text-on-surface mb-2">Day ${dayData.day} — Afternoon</h3>
        <p class="text-on-surface-variant text-sm leading-relaxed">${dayData.afternoon || '—'}</p>
      </div>
    </div>
    <div class="mt-12">
      <div class="flex items-center gap-4 mb-6">
        <div class="bg-primary-fixed text-on-primary-fixed-variant px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase">Evening</div>
        <div class="h-px flex-grow bg-outline-variant/30"></div>
      </div>
      <div class="bg-surface-container-lowest rounded-xl p-6 shadow-sm">
        <h3 class="text-xl font-headline font-bold text-on-surface mb-2">Day ${dayData.day} — Evening</h3>
        <p class="text-on-surface-variant text-sm leading-relaxed">${dayData.evening || '—'}</p>
      </div>
    </div>
    ${tips.length > 0 ? `
    <div class="mt-12 bg-primary p-8 rounded-[2rem] text-on-primary space-y-3">
      <div class="inline-block bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">Concierge Tips</div>
      <ul class="space-y-2 mt-2">
        ${tips.map(tip => `<li class="text-sm opacity-90 flex items-start gap-2"><span class="material-symbols-outlined text-sm mt-0.5">tips_and_updates</span>${tip}</li>`).join('')}
      </ul>
    </div>` : ''}
  `;
}

// ── Generate itinerary from backend ───────────
async function generateItinerary() {
  const token = getToken();
  if (!token) {
    showToast('Please log in first', 'error');
    setTimeout(() => { window.location.href = '../html/login.html'; }, 1500);
    return;
  }

  const btn = document.getElementById('ai-regen-btn');
  setButtonLoading(btn, true);

  const ctx = getTripContext();

  try {
    const res = await fetch(`${API_BASE}/api/itinerary/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        destination: ctx.destination,
        days:        ctx.days,
        budget:      ctx.budget,
        interests:   ctx.interests,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Failed to generate itinerary');
    }

    // Cache the generated itinerary in localStorage for offline re-render
    localStorage.setItem('cachedItinerary', JSON.stringify(data.itinerary));

    renderItinerary(data.itinerary);
    showToast('Itinerary generated!', 'success');

  } catch (err) {
    console.error('Itinerary error:', err);
    showToast(err.message || 'Something went wrong', 'error');
  } finally {
    setButtonLoading(btn, false);
  }
}

// ── On page load: restore cached itinerary ────
document.addEventListener('DOMContentLoaded', () => {
  // Wire up AI regen button
  const regenBtn = document.querySelector('button[id="ai-regen-btn"], button.bg-gradient-to-br');
  if (regenBtn) {
    regenBtn.id = 'ai-regen-btn';
    regenBtn.addEventListener('click', generateItinerary);
  }

  // Restore last generated itinerary if available
  const cached = localStorage.getItem('cachedItinerary');
  if (cached) {
    try {
      renderItinerary(JSON.parse(cached));
    } catch (e) {
      console.warn('Could not restore cached itinerary:', e);
    }
  }

  // Update hero trip info from localStorage
  const dest = localStorage.getItem('activeTripDestination');
  const dateRange = localStorage.getItem('activeTripDateRange');
  const travelers = localStorage.getItem('activeTripMembers');

  if (dest) {
    const titleEl = document.querySelector('h2.font-headline');
    if (titleEl) titleEl.textContent = dest;
  }
  if (dateRange) {
    const subtitleEl = document.querySelector('p.text-on-surface-variant.font-body');
    if (subtitleEl) subtitleEl.textContent = dateRange;
  }
});