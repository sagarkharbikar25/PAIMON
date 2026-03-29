/* =============================================
   home_dashboard.js
   Pravas — Dashboard (connected to backend)
   ============================================= */

import { guardRoute, getCurrentUser, logout } from './auth.js';
import apiFetch from './api.js';

/* ── Route Guard ─────────────────────────────
   Not logged in → go to login page
   ─────────────────────────────────────────────*/
guardRoute(null, '/html/login.html');

/* ── DOM Ready ───────────────────────────────*/
document.addEventListener('DOMContentLoaded', async function () {

  /* ── 1. Load user from localStorage ─────── */
  const user = getCurrentUser();
  if (user) {
    const welcomeHeading = document.getElementById('welcome-heading');
    if (welcomeHeading) {
      welcomeHeading.textContent = `Welcome Back, ${user.name.split(' ')[0]} 👋`;
    }
    const avatarImg = document.getElementById('user-avatar');
    if (avatarImg && user.photoUrl) {
      avatarImg.src = user.photoUrl;
    }
  }

  /* ── 2. Fetch fresh user from backend ────── */
  try {
    const { user: freshUser } = await apiFetch('/auth/me');
    if (freshUser) {
      const welcomeHeading = document.getElementById('welcome-heading');
      if (welcomeHeading) {
        welcomeHeading.textContent = `Welcome Back, ${freshUser.name.split(' ')[0]} 👋`;
      }
      const avatarImg = document.getElementById('user-avatar');
      if (avatarImg && freshUser.photoUrl) {
        avatarImg.src = freshUser.photoUrl;
      }
    }
  } catch (err) {
    console.warn('Could not refresh user from backend:', err.message);
  }

  /* ── 3. Fetch & render trips ─────────────── */
  await loadTrips();

  /* ── 4. Logout button ────────────────────── */
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
      logout();
      window.location.href = '/html/login.html';
    });
  }

  /* ── 5. Bottom nav active state ──────────── */
  const navItems = document.querySelectorAll('[data-nav]');
  navItems.forEach(item => {
    item.addEventListener('click', function () {
      navItems.forEach(n => {
        n.classList.remove('text-primary', 'bg-secondary-container/30');
        n.classList.add('text-slate-400');
      });
      this.classList.add('text-primary', 'bg-secondary-container/30');
      this.classList.remove('text-slate-400');
    });
  });

  /* ── 6. FAB — New Trip ───────────────────── */
  const fab = document.getElementById('fab-new-trip');
  if (fab) {
    fab.addEventListener('click', function () {
      window.location.href = '/html/create_trip.html';
    });
  }

});

/* ─────────────────────────────────────────────
   loadTrips()
   Fetches trips from GET /api/trips and renders
   upcoming ones into #trips-grid
   ─────────────────────────────────────────────*/
async function loadTrips() {
  const grid = document.getElementById('trips-grid');
  if (!grid) return;

  // Show skeleton loader
  grid.innerHTML = `
    <div class="bg-surface-container-lowest rounded-[2rem] p-4 animate-pulse">
      <div class="h-48 rounded-[1.5rem] bg-surface-container-highest mb-5"></div>
      <div class="h-5 bg-surface-container-highest rounded w-3/4 mb-2"></div>
      <div class="h-4 bg-surface-container-highest rounded w-1/2"></div>
    </div>
    <div class="bg-surface-container-lowest rounded-[2rem] p-4 animate-pulse">
      <div class="h-48 rounded-[1.5rem] bg-surface-container-highest mb-5"></div>
      <div class="h-5 bg-surface-container-highest rounded w-3/4 mb-2"></div>
      <div class="h-4 bg-surface-container-highest rounded w-1/2"></div>
    </div>
  `;

  try {
    const { trips } = await apiFetch('/trips');

    // Filter upcoming trips (status: planned or upcoming)
    const upcoming = trips.filter(t =>
      t.status === 'planned' || t.status === 'upcoming' || t.status === 'ongoing'
    );

    if (upcoming.length === 0) {
      grid.innerHTML = renderEmptyState();
      return;
    }

    // Render trip cards + always add "Plan New" card at end
    grid.innerHTML = upcoming.slice(0, 2).map(renderTripCard).join('') + renderPlanNewCard();

    // Update current journey hero card if there's an ongoing trip
    const ongoing = trips.find(t => t.status === 'ongoing');
    if (ongoing) updateHeroCard(ongoing);

  } catch (err) {
    console.error('Failed to load trips:', err.message);
    grid.innerHTML = `
      <div class="col-span-3 text-center py-10 text-on-surface-variant">
        <span class="material-symbols-outlined text-4xl mb-2 block">wifi_off</span>
        <p class="font-body text-sm">Could not load trips. Check your connection.</p>
      </div>
    `;
  }
}

/* ─────────────────────────────────────────────
   renderTripCard(trip)
   ─────────────────────────────────────────────*/
function renderTripCard(trip) {
  const start = trip.startDate ? new Date(trip.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : '—';
  const end   = trip.endDate   ? new Date(trip.endDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : '—';
  const members = trip.members ? trip.members.length + 1 : 1; // +1 for creator

  // Use trip cover image or a placeholder
  const coverImg = trip.coverImage ||
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&auto=format&fit=crop';

  const statusBadge = trip.status === 'ongoing'
    ? `<div class="absolute top-4 right-4 bg-primary/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1">
         <span class="material-symbols-outlined text-white text-sm" style="font-variation-settings: 'FILL' 1;">directions_run</span>
         <span class="text-[10px] font-bold text-white uppercase tracking-tighter">Ongoing</span>
       </div>`
    : `<div class="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1">
         <span class="material-symbols-outlined text-green-600 text-sm" style="font-variation-settings: 'FILL' 1;">check_circle</span>
         <span class="text-[10px] font-bold text-on-surface uppercase tracking-tighter">Planned</span>
       </div>`;

  return `
    <div class="bg-surface-container-lowest rounded-[2rem] p-4 group cursor-pointer hover:shadow-xl transition-all duration-300"
         onclick="window.location.href='/html/trip_detail.html?id=${trip._id}'">
      <div class="relative h-48 rounded-[1.5rem] overflow-hidden mb-5">
        <img
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          src="${coverImg}"
          alt="${trip.name}"
          onerror="this.src='https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&auto=format&fit=crop'"
        />
        ${statusBadge}
      </div>
      <div class="px-2 pb-2">
        <h4 class="font-headline font-bold text-xl text-primary mb-1">${trip.name}</h4>
        <p class="text-on-surface-variant text-xs font-body mb-2">${trip.destination || ''}</p>
        <div class="flex items-center gap-4 text-on-surface-variant text-xs font-medium">
          <span class="flex items-center gap-1">
            <span class="material-symbols-outlined text-xs">calendar_month</span>
            ${start} – ${end}
          </span>
          <span class="flex items-center gap-1">
            <span class="material-symbols-outlined text-xs">group</span>
            ${members} ${members === 1 ? 'Person' : 'People'}
          </span>
        </div>
      </div>
    </div>
  `;
}

/* ─────────────────────────────────────────────
   renderPlanNewCard()
   ─────────────────────────────────────────────*/
function renderPlanNewCard() {
  return `
    <div class="hidden md:flex flex-col items-center justify-center border-2 border-dashed
                border-outline-variant/30 rounded-[2rem] h-full p-8 text-on-surface-variant
                hover:border-primary/30 hover:bg-surface-container-low transition-colors
                group cursor-pointer"
         onclick="window.location.href='/html/create_trip.html'">
      <span class="material-symbols-outlined text-4xl mb-3 group-hover:scale-110 transition-transform">add_location_alt</span>
      <p class="font-headline font-bold text-sm">Plan New Expedition</p>
    </div>
  `;
}

/* ─────────────────────────────────────────────
   renderEmptyState()
   ─────────────────────────────────────────────*/
function renderEmptyState() {
  return `
    <div class="col-span-3 flex flex-col items-center justify-center py-16 text-on-surface-variant">
      <span class="material-symbols-outlined text-5xl mb-4">luggage</span>
      <p class="font-headline font-bold text-lg mb-1">No trips yet</p>
      <p class="font-body text-sm mb-6">Start planning your first adventure!</p>
      <button onclick="window.location.href='/html/create_trip.html'"
              class="primary-gradient text-white px-8 py-3 rounded-xl font-headline font-bold text-sm shadow-lg">
        Plan a Trip
      </button>
    </div>
    ${renderPlanNewCard()}
  `;
}

/* ─────────────────────────────────────────────
   updateHeroCard(trip)
   Updates the big hero card with the ongoing trip
   ─────────────────────────────────────────────*/
function updateHeroCard(trip) {
  const heroTitle = document.querySelector('.font-headline.text-5xl.text-white');
  if (heroTitle) heroTitle.textContent = trip.name;

  const heroImg = document.querySelector('section.group img.absolute');
  if (heroImg && trip.coverImage) heroImg.src = trip.coverImage;

  const heroBtn = document.querySelector('button.primary-gradient');
  if (heroBtn) {
    heroBtn.onclick = () => window.location.href = `/html/trip_detail.html?id=${trip._id}`;
  }
}