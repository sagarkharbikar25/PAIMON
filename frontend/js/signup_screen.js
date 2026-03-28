/* =============================================
   signup_screen.js
   ============================================= */

/**
 * Sign Up Screen – Interactive Behaviour
 *
 * Interactive elements on this screen:
 *   • Password visibility toggle  → show / hide the password field value
 *   • Sign Up form submit         → validate inputs and handle registration
 *   • "Continue with Google" btn  → trigger OAuth / social sign-up flow
 *   • "Log in" link               → navigate to the login screen
 *   • Terms / Privacy links       → open the relevant policy pages
 */

document.addEventListener('DOMContentLoaded', function () {

    /* ------------------------------------------------------------------
       Password visibility toggle
       ------------------------------------------------------------------ */
    const toggleVisibilityBtn = document.querySelector('[data-action="toggle-password"]');
    const passwordInput = document.getElementById('password');
    const visibilityIcon = toggleVisibilityBtn ? toggleVisibilityBtn.querySelector('.material-symbols-outlined') : null;

    if (toggleVisibilityBtn && passwordInput && visibilityIcon) {
        toggleVisibilityBtn.addEventListener('click', function () {
            const isHidden = passwordInput.type === 'password';
            passwordInput.type = isHidden ? 'text' : 'password';
            visibilityIcon.textContent = isHidden ? 'visibility_off' : 'visibility';
        });
    }

    /* ------------------------------------------------------------------
       Sign Up form submission
       ------------------------------------------------------------------ */
    const signupForm = document.querySelector('[data-form="signup"]');

    if (signupForm) {
        signupForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const fullName = document.getElementById('full_name').value.trim();
            const email    = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;

            // Basic client-side validation
            if (!fullName) {
                console.warn('Full name is required');
                return;
            }
            if (!email || !email.includes('@')) {
                console.warn('A valid email address is required');
                return;
            }
            if (password.length < 8) {
                console.warn('Password must be at least 8 characters');
                return;
            }

            // TODO: send registration request to your API / auth provider
            console.log('Sign up submitted', { fullName, email });
        });
    }

    /* ------------------------------------------------------------------
       "Continue with Google" button
       ------------------------------------------------------------------ */
    const googleBtn = document.querySelector('[data-action="google-signup"]');

    if (googleBtn) {
        googleBtn.addEventListener('click', function () {
            // TODO: initiate Google OAuth flow (e.g. Firebase, Supabase, custom OAuth)
            console.log('Continue with Google');
        });
    }

    /* ------------------------------------------------------------------
       "Log in" link
       ------------------------------------------------------------------ */
    const loginLink = document.querySelector('[data-action="go-to-login"]');

    if (loginLink) {
        loginLink.addEventListener('click', function (e) {
            e.preventDefault();
            // TODO: navigate to the login / sign-in screen
            console.log('Navigate to Log In screen');
        });
    }

    /* ------------------------------------------------------------------
       Terms of Service & Privacy Policy links
       ------------------------------------------------------------------ */
    const termsLink   = document.querySelector('[data-action="terms"]');
    const privacyLink = document.querySelector('[data-action="privacy"]');

    if (termsLink) {
        termsLink.addEventListener('click', function (e) {
            e.preventDefault();
            // TODO: open Terms of Service page / modal
            console.log('Open Terms of Service');
        });
    }

    if (privacyLink) {
        privacyLink.addEventListener('click', function (e) {
            e.preventDefault();
            // TODO: open Privacy Policy page / modal
            console.log('Open Privacy Policy');
        });
    }

});