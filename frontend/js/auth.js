/* =============================================
   auth.js
   Pravas — Auth Bridge (JWT, no Firebase)
   ============================================= */

import { api, saveToken, clearToken, getToken } from './api.js';

const USER_KEY = 'pravas_user';

/* ── User cache helpers ──────────────────────────────────────────────────── */
function saveUser(user)  { localStorage.setItem(USER_KEY, JSON.stringify(user)); }
function clearUser()     { localStorage.removeItem(USER_KEY); }
export function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; }
}

/* ─────────────────────────────────────────────
   loginWithEmail(email, password)
   → hits POST /api/auth/login
   → saves JWT + user to localStorage
   ───────────────────────────────────────────── */
export async function loginWithEmail(email, password) {
  const data = await api.login(email, password);
  saveToken(data.token);
  saveUser(data.user);
  return data.user;
}

/* ─────────────────────────────────────────────
   registerWithEmail(email, password, fullName)
   → hits POST /api/auth/register
   → saves JWT + user to localStorage
   ───────────────────────────────────────────── */
export async function registerWithEmail(email, password, fullName) {
  const data = await api.register(fullName, email, password);
  saveToken(data.token);
  saveUser(data.user);
  return data.user;
}

/* ─────────────────────────────────────────────
   loginWithGoogle()
   → placeholder for when Firebase is added later
   ───────────────────────────────────────────── */
export async function loginWithGoogle() {
  throw Object.assign(
    new Error('Google login is not enabled yet.'),
    { code: 'auth/google-not-enabled' }
  );
}

/* ─────────────────────────────────────────────
   logout()
   → clears token + user from localStorage
   ───────────────────────────────────────────── */
export function logout() {
  clearToken();
  clearUser();
}

/* ─────────────────────────────────────────────
   guardRoute(dashboardUrl, loginUrl)
   Replacement for Firebase's onAuthStateChanged.

   Usage — same API as before:
     Login page:     guardRoute('/home_dashboard.html', null)
     Dashboard page: guardRoute(null, '/login.html')
   ───────────────────────────────────────────── */
export function guardRoute(dashboardUrl, loginUrl) {
  const isLoggedIn = !!getToken();

  if (isLoggedIn && dashboardUrl) {
    window.location.href = dashboardUrl;
  } else if (!isLoggedIn && loginUrl) {
    window.location.href = loginUrl;
  }
}