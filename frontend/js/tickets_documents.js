/* =============================================
   tickets_documents.js
   Pravas — Tickets & Documents Scripts
   ============================================= */

import { guardRoute, getCurrentUser } from './auth.js';

/* ── Route Guard ─────────────────────────────
   Not logged in → redirect to login
   ─────────────────────────────────────────────*/
guardRoute(null, '/html/login.html');

/* ── DOM Ready ───────────────────────────────*/
document.addEventListener('DOMContentLoaded', function () {

    /* Load user info */
    const user = getCurrentUser();
    if (user) {
        const userNameEl = document.getElementById('user-name');
        if (userNameEl) userNameEl.textContent = user.name || 'The Explorer';

        const avatarEl = document.getElementById('user-avatar');
        if (avatarEl && user.photoUrl) avatarEl.src = user.photoUrl;
    }

    /* ── Document Category Cards ─────────────*/
    const categoryCards = document.querySelectorAll('[data-category]');
    categoryCards.forEach(card => {
        card.addEventListener('click', function () {
            const category = this.dataset.category;
            console.log(`Opening category: ${category}`);
            // TODO: filter documents by category
        });
    });

    /* ── View All Tickets ────────────────────*/
    const viewAllBtn = document.getElementById('view-all-tickets');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', function () {
            console.log('View all tickets');
            // TODO: navigate to full tickets list
        });
    }

    /* ── Voucher Details ─────────────────────*/
    const voucherBtn = document.getElementById('voucher-details-btn');
    if (voucherBtn) {
        voucherBtn.addEventListener('click', function () {
            console.log('Opening voucher details');
            // TODO: open voucher modal or page
        });
    }

    /* ── Secure Storage Document Items ───────*/
    const docItems = document.querySelectorAll('[data-doc]');
    docItems.forEach(item => {
        item.addEventListener('click', function () {
            const docName = this.dataset.doc;
            console.log(`Opening doc: ${docName}`);
            // TODO: open document viewer
        });
    });

    /* ── Bottom Nav active state ─────────────*/
    const navLinks = document.querySelectorAll('[data-nav]');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            navLinks.forEach(n => {
                n.classList.remove('text-primary', 'bg-primary/10');
                n.classList.add('text-slate-400');
            });
            this.classList.add('text-primary', 'bg-primary/10');
            this.classList.remove('text-slate-400');
        });
    });

});