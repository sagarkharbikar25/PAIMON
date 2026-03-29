/* =============================================
   dynamic_splash_screen.js — Pravas Splash Screen Scripts
   ============================================= */

/* ── Tailwind Config ── */
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "background":                   "#f6fafe",
        "secondary":                    "#48626e",
        "tertiary":                     "#602400",
        "surface-dim":                  "#d6dade",
        "on-primary-container":         "#a5bdff",
        "surface-container":            "#eaeef2",
        "surface-tint":                 "#2559bd",
        "surface":                      "#f6fafe",
        "on-primary-fixed-variant":     "#00419e",
        "inverse-primary":              "#b1c5ff",
        "tertiary-container":           "#843500",
        "on-secondary-container":       "#4e6874",
        "surface-container-highest":    "#dfe3e7",
        "inverse-on-surface":           "#edf1f5",
        "on-tertiary-fixed":            "#341100",
        "on-background":                "#171c1f",
        "on-primary-fixed":             "#001946",
        "surface-variant":              "#dfe3e7",
        "surface-container-low":        "#f0f4f8",
        "inverse-surface":              "#2c3134",
        "tertiary-fixed-dim":           "#ffb692",
        "surface-bright":               "#f6fafe",
        "secondary-container":          "#cbe7f5",
        "tertiary-fixed":               "#ffdbcb",
        "primary-fixed-dim":            "#b1c5ff",
        "outline":                      "#737784",
        "on-surface-variant":           "#434653",
        "primary-fixed":                "#dae2ff",
        "on-secondary-fixed-variant":   "#304a55",
        "secondary-fixed-dim":          "#afcbd8",
        "primary-container":            "#0047ab",
        "primary":                      "#00327d",
        "outline-variant":              "#c3c6d5",
        "on-primary":                   "#ffffff",
        "secondary-fixed":              "#cbe7f5",
        "surface-container-high":       "#e4e9ed",
        "on-tertiary-container":        "#ffaa80",
        "error-container":              "#ffdad6",
        "surface-container-lowest":     "#ffffff",
        "on-surface":                   "#171c1f",
        "on-tertiary":                  "#ffffff",
        "on-error":                     "#ffffff",
        "error":                        "#ba1a1a",
        "on-secondary":                 "#ffffff",
        "on-tertiary-fixed-variant":    "#7a3000",
        "on-error-container":           "#93000a",
        "on-secondary-fixed":           "#021f29"
      },
      fontFamily: {
        "headline": ["Plus Jakarta Sans"],
        "body":     ["Inter"],
        "label":    ["Inter"]
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg":      "0.5rem",
        "xl":      "0.75rem",
        "full":    "9999px"
      }
    }
  }
};

/* ── API Config ── */
const API_BASE = 'http://localhost:5000';

/* ── Navigate with splash exit animation ── */
function navigateTo(path) {
  const splashScreen = document.getElementById('splash-screen');
  splashScreen.classList.add('exiting');
  setTimeout(() => { window.location.href = path; }, 500);
}

/* ── Check if existing JWT is still valid ──
   Hits GET /api/auth/me — if token is valid,
   user goes straight to dashboard (skip login).
   If invalid/expired/missing, stay on splash. ── */
async function checkAuthAndRedirect() {
  const token = localStorage.getItem('token') || localStorage.getItem('authToken');

  if (!token) return; // No token — stay on splash, show Start button

  try {
    const response = await fetch(`${API_BASE}/api/auth/me`, {
      method:  'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) {
      // Token valid — skip login, go straight to dashboard
      navigateTo('../html/navigation_drawer.html');
    } else {
      // Token expired or invalid — clear it and stay on splash
      localStorage.removeItem('token');
      localStorage.removeItem('authToken');
    }
  } catch (err) {
    // Server unreachable — stay on splash silently
    console.warn('Auth check failed:', err.message);
  }
}

/* ── DOMContentLoaded ── */
document.addEventListener('DOMContentLoaded', function () {

  const startJourneyBtn = document.getElementById('start-journey-btn');
  const logoContainer   = document.getElementById('logo-container');
  const appTitle        = document.getElementById('app-title');
  const tagline         = document.getElementById('tagline');

  // ── Run auth check immediately on load ──
  checkAuthAndRedirect();

  // ── Staggered entrance animations ──
  const elements = [
    { el: logoContainer,   delay: 300  },
    { el: appTitle,        delay: 600  },
    { el: tagline,         delay: 900  },
    { el: startJourneyBtn, delay: 1200 },
  ];

  elements.forEach(({ el, delay }) => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(20px)';
    setTimeout(() => {
      el.style.transition = 'all 0.8s ease-out';
      el.style.opacity    = '1';
      el.style.transform  = 'translateY(0)';
    }, delay);
  });

  // ── Subtle logo pulse every 3s ──
  setInterval(() => {
    logoContainer.style.transform = 'scale(1.02)';
    setTimeout(() => { logoContainer.style.transform = 'scale(1)'; }, 1500);
  }, 3000);

  // ── Logo hover ──
  logoContainer.addEventListener('mouseenter', function () {
    this.style.transform = 'scale(1.1) rotate(5deg)';
  });
  logoContainer.addEventListener('mouseleave', function () {
    this.style.transform = 'scale(1) rotate(0deg)';
  });

  // ── Start Journey button → go to login ──
  startJourneyBtn.addEventListener('click', function () {
    navigateTo('../html/login.html');
  });

  // ── Mobile touch feedback ──
  startJourneyBtn.addEventListener('touchstart', function () {
    this.style.transform = 'scale(0.95)';
  });
  startJourneyBtn.addEventListener('touchend', function () {
    this.style.transform = 'scale(1)';
  });

  // ── Preload background image ──
  const bgImage = new Image();
  bgImage.src = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBO4ceTowasppywz_qcM5prGvwBuzMGd1uQUlwopb3mcWoMcdwNa4lXhNb0qrREJkVpFiSa4KWlWYG8BJ408wSpScMsgBUU2M-MFmtbfRYayxjY_zMabcjnzPjyuAlrVWxFDeo0iLiYeT79pmzl9ExBll5oj3IwIGjxztyvNZIN9nDk_VsOI5phUdeD2O4wJzESB7aEy0kafSFsWvDo4zHjV06_I9-s3gQzLPTdPopAVzIQhyC663qibs-QYfnWA9LlZrLhmHowh_SZ';

});