/* =============================================
   ai_trip_planner.js
   Pravas — AI Trip Planner (connected to backend)
   ============================================= */

import { guardRoute } from './auth.js';
import { api } from './api.js';

guardRoute(null, '/html/login.html');

tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "tertiary-fixed": "#ffdbcb", "on-secondary-container": "#4e6874",
        "surface-bright": "#f6fafe", "inverse-on-surface": "#edf1f5",
        "on-primary": "#ffffff", "surface": "#f6fafe", "on-tertiary": "#ffffff",
        "on-error": "#ffffff", "surface-variant": "#dfe3e7",
        "secondary-fixed": "#cbe7f5", "outline": "#737784",
        "surface-container-high": "#e4e9ed", "inverse-primary": "#b1c5ff",
        "primary": "#00327d", "tertiary": "#602400",
        "secondary-container": "#cbe7f5", "tertiary-container": "#843500",
        "surface-container": "#eaeef2", "background": "#f6fafe",
        "primary-fixed": "#dae2ff", "on-surface": "#171c1f",
        "surface-container-low": "#f0f4f8", "primary-container": "#0047ab",
        "outline-variant": "#c3c6d5", "surface-container-highest": "#dfe3e7",
        "on-surface-variant": "#434653", "surface-container-lowest": "#ffffff",
        "on-secondary": "#ffffff", "primary-fixed-dim": "#b1c5ff",
        "on-tertiary-container": "#ffaa80", "inverse-surface": "#2c3134",
        "surface-tint": "#2559bd", "on-background": "#171c1f",
        "secondary": "#48626e", "error": "#ba1a1a",
        "on-primary-container": "#a5bdff", "surface-dim": "#d6dade"
      },
      fontFamily: { "headline": ["Plus Jakarta Sans"], "body": ["Inter"], "label": ["Inter"] },
      borderRadius: { "DEFAULT": "0.25rem", "lg": "1rem", "xl": "1.5rem", "full": "9999px" },
    },
  },
};

document.addEventListener('DOMContentLoaded', function () {

  const generateBtn      = document.getElementById('generate-btn');
  const destinationInput = document.getElementById('destination-input');
  const daysInput        = document.getElementById('days-input');
  const tripBadge        = document.getElementById('trip-badge');
  const itinerarySection = document.getElementById('itinerary-section');
  const itineraryCards   = document.getElementById('itinerary-cards');
  const menuBtn          = document.querySelector('.menu-btn');
  const bottomNavLinks   = document.querySelectorAll('.bottom-nav-link');

  let generatedItinerary = null;

  // ── Generate → POST /api/itinerary/generate ───────────────────────────────
  generateBtn.addEventListener('click', async function () {
    const destination = destinationInput.value.trim();
    const days        = parseInt(daysInput.value.trim());

    if (!destination || !days) {
      showToast('Please enter both destination and number of days.', 'error'); return;
    }
    if (days < 1 || days > 30) {
      showToast('Days must be between 1 and 30.', 'error'); return;
    }

    tripBadge.textContent    = `${days} Day${days > 1 ? 's' : ''} in ${destination}`;
    generateBtn.disabled     = true;
    generateBtn.innerHTML    = `<span class="material-symbols-outlined animate-spin">progress_activity</span> Generating...`;
    itineraryCards.innerHTML = renderSkeleton();
    itinerarySection.scrollIntoView({ behavior: 'smooth' });

    try {
      const { itinerary } = await api.generateItinerary({
        destination, days, budget: 10000, interests: ['sightseeing'],
      });
      generatedItinerary = itinerary;
      renderItineraryCards(itinerary);
    } catch (err) {
      itineraryCards.innerHTML = `
        <div class="text-center py-12 text-on-surface-variant">
          <span class="material-symbols-outlined text-5xl mb-3 block">wifi_off</span>
          <p class="font-headline font-bold">Could not generate itinerary.</p>
          <p class="text-sm mt-1">${err.message || 'Please try again.'}</p>
        </div>`;
    } finally {
      generateBtn.disabled  = false;
      generateBtn.innerHTML = `<span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1;">auto_awesome</span> Generate Itinerary`;
    }
  });

  // ── Render cards ──────────────────────────────────────────────────────────
  function renderItineraryCards(itinerary) {
    const decorLine = `<div class="absolute left-6 top-4 bottom-4 w-px bg-outline-variant/30 hidden md:block"></div>`;

    const dayCards = itinerary.days.map(d => `
      <div class="relative md:pl-16">
        <div class="hidden md:flex absolute left-0 top-0 w-12 h-12 bg-primary rounded-full items-center justify-center text-white font-bold shadow-md z-10">${d.day}</div>
        <div class="bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_12px_40px_rgba(23,28,31,0.06)]">
          <div class="p-6 md:p-8 space-y-4">
            <div class="flex justify-between items-start">
              <h4 class="text-xl font-headline font-extrabold text-on-surface">Day ${d.day}</h4>
              <span class="text-primary font-bold text-sm">₹${d.estimatedCost?.toLocaleString('en-IN') || '—'} <span class="text-xs text-on-surface-variant font-medium">est.</span></span>
            </div>
            <div class="space-y-2 font-body text-sm text-on-surface-variant">
              <p><span class="font-semibold text-on-surface">🌅 Morning:</span> ${d.morning || '—'}</p>
              <p><span class="font-semibold text-on-surface">☀️ Afternoon:</span> ${d.afternoon || '—'}</p>
              <p><span class="font-semibold text-on-surface">🌆 Evening:</span> ${d.evening || '—'}</p>
            </div>
            ${d.places?.length ? `<div class="flex flex-wrap gap-2 pt-2">${d.places.map(p =>
              `<span class="bg-surface-container-high px-3 py-1 rounded-lg text-xs font-semibold text-on-surface-variant flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[16px]">location_on</span>${p}
              </span>`).join('')}</div>` : ''}
          </div>
        </div>
      </div>`).join('');

    const tipsHtml = itinerary.tips?.length ? `
      <div class="bg-primary/5 rounded-xl p-5 mt-2">
        <p class="font-headline font-bold text-primary mb-2">💡 Travel Tips</p>
        <ul class="space-y-1">${itinerary.tips.map(t => `<li class="text-sm font-body text-on-surface-variant">${t}</li>`).join('')}</ul>
        ${itinerary.totalEstimatedCost ? `<p class="mt-3 font-bold text-primary">Total est. cost: ₹${itinerary.totalEstimatedCost.toLocaleString('en-IN')}</p>` : ''}
      </div>` : '';

    const applyHtml = `
      <div class="flex justify-center pt-8 pb-12">
        <button id="apply-btn" class="bg-primary text-on-primary px-10 py-4 rounded-full font-headline font-bold shadow-xl hover:shadow-2xl transition-all flex items-center gap-2 active:scale-95">
          <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1;">check_circle</span>
          Apply to Trip
        </button>
      </div>`;

    itineraryCards.innerHTML = decorLine + dayCards + tipsHtml + applyHtml;

    document.getElementById('apply-btn').addEventListener('click', () => {
      sessionStorage.setItem('ai_itinerary', JSON.stringify(generatedItinerary));
      showToast('Itinerary saved! Go to your trip to apply it.', 'success');
    });
  }

  function renderSkeleton() {
    return [1,2,3].map(() => `
      <div class="relative md:pl-16 animate-pulse">
        <div class="hidden md:flex absolute left-0 top-0 w-12 h-12 bg-surface-container-highest rounded-full z-10"></div>
        <div class="bg-surface-container-lowest rounded-xl p-8 space-y-3">
          <div class="h-5 bg-surface-container-highest rounded w-1/4"></div>
          <div class="h-4 bg-surface-container-highest rounded w-3/4"></div>
          <div class="h-4 bg-surface-container-highest rounded w-2/3"></div>
          <div class="h-4 bg-surface-container-highest rounded w-1/2"></div>
        </div>
      </div>`).join('');
  }

  // ── Bottom nav ────────────────────────────────────────────────────────────
  bottomNavLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      bottomNavLinks.forEach(n => {
        n.classList.remove('bg-[#cbe7f5]','text-[#00327d]','rounded-2xl','scale-105');
        n.classList.add('text-slate-400');
        n.querySelector('.material-symbols-outlined').style.fontVariationSettings = "'FILL' 0";
      });
      this.classList.remove('text-slate-400');
      this.classList.add('bg-[#cbe7f5]','text-[#00327d]','rounded-2xl','scale-105');
      this.querySelector('.material-symbols-outlined').style.fontVariationSettings = "'FILL' 1";
    });
  });

  if (menuBtn) menuBtn.addEventListener('click', () => {});
});

function showToast(message, type = 'success') {
  const existing = document.getElementById('pravas-toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.id = 'pravas-toast';
  toast.className = `fixed top-24 left-1/2 -translate-x-1/2 z-[999] px-6 py-3 rounded-xl font-bold text-sm shadow-xl ${type === 'error' ? 'bg-red-500 text-white' : 'bg-primary text-white'}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}