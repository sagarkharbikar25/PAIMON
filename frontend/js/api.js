/* =============================================
   api.js — Pravas Central API Wrapper (JWT)
   ============================================= */

const BASE_URL = 'http://localhost:5000/api';

export function saveToken(token) { localStorage.setItem('pravas_token', token); }
export function getToken()       { return localStorage.getItem('pravas_token'); }
export function clearToken()     { localStorage.removeItem('pravas_token'); }

async function apiFetch(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
  let data;
  try { data = await response.json(); } catch { data = {}; }
  if (!response.ok) {
    const err = new Error(data.message || `Request failed: ${response.status}`);
    err.status = response.status;
    err.serverData = data;
    throw err;
  }
  return data;
}

export const api = {
  // ── Auth ──────────────────────────────────
  register: (name, email, password) =>
    apiFetch('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) }),

  login: (email, password) =>
    apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  getMe: () => apiFetch('/auth/me'),

  updateProfile: (payload) =>
    apiFetch('/auth/profile', { method: 'PUT', body: JSON.stringify(payload) }),

  // ── Trips ─────────────────────────────────
  getTrips: (status) =>
    apiFetch(`/trips${status ? `?status=${status}` : ''}`),

  getTrip: (id) => apiFetch(`/trips/${id}`),

  createTrip: (data) =>
    apiFetch('/trips', { method: 'POST', body: JSON.stringify(data) }),

  updateTrip: (id, data) =>
    apiFetch(`/trips/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  deleteTrip: (id) =>
    apiFetch(`/trips/${id}`, { method: 'DELETE' }),

  inviteMember: (tripId, email) =>
    apiFetch(`/trips/${tripId}/invite`, { method: 'POST', body: JSON.stringify({ email }) }),

  respondToInvite: (tripId, action) =>
    apiFetch(`/trips/${tripId}/respond`, { method: 'PATCH', body: JSON.stringify({ action }) }),

  // ── Expenses ──────────────────────────────
  getExpenses: (tripId) => apiFetch(`/expenses/${tripId}`),

  createExpense: (tripId, data) =>
    apiFetch(`/expenses/${tripId}`, { method: 'POST', body: JSON.stringify(data) }),

  deleteExpense: (id) =>
    apiFetch(`/expenses/${id}`, { method: 'DELETE' }),

  getSettlementSummary: (tripId) => apiFetch(`/expenses/${tripId}/summary`),

  // ── Itinerary ─────────────────────────────
  generateItinerary: (data) =>
    apiFetch('/itinerary/generate', { method: 'POST', body: JSON.stringify(data) }),

  // ── Chatbot ───────────────────────────────
  askChatbot: (question, destination) =>
    apiFetch('/chatbot/ask', { method: 'POST', body: JSON.stringify({ question, destination }) }),

  // ── Weather ───────────────────────────────
  getWeather: (city) => apiFetch(`/weather?city=${encodeURIComponent(city)}`),

  // ── Maps ──────────────────────────────────
  searchPlaces: (query) => apiFetch(`/maps/search?q=${encodeURIComponent(query)}`),

  // ── Translator ────────────────────────────
  translate: (text, targetLang) =>
    apiFetch('/translate', { method: 'POST', body: JSON.stringify({ text, targetLang }) }),
};

export default apiFetch;