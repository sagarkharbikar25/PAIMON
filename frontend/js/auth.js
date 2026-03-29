/* =============================================
   auth.js
   Pravas — Auth Bridge (JWT, no Firebase)
   ============================================= */

import { api, saveToken, clearToken, getToken } from './api.js';

const USER_KEY = 'pravas_user';

/* ── User cache helpers ── */
function saveUser(user) { localStorage.setItem(USER_KEY, JSON.stringify(user)); }
function clearUser()    { localStorage.removeItem(USER_KEY); }

export function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; }
}

/* ── loginWithEmail ── */
export async function loginWithEmail(email, password) {
  const data = await api.login(email, password);
  saveToken(data.token);
  saveUser(data.user);
  return data.user;
}

/* ── registerWithEmail ── */
export async function registerWithEmail(email, password, fullName) {
  const data = await api.register(fullName, email, password);
  saveToken(data.token);
  saveUser(data.user);
  return data.user;
}

/* ── Google login placeholder ── */
export async function loginWithGoogle() {
  throw Object.assign(
    new Error('Google login is not enabled yet.'),
    { code: 'auth/google-not-enabled' }
  );
}

/* ── logout ── */
export function logout() {
  clearToken();
  clearUser();
}

/* ─────────────────────────────────────────────
   guardRoute(dashboardUrl, loginUrl)

   Detects the correct base path automatically
   so it works on Live Server (PAIMON root)
   and any other environment.

   Usage — same as before:
     Login page:     guardRoute('/frontend/html/home_dashboard.html', null)
     Protected page: guardRoute(null, '/frontend/html/login.html')
   ───────────────────────────────────────────── */
export function guardRoute(dashboardUrl, loginUrl) {
  const isLoggedIn = !!getToken();

  if (isLoggedIn && dashboardUrl) {
    window.location.href = dashboardUrl;
  } else if (!isLoggedIn && loginUrl) {
    window.location.href = loginUrl;
  }
}

/* ── Helper to build correct HTML page path ──
   Use this anywhere you need to navigate:
   e.g. window.location.href = htmlPath('home_dashboard.html')
   ─────────────────────────────────────────── */
export function htmlPath(page) {
  return `/frontend/html/${page}`;
}