/* =============================================
   splash_screen.js — Pravas Splash Screen
   Backend connected:
     GET /api/auth/me → if valid JWT, skip to dashboard
                      → if not, go to login
   ============================================= */

/* ── Tailwind Config ── */
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "background": "#f6fafe",
        "secondary": "#48626e",
        "tertiary": "#602400",
        "surface-dim": "#d6dade",
        "on-primary-container": "#a5bdff",
        "surface-container": "#eaeef2",
        "surface-tint": "#2559bd",
        "surface": "#f6fafe",
        "on-primary-fixed-variant": "#00419e",
        "inverse-primary": "#b1c5ff",
        "tertiary-container": "#843500",
        "on-secondary-container": "#4e6874",
        "surface-container-highest": "#dfe3e7",
        "inverse-on-surface": "#edf1f5",
        "on-tertiary-fixed": "#341100",
        "on-background": "#171c1f",
        "on-primary-fixed": "#001946",
        "surface-variant": "#dfe3e7",
        "surface-container-low": "#f0f4f8",
        "inverse-surface": "#2c3134",
        "tertiary-fixed-dim": "#ffb692",
        "surface-bright": "#f6fafe",
        "secondary-container": "#cbe7f5",
        "tertiary-fixed": "#ffdbcb",
        "primary-fixed-dim": "#b1c5ff",
        "outline": "#737784",
        "on-surface-variant": "#434653",
        "primary-fixed": "#dae2ff",
        "on-secondary-fixed-variant": "#304a55",
        "secondary-fixed-dim": "#afcbd8",
        "primary-container": "#0047ab",
        "primary": "#00327d",
        "outline-variant": "#c3c6d5",
        "on-primary": "#ffffff",
        "secondary-fixed": "#cbe7f5",
        "surface-container-high": "#e4e9ed",
        "on-tertiary-container": "#ffaa80",
        "error-container": "#ffdad6",
        "surface-container-lowest": "#ffffff",
        "on-surface": "#171c1f",
        "on-tertiary": "#ffffff",
        "on-error": "#ffffff",
        "error": "#ba1a1a",
        "on-secondary": "#ffffff",
        "on-tertiary-fixed-variant": "#7a3000",
        "on-error-container": "#93000a",
        "on-secondary-fixed": "#021f29"
      },
      fontFamily: {
        "headline": ["Plus Jakarta Sans"],
        "body": ["Inter"],
        "label": ["Inter"]
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
    },
  },
};

/* ── Config ── */
const API_BASE = 'http://localhost:5000';

/* ── Helper ── */
function getToken() {
  return localStorage.getItem('token') || localStorage.getItem('authToken') || null;
}

/* ── Animate loading bar ── */
function animateLoadingBar() {
  const bar = document.querySelector('.bg-surface-container.rounded-full .bg-primary');
  if (!bar) return;

  let width = 33;
  const interval = setInterval(() => {
    width = Math.min(width + Math.random() * 15, 90);
    bar.style.width = `${width}%`;
    bar.style.transition = 'width 0.3s ease';
  }, 200);

  return {
    complete: () => {
      clearInterval(interval);
      bar.style.width = '100%';
    },
    stop: () => clearInterval(interval),
  };
}

/* ── Check auth and auto-navigate ── */
async function checkAuthAndNavigate() {
  const token = getToken();
  const loader = animateLoadingBar();

  if (!token) {
    // No token — stop at 90%, wait, then go to login
    setTimeout(() => {
      loader.stop();
    }, 600);
    return; // Button handles manual navigation
  }

  try {
    const res = await fetch(`${API_BASE}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    loader.complete();

    if (res.ok) {
      const data = await res.json();
      const user = data.user || data;

      // Store user info for other pages
      localStorage.setItem('userId',       user._id   || '');
      localStorage.setItem('userName',     user.name  || '');
      localStorage.setItem('userEmail',    user.email || '');
      localStorage.setItem('userPhotoUrl', user.photoUrl || '');

      // Check if onboarding is needed
      const onboardingDone = localStorage.getItem('onboardingComplete') === 'true'
                          || user.onboardingComplete === true;

      // Short delay for splash feel, then navigate
      setTimeout(() => {
        if (onboardingDone) {
          window.location.href = '../html/navigation_drawer.html';
        } else {
          window.location.href = '../html/onboarding_features_intro.html';
        }
      }, 800);

    } else {
      // Token invalid/expired — clear and stay on splash
      localStorage.removeItem('token');
      localStorage.removeItem('authToken');
    }

  } catch (err) {
    // Server unreachable — stay on splash silently
    loader.stop();
    console.warn('Auth check failed (server may be offline):', err.message);
  }
}

/* ── Wire Start Journey button ── */
function wireStartButton() {
  const btn = document.querySelector('button.group');
  if (!btn) return;

  btn.addEventListener('click', () => {
    // Always go to login — user will be redirected to dashboard if token valid
    window.location.href = '../html/login.html';
  });
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
  wireStartButton();
  checkAuthAndNavigate(); // Runs auth check silently in background
});