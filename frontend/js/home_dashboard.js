/* =============================================
   home_dashboard.js
   Pravas — Dashboard Scripts
   ============================================= */

import { guardRoute, getCurrentUser, logout } from './auth.js';

/* ── Route Guard ─────────────────────────────
   If user is not logged in → send to login page
   ─────────────────────────────────────────────*/
guardRoute(null, '/html/login.html');

/* ── DOM Ready ───────────────────────────────*/
document.addEventListener('DOMContentLoaded', function () {

    /* Load user info from localStorage into the UI */
    const user = getCurrentUser();
    if (user) {
        /* Update welcome heading with user's name */
        const welcomeHeading = document.getElementById('welcome-heading');
        if (welcomeHeading) {
            welcomeHeading.textContent = `Welcome Back, ${user.name.split(' ')[0]}`;
        }

        /* Update profile avatar if photoUrl exists */
        const avatarImg = document.getElementById('user-avatar');
        if (avatarImg && user.photoUrl) {
            avatarImg.src = user.photoUrl;
        }
    }

    /* ── Logout button ───────────────────────*/
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            logout();
            window.location.href = '/html/login.html';
        });
    }

    /* ── Bottom nav active state ─────────────*/
    const navItems = document.querySelectorAll('[data-nav]');
    navItems.forEach(item => {
        item.addEventListener('click', function () {
            navItems.forEach(n => {
                n.classList.remove('text-primary', 'bg-secondary-container/30');
                n.classList.add('text-slate-400');
            });
            this.classList.add('text-primary', 'bg-secondary-container/30');
            this.classList.remove('text-slate-400');
        });
    });

    /* ── FAB — New Trip ──────────────────────*/
    const fab = document.getElementById('fab-new-trip');
    if (fab) {
        fab.addEventListener('click', function () {
            window.location.href = '/html/create_trip.html';
        });
    }

});