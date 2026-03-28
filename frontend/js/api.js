/* =============================================
   api.js
   Pravas — Central API Fetch Wrapper (JWT)
   ============================================= */

const BASE_URL = 'http://localhost:5000/api';

/* ── Token helpers ───────────────────────────────────────────────────────────
   JWT is stored in localStorage under 'pravas_token'.
   Call saveToken() after login/register, clearToken() on logout.
   ─────────────────────────────────────────────────────────────────────────── */
export function saveToken(token) { localStorage.setItem('pravas_token', token); }
export function getToken()       { return localStorage.getItem('pravas_token'); }
export function clearToken()     { localStorage.removeItem('pravas_token'); }

/* ── Core fetch wrapper ──────────────────────────────────────────────────────
   Automatically attaches Authorization: Bearer <jwt> on every request.
   Throws a proper Error on non-2xx with the server's message included.
   ─────────────────────────────────────────────────────────────────────────── */
async function apiFetch(endpoint, options = {}) {
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    const err        = new Error(data.message || `Request failed: ${response.status}`);
    err.status       = response.status;
    err.serverData   = data;
    throw err;
  }

  return data;
}

/* ── Named API calls ─────────────────────────────────────────────────────── */
export const api = {
  /** POST /auth/register — { name, email, password } */
  register(name, email, password) {
    return apiFetch('/auth/register', {
      method: 'POST',
      body:   JSON.stringify({ name, email, password }),
    });
  },

  /** POST /auth/login — { email, password } */
  login(email, password) {
    return apiFetch('/auth/login', {
      method: 'POST',
      body:   JSON.stringify({ email, password }),
    });
  },

  /** GET /auth/me — get current user's profile */
  getMe() {
    return apiFetch('/auth/me');
  },

  /** PUT /auth/profile — { name, preferences } */
  updateProfile(payload) {
    return apiFetch('/auth/profile', {
      method: 'PUT',
      body:   JSON.stringify(payload),
    });
  },
};

export default apiFetch;