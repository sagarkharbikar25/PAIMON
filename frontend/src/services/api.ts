/* =============================================
   src/services/api.ts
   Pravas — Central API Wrapper (TypeScript)
   ============================================= */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/* ── Token helpers ─────────────────────────── */
export const saveToken = (token: string) => localStorage.setItem('pravas_token', token);
export const getToken  = ()              => localStorage.getItem('pravas_token');
export const clearToken = ()             => localStorage.removeItem('pravas_token');

export const saveUser = (user: object)  => localStorage.setItem('pravas_user', JSON.stringify(user));
export const getStoredUser = ()         => {
  try { return JSON.parse(localStorage.getItem('pravas_user') || 'null'); } catch { return null; }
};
export const clearUser = ()             => localStorage.removeItem('pravas_user');

/* ── Core fetch wrapper ────────────────────── */
async function apiFetch<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });

  let data: { message?: string } & Record<string, unknown>;
  try { data = await res.json(); } catch { data = {}; }

  if (!res.ok) {
    const err = new Error(data.message || `Request failed: ${res.status}`);
    (err as Error & { status: number }).status = res.status;
    throw err;
  }
  return data as T;
}

export default apiFetch;