/* =============================================
   tickets_documents.js
   Pravas — Tickets & Documents (Vault)
   Fully connected to backend

   Endpoints used:
     GET /api/auth/me          → user avatar + name
     GET /api/trips            → list trips → pick active
     GET /api/trips/:id        → single trip → boarding pass + hotel voucher
   ============================================= */

import { guardRoute } from './auth.js';

/* ══════════════════════════════════════════════
   CONFIG
══════════════════════════════════════════════ */
const BASE_URL = 'http://localhost:5000/api';

/* ── Route Guard ── */
guardRoute(null, '/html/login.html');

/* ══════════════════════════════════════════════
   API HELPER
══════════════════════════════════════════════ */
function getToken() {
    return localStorage.getItem('pravas_token') || null;
}

async function apiFetch(endpoint, options = {}) {
    const token = getToken();
    const res   = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers || {}),
        },
    });
    const data = await res.json();
    if (!res.ok) {
        const err    = new Error(data.message || 'Request failed');
        err.status   = res.status;
        throw err;
    }
    return data;
}

/* ══════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════ */
function formatDate(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
    });
}

function showToast(message, type = 'info') {
    const existing = document.getElementById('vault-toast');
    if (existing) existing.remove();

    const toast     = document.createElement('div');
    toast.id        = 'vault-toast';
    const isError   = type === 'error';
    toast.className = `fixed top-20 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3
        px-5 py-3 rounded-xl shadow-xl text-sm font-semibold
        ${isError ? 'bg-error-container text-on-error-container' : 'bg-secondary-container text-on-secondary-container'}`;
    toast.innerHTML = `
        <span class="material-symbols-outlined text-base">${isError ? 'error' : 'check_circle'}</span>
        <span>${message}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
}

/* ══════════════════════════════════════════════
   RENDER — USER HEADER
══════════════════════════════════════════════ */
async function loadUserProfile() {
    try {
        const raw  = localStorage.getItem('pravas_user');
        const user = raw ? JSON.parse(raw) : null;

        const apply = (u) => {
            const nameEl   = document.getElementById('user-name');
            const avatarEl = document.getElementById('user-avatar');
            if (nameEl)   nameEl.textContent          = u.name     || 'The Explorer';
            if (avatarEl && u.photoUrl) avatarEl.src  = u.photoUrl;
        };

        if (user) { apply(user); return; }

        const data = await apiFetch('/auth/me');
        if (data.user) {
            apply(data.user);
            localStorage.setItem('pravas_user', JSON.stringify(data.user));
        }
    } catch (err) {
        console.error('Profile load failed:', err);
    }
}

/* ══════════════════════════════════════════════
   RENDER — BOARDING PASS
   Maps trip model fields onto the boarding pass UI.
   Adjust property names to match your Trip schema.
══════════════════════════════════════════════ */
function renderBoardingPass(trip) {
    if (!trip) return;

    const set = (id, value) => {
        const el = document.getElementById(id);
        if (el) { el.textContent = value; el.classList.remove('animate-pulse'); }
    };

    set('bp-airline',     trip.airline        || trip.flightAirline  || 'SKYSTRIDE');
    set('bp-flight-no',   trip.flightNumber   || trip.flightNo       || 'SS-402');
    set('bp-origin',      trip.originCode     || trip.fromCode       || 'DEL');
    set('bp-origin-city', trip.originCity     || trip.from           || 'New Delhi, IN');
    set('bp-dest',        trip.destCode       || trip.toCode         || 'HND');
    set('bp-dest-city',   trip.destCity       || trip.destination    || 'Tokyo, JP');
    set('bp-duration',    trip.flightDuration || `${trip.days || '—'} days`);
    set('bp-gate',        trip.gate           || '—');
    set('bp-seat',        trip.seat           || '—');
    set('bp-boarding',    trip.boardingTime
        ? new Date(trip.boardingTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
        : (trip.startDate ? formatDate(trip.startDate) : '—'));
    set('bp-pass-id',     `PASS_ID: ${(trip._id || '9823-XJ-2024').slice(-12).toUpperCase()}`);

    const flightsCount = document.getElementById('flights-count');
    if (flightsCount) flightsCount.textContent = '1 Active Pass';
}

/* ══════════════════════════════════════════════
   RENDER — HOTEL VOUCHER
══════════════════════════════════════════════ */
function renderHotelVoucher(trip) {
    if (!trip) return;

    const set = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    };

    set('hotel-name',    trip.hotelName    || trip.accommodation || 'Hotel');
    set('hotel-address', trip.hotelAddress || trip.destination   || '—');
    set('hotel-checkin', trip.checkIn  ? formatDate(trip.checkIn)  : (trip.startDate ? formatDate(trip.startDate) : '—'));
    set('hotel-checkout',trip.checkOut ? formatDate(trip.checkOut) : (trip.endDate   ? formatDate(trip.endDate)   : '—'));

    const hotelsCount = document.getElementById('hotels-count');
    if (hotelsCount) hotelsCount.textContent = '1 Upcoming Stay';

    // Render member avatars
    const membersEl = document.getElementById('hotel-members');
    if (membersEl && trip.members?.length) {
        const accepted = trip.members.filter(m => m.status === 'accepted').slice(0, 4);
        membersEl.innerHTML = accepted.map(m => {
            const u = m.user;
            return u?.photoUrl
                ? `<div class="w-8 h-8 rounded-full border-2 border-white overflow-hidden">
                     <img alt="${u.name || 'Guest'}" class="w-full h-full object-cover" src="${u.photoUrl}"/>
                   </div>`
                : `<div class="w-8 h-8 rounded-full border-2 border-white bg-secondary-container flex items-center justify-center text-[10px] font-bold text-on-secondary-container">
                     ${(u?.name || '?').charAt(0).toUpperCase()}
                   </div>`;
        }).join('');
    }
}

/* ══════════════════════════════════════════════
   SKELETON
══════════════════════════════════════════════ */
function showSkeletons() {
    ['bp-airline','bp-flight-no','bp-origin','bp-dest','bp-gate','bp-seat','bp-boarding',
     'hotel-name','hotel-address','hotel-checkin','hotel-checkout'].forEach(id => {
        const el = document.getElementById(id);
        if (el) { el.textContent = '—'; el.classList.add('animate-pulse'); }
    });
}

/* ══════════════════════════════════════════════
   LOAD ACTIVE TRIP
══════════════════════════════════════════════ */
async function loadActiveTrip() {
    showSkeletons();
    try {
        let trip = null;

        // 1. Use cached tripId if available
        const cachedId = localStorage.getItem('activeTripId');
        if (cachedId) {
            const data = await apiFetch(`/trips/${cachedId}`);
            trip = data.trip;
        }

        // 2. Fall back to first active trip from list
        if (!trip) {
            const data = await apiFetch('/trips?status=active');
            trip = data.trips?.[0] || null;
        }

        // 3. Fall back to any trip
        if (!trip) {
            const data = await apiFetch('/trips');
            trip = data.trips?.[0] || null;
        }

        if (!trip) {
            showToast('No active trip found. Open a trip to see your tickets.', 'error');
            return;
        }

        // Persist for other screens
        localStorage.setItem('activeTripId',          trip._id);
        localStorage.setItem('activeTripDestination', trip.destination || '');
        localStorage.setItem('activeTripDays',        trip.days        || '7');
        localStorage.setItem('activeTripBudget',      trip.budget      || '60000');

        renderBoardingPass(trip);
        renderHotelVoucher(trip);

    } catch (err) {
        console.error('Failed to load trip:', err);
        showToast('Could not load trip data.', 'error');
    }
}

/* ══════════════════════════════════════════════
   VOUCHER DETAILS MODAL
══════════════════════════════════════════════ */
function openVoucherModal(trip) {
    document.getElementById('voucher-modal')?.remove();

    const modal     = document.createElement('div');
    modal.id        = 'voucher-modal';
    modal.className = 'fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm';
    modal.innerHTML = `
        <div class="bg-surface-container-lowest w-full max-w-lg rounded-t-[2rem] md:rounded-[2rem] p-8 shadow-2xl">
          <div class="flex items-center justify-between mb-6">
            <h3 class="font-headline font-bold text-xl text-primary">Voucher Details</h3>
            <button id="close-voucher" class="p-2 rounded-full hover:bg-surface-container-high transition-colors">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <div class="space-y-0 text-sm divide-y divide-surface-container">
            ${[
                ['Property',        trip?.hotelName      || trip?.accommodation || 'Hotel'],
                ['Destination',     trip?.destination    || '—'],
                ['Check-in',        trip?.checkIn  ? formatDate(trip.checkIn)  : (trip?.startDate ? formatDate(trip.startDate) : '—')],
                ['Check-out',       trip?.checkOut ? formatDate(trip.checkOut) : (trip?.endDate   ? formatDate(trip.endDate)   : '—')],
                ['Confirmation ID', (trip?._id || '').slice(-10).toUpperCase() || '—'],
            ].map(([label, value]) => `
                <div class="flex justify-between py-3">
                  <span class="text-on-surface-variant font-medium">${label}</span>
                  <span class="font-bold text-on-surface text-right max-w-[60%]">${value}</span>
                </div>`).join('')}
            <div class="flex justify-between py-3">
              <span class="text-on-surface-variant font-medium">Status</span>
              <span class="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold">CONFIRMED</span>
            </div>
          </div>
          <button id="close-voucher-btn"
            class="w-full mt-6 py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-bold rounded-xl active:scale-[0.98] transition-all">
            Done
          </button>
        </div>`;
    document.body.appendChild(modal);

    const close = () => modal.remove();
    document.getElementById('close-voucher').addEventListener('click', close);
    document.getElementById('close-voucher-btn').addEventListener('click', close);
    modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
}

/* ══════════════════════════════════════════════
   DOM READY
══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', async () => {

    /* ── Auth guard ── */
    if (!getToken()) {
        window.location.href = '/html/login.html';
        return;
    }

    /* ── Load user + trip in parallel ── */
    await Promise.all([loadUserProfile(), loadActiveTrip()]);

    /* ── Category card clicks ── */
    document.querySelectorAll('[data-category]').forEach(card => {
        card.addEventListener('click', function () {
            document.querySelectorAll('[data-category]').forEach(c =>
                c.classList.remove('ring-2', 'ring-primary'));
            this.classList.add('ring-2', 'ring-primary');
            // TODO: filter document list by this.dataset.category
        });
    });

    /* ── View All Tickets ── */
    document.getElementById('view-all-tickets')?.addEventListener('click', () => {
        showToast('Full ticket list coming soon.', 'info');
    });

    /* ── Voucher Details ── */
    document.getElementById('voucher-details-btn')?.addEventListener('click', async () => {
        const tripId = localStorage.getItem('activeTripId');
        if (!tripId) { showToast('No active trip loaded.', 'error'); return; }
        try {
            const data = await apiFetch(`/trips/${tripId}`);
            openVoucherModal(data.trip);
        } catch {
            showToast('Could not load voucher details.', 'error');
        }
    });

    /* ── Secure Storage doc rows ── */
    document.querySelectorAll('[data-doc]').forEach(item => {
        item.addEventListener('click', function () {
            showToast(`Opening ${this.dataset.doc}… upload viewer coming soon.`, 'info');
            // TODO: wire to upload_ticket.js
        });
    });

    /* ── Bottom Nav ── */
    const routes = {
        itinerary: '/html/itinerary_planner.html',
        expenses:  '/html/streamlined_expense_report.html',
        tickets:   null,
        explore:   '/html/map_explore.html',
    };
    document.querySelectorAll('[data-nav]').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const target = this.dataset.nav;

            document.querySelectorAll('[data-nav]').forEach(n => {
                n.classList.remove('text-primary', 'bg-primary/10', 'rounded-2xl');
                n.classList.add('text-slate-400');
            });
            this.classList.remove('text-slate-400');
            this.classList.add('text-primary', 'bg-primary/10', 'rounded-2xl');

            if (routes[target]) window.location.href = routes[target];
        });
    });

});