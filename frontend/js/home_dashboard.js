/* =============================================
   home_dashboard.js — Pravas (connected to backend)
   ============================================= */
import { guardRoute, getCurrentUser, logout } from './auth.js';
import apiFetch from './api.js';

const PATHS = {
  login:      '/frontend/html/login.html',
  createTrip: '/frontend/html/create_trip.html',
  profile:    '/frontend/html/profile_screen.html',
  itinerary:  (id) => `/frontend/html/itinerary_planner.html?tripId=${id}`,
  expenses:   (id) => `/frontend/html/expense_tracker.html?tripId=${id}`,
  explore:    '/frontend/html/explore.html' // ✅ NEW (if you have page)
};

guardRoute(null, PATHS.login);

document.addEventListener('DOMContentLoaded', async function () {

  /* ── 1. Show cached user instantly ── */
  const user = getCurrentUser();
  if (user) {
    const h = document.getElementById('welcome-heading');
    if (h) h.textContent = `Welcome Back, ${user.name.split(' ')[0]} 👋`;
    const a = document.getElementById('user-avatar');
    if (a && user.photoUrl) a.src = user.photoUrl;
  }

  /* ── 2. Refresh from backend ── */
  try {
    const { user: u } = await apiFetch('/auth/me');
    if (u) {
      const h = document.getElementById('welcome-heading');
      if (h) h.textContent = `Welcome Back, ${u.name.split(' ')[0]} 👋`;
      const a = document.getElementById('user-avatar');
      if (a && u.photoUrl) a.src = u.photoUrl;
    }
  } catch (e) { console.warn(e.message); }

  /* ── 3. Load trips ── */
  await loadTrips();

  /* ── 4. Logout ── */
  document.getElementById('logout-btn')?.addEventListener('click', () => {
    logout();
    window.location.href = PATHS.login;
  });

  /* ── 5. Bottom nav ── */
  document.querySelectorAll('[data-nav]').forEach(item => {
    item.addEventListener('click', function () {

      document.querySelectorAll('[data-nav]').forEach(n => {
        n.classList.remove('text-primary','bg-secondary-container/30');
        n.classList.add('text-slate-400');
      });

      this.classList.add('text-primary','bg-secondary-container/30');
      this.classList.remove('text-slate-400');

      const nav = this.dataset.nav;

      if (nav === 'explore') window.location.href = PATHS.explore; // ✅ FIXED
      if (nav === 'trips')   window.location.href = PATHS.createTrip;
      if (nav === 'plan')    window.location.href = PATHS.createTrip;
      if (nav === 'profile') window.location.href = PATHS.profile;
    });
  });

  /* ── 6. FAB ── */
  document.getElementById('fab-new-trip')?.addEventListener('click', () => {
    window.location.href = PATHS.createTrip;
  });

  /* ── 7. Top nav Plan/My Trips/Explore ── */
  document.querySelectorAll('.font-label').forEach(el => {
    el.style.cursor = 'pointer';

    el.addEventListener('click', () => {
      const text = el.textContent.trim().toLowerCase();

      if (text.includes('explore')) window.location.href = PATHS.explore; // ✅ FIXED
      if (text.includes('plan'))    window.location.href = PATHS.createTrip;
      if (text.includes('trip'))    window.location.href = PATHS.createTrip;
    });
  });

  /* ── 8. See All Button ── */
  document.querySelectorAll('button').forEach(btn => {
    if (btn.textContent.includes('See All')) {
      btn.addEventListener('click', () => {
        window.location.href = PATHS.createTrip; // or trips page
      });
    }
  });

  /* ── 9. Expense Report Button ── */
  document.querySelectorAll('button').forEach(btn => {
    if (btn.textContent.includes('Expense')) {
      btn.addEventListener('click', () => {
        const tripId = localStorage.getItem('activeTripId');
        if (tripId) {
          window.location.href = PATHS.expenses(tripId);
        } else {
          alert('No active trip selected');
        }
      });
    }
  });

});

/* ================= TRIPS ================= */

async function loadTrips() {
  const grid = document.getElementById('trips-grid');
  if (!grid) return;

  grid.innerHTML = `Loading...`;

  try {
    const { trips } = await apiFetch('/trips');

    const upcoming = trips.filter(t => t.status === 'upcoming' || t.status === 'current');

    if (upcoming.length === 0) {
      grid.innerHTML = renderEmptyState();
      return;
    }

    grid.innerHTML = upcoming.slice(0, 2).map(renderTripCard).join('') + renderPlanNewCard();

    const current = trips.find(t => t.status === 'current');
    if (current) updateHeroCard(current);

  } catch (err) {
    console.error(err.message);
    grid.innerHTML = `Error loading trips`;
  }
}

/* ================= CARDS ================= */

function renderTripCard(trip) {
  const tripName = trip.title || trip.destination || 'Trip';

  return `
    <div class="bg-surface-container-lowest rounded-[2rem] p-4 group cursor-pointer"
         onclick="localStorage.setItem('activeTripId','${trip._id}');
                  window.location.href='/frontend/html/itinerary_planner.html?tripId=${trip._id}'">
      <h4>${tripName}</h4>
    </div>`;
}

function renderPlanNewCard() {
  return `
    <div onclick="window.location.href='/frontend/html/create_trip.html'">
      Plan New
    </div>`;
}

function renderEmptyState() {
  return `
    <div>
      <button onclick="window.location.href='/frontend/html/create_trip.html'">
        Plan a Trip
      </button>
    </div>`;
}

function updateHeroCard(trip) {
  const viewBtn = document.querySelector('button.primary-gradient');
  if (viewBtn) {
    viewBtn.onclick = () => {
      localStorage.setItem('activeTripId', trip._id);
      window.location.href = `/frontend/html/itinerary_planner.html?tripId=${trip._id}`;
    };
  }

  const manageBtn = document.querySelectorAll('button');

manageBtn.forEach(btn => {
  if (btn.textContent.includes('Manage')) {
    btn.onclick = () => {
      const tripId = localStorage.getItem('activeTripId');
      if (!tripId) {
        alert('No active trip selected');
        return;
      }
      window.location.href = `/frontend/html/expense_tracker.html?tripId=${tripId}`;
    };
  }
});
}

/* ── PROFILE CLICK ── */
const profileImg = document.getElementById('user-avatar');

profileImg?.addEventListener('click', () => {
  window.location.href = '/frontend/html/profile_screen.html';
});
/* ── VIEW ITINERARY BUTTON ── */
document.querySelectorAll('button').forEach(btn => {
  if (btn.textContent.includes('View Itinerary')) {
    btn.addEventListener('click', () => {
      const tripId = localStorage.getItem('activeTripId');

      if (!tripId) {
        alert('No trip selected');
        return;
      }

      window.location.href = `/frontend/html/itinerary_planner.html?tripId=${tripId}`;
    });
  }
});
/* ── MANAGE BOOKINGS BUTTON ── */
document.querySelectorAll('button').forEach(btn => {
  if (btn.textContent.includes('Manage')) {
    btn.addEventListener('click', () => {
      const tripId = localStorage.getItem('activeTripId');

      if (!tripId) {
        alert('No trip selected');
        return;
      }

      window.location.href = `/frontend/html/expense_tracker.html?tripId=${tripId}`;
    });
  }
});
/* ── SIDEBAR TOGGLE (FINAL FIX) ── */

const menuBtn = document.getElementById('menu-btn');
const sidebar = document.getElementById('sidebar');
const closeBtn = document.getElementById('close-sidebar');
const overlay = document.getElementById('overlay');

/* OPEN */
menuBtn?.addEventListener('click', () => {
  sidebar.classList.remove('-translate-x-full');
  overlay.classList.remove('hidden');
});

/* CLOSE BUTTON */
closeBtn?.addEventListener('click', () => {
  sidebar.classList.add('-translate-x-full');
  overlay.classList.add('hidden');
});

/* CLICK OUTSIDE */
overlay?.addEventListener('click', () => {
  sidebar.classList.add('-translate-x-full');
  overlay.classList.add('hidden');
});