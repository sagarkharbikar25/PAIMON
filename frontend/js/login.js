/* =============================================
   login.js
   Pravas Login Page — fully connected to backend
   ============================================= */

import { loginWithEmail, loginWithGoogle, guardRoute } from './auth.js';

/* ── Tailwind Config (keep as-is from original) ── */
tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                'background':                '#f6fafe',
                'secondary':                 '#48626e',
                'tertiary':                  '#602400',
                'surface-dim':               '#d6dade',
                'on-primary-container':      '#a5bdff',
                'surface-container':         '#eaeef2',
                'surface-tint':              '#2559bd',
                'surface':                   '#f6fafe',
                'on-primary-fixed-variant':  '#00419e',
                'inverse-primary':           '#b1c5ff',
                'tertiary-container':        '#843500',
                'on-secondary-container':    '#4e6874',
                'surface-container-highest': '#dfe3e7',
                'inverse-on-surface':        '#edf1f5',
                'on-tertiary-fixed':         '#341100',
                'on-background':             '#171c1f',
                'on-primary-fixed':          '#001946',
                'surface-variant':           '#dfe3e7',
                'surface-container-low':     '#f0f4f8',
                'inverse-surface':           '#2c3134',
                'tertiary-fixed-dim':        '#ffb692',
                'surface-bright':            '#f6fafe',
                'secondary-container':       '#cbe7f5',
                'tertiary-fixed':            '#ffdbcb',
                'primary-fixed-dim':         '#b1c5ff',
                'outline':                   '#737784',
                'on-surface-variant':        '#434653',
                'primary-fixed':             '#dae2ff',
                'on-secondary-fixed-variant':'#304a55',
                'secondary-fixed-dim':       '#afcbd8',
                'primary-container':         '#0047ab',
                'primary':                   '#00327d',
                'outline-variant':           '#c3c6d5',
                'on-primary':                '#ffffff',
                'secondary-fixed':           '#cbe7f5',
                'surface-container-high':    '#e4e9ed',
                'on-tertiary-container':     '#ffaa80',
                'error-container':           '#ffdad6',
                'surface-container-lowest':  '#ffffff',
                'on-surface':                '#171c1f',
                'on-tertiary':               '#ffffff',
                'on-error':                  '#ffffff',
                'error':                     '#ba1a1a',
                'on-secondary':              '#ffffff',
                'on-tertiary-fixed-variant': '#7a3000',
                'on-error-container':        '#93000a',
                'on-secondary-fixed':        '#021f29',
            },
            fontFamily: {
                headline: ['Plus Jakarta Sans'],
                body:     ['Inter'],
                label:    ['Inter'],
            },
            borderRadius: {
                DEFAULT: '0.25rem',
                lg:      '1rem',
                xl:      '1.5rem',
                full:    '9999px',
            },
        },
    },
};

/* ── Password Visibility Toggle ── */
function togglePassword() {
    const input    = document.getElementById('passwordInput');
    const icon     = document.getElementById('toggleIcon');
    const isHidden = input.type === 'password';

    input.type       = isHidden ? 'text' : 'password';
    icon.textContent = isHidden ? 'visibility_off' : 'visibility';
}

/* ── UI State Helpers ── */

/**
 * Show an inline error message beneath a field.
 * @param {string} fieldId  - The input element id
 * @param {string} message  - Error text to display
 */
function showFieldError(fieldId, message) {
    clearFieldError(fieldId);
    const input = document.getElementById(fieldId);
    if (!input) return;
    input.classList.add('ring-2', 'ring-error', 'bg-error-container/10');
    const err = document.createElement('p');
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

/**
 * Show / hide the submit button loading state.
 */
function setLoading(isLoading) {
    const btn      = document.querySelector('[data-action="login-submit"]');
    const btnText  = document.getElementById('login-btn-text');
    const spinner  = document.getElementById('login-spinner');
    if (!btn) return;

    btn.disabled = isLoading;
    if (btnText) btnText.textContent = isLoading ? 'Signing in…' : 'Log In';
    if (spinner) spinner.classList.toggle('hidden', !isLoading);
}

/**
 * Show a toast-style error banner at the top of the form.
 */
function showBanner(message, type = 'error') {
    removeBanner();
    const form   = document.querySelector('[data-form="login"]');
    if (!form) return;

    const banner       = document.createElement('div');
    banner.id          = 'auth-banner';
    const isError      = type === 'error';
    banner.className   = `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium mb-4
        ${isError ? 'bg-error-container text-on-error-container' : 'bg-secondary-container text-on-secondary-container'}`;
    banner.innerHTML   = `
        <span class="material-symbols-outlined text-base">${isError ? 'error' : 'check_circle'}</span>
        <span>${message}</span>`;
    form.prepend(banner);
}

function removeBanner() {
    const existing = document.getElementById('auth-banner');
    if (existing) existing.remove();
}

/* ── Client-side Validation ── */
function validateLoginForm(email, password) {
    let valid = true;
    clearFieldError('emailInput');
    clearFieldError('passwordInput');
    removeBanner();

    if (!email || !email.includes('@')) {
        showFieldError('emailInput', 'Please enter a valid email address.');
        valid = false;
    }
    if (!password || password.length < 6) {
        showFieldError('passwordInput', 'Password must be at least 6 characters.');
        valid = false;
    }
    return valid;
}

/* ── Map Firebase error codes to friendly messages ── */
function friendlyError(code) {
    const map = {
        'auth/user-not-found':        'No account found with this email.',
        'auth/wrong-password':        'Incorrect password. Please try again.',
        'auth/invalid-credential':    'Incorrect email or password.',
        'auth/too-many-requests':     'Too many attempts. Please try again later.',
        'auth/user-disabled':         'This account has been disabled.',
        'auth/network-request-failed':'Network error. Check your connection.',
    };
    return map[code] || 'Something went wrong. Please try again.';
}

/* ── DOM Ready ── */
document.addEventListener('DOMContentLoaded', function () {

    /* If the user is already logged in, send them straight to the dashboard */
    guardRoute('/home_dashboard.html', null);

    /* ── Password toggle (keep existing function accessible globally) ── */
    window.togglePassword = togglePassword;

    /* ----------------------------------------------------------------
       Email / Password Login Form
       ---------------------------------------------------------------- */
    const loginForm = document.querySelector('[data-form="login"]');

    if (loginForm) {
        loginForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const email    = document.getElementById('emailInput')?.value.trim();
            const password = document.getElementById('passwordInput')?.value;

            if (!validateLoginForm(email, password)) return;

            setLoading(true);
            try {
                await loginWithEmail(email, password);
                // ✅ Success — redirect to dashboard
                window.location.href = '/home_dashboard.html';
            } catch (err) {
                console.error('Login error:', err);
                showBanner(friendlyError(err.code));
            } finally {
                setLoading(false);
            }
        });
    }

    /* ----------------------------------------------------------------
       Google Login
       ---------------------------------------------------------------- */
    const googleBtn = document.querySelector('[data-action="google-login"]');

    if (googleBtn) {
        googleBtn.addEventListener('click', async function () {
            removeBanner();
            try {
                googleBtn.disabled = true;
                await loginWithGoogle();
                // ✅ Success — redirect to dashboard
                window.location.href = '/home_dashboard.html';
            } catch (err) {
                console.error('Google login error:', err);
                if (err.code !== 'auth/popup-closed-by-user') {
                    showBanner(friendlyError(err.code));
                }
            } finally {
                googleBtn.disabled = false;
            }
        });
    }

    /* ----------------------------------------------------------------
       "Sign Up" link → navigate to signup screen
       ---------------------------------------------------------------- */
    const signupLink = document.querySelector('[data-action="go-to-signup"]');

    if (signupLink) {
        signupLink.addEventListener('click', function (e) {
            e.preventDefault();
            window.location.href = '/signup_screen.html';
        });
    }

    /* ----------------------------------------------------------------
       "Forgot Password" link (optional — wire up when screen exists)
       ---------------------------------------------------------------- */
    const forgotLink = document.querySelector('[data-action="forgot-password"]');

    if (forgotLink) {
        forgotLink.addEventListener('click', function (e) {
            e.preventDefault();
            // TODO: navigate to forgot-password screen or open modal
            console.log('Navigate to forgot password');
        });
    }
});