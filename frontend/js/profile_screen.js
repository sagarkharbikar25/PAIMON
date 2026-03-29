/* =============================================
   profile_screen.js
   VIEW PAGE - Displays profile from backend
   ============================================= */
import { guardRoute, logout } from './auth.js';

guardRoute(null, '/html/login.html');

document.addEventListener('DOMContentLoaded', async function () {
    
    // LOAD DATA from backend
    try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/users/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        
        if (data.success && data.user) {
            const user = data.user;
            
            // Update Name (find the h2 with Arjun Sharma)
            const nameHeading = document.querySelector('h2.text-3xl');
            if (nameHeading) nameHeading.textContent = user.name || 'Traveler';
            
            // Update Location (find the span with Mumbai, India)
            const locationSpan = document.querySelector('span.text-primary.text-sm');
            if (locationSpan && user.country) {
                const locationText = user.state ? `${user.state}, ${user.country}` : user.country;
                locationSpan.innerHTML = `<span class="material-symbols-outlined text-base" data-icon="location_on">location_on</span> ${locationText}`;
            }
            
            // Update Avatar if photoUrl exists
            const avatarImg = document.querySelector('section img[alt]');
            if (avatarImg && user.photoUrl) {
                avatarImg.src = user.photoUrl;
            }
        }
    } catch (err) {
        console.error("Failed to load profile:", err);
    }

    // BUTTON ACTIONS
    document.querySelector('[data-action="back"]').addEventListener('click', () => window.history.back());
    
    document.querySelector('[data-action="personal-info"]').addEventListener('click', () => {
        window.location.href = '/html/complete_profile_setup.html'; // Go to edit form
    });
    
    document.querySelector('[data-action="logout"]').addEventListener('click', () => {
        logout();
        window.location.href = '/html/login.html';
    });
    
    // Settings button placeholder
    document.querySelector('[data-action="settings"]').addEventListener('click', () => {
        window.location.href = '/html/settings_screen.html'; // Create this later
    });
});