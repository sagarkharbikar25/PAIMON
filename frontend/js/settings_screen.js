/* =============================================
   settings_screen.js — Pravas Settings Screen
   Backend connected:
     GET /api/auth/me      → load user profile + preferences
     PUT /api/users/me     → save preferences (notifications, location, currency)
     (Sign out)            → clear localStorage → redirect to login
   ============================================= */

/* ── Tailwind Config ── */
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "on-secondary-container": "#4e6874",
        "error-container": "#ffdad6",
        "tertiary-container": "#843500",
        "surface-tint": "#2559bd",
        "error": "#ba1a1a",
        "background": "#f6fafe",
        "primary-fixed-dim": "#b1c5ff",
        "on-surface": "#171c1f",
        "on-secondary": "#ffffff",
        "on-primary-fixed": "#001946",
        "primary": "#00327d",
        "surface-dim": "#d6dade",
        "on-background": "#171c1f",
        "inverse-on-surface": "#edf1f5",
        "surface-container-low": "#f0f4f8",
        "surface-container-high": "#e4e9ed",
        "outline": "#737784",
        "on-surface-variant": "#434653",
        "tertiary": "#602400",
        "on-primary-fixed-variant": "#00419e",
        "surface-container-highest": "#dfe3e7",
        "primary-fixed": "#dae2ff",
        "inverse-primary": "#b1c5ff",
        "secondary-container": "#cbe7f5",
        "secondary": "#48626e",
        "on-tertiary-fixed": "#341100",
        "primary-container": "#0047ab",
        "surface": "#f6fafe",
        "on-primary-container": "#a5bdff",
        "on-error": "#ffffff",
        "inverse-surface": "#2c3134",
        "surface-bright": "#f6fafe",
        "on-secondary-fixed": "#021f29",
        "on-tertiary-container": "#ffaa80",
        "surface-variant": "#dfe3e7",
        "tertiary-fixed": "#ffdbcb",
        "surface-container-lowest": "#ffffff",
        "on-tertiary": "#ffffff",
        "surface-container": "#eaeef2",
        "on-primary": "#ffffff",
        "outline-variant": "#c3c6d5",
        "secondary-fixed-dim": "#afcbd8",
        "on-error-container": "#93000a",
        "secondary-fixed": "#cbe7f5",
        "on-secondary-fixed-variant": "#304a55",
        "tertiary-fixed-dim": "#ffb692",
        "on-tertiary-fixed-variant": "#7a3000"
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

/* ── Config ── */
const API_BASE = 'http://localhost:5000';

/* ── Helpers ── */
function getToken() {
  return localStorage.getItem('token') || localStorage.getItem('authToken') || null;
}

function showToast(message, type = 'success') {
  const existing = document.getElementById('pravas-toast');
  if (existing) existing.remove();

  const colors = type === 'success' ? 'bg-primary text-white' : 'bg-error text-on-error';
  const icon   = type === 'success' ? 'check_circle' : 'error';

  const toast = document.createElement('div');
  toast.id = 'pravas-toast';
  toast.className = `fixed top-20 left-1/2 -translate-x-1/2 z-[9999] px-6 py-3 rounded-2xl shadow-xl font-bold text-sm flex items-center gap-2 ${colors}`;
  toast.innerHTML = `<span class="material-symbols-outlined text-base">${icon}</span>${message}`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

/* ── Save a preference to backend (debounced) ── */
let saveTimer;
function savePreferences(payload) {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/api/users/me`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type':  'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Save failed');
      showToast('Preferences saved', 'success');
    } catch (err) {
      console.error('Save preference error:', err);
      showToast('Could not save preference', 'error');
    }
  }, 800); // debounce — wait 800ms after last toggle before saving
}

/* ── Load user profile into the header card ── */
async function loadUserProfile() {
  const token = getToken();
  if (!token) {
    window.location.href = '../html/login.html';
    return;
  }

  try {
    const res  = await fetch(`${API_BASE}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();

    if (!res.ok) {
      if (res.status === 401) {
        localStorage.clear();
        window.location.href = '../html/login.html';
      }
      return;
    }

    const user = data.user || data;

    // Name
    const nameEl = document.querySelector('h2.font-headline.text-xl');
    if (nameEl && user.name) nameEl.textContent = user.name;

    // Tier / plan label
    const tierEl = document.querySelector('.text-on-surface-variant.text-sm.font-medium');
    if (tierEl) {
      const tier = user.memberTier || 'Explorer';
      tierEl.textContent = `${tier} Tier • ${user.plan || 'Free'} Member`;
    }

    // Avatar
    const avatarImg = document.querySelector('img[alt="User profile"]');
    if (avatarImg && user.photoUrl) {
      avatarImg.src = user.photoUrl;
      avatarImg.alt = user.name || 'User profile';
    }

    // Plan badge
    const planBadge = document.querySelector('.bg-tertiary-container\\/10.text-tertiary');
    if (planBadge && user.plan) {
      planBadge.textContent = `${user.plan.charAt(0).toUpperCase() + user.plan.slice(1)} Plan`;
    }

    // Restore saved preferences from user object or localStorage
    restorePreferences(user);

  } catch (err) {
    console.error('Profile load error:', err);
  }
}

/* ── Restore toggle states from user profile ── */
function restorePreferences(user) {
  // Push notifications toggle
  const notifToggle = document.querySelector('input[type="checkbox"]:nth-of-type(1)');
  if (notifToggle) {
    const val = user.preferences?.pushNotifications ?? localStorage.getItem('pref_notifications') !== 'false';
    notifToggle.checked = val;
  }

  // Location services toggle
  const locationToggle = document.querySelector('input[type="checkbox"]:nth-of-type(2)');
  if (locationToggle) {
    const val = user.preferences?.locationServices ?? localStorage.getItem('pref_location') !== 'false';
    locationToggle.checked = val;
  }

  // Dark mode toggle
  const darkToggle = document.querySelector('input[type="checkbox"]:nth-of-type(3)');
  if (darkToggle) {
    const isDark = localStorage.getItem('darkMode') === 'true' ||
                   document.documentElement.classList.contains('dark');
    darkToggle.checked = isDark;
  }

  // Currency buttons
  const savedCurrency = user.preferences?.currency || localStorage.getItem('pref_currency') || 'INR';
  applyCurrencySelection(savedCurrency);
}

/* ── Wire up toggle switches ── */
function wireToggles() {
  const toggles = document.querySelectorAll('input[type="checkbox"]');

  // Push notifications (index 0)
  if (toggles[0]) {
    toggles[0].addEventListener('change', (e) => {
      const val = e.target.checked;
      localStorage.setItem('pref_notifications', val.toString());
      savePreferences({ preferences: { pushNotifications: val } });
    });
  }

  // Location services (index 1)
  if (toggles[1]) {
    toggles[1].addEventListener('change', (e) => {
      const val = e.target.checked;
      localStorage.setItem('pref_location', val.toString());
      savePreferences({ preferences: { locationServices: val } });
    });
  }

  // Dark mode (index 2)
  if (toggles[2]) {
    toggles[2].addEventListener('change', (e) => {
      const isDark = e.target.checked;
      localStorage.setItem('darkMode', isDark.toString());
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      // No backend save needed for dark mode — UI preference only
    });
  }
}

/* ── Wire up currency buttons ── */
function wireCurrencyButtons() {
  const currencyBtns = document.querySelectorAll('.flex.bg-surface-container.p-1 button');
  currencyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currency = btn.textContent.trim();
      applyCurrencySelection(currency);
      localStorage.setItem('pref_currency', currency);

      // Update subtitle text
      const subtitle = document.querySelector('.text-xs.text-on-surface-variant');
      if (subtitle && subtitle.textContent.startsWith('Current:')) {
        subtitle.textContent = `Current: ${currency}`;
      }

      savePreferences({ preferences: { currency } });
    });
  });
}

/* ── Apply active style to selected currency button ── */
function applyCurrencySelection(currency) {
  const currencyBtns = document.querySelectorAll('.flex.bg-surface-container.p-1 button');
  currencyBtns.forEach(btn => {
    const isActive = btn.textContent.trim() === currency;
    if (isActive) {
      btn.className = 'px-4 py-1.5 rounded-md bg-surface-container-lowest shadow-sm text-xs font-bold text-primary';
    } else {
      btn.className = 'px-4 py-1.5 rounded-md text-xs font-bold text-on-surface-variant hover:text-on-surface transition-colors';
    }
  });
}

/* ── Wire up back button ── */
function wireBackButton() {
  const backBtn = document.querySelector('button .material-symbols-outlined[textContent="arrow_back"]')
    || document.querySelector('header button');
  if (backBtn) {
    const btn = backBtn.closest('button') || backBtn;
    btn.addEventListener('click', () => history.back());
  }
}

/* ── Wire up Sign Out button ── */
function wireSignOut() {
  const signOutBtn = document.querySelector('button.text-error');
  if (!signOutBtn) return;

  signOutBtn.addEventListener('click', async () => {
    // Optimistic UI
    signOutBtn.textContent = 'Signing out...';
    signOutBtn.disabled = true;

    // Clear all local state
    localStorage.clear();

    // Small delay for UX feel
    setTimeout(() => {
      window.location.href = '../html/login.html';
    }, 400);
  });
}

/* ── Restore dark mode on page load (before render) ── */
if (localStorage.getItem('darkMode') === 'true') {
  document.documentElement.classList.add('dark');
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', async () => {
  await loadUserProfile();
  wireToggles();
  wireCurrencyButtons();
  wireBackButton();
  wireSignOut();
});