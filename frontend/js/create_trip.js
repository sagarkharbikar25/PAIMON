// =============================================
// create_trip.js — Pravas Create Trip Scripts
// =============================================

/* ── Tailwind Config ── */
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "inverse-surface":              "#2c3134",
        "background":                   "#f6fafe",
        "primary-fixed-dim":            "#b1c5ff",
        "primary":                      "#00327d",
        "on-tertiary-container":        "#ffaa80",
        "tertiary-container":           "#843500",
        "on-primary-container":         "#a5bdff",
        "error-container":              "#ffdad6",
        "error":                        "#ba1a1a",
        "inverse-primary":              "#b1c5ff",
        "on-secondary-container":       "#4e6874",
        "on-secondary":                 "#ffffff",
        "on-tertiary":                  "#ffffff",
        "secondary-container":          "#cbe7f5",
        "on-tertiary-fixed":            "#341100",
        "primary-fixed":                "#dae2ff",
        "inverse-on-surface":           "#edf1f5",
        "surface-container-highest":    "#dfe3e7",
        "surface-container-high":       "#e4e9ed",
        "outline-variant":              "#c3c6d5",
        "on-tertiary-fixed-variant":    "#7a3000",
        "tertiary-fixed":               "#ffdbcb",
        "surface-bright":               "#f6fafe",
        "tertiary":                     "#602400",
        "tertiary-fixed-dim":           "#ffb692",
        "surface-variant":              "#dfe3e7",
        "on-error-container":           "#93000a",
        "secondary-fixed-dim":          "#afcbd8",
        "surface":                      "#f6fafe",
        "secondary":                    "#48626e",
        "on-surface":                   "#171c1f",
        "on-background":                "#171c1f",
        "surface-container-lowest":     "#ffffff",
        "on-secondary-fixed":           "#021f29",
        "surface-tint":                 "#2559bd",
        "on-primary-fixed":             "#001946",
        "on-primary":                   "#ffffff",
        "on-primary-fixed-variant":     "#00419e",
        "on-secondary-fixed-variant":   "#304a55",
        "surface-container":            "#eaeef2",
        "on-surface-variant":           "#434653",
        "surface-dim":                  "#d6dade",
        "secondary-fixed":              "#cbe7f5",
        "outline":                      "#737784",
        "on-error":                     "#ffffff",
        "surface-container-low":        "#f0f4f8",
        "primary-container":            "#0047ab"
      },
      fontFamily: {
        "headline": ["Plus Jakarta Sans"],
        "body":     ["Inter"],
        "label":    ["Inter"]
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg":      "1rem",
        "xl":      "1.5rem",
        "full":    "9999px"
      }
    }
  }
};

/* ── API Config ── */
const API_BASE = 'http://localhost:5000';

/* ── Helper: get JWT token from localStorage ── */
function getToken() {
  return localStorage.getItem('token') || localStorage.getItem('authToken') || '';
}

/* ── Helper: show inline toast feedback ── */
function showToast(message, type = 'success') {
  // Remove any existing toast
  const existing = document.getElementById('pravas-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'pravas-toast';

  const isSuccess = type === 'success';
  toast.className = `
    fixed top-20 left-1/2 -translate-x-1/2 z-[100]
    flex items-center gap-3 px-6 py-4 rounded-xl shadow-xl
    text-sm font-semibold transition-all duration-300
    ${isSuccess
      ? 'bg-[#00327d] text-white'
      : 'bg-[#ffdad6] text-[#93000a]'}
  `.trim();

  toast.innerHTML = `
    <span class="material-symbols-outlined text-base">
      ${isSuccess ? 'check_circle' : 'error'}
    </span>
    <span>${message}</span>
  `;

  document.body.appendChild(toast);

  // Auto-remove after 3.5s
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translate(-50%, -8px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* ── Helper: set button loading state ── */
function setButtonLoading(btn, isLoading) {
  if (isLoading) {
    btn.disabled = true;
    btn.dataset.originalHtml = btn.innerHTML;
    btn.innerHTML = `
      <svg class="animate-spin w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
      </svg>
      <span>Creating...</span>
    `;
  } else {
    btn.disabled = false;
    btn.innerHTML = btn.dataset.originalHtml || btn.innerHTML;
  }
}

/* ── Main DOMContentLoaded ── */
document.addEventListener('DOMContentLoaded', function () {

  // ── DOM refs ──
  const menuBtn            = document.querySelector('.menu-btn');
  const tripForm           = document.getElementById('trip-form');
  const destinationInput   = document.getElementById('destination-input');
  const departureDateInput = document.getElementById('departure-date');
  const returnDateInput    = document.getElementById('return-date');
  const budgetInput        = document.getElementById('budget-input');
  const addMembersBtn      = document.getElementById('add-members-btn');
  const createExpeditionBtn= document.getElementById('create-expedition-btn');
  const inspirationCard    = document.getElementById('inspiration-card');
  const bottomNavLinks     = document.querySelectorAll('.bottom-nav-link');

  // ── Menu button ──
  menuBtn.addEventListener('click', function () {
    console.log('Menu button clicked');
  });

  // ── Add Members button ──
  addMembersBtn.addEventListener('click', function () {
    console.log('Add Members button clicked');
  });

  // ── Set minimum departure date to today ──
  const today = new Date().toISOString().split('T')[0];
  departureDateInput.setAttribute('min', today);

  // ── Return date: must be after departure ──
  departureDateInput.addEventListener('change', function () {
    const departureDate = this.value;
    returnDateInput.setAttribute('min', departureDate);
    if (returnDateInput.value && returnDateInput.value < departureDate) {
      returnDateInput.value = '';
    }
  });

  // ── Budget formatting ──
  budgetInput.addEventListener('input', function (e) {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value) {
      e.target.value = '$' + parseInt(value).toLocaleString();
    }
  });

  // ── Inspiration card: pre-fill destination ──
  inspirationCard.addEventListener('click', function () {
    destinationInput.value = 'Oman - Hidden Valleys';
    destinationInput.focus();
  });

  // ── Bottom nav active state ──
  bottomNavLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      bottomNavLinks.forEach(function (navLink) {
        navLink.classList.remove('text-[#00327d]', 'bg-[#cbe7f5]/30', 'rounded-2xl');
        navLink.classList.add('text-slate-400');
        const icon = navLink.querySelector('.material-symbols-outlined');
        icon.style.fontVariationSettings = "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24";
      });
      this.classList.remove('text-slate-400');
      this.classList.add('text-[#00327d]', 'bg-[#cbe7f5]/30', 'rounded-2xl');
      const activeIcon = this.querySelector('.material-symbols-outlined');
      activeIcon.style.fontVariationSettings = "'FILL' 1";
    });
  });

  // ── Form submission → POST /api/trips ──
  tripForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const destination   = destinationInput.value.trim();
    const departureDate = departureDateInput.value;
    const returnDate    = returnDateInput.value;
    const budget        = budgetInput.value.trim();

    // ── Client-side validation ──
    if (!destination) {
      showToast('Please enter a destination.', 'error');
      destinationInput.focus();
      return;
    }
    if (!departureDate) {
      showToast('Please select a departure date.', 'error');
      departureDateInput.focus();
      return;
    }
    if (!returnDate) {
      showToast('Please select a return date.', 'error');
      returnDateInput.focus();
      return;
    }

    const token = getToken();
    if (!token) {
      showToast('You must be logged in to create a trip.', 'error');
      return;
    }

    // ── Build payload matching your Trip schema ──
    const tripData = {
      destination,
      departureDate,
      returnDate,
      ...(budget && { budget: parseInt(budget.replace(/[^0-9]/g, '')) })
    };

    // ── Loading state on button ──
    setButtonLoading(createExpeditionBtn, true);

    try {
      const response = await fetch(`${API_BASE}/api/trips`, {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(tripData)
      });

      const data = await response.json();

      if (!response.ok) {
        // Surface the server error message if available
        throw new Error(data.message || `Server error: ${response.status}`);
      }

      showToast('Expedition created successfully! 🚀', 'success');
      console.log('Trip saved:', data);

      // Optional: redirect to the trip detail page after short delay
      // setTimeout(() => window.location.href = `../html/navigation_drawer.html`, 1500);

    } catch (err) {
      console.error('Create trip error:', err);
      showToast(err.message || 'Something went wrong. Please try again.', 'error');
    } finally {
      setButtonLoading(createExpeditionBtn, false);
    }
  });

});