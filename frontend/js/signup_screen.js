/* =============================================
   signup_screen.js
   Pravas Sign Up Screen — fully connected to backend
   ============================================= */

import { registerWithEmail, loginWithGoogle, guardRoute } from './auth.js';

/* ── Password Visibility Toggle ── */
function togglePasswordVisibility(inputId, iconEl) {
    const input    = document.getElementById(inputId);
    if (!input || !iconEl) return;
    const isHidden = input.type === 'password';
    input.type           = isHidden ? 'text' : 'password';
    iconEl.textContent   = isHidden ? 'visibility_off' : 'visibility';
}

/* ── UI State Helpers ── */

function showFieldError(fieldId, message) {
    clearFieldError(fieldId);
    const input = document.getElementById(fieldId);
    if (!input) return;
    input.classList.add('ring-2', 'ring-error', 'bg-error-container/10');
    const err       = document.createElement('p');
    err.id          = `${fieldId}-error`;
    err.className   = 'text-error text-xs mt-1 ml-1 font-medium';
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
    const form   = document.querySelector('[data-form="signup"]');
    if (!form) return;
    const banner     = document.createElement('div');
    banner.id        = 'auth-banner';
    const isError    = type === 'error';
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

/* ── Client-side Validation ── */
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

/* ── Map Firebase error codes to friendly messages ── */
function friendlyError(code) {
    const map = {
        'auth/email-already-in-use':   'An account with this email already exists.',
        'auth/invalid-email':          'Please enter a valid email address.',
        'auth/weak-password':          'Password is too weak. Use at least 8 characters with symbols.',
        'auth/network-request-failed': 'Network error. Check your connection.',
        'auth/too-many-requests':      'Too many attempts. Please try again later.',
    };
    return map[code] || 'Something went wrong. Please try again.';
}

/* ── DOM Ready ── */
document.addEventListener('DOMContentLoaded', function () {

    /* If the user is already logged in, send them to the dashboard */
    guardRoute('/home_dashboard.html', null);

    /* ----------------------------------------------------------------
       Password visibility toggle
       ---------------------------------------------------------------- */
    const toggleVisibilityBtn = document.querySelector('[data-action="toggle-password"]');
    const passwordInput       = document.getElementById('password');
    const visibilityIcon      = toggleVisibilityBtn
        ? toggleVisibilityBtn.querySelector('.material-symbols-outlined')
        : null;

    if (toggleVisibilityBtn && passwordInput && visibilityIcon) {
        toggleVisibilityBtn.addEventListener('click', function () {
            togglePasswordVisibility('password', visibilityIcon);
        });
    }

    /* ----------------------------------------------------------------
       Sign Up form submission
       ---------------------------------------------------------------- */
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
                // Success — redirect to dashboard
                showBanner('Account created! Redirecting…', 'success');
                setTimeout(() => { window.location.href = '/home_dashboard.html'; }, 800);
            } catch (err) {
                console.error('Sign up error:', err);
                showBanner(friendlyError(err.code));
            } finally {
                setLoading(false);
            }
        });
    }

    /* ----------------------------------------------------------------
       "Continue with Google" button
       ---------------------------------------------------------------- */
    const googleBtn = document.querySelector('[data-action="google-signup"]');

    if (googleBtn) {
        googleBtn.addEventListener('click', async function () {
            removeBanner();
            try {
                googleBtn.disabled = true;
                await loginWithGoogle();
                window.location.href = '/home_dashboard.html';
            } catch (err) {
                console.error('Google signup error:', err);
                if (err.code !== 'auth/popup-closed-by-user') {
                    showBanner(friendlyError(err.code));
                }
            } finally {
                googleBtn.disabled = false;
            }
        });
    }

    /* ----------------------------------------------------------------
       "Log in" link
       ---------------------------------------------------------------- */
    const loginLink = document.querySelector('[data-action="go-to-login"]');
    if (loginLink) {
        loginLink.addEventListener('click', function (e) {
            e.preventDefault();
            window.location.href = '/login.html';
        });
    }

    /* ----------------------------------------------------------------
       Terms of Service & Privacy Policy links
       ---------------------------------------------------------------- */
    const termsLink   = document.querySelector('[data-action="terms"]');
    const privacyLink = document.querySelector('[data-action="privacy"]');

    if (termsLink) {
        termsLink.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('Open Terms of Service');
        });
    }

    if (privacyLink) {
        privacyLink.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('Open Privacy Policy');
        });
    }

});