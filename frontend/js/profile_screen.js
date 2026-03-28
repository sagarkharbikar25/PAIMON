/* =============================================
   profile_screen.js
   ============================================= */

/**
 * Profile Screen – Interactive Behaviour
 *
 * Interactive elements on this screen:
 *   • Back button          → navigate to the previous screen
 *   • Settings button      → open app settings
 *   • Edit avatar button   → trigger profile photo upload / edit flow
 *   • Account Settings rows (Personal Information, Payment Methods, Notifications)
 *   • Help & Support rows  (Help Center, Privacy & Terms)
 *   • Log Out button       → sign the user out
 *   • Bottom Navigation    → tab switching (Explore, Bookings, Saved, Profile)
 */

document.addEventListener('DOMContentLoaded', function () {

    /* ------------------------------------------------------------------
       Back button
       ------------------------------------------------------------------ */
    const backBtn = document.querySelector('[data-action="back"]');
    if (backBtn) {
        backBtn.addEventListener('click', function () {
            // TODO: navigate back (e.g. history.back())
            console.log('Navigate back');
        });
    }

    /* ------------------------------------------------------------------
       Settings button
       ------------------------------------------------------------------ */
    const settingsBtn = document.querySelector('[data-action="settings"]');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', function () {
            // TODO: open settings screen
            console.log('Open settings');
        });
    }

    /* ------------------------------------------------------------------
       Edit avatar button
       ------------------------------------------------------------------ */
    const editAvatarBtn = document.querySelector('[data-action="edit-avatar"]');
    if (editAvatarBtn) {
        editAvatarBtn.addEventListener('click', function () {
            // TODO: trigger file picker or photo-edit modal
            console.log('Edit avatar');
        });
    }

    /* ------------------------------------------------------------------
       Account Settings rows
       ------------------------------------------------------------------ */
    const personalInfoBtn = document.querySelector('[data-action="personal-info"]');
    if (personalInfoBtn) {
        personalInfoBtn.addEventListener('click', function () {
            // TODO: navigate to Personal Information screen
            console.log('Open Personal Information');
        });
    }

    const paymentBtn = document.querySelector('[data-action="payment-methods"]');
    if (paymentBtn) {
        paymentBtn.addEventListener('click', function () {
            // TODO: navigate to Payment Methods screen
            console.log('Open Payment Methods');
        });
    }

    const notificationsBtn = document.querySelector('[data-action="notifications"]');
    if (notificationsBtn) {
        notificationsBtn.addEventListener('click', function () {
            // TODO: navigate to Notifications settings screen
            console.log('Open Notifications');
        });
    }

    /* ------------------------------------------------------------------
       Help & Support rows
       ------------------------------------------------------------------ */
    const helpCenterBtn = document.querySelector('[data-action="help-center"]');
    if (helpCenterBtn) {
        helpCenterBtn.addEventListener('click', function () {
            // TODO: open Help Center (in-app or external URL)
            console.log('Open Help Center');
        });
    }

    const privacyBtn = document.querySelector('[data-action="privacy-terms"]');
    if (privacyBtn) {
        privacyBtn.addEventListener('click', function () {
            // TODO: open Privacy & Terms screen
            console.log('Open Privacy & Terms');
        });
    }

    /* ------------------------------------------------------------------
       Log Out button
       ------------------------------------------------------------------ */
    const logoutBtn = document.querySelector('[data-action="logout"]');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            // TODO: sign user out and redirect to login screen
            console.log('Log out');
        });
    }

    /* ------------------------------------------------------------------
       Bottom Navigation tabs
       ------------------------------------------------------------------ */
    const navLinks = document.querySelectorAll('[data-nav]');
    navLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const target = link.getAttribute('data-nav');
            // TODO: route to the selected tab (explore / bookings / saved / profile)
            console.log('Navigate to tab:', target);
        });
    });

});