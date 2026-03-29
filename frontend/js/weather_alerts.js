/* =============================================
   weather_alerts.js
   Pravas — Weather & Alerts (connected to backend)
   ============================================= */

import { guardRoute, getCurrentUser } from './auth.js';
import { getToken } from './api.js';

const BASE_URL = 'http://localhost:5000/api';

/* ── Route Guard ─────────────────────────────*/
guardRoute(null, '/html/login.html');

/* ── DOM Ready ───────────────────────────────*/
document.addEventListener('DOMContentLoaded', async function () {

    /* Load user avatar */
    const user = getCurrentUser();
    if (user) {
        const avatarEl = document.getElementById('user-avatar');
        if (avatarEl && user.photoUrl) avatarEl.src = user.photoUrl;
    }

    /* ── API helper ────────────────────────── */
    async function apiFetch(endpoint) {
        const token = getToken();
        const res   = await fetch(`${BASE_URL}${endpoint}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Request failed');
        return data;
    }

    /* ── Weather icon map ──────────────────── */
    const iconMap = {
        '01d': 'wb_sunny',       '01n': 'bedtime',
        '02d': 'partly_cloudy_day', '02n': 'partly_cloudy_night',
        '03d': 'cloud',          '03n': 'cloud',
        '04d': 'cloud',          '04n': 'cloud',
        '09d': 'rainy',          '09n': 'rainy',
        '10d': 'rainy',          '10n': 'rainy',
        '11d': 'thunderstorm',   '11n': 'thunderstorm',
        '13d': 'ac_unit',        '13n': 'ac_unit',
        '50d': 'foggy',          '50n': 'foggy',
    };

    function getIcon(code) { return iconMap[code] || 'wb_sunny'; }

    /* ── Day name helper ───────────────────── */
    function dayName(dateStr) {
        const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
        return days[new Date(dateStr).getDay()];
    }

    /* ── Get city from user trip or default ── */
    const city = localStorage.getItem('pravas_current_city') || 'Kyoto';

    /* ────────────────────────────────────────
       LOAD CURRENT WEATHER
       ─────────────────────────────────────── */
    async function loadCurrentWeather() {
        try {
            const data    = await apiFetch(`/weather/current?city=${encodeURIComponent(city)}`);
            const weather = data.weather;

            /* Temperature */
            const tempEl = document.getElementById('current-temp');
            if (tempEl) tempEl.textContent = `${Math.round(weather.temp)}°C`;

            /* Description */
            const descEl = document.getElementById('current-desc');
            if (descEl) descEl.textContent = weather.description.charAt(0).toUpperCase() + weather.description.slice(1);

            /* City name */
            const cityEl = document.getElementById('current-city');
            if (cityEl) cityEl.textContent = weather.city;

            /* Weather icon */
            const iconEl = document.getElementById('current-icon');
            if (iconEl) iconEl.textContent = getIcon(weather.icon);

            /* Humidity stat */
            const humidEl = document.getElementById('stat-humidity');
            if (humidEl) humidEl.textContent = `${weather.humidity}%`;

        } catch (err) {
            console.error('Weather load error:', err.message);
        }
    }

    /* ────────────────────────────────────────
       LOAD 5-DAY FORECAST
       ─────────────────────────────────────── */
    async function loadForecast() {
        try {
            const data     = await apiFetch(`/weather/forecast?city=${encodeURIComponent(city)}`);
            const forecast = data.forecast.forecast;
            const container = document.getElementById('forecast-rows');
            if (!container || !forecast?.length) return;

            container.innerHTML = '';

            forecast.forEach((day, i) => {
                const isToday = i === 0;
                const row = document.createElement('div');
                row.className = `flex items-center justify-between p-4 bg-surface-container-lowest rounded-lg hover:shadow-sm transition-all cursor-pointer
                    ${isToday ? 'border-2 border-primary-container/20' : ''}`;

                row.innerHTML = `
                    <span class="w-12 ${isToday ? 'text-primary font-bold' : 'text-on-surface-variant font-medium'}">
                        ${dayName(day.date)}
                    </span>
                    <span class="material-symbols-outlined ${isToday ? 'text-primary-container' : 'text-amber-500'}"
                          style="font-variation-settings: 'FILL' 1;">
                        ${getIcon(day.icon)}
                    </span>
                    <div class="flex-1 px-8">
                        <div class="h-1.5 w-full bg-surface-container rounded-full overflow-hidden relative">
                            <div class="absolute left-1/4 right-1/4 h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"></div>
                        </div>
                    </div>
                    <div class="flex gap-3 font-medium">
                        <span class="text-on-surface">${Math.round(day.temp)}°</span>
                        <span class="text-on-surface-variant opacity-50">${Math.round(day.temp - 5)}°</span>
                    </div>
                `;

                row.addEventListener('click', () => {
                    console.log('Forecast day clicked:', day.date);
                });

                container.appendChild(row);
            });

        } catch (err) {
            console.error('Forecast load error:', err.message);
        }
    }

    /* ────────────────────────────────────────
       LOAD WEATHER ALERTS
       ─────────────────────────────────────── */
    async function loadAlerts() {
        try {
            const data    = await apiFetch(`/weather/alerts?city=${encodeURIComponent(city)}`);
            const alerts  = data.alerts;
            const container = document.getElementById('alerts-container');
            if (!container) return;

            if (!alerts || alerts.length === 0) {
                container.innerHTML = `
                    <div class="bg-surface-container-low p-4 rounded-xl text-sm text-on-surface-variant font-medium flex items-center gap-2">
                        <span class="material-symbols-outlined text-primary">check_circle</span>
                        No active alerts for ${city}. All clear!
                    </div>`;
                return;
            }

            /* Keep static cards but prepend real alerts */
            const alertColors = {
                RAIN:  { border: 'border-primary-container', bg: 'bg-primary-container/10', icon: 'rainy',      text: 'text-primary-container', badge: 'WEATHER ALERT',  badgeBg: 'bg-surface-container-high text-on-surface-variant' },
                HEAT:  { border: 'border-error',             bg: 'bg-error/10',             icon: 'thermostat', text: 'text-error',             badge: 'HEAT ALERT',    badgeBg: 'bg-error-container text-on-error-container' },
                COLD:  { border: 'border-primary-container', bg: 'bg-primary-container/10', icon: 'ac_unit',    text: 'text-primary-container', badge: 'COLD ALERT',    badgeBg: 'bg-surface-container-high text-on-surface-variant' },
                STORM: { border: 'border-tertiary-container', bg: 'bg-tertiary-container/10', icon: 'thunderstorm', text: 'text-tertiary-container', badge: 'STORM WARNING', badgeBg: 'bg-tertiary-fixed text-on-tertiary-fixed-variant' },
            };

            container.innerHTML = '';

            alerts.forEach(alert => {
                const style = alertColors[alert.type] || alertColors.RAIN;
                const card  = document.createElement('div');
                card.className = `bg-white rounded-xl overflow-hidden shadow-[0_12px_40px_rgba(23,28,31,0.06)] border-l-4 ${style.border} group hover:-translate-y-1 transition-transform`;

                card.innerHTML = `
                    <div class="p-6">
                        <div class="flex items-start justify-between mb-4">
                            <div class="${style.bg} p-3 rounded-lg ${style.text}">
                                <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">${style.icon}</span>
                            </div>
                            <span class="text-[10px] font-bold ${style.badgeBg} px-2 py-1 rounded">${style.badge}</span>
                        </div>
                        <h3 class="text-xl font-bold font-headline mb-2">${alert.type.charAt(0) + alert.type.slice(1).toLowerCase()} Alert</h3>
                        <p class="text-on-surface-variant text-sm leading-relaxed mb-6">${alert.message}</p>
                        <button class="alert-notify-btn w-full py-3 bg-surface-container-highest text-on-surface font-semibold rounded-lg hover:bg-surface-container-high transition-colors">
                            Notify me later
                        </button>
                    </div>
                `;

                /* Notify later button */
                card.querySelector('.alert-notify-btn').addEventListener('click', function () {
                    this.textContent = 'Reminder set ✓';
                    this.disabled    = true;
                    this.classList.add('opacity-60', 'cursor-not-allowed');
                });

                container.appendChild(card);
            });

            /* Info box at bottom */
            const infoBox = document.createElement('div');
            infoBox.className = 'bg-surface-container-low p-4 rounded-xl border border-outline-variant/15';
            infoBox.innerHTML = `
                <div class="flex gap-3">
                    <span class="material-symbols-outlined text-primary-container">info</span>
                    <p class="text-xs text-on-surface-variant font-medium">
                        Data updated just now. Powered by OpenWeatherMap.
                    </p>
                </div>
            `;
            container.appendChild(infoBox);

        } catch (err) {
            console.error('Alerts load error:', err.message);
        }
    }

    /* ── Static button handlers ────────────── */

    /* Notify later (static rain card) */
    const notifyLaterBtn = document.getElementById('notify-later-btn');
    if (notifyLaterBtn) {
        notifyLaterBtn.addEventListener('click', function () {
            this.textContent = 'Reminder set ✓';
            this.disabled    = true;
            this.classList.add('opacity-60', 'cursor-not-allowed');
        });
    }

    /* View heatmap */
    const viewHeatmapBtn = document.getElementById('view-heatmap-btn');
    if (viewHeatmapBtn) {
        viewHeatmapBtn.addEventListener('click', () => {
            alert('Heatmap feature coming soon!');
        });
    }

    /* Share alert */
    const shareAlertBtn = document.getElementById('share-alert-btn');
    if (shareAlertBtn) {
        shareAlertBtn.addEventListener('click', async () => {
            const shareData = {
                title: 'High crowds in Gion – प्रvaas Alert',
                text:  'Real-time data indicates heavy pedestrian traffic around Yasaka Shrine.',
                url:   window.location.href,
            };
            try {
                if (navigator.share) {
                    await navigator.share(shareData);
                } else {
                    await navigator.clipboard.writeText(shareData.text + '\n' + shareData.url);
                    alert('Alert copied to clipboard!');
                }
            } catch (err) {
                console.error('Share failed:', err);
            }
        });
    }

    /* Full details */
    const fullDetailsBtn = document.getElementById('full-details-btn');
    if (fullDetailsBtn) {
        fullDetailsBtn.addEventListener('click', () => {
            console.log('Full forecast details — coming soon');
        });
    }

    /* Menu button */
    const menuBtn = document.getElementById('menu-btn');
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            console.log('Menu toggled');
        });
    }

    /* Bottom nav */
    const navLinks = document.querySelectorAll('[data-nav]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.forEach(n => n.classList.remove('bg-secondary-container', 'text-primary', 'scale-105'));
            link.classList.add('bg-secondary-container', 'text-primary', 'scale-105');
            console.log('Navigating to:', link.dataset.nav);
        });
    });

    /* ── Initialise all data ───────────────── */
    await Promise.all([
        loadCurrentWeather(),
        loadForecast(),
        loadAlerts(),
    ]);

});