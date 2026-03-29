/* =============================================
   create_trip.js — Pravas (connected to backend)
   ============================================= */
import { guardRoute } from './auth.js';
import { api } from './api.js';

guardRoute(null, '/frontend/html/login.html');

tailwind.config = {
  darkMode: "class",
  theme: { extend: { colors: {
    "background":"#f6fafe","primary":"#00327d","on-primary":"#ffffff",
    "primary-container":"#0047ab","secondary-container":"#cbe7f5",
    "on-secondary-container":"#4e6874","surface":"#f6fafe",
    "surface-container":"#eaeef2","surface-container-high":"#e4e9ed",
    "surface-container-highest":"#dfe3e7","surface-container-low":"#f0f4f8",
    "surface-container-lowest":"#ffffff","on-surface":"#171c1f",
    "on-surface-variant":"#434653","outline":"#737784","outline-variant":"#c3c6d5",
    "error":"#ba1a1a","error-container":"#ffdad6","on-error-container":"#93000a",
    "tertiary":"#602400","tertiary-container":"#843500","tertiary-fixed":"#ffdbcb",
    "primary-fixed":"#dae2ff","surface-dim":"#d6dade",
  }, fontFamily:{"headline":["Plus Jakarta Sans"],"body":["Inter"],"label":["Inter"]},
  borderRadius:{"DEFAULT":"0.25rem","lg":"1rem","xl":"1.5rem","full":"9999px"} } }
};

document.addEventListener('DOMContentLoaded', function () {
  const menuBtn             = document.querySelector('.menu-btn');
  const tripForm            = document.getElementById('trip-form');
  const destinationInput    = document.getElementById('destination-input');
  const departureDateInput  = document.getElementById('departure-date');
  const returnDateInput     = document.getElementById('return-date');
  const budgetInput         = document.getElementById('budget-input');
  const addMembersBtn       = document.getElementById('add-members-btn');
  const createExpeditionBtn = document.getElementById('create-expedition-btn');
  const inspirationCard     = document.getElementById('inspiration-card');
  const bottomNavLinks      = document.querySelectorAll('.bottom-nav-link');

  if (menuBtn) menuBtn.addEventListener('click', () => window.location.href = '/frontend/html/navigation_drawer.html');
  if (addMembersBtn) addMembersBtn.addEventListener('click', () => showToast('Member invites coming soon!', 'info'));

  const today = new Date().toISOString().split('T')[0];
  if (departureDateInput) {
    departureDateInput.setAttribute('min', today);
    departureDateInput.addEventListener('change', function () {
      if (returnDateInput) {
        returnDateInput.setAttribute('min', this.value);
        if (returnDateInput.value && returnDateInput.value < this.value) returnDateInput.value = '';
      }
    });
  }

  if (budgetInput) {
    budgetInput.addEventListener('input', function (e) {
      const v = e.target.value.replace(/[^0-9]/g, '');
      e.target.value = v ? '₹' + parseInt(v).toLocaleString('en-IN') : '';
    });
  }

  if (inspirationCard) {
    inspirationCard.addEventListener('click', () => {
      if (destinationInput) { destinationInput.value = 'Oman - Hidden Valleys'; destinationInput.focus(); }
    });
  }

  bottomNavLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      bottomNavLinks.forEach(n => {
        n.classList.remove('text-[#00327d]','bg-[#cbe7f5]/30','rounded-2xl');
        n.classList.add('text-slate-400');
        n.querySelector('.material-symbols-outlined').style.fontVariationSettings = "'FILL' 0";
      });
      this.classList.remove('text-slate-400');
      this.classList.add('text-[#00327d]','bg-[#cbe7f5]/30','rounded-2xl');
      this.querySelector('.material-symbols-outlined').style.fontVariationSettings = "'FILL' 1";
      const label = this.querySelector('span:last-child')?.textContent.trim().toLowerCase();
      if (label === 'explore' || label === 'my trips') window.location.href = '/frontend/html/home_dashboard.html';
      if (label === 'profile') window.location.href = '/frontend/html/profile_screen.html';
    });
  });

  if (tripForm) {
    tripForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const destination = destinationInput?.value.trim();
      const startDate   = departureDateInput?.value;
      const endDate     = returnDateInput?.value;
      const budgetRaw   = budgetInput?.value.replace(/[^0-9]/g, '');
      const budget      = budgetRaw ? parseInt(budgetRaw) : 0;

      if (!destination) { showToast('Please enter a destination.', 'error'); return; }
      if (!startDate)   { showToast('Please select a departure date.', 'error'); return; }
      if (!endDate)     { showToast('Please select a return date.', 'error'); return; }

      setButtonLoading(createExpeditionBtn, true);
      try {
        // ✅ 'title' matches trip.model.js schema (not 'name')
        const { trip } = await api.createTrip({ title: destination, destination, startDate, endDate, budget });

        // Save for itinerary planner page
        localStorage.setItem('activeTripId',          trip._id);
        localStorage.setItem('activeTripDestination', trip.destination);
        localStorage.setItem('activeTripDateRange',   `${startDate} — ${endDate}`);

        showToast('Expedition created! 🚀', 'success');
        setTimeout(() => window.location.href = '/frontend/html/home_dashboard.html', 1500);
      } catch (err) {
        showToast(err.message || 'Something went wrong.', 'error');
      } finally {
        setButtonLoading(createExpeditionBtn, false);
      }
    });
  }
});

function showToast(message, type = 'success') {
  const existing = document.getElementById('pravas-toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.id = 'pravas-toast';
  toast.className = `fixed top-20 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-4 rounded-xl shadow-xl text-sm font-semibold
    ${type === 'error' ? 'bg-red-500 text-white' : type === 'info' ? 'bg-blue-100 text-blue-800' : 'bg-primary text-white'}`;
  toast.innerHTML = `<span class="material-symbols-outlined text-base">${type === 'error' ? 'error' : 'check_circle'}</span><span>${message}</span>`;
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 3500);
}

function setButtonLoading(btn, isLoading) {
  if (!btn) return;
  if (isLoading) {
    btn.disabled = true;
    btn.dataset.originalHtml = btn.innerHTML;
    btn.innerHTML = `<svg class="animate-spin w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg><span>Creating...</span>`;
  } else {
    btn.disabled = false;
    btn.innerHTML = btn.dataset.originalHtml || btn.innerHTML;
  }
}