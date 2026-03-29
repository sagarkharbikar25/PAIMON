/* =============================================
   signup_screen.js
   Pravas Sign Up Screen — fully connected to backend
   ============================================= */

import { registerWithEmail, loginWithGoogle, guardRoute } from './auth.js';

/* ── Correct paths for Live Server (PAIMON root) ── */
const DASHBOARD = '/frontend/html/home_dashboard.html';
const LOGIN     = '/frontend/html/login.html';

/* ── Password Visibility Toggle ── */
function togglePasswordVisibility(inputId, iconEl) {
  const input = document.getElementById(inputId);
  if (!input || !iconEl) return;
  const isHidden = input.type === 'password';
  input.type = isHidden ? 'text' : 'password';
  iconEl.textContent = isHidden ? 'visibility_off' : 'visibility';
}

/* ── UI State Helpers ── */
function showFieldError(fieldId, message) {
  clearFieldError(fieldId);
  const input = document.getElementById(fieldId);
  if (!input) return;
  input.classList.add('ring-2', 'ring-error', 'bg-error-container/10');
  const err = document.createElement('p');
  err.id = `${fieldId}-error`;
  err.className = 'text-error text-xs mt-1 ml-1 font-medium';
  err.textContent = message;
  input.parentElement.appendChild(err);
}

function clearFieldError(fieldId) {
  const input = document.getElementById(fieldId);
  if (input) input.classList.remove('ring-2', 'ring-error', 'bg-error-container/10');
  const existing = document.getElementById(`${fieldId}-error`);
  if (existing) existing.remove();
}

function clearAllErrors() {
  ['full_name', 'email', 'password'].forEach(clearFieldError);
  removeBanner();
}

function setLoading(isLoading) {
  const btn     = document.querySelector('[type="submit"]');
  const btnText = document.getElementById('signup-btn-text');
  const spinner = document.getElementById('signup-spinner');
  if (!btn) return;
  btn.disabled = isLoading;
  if (btnText) btnText.textContent = isLoading ? 'Creating account…' : 'Sign Up';
  if (spinner) spinner.classList.toggle('hidden', !isLoading);
}

function showBanner(message, type = 'error') {
  removeBanner();
  const form = document.querySelector('[data-form="signup"]');
  if (!form) return;
  const banner = document.createElement('div');
  banner.id = 'auth-banner';
  const isError = type === 'error';
  banner.className = `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium mb-4
    ${isError ? 'bg-error-container text-on-error-container' : 'bg-secondary-container text-on-secondary-container'}`;
  banner.innerHTML = `
    <span class="material-symbols-outlined text-base">${isError ? 'error' : 'check_circle'}</span>
    <span>${message}</span>`;
  form.prepend(banner);
}

function removeBanner() {
  const existing = document.getElementById('auth-banner');
  if (existing) existing.remove();
}

/* ── Validation ── */
function validateSignupForm(fullName, email, password) {
  let valid = true;
  clearAllErrors();
  if (!fullName || fullName.length < 2) {
    showFieldError('full_name', 'Please enter your full name (at least 2 characters).');
    valid = false;
  }
  if (!email || !email.includes('@')) {
    showFieldError('email', 'Please enter a valid email address.');
    valid = false;
  }
  if (!password || password.length < 8) {
    showFieldError('password', 'Password must be at least 8 characters.');
    valid = false;
  }
  const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  if (password && password.length >= 8 && !hasSymbol) {
    showFieldError('password', 'Password must include at least one symbol (e.g. @, #, !).');
    valid = false;
  }
  return valid;
}

function friendlyError(err) {
  const msg = err?.message || '';
  if (msg.includes('already') || msg.includes('duplicate')) return 'An account with this email already exists.';
  if (msg.includes('Network') || msg.includes('fetch')) return 'Network error. Check your connection.';
  return msg || 'Something went wrong. Please try again.';
}

/* ── DOM Ready ── */
document.addEventListener('DOMContentLoaded', function () {

  /* Already logged in → go to dashboard */
  guardRoute(DASHBOARD, null);

  /* ── Password visibility toggle ── */
  const toggleBtn      = document.querySelector('[data-action="toggle-password"]');
  const passwordInput  = document.getElementById('password');
  const visibilityIcon = toggleBtn?.querySelector('.material-symbols-outlined');

  if (toggleBtn && passwordInput && visibilityIcon) {
    toggleBtn.addEventListener('click', function () {
      togglePasswordVisibility('password', visibilityIcon);
    });
  }

  /* ── Sign Up form ── */
  const signupForm = document.querySelector('[data-form="signup"]');
  if (signupForm) {
    signupForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const fullName = document.getElementById('full_name')?.value.trim();
      const email    = document.getElementById('email')?.value.trim();
      const password = document.getElementById('password')?.value;
      if (!validateSignupForm(fullName, email, password)) return;
      setLoading(true);
      try {
        await registerWithEmail(email, password, fullName);
        showBanner('Account created! Redirecting…', 'success');
        setTimeout(() => { window.location.href = DASHBOARD; }, 800);  // ✅ correct path
      } catch (err) {
        console.error('Sign up error:', err);
        showBanner(friendlyError(err));
      } finally {
        setLoading(false);
      }
    });
  }

  /* ── Google Signup ── */
  const googleBtn = document.querySelector('[data-action="google-signup"]');
  if (googleBtn) {
    googleBtn.addEventListener('click', async function () {
      removeBanner();
      try {
        googleBtn.disabled = true;
        await loginWithGoogle();
        window.location.href = DASHBOARD;
      } catch (err) {
        if (err.code !== 'auth/popup-closed-by-user') showBanner(friendlyError(err));
      } finally {
        googleBtn.disabled = false;
      }
    });
  }

  /* ── Go to Login ── */
  const loginLink = document.querySelector('[data-action="go-to-login"]');
  if (loginLink) {
    loginLink.addEventListener('click', function (e) {
      e.preventDefault();
      window.location.href = LOGIN;   // ✅ correct path
    });
  }

  /* ── Terms / Privacy ── */
  document.querySelector('[data-action="terms"]')?.addEventListener('click', e => e.preventDefault());
  document.querySelector('[data-action="privacy"]')?.addEventListener('click', e => e.preventDefault());
});