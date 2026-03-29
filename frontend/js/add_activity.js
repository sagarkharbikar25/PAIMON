/* =============================================
   add_activity.js — connected to backend
   ============================================= */
import { guardRoute } from './auth.js';
import { api } from './api.js';

guardRoute(null, '/html/login.html');

// Get tripId from URL ?tripId=xxx
const params = new URLSearchParams(window.location.search);
const TRIP_ID = params.get('tripId');

/* ── Tailwind config ── */
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#00327d", "on-primary": "#ffffff",
        "primary-container": "#0047ab", "on-primary-container": "#a5bdff",
        "background": "#f6fafe", "surface": "#f6fafe",
        "surface-container": "#eaeef2", "surface-container-high": "#e4e9ed",
        "surface-container-highest": "#dfe3e7", "surface-container-lowest": "#ffffff",
        "surface-dim": "#d6dade", "on-surface": "#171c1f",
        "on-surface-variant": "#434653", "outline": "#737784",
        "outline-variant": "#c3c6d5", "tertiary": "#602400",
      },
      fontFamily: { "headline": ["Plus Jakarta Sans"], "body": ["Inter"], "label": ["Inter"] },
      borderRadius: { "DEFAULT": "0.25rem", "lg": "1rem", "xl": "1.5rem", "full": "9999px" },
    },
  },
};

document.addEventListener('DOMContentLoaded', function () {

  /* ── Category toggle ── */
  let selectedCategory = 'Food';
  const categoryButtons = document.querySelectorAll('.category-btn');
  categoryButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      categoryButtons.forEach(b => {
        b.classList.remove('bg-primary', 'text-on-primary', 'shadow-md');
        b.classList.add('bg-white', 'text-on-surface-variant', 'border', 'border-outline-variant/30');
      });
      this.classList.remove('bg-white', 'text-on-surface-variant', 'border', 'border-outline-variant/30');
      this.classList.add('bg-primary', 'text-on-primary', 'shadow-md');
      selectedCategory = this.querySelector('span:last-child').textContent.trim();
    });
  });

  /* ── Form submit → POST /api/expenses/:tripId ── */
  const form = document.querySelector('form');
  const saveBtn = document.getElementById('save-btn');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    if (!TRIP_ID) {
      showToast('No trip selected. Go back and open a trip first.', 'error');
      return;
    }

    const activityName = form.querySelector('input[type="text"]').value.trim();
    const date         = form.querySelector('input[type="date"]').value;
    const time         = form.querySelector('input[type="time"]').value;
    const location     = form.querySelectorAll('input[type="text"]')[1]?.value.trim();
    const notes        = form.querySelector('textarea').value.trim();

    if (!activityName) {
      showToast('Please enter an activity name.', 'error');
      return;
    }

    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';

    try {
      // Save as an expense entry with 0 amount (activity log)
      await api.createExpense(TRIP_ID, {
        title:     activityName,
        amount:    0,
        currency:  'INR',
        category:  selectedCategory,
        splitType: 'none',
        notes,
        location,
        date: date || new Date().toISOString(),
        time,
      });

      showToast('Activity saved!', 'success');
      setTimeout(() => history.back(), 1200);
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Failed to save activity.', 'error');
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save Activity';
    }
  });

  /* ── Discard ── */
  document.getElementById('discard-btn').addEventListener('click', function () {
    form.reset();
    history.back();
  });

  /* ── Back button ── */
  const backBtn = document.querySelector('button span.material-symbols-outlined');
  if (backBtn?.textContent === 'arrow_back') {
    backBtn.closest('button').addEventListener('click', () => history.back());
  }

  /* ── Bottom nav ── */
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      navLinks.forEach(n => {
        n.classList.remove('text-[#00327d]', 'bg-[#0047AB]/10', 'rounded-2xl');
        n.classList.add('text-slate-400');
      });
      this.classList.remove('text-slate-400');
      this.classList.add('text-[#00327d]', 'bg-[#0047AB]/10', 'rounded-2xl');
    });
  });
});

/* ── Toast helper ── */
function showToast(message, type = 'success') {
  const existing = document.getElementById('pravas-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'pravas-toast';
  toast.className = `fixed top-24 left-1/2 -translate-x-1/2 z-[999] px-6 py-3 rounded-xl
    font-bold text-sm shadow-xl transition-all
    ${type === 'error' ? 'bg-red-500 text-white' : 'bg-primary text-white'}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}