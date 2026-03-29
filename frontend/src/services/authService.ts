/* =============================================
   src/services/authService.ts
   Pravas — Auth Service
   ============================================= */

import apiFetch, { saveToken, saveUser, clearToken, clearUser, getStoredUser } from './api';

interface AuthResponse {
  success: boolean;
  token: string;
  user: {
    _id: string;
    name: string;
    email: string;
    photoUrl: string;
  };
}

/* ── Login ─────────────────────────────────── */
export async function login(email: string, password: string) {
  const data = await apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  saveToken(data.token);
  saveUser(data.user);
  return data.user;
}

/* ── Register ──────────────────────────────── */
export async function register(name: string, email: string, password: string) {
  const data = await apiFetch<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
  saveToken(data.token);
  saveUser(data.user);
  return data.user;
}

/* ── Update profile ────────────────────────── */
export async function updateProfile(payload: {
  name?: string;
  mobile?: string;
  dateOfBirth?: string;
  age?: number;
  country?: string;
  state?: string;
}) {
  const data = await apiFetch<{ success: boolean; user: object }>('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  saveUser(data.user);
  return data.user;
}

/* ── Get current user ──────────────────────── */
export async function getMe() {
  const data = await apiFetch<{ success: boolean; user: object }>('/auth/me');
  saveUser(data.user);
  return data.user;
}

/* ── Logout ────────────────────────────────── */
export function logout() {
  clearToken();
  clearUser();
}

/* ── Is logged in ──────────────────────────── */
export function isLoggedIn(): boolean {
  return !!localStorage.getItem('pravas_token');
}

/* ── Get cached user ───────────────────────── */
export { getStoredUser };