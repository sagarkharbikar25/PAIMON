tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "tertiary-fixed": "#ffdbcb",
                "on-secondary-container": "#4e6874",
                "surface-bright": "#f6fafe",
                "inverse-on-surface": "#edf1f5",
                "on-primary": "#ffffff",
                "on-tertiary-fixed-variant": "#7a3000",
                "on-error-container": "#93000a",
                "on-primary-fixed": "#001946",
                "surface": "#f6fafe",
                "on-tertiary": "#ffffff",
                "on-error": "#ffffff",
                "surface-variant": "#dfe3e7",
                "secondary-fixed": "#cbe7f5",
                "outline": "#737784",
                "surface-container-high": "#e4e9ed",
                "inverse-primary": "#b1c5ff",
                "primary": "#00327d",
                "tertiary": "#602400",
                "on-secondary-fixed": "#021f29",
                "secondary-container": "#cbe7f5",
                "tertiary-container": "#843500",
                "surface-container": "#eaeef2",
                "background": "#f6fafe",
                "primary-fixed": "#dae2ff",
                "on-surface": "#171c1f",
                "on-tertiary-fixed": "#341100",
                "surface-container-low": "#f0f4f8",
                "error-container": "#ffdad6",
                "primary-container": "#0047ab",
                "outline-variant": "#c3c6d5",
                "on-secondary-fixed-variant": "#304a55",
                "surface-container-highest": "#dfe3e7",
                "on-surface-variant": "#434653",
                "surface-container-lowest": "#ffffff",
                "on-secondary": "#ffffff",
                "primary-fixed-dim": "#b1c5ff",
                "on-tertiary-container": "#ffaa80",
                "inverse-surface": "#2c3134",
                "on-primary-fixed-variant": "#00419e",
                "secondary-fixed-dim": "#afcbd8",
                "surface-tint": "#2559bd",
                "on-background": "#171c1f",
                "secondary": "#48626e",
                "error": "#ba1a1a",
                "on-primary-container": "#a5bdff",
                "tertiary-fixed-dim": "#ffb692",
                "surface-dim": "#d6dade"
            },
            fontFamily: {
                "headline": ["Plus Jakarta Sans"],
                "body": ["Inter"],
                "label": ["Inter"]
            },
            borderRadius: {
                "DEFAULT": "0.25rem",
                "lg": "1rem",
                "xl": "1.5rem",
                "full": "9999px"
            },
        },
    },
};

document.addEventListener('DOMContentLoaded', function () {

    // Get DOM elements
    var generateBtn = document.getElementById('generate-btn');
    var applyBtn = document.getElementById('apply-btn');
    var destinationInput = document.getElementById('destination-input');
    var daysInput = document.getElementById('days-input');
    var tripBadge = document.getElementById('trip-badge');
    var itinerarySection = document.getElementById('itinerary-section');
    var menuBtn = document.querySelector('.menu-btn');
    var bottomNavLinks = document.querySelectorAll('.bottom-nav-link');

    // Generate Itinerary button click handler
    generateBtn.addEventListener('click', function () {
        var destination = destinationInput.value.trim();
        var days = daysInput.value.trim();

        if (destination === '' || days === '') {
            console.log('Please fill in both destination and number of days.');
            return;
        }

        // Update the trip badge text
        tripBadge.textContent = days + ' Days in ' + destination;

        // Scroll to the itinerary section
        itinerarySection.scrollIntoView({ behavior: 'smooth' });

        console.log('Generating itinerary for ' + days + ' days in ' + destination);
    });

    // Apply to Trip button click handler
    applyBtn.addEventListener('click', function () {
        console.log('Itinerary applied to trip!');
    });

    // Menu button click handler
    menuBtn.addEventListener('click', function () {
        console.log('Menu button clicked');
    });

    // Bottom navigation active state handler
    bottomNavLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            // Remove active styles from all bottom nav links
            bottomNavLinks.forEach(function (navLink) {
                navLink.classList.remove('bg-[#cbe7f5]', 'dark:bg-[#0047AB]/30', 'text-[#00327d]', 'dark:text-white', 'rounded-2xl', 'scale-105');
                navLink.classList.add('text-slate-400', 'dark:text-slate-500');
                var icon = navLink.querySelector('.material-symbols-outlined');
                icon.style.fontVariationSettings = "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24";
            });

            // Add active styles to clicked link
            this.classList.remove('text-slate-400', 'dark:text-slate-500');
            this.classList.add('bg-[#cbe7f5]', 'dark:bg-[#0047AB]/30', 'text-[#00327d]', 'dark:text-white', 'rounded-2xl', 'scale-105');
            var activeIcon = this.querySelector('.material-symbols-outlined');
            activeIcon.style.fontVariationSettings = "'FILL' 1";
        });
    });
});