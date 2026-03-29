/* =============================================
   itinerary_planner.js — Pravas (connected to backend)
   ============================================= */
import { guardRoute } from './auth.js';
import { api } from './api.js';

guardRoute(null, '/frontend/html/login.html');

// Get tripId from URL or localStorage
const params = new URLSearchParams(window.location.search);
const TRIP_ID = params.get('tripId') || localStorage.getItem('activeTripId');

tailwind.config = {
  darkMode:"class",
  theme:{ extend:{ colors:{
    "primary-fixed":"#dae2ff","background":"#f6fafe","surface-dim":"#d6dade",
    "secondary":"#48626e","on-surface":"#171c1f","tertiary":"#602400",
    "tertiary-fixed":"#ffdbcb","primary":"#00327d","on-tertiary-fixed":"#341100",
    "surface-bright":"#f6fafe","on-secondary-container":"#4e6874",
    "secondary-fixed":"#cbe7f5","surface-tint":"#2559bd","on-primary-fixed":"#001946",
    "primary-fixed-dim":"#b1c5ff","on-tertiary-fixed-variant":"#7a3000",
    "on-primary":"#ffffff","on-error":"#ffffff","primary-container":"#0047ab",
    "on-secondary-fixed":"#021f29","surface-container-highest":"#dfe3e7",
    "surface-container":"#eaeef2","surface":"#f6fafe","inverse-primary":"#b1c5ff",
    "error-container":"#ffdad6","tertiary-fixed-dim":"#ffb692","surface-variant":"#dfe3e7",
    "on-surface-variant":"#434653","on-secondary":"#ffffff","on-primary-fixed-variant":"#00419e",
    "on-tertiary":"#ffffff","outline":"#737784","surface-container-low":"#f0f4f8",
    "surface-container-high":"#e4e9ed","error":"#ba1a1a","on-tertiary-container":"#ffaa80",
    "on-primary-container":"#a5bdff","outline-variant":"#c3c6d5",
    "secondary-container":"#cbe7f5","inverse-on-surface":"#edf1f5",
    "secondary-fixed-dim":"#afcbd8","surface-container-lowest":"#ffffff",
    "inverse-surface":"#2c3134","on-error-container":"#93000a",
    "on-secondary-fixed-variant":"#304a55","on-background":"#171c1f",
    "tertiary-container":"#843500"
  }, fontFamily:{"headline":["Plus Jakarta Sans"],"body":["Inter"],"label":["Inter"]},
  borderRadius:{"DEFAULT":"0.25rem","lg":"1rem","xl":"1.5rem","full":"9999px"} } }
};

document.addEventListener('DOMContentLoaded', async () => {

  // ── Load trip info ──────────────────────────────────────────────────────
  const destination = localStorage.getItem('activeTripDestination') || 'Your Trip';
  const dateRange   = localStorage.getItem('activeTripDateRange')   || '';

  const titleEl = document.querySelector('h2.font-headline');
  if (titleEl) titleEl.textContent = destination;

  const subtitleEl = document.querySelector('p.text-on-surface-variant.font-body');
  if (subtitleEl && dateRange) subtitleEl.textContent = dateRange;

  // ── Restore cached itinerary ────────────────────────────────────────────
  const cached = localStorage.getItem('cachedItinerary');
  if (cached) {
    try { renderItinerary(JSON.parse(cached)); } catch (e) { console.warn(e); }
  }

  // ── AI Regenerate button ────────────────────────────────────────────────
  const regenBtn = document.querySelector('button.bg-gradient-to-br');
  if (regenBtn) {
    regenBtn.id = 'ai-regen-btn';
    regenBtn.addEventListener('click', generateItinerary);
  }

  // ── Bottom nav ──────────────────────────────────────────────────────────
  const navBtns = document.querySelectorAll('nav.fixed button');
  navBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const label = this.querySelector('span:last-child')?.textContent.trim().toLowerCase();
      if (label === 'expenses') window.location.href = `/frontend/html/expense_tracker.html?tripId=${TRIP_ID}`;
      if (label === 'tickets')  window.location.href = `/frontend/html/tickets_documents.html?tripId=${TRIP_ID}`;
      if (label === 'explore')  window.location.href = '/frontend/html/home_dashboard.html';
    });
  });

  // ── Expand Map button ───────────────────────────────────────────────────
  const mapBtn = document.querySelector('button.w-full.bg-white\\/20');
  if (mapBtn) mapBtn.addEventListener('click', () => window.location.href = '/frontend/html/map_explore.html');
});

// ── Generate itinerary from backend ──────────────────────────────────────
async function generateItinerary() {
  const btn         = document.getElementById('ai-regen-btn');
  const destination = localStorage.getItem('activeTripDestination') || 'India';
  const days        = parseInt(localStorage.getItem('activeTripDays') || '3');
  const budget      = parseInt(localStorage.getItem('activeTripBudget') || '10000');
  const interests   = JSON.parse(localStorage.getItem('activeTripInterests') || '["sightseeing"]');

  setButtonLoading(btn, true);
  try {
    const response = await api.generateItinerary({ destination, days, budget, interests });

const itinerary = response.itinerary || response.data || response.result;

if (!itinerary || !itinerary.days) {
  /* 🔥 ADD: strict validation */
if (!Array.isArray(itinerary.days)) {
  showToast('AI response invalid', 'error');
  return;
}

/* 🔥 ADD: FIX missing days (IMPORTANT) */
if (itinerary.days.length < days) {
  console.warn('AI returned fewer days, fixing...');

  for (let i = itinerary.days.length + 1; i <= days; i++) {
    itinerary.days.push({
      day: i,
      morning: "Free exploration",
      afternoon: "Local sightseeing",
      evening: "Relax nearby",
      places: [],
      estimatedCost: 0
    });
  }
}
  throw new Error('Invalid itinerary format from AI');
}
if (!itinerary.days || !Array.isArray(itinerary.days)) {
  showToast('AI response invalid', 'error');
  return;
}
    localStorage.setItem('cachedItinerary', JSON.stringify(itinerary));
    renderItinerary(itinerary);
    showToast('Itinerary generated!', 'success');
  } catch (err) {
    console.error(err);
    showToast(err.message || 'Could not generate itinerary.', 'error');
  } finally {
    setButtonLoading(btn, false);
  }
}

function renderItinerary(itinerary) {
  const titleEl = document.querySelector('h2.font-headline');
  if (titleEl && itinerary.destination) titleEl.textContent = itinerary.destination;

  const mainGrid   = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-12');
  if (!mainGrid) return;
  const timelineCol = mainGrid.querySelector('.md\\:col-span-8');
  if (!timelineCol) return;

  const activeDay = itinerary.days?.[0];
  if (!activeDay) return;

  renderDay(activeDay, timelineCol, itinerary.tips || []);
  updateDaySummary(activeDay);

  const dateNav = document.querySelector('nav.flex.gap-4');

  // 🔥 CLEAR OLD BUTTONS
  dateNav.innerHTML = '';

  // 🔥 CREATE BUTTONS
  itinerary.days.forEach((d, i) => {
    const btn = document.createElement('button');

    btn.className = `
      flex-shrink-0 px-6 py-4 rounded-xl flex flex-col items-center min-w-[80px]
      ${i === 0 ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant'}
    `;

    btn.innerHTML = `
      <span class="text-xs font-label">D${d.day}</span>
      <span class="text-xl font-headline font-bold">${d.day}</span>
    `;

    dateNav.appendChild(btn);
  });

  // 🔥 NOW BIND SCROLLER AFTER CREATION
  wireupDayScroller(itinerary, timelineCol);
}

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
        ${dayData.places?.length ? `<div class="flex flex-wrap gap-2 mt-4">${dayData.places.map(p=>`<span class="text-xs bg-secondary-fixed text-on-secondary-fixed px-3 py-1 rounded-full font-semibold">${p}</span>`).join('')}</div>` : ''}
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
    ${tips.length ? `
    <div class="mt-12 bg-primary p-8 rounded-[2rem] text-on-primary space-y-3">
      <div class="inline-block bg-white/20 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">Concierge Tips</div>
      <ul class="space-y-2 mt-2">${tips.map(t=>`<li class="text-sm opacity-90 flex items-start gap-2"><span class="material-symbols-outlined text-sm mt-0.5">tips_and_updates</span>${t}</li>`).join('')}</ul>
    </div>` : ''}`;
}

function wireupDayScroller(itinerary, timelineCol) {
  const dateNav = document.querySelector('nav.flex.gap-4');

  const dateButtons = dateNav.querySelectorAll('button'); // ✅ FIX

  dateButtons.forEach((btn, i) => {
    btn.onclick = () => {

      dateButtons.forEach(b => {
        b.classList.remove('bg-primary','text-on-primary');
        b.classList.add('bg-surface-container-low','text-on-surface-variant');
      });

      btn.classList.add('bg-primary','text-on-primary');
      btn.classList.remove('bg-surface-container-low','text-on-surface-variant');

      const selectedDay = itinerary.days[i];

      if (selectedDay) {
        renderDay(selectedDay, timelineCol, itinerary.tips || []);
        updateDaySummary(selectedDay);
      }
    };
  });
}

function updateDaySummary(dayData) {
  const spendEl = document.querySelector('.text-tertiary.font-bold');
  if (spendEl && dayData.estimatedCost) spendEl.textContent = `₹${dayData.estimatedCost.toLocaleString('en-IN')}`;
}

function showToast(message, type = 'success') {
  const existing = document.getElementById('pravas-toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.id = 'pravas-toast';
  toast.className = `fixed top-6 left-1/2 -translate-x-1/2 z-[9999] px-6 py-3 rounded-2xl shadow-xl font-bold text-sm flex items-center gap-2
    ${type === 'error' ? 'bg-red-500 text-white' : 'bg-primary text-white'}`;
  toast.innerHTML = `<span class="material-symbols-outlined text-base">${type==='error'?'error':'check_circle'}</span>${message}`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

function setButtonLoading(btn, loading) {
  if (!btn) return;
  if (loading) {
    btn.dataset.originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<svg class="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> Generating...`;
  } else {
    btn.disabled = false;
    btn.innerHTML = btn.dataset.originalText || btn.innerHTML;
  }
}
/* ── NOTIFICATION BUTTON ── */
const notifBtn = document.querySelector('header button');

notifBtn?.addEventListener('click', () => {
  showToast('No new notifications 🔔');
});
/* ── DATE SCROLLER IMPROVEMENT ── */
const dateNav = document.querySelector('nav.flex.gap-4');

document.querySelectorAll('nav.flex.gap-4 button').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.scrollIntoView({ behavior: 'smooth', inline: 'center' });
  });
});
/* ── VIEW DETAILS BUTTON ── */
document.querySelectorAll('button').forEach(btn => {
  if (btn.textContent.includes('View Details')) {
    btn.addEventListener('click', () => {
      showToast('Opening activity details...');
      // later: open modal/page
    });
  }
});
/* ── MAP BUTTON FIX ── */
document.querySelectorAll('button').forEach(btn => {
  if (btn.textContent.includes('Expand Map')) {
    btn.addEventListener('click', () => {
      window.location.href = '/frontend/html/map_explore.html';
    });
  }
});
/* ── BOTTOM NAV ACTIVE STATE ── */
const navBtns = document.querySelectorAll('nav.fixed.bottom-0 button');

navBtns.forEach(btn => {
  btn.addEventListener('click', function () {

    navBtns.forEach(b => {
      b.classList.remove('text-[#00327d]', 'bg-[#0047AB]/10');
      b.classList.add('text-slate-400');
    });

    this.classList.add('text-[#00327d]', 'bg-[#0047AB]/10');
    this.classList.remove('text-slate-400');
  });
});
/* ── TRIP SAFETY CHECK ── */
if (!TRIP_ID) {
  console.warn('No tripId found');
  showToast('No active trip selected', 'error');
}
document.addEventListener('DOMContentLoaded', () => {

  /* ── NOTIFICATION BUTTON ── */
  const notifBtn = document.querySelector('header button');
  notifBtn?.addEventListener('click', () => {
    showToast('No new notifications 🔔');
  });

  /* ── DATE SCROLL ── */
  document.querySelectorAll('nav.flex.gap-4 button').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.scrollIntoView({ behavior: 'smooth', inline: 'center' });
    });
  });

  /* ── VIEW DETAILS ── */
  document.querySelectorAll('button').forEach(btn => {
    if (btn.textContent.includes('View Details')) {
      btn.addEventListener('click', () => {
        showToast('Opening activity details...');
      });
    }
  });

  /* ── MAP BUTTON ── */
  document.querySelectorAll('button').forEach(btn => {
    if (btn.textContent.includes('Expand Map')) {
      btn.addEventListener('click', () => {
        window.location.href = '/frontend/html/map_explore.html';
      });
    }
  });

  /* ── NAV ACTIVE ── */
  const navBtns = document.querySelectorAll('nav.fixed.bottom-0 button');

  navBtns.forEach(btn => {
    btn.addEventListener('click', function () {

      navBtns.forEach(b => {
        b.classList.remove('text-[#00327d]', 'bg-[#0047AB]/10');
        b.classList.add('text-slate-400');
      });

      this.classList.add('text-[#00327d]', 'bg-[#0047AB]/10');
      this.classList.remove('text-slate-400');
    });
  });

});