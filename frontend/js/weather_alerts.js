/* =============================================
   weather_alerts.js
   JavaScript for Weather & Alerts page
   ============================================= */

// ── Bottom Navigation ───────────────────────────────────────────────────────
const navLinks = document.querySelectorAll('[data-nav]');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.dataset.nav;
        // Placeholder: replace with actual routing/navigation logic
        console.log('Navigating to:', target);
    });
});


// ── Menu Button ─────────────────────────────────────────────────────────────
const menuBtn = document.getElementById('menu-btn');

menuBtn.addEventListener('click', () => {
    // Placeholder: replace with actual sidebar/drawer toggle logic
    console.log('Menu toggled');
});


// ── Full Details Button ─────────────────────────────────────────────────────
const fullDetailsBtn = document.getElementById('full-details-btn');

fullDetailsBtn.addEventListener('click', () => {
    // Placeholder: replace with actual full forecast page navigation
    console.log('Full forecast details requested');
});


// ── Forecast Row Hover Highlight ────────────────────────────────────────────
const forecastRows = document.querySelectorAll('.space-y-4 > div');

forecastRows.forEach(row => {
    row.addEventListener('click', () => {
        // Placeholder: expand row or show detail panel
        console.log('Forecast row clicked:', row.querySelector('span.w-12')?.textContent?.trim());
    });
});


// ── Rain Alert — Notify Me Later ────────────────────────────────────────────
const notifyLaterBtn = document.getElementById('notify-later-btn');

notifyLaterBtn.addEventListener('click', () => {
    notifyLaterBtn.textContent = 'Reminder set ✓';
    notifyLaterBtn.disabled = true;
    notifyLaterBtn.classList.add('opacity-60', 'cursor-not-allowed');
    console.log('Rain alert: notify later scheduled');
});


// ── Crowd Warning — View Heatmap ────────────────────────────────────────────
const viewHeatmapBtn = document.getElementById('view-heatmap-btn');

viewHeatmapBtn.addEventListener('click', () => {
    // Placeholder: replace with actual heatmap page/modal navigation
    console.log('Opening crowd heatmap for Gion');
    alert('Heatmap feature coming soon!');
});


// ── Crowd Warning — Share Alert ─────────────────────────────────────────────
const shareAlertBtn = document.getElementById('share-alert-btn');

shareAlertBtn.addEventListener('click', async () => {
    const shareData = {
        title: 'High crowds in Gion – प्रvaas Alert',
        text: 'Real-time data indicates heavy pedestrian traffic around Yasaka Shrine. Expect delays of 20-30 minutes for restaurant entries.',
        url: window.location.href,
    };
    try {
        if (navigator.share) {
            await navigator.share(shareData);
            console.log('Alert shared successfully');
        } else {
            await navigator.clipboard.writeText(shareData.text + '\n' + shareData.url);
            alert('Alert copied to clipboard!');
        }
    } catch (err) {
        console.error('Share failed:', err);
    }
});