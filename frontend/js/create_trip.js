tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "inverse-surface": "#2c3134",
                "background": "#f6fafe",
                "primary-fixed-dim": "#b1c5ff",
                "primary": "#00327d",
                "on-tertiary-container": "#ffaa80",
                "tertiary-container": "#843500",
                "on-primary-container": "#a5bdff",
                "error-container": "#ffdad6",
                "error": "#ba1a1a",
                "inverse-primary": "#b1c5ff",
                "on-secondary-container": "#4e6874",
                "on-secondary": "#ffffff",
                "on-tertiary": "#ffffff",
                "secondary-container": "#cbe7f5",
                "on-tertiary-fixed": "#341100",
                "primary-fixed": "#dae2ff",
                "inverse-on-surface": "#edf1f5",
                "surface-container-highest": "#dfe3e7",
                "surface-container-high": "#e4e9ed",
                "outline-variant": "#c3c6d5",
                "on-tertiary-fixed-variant": "#7a3000",
                "tertiary-fixed": "#ffdbcb",
                "surface-bright": "#f6fafe",
                "tertiary": "#602400",
                "tertiary-fixed-dim": "#ffb692",
                "surface-variant": "#dfe3e7",
                "on-error-container": "#93000a",
                "secondary-fixed-dim": "#afcbd8",
                "surface": "#f6fafe",
                "secondary": "#48626e",
                "on-surface": "#171c1f",
                "on-background": "#171c1f",
                "surface-container-lowest": "#ffffff",
                "on-secondary-fixed": "#021f29",
                "surface-tint": "#2559bd",
                "on-primary-fixed": "#001946",
                "on-primary": "#ffffff",
                "on-primary-fixed-variant": "#00419e",
                "on-secondary-fixed-variant": "#304a55",
                "surface-container": "#eaeef2",
                "on-surface-variant": "#434653",
                "surface-dim": "#d6dade",
                "secondary-fixed": "#cbe7f5",
                "outline": "#737784",
                "on-error": "#ffffff",
                "surface-container-low": "#f0f4f8",
                "primary-container": "#0047ab"
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
    var menuBtn = document.querySelector('.menu-btn');
    var tripForm = document.getElementById('trip-form');
    var destinationInput = document.getElementById('destination-input');
    var departureDateInput = document.getElementById('departure-date');
    var returnDateInput = document.getElementById('return-date');
    var budgetInput = document.getElementById('budget-input');
    var addMembersBtn = document.getElementById('add-members-btn');
    var createExpeditionBtn = document.getElementById('create-expedition-btn');
    var inspirationCard = document.getElementById('inspiration-card');
    var bottomNavLinks = document.querySelectorAll('.bottom-nav-link');

    // Menu button click handler
    menuBtn.addEventListener('click', function () {
        console.log('Menu button clicked');
    });

    // Add Members button click handler
    addMembersBtn.addEventListener('click', function () {
        console.log('Add Members button clicked');
    });

    // Set minimum date for departure to today
    var today = new Date().toISOString().split('T')[0];
    departureDateInput.setAttribute('min', today);

    // Update return date minimum when departure date changes
    departureDateInput.addEventListener('change', function () {
        var departureDate = this.value;
        returnDateInput.setAttribute('min', departureDate);

        // If return date is before departure date, reset it
        if (returnDateInput.value && returnDateInput.value < departureDate) {
            returnDateInput.value = '';
        }
    });

    // Budget input formatting
    budgetInput.addEventListener('input', function (e) {
        var value = e.target.value.replace(/[^0-9]/g, '');
        if (value) {
            var formattedValue = '$' + parseInt(value).toLocaleString();
            e.target.value = formattedValue;
        }
    });

    // Form submission handler
    tripForm.addEventListener('submit', function (e) {
        e.preventDefault();

        var tripData = {
            destination: destinationInput.value.trim(),
            departureDate: departureDateInput.value,
            returnDate: returnDateInput.value,
            budget: budgetInput.value.trim()
        };

        // Validation
        if (tripData.destination === '') {
            console.log('Please enter a destination.');
            destinationInput.focus();
            return;
        }

        if (tripData.departureDate === '') {
            console.log('Please select a departure date.');
            departureDateInput.focus();
            return;
        }

        if (tripData.returnDate === '') {
            console.log('Please select a return date.');
            returnDateInput.focus();
            return;
        }

        console.log('Expedition created:', tripData);
        console.log('Expedition created successfully!');
    });

    // Inspiration card click handler
    inspirationCard.addEventListener('click', function () {
        destinationInput.value = 'Oman - Hidden Valleys';
        destinationInput.focus();
        console.log('Inspiration selected: The Hidden Valleys of Oman');
    });

    // Bottom navigation active state handler
    bottomNavLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            // Remove active styles from all bottom nav links
            bottomNavLinks.forEach(function (navLink) {
                navLink.classList.remove('text-[#00327d]', 'bg-[#cbe7f5]/30', 'rounded-2xl');
                navLink.classList.add('text-slate-400');
                var icon = navLink.querySelector('.material-symbols-outlined');
                icon.style.fontVariationSettings = "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24";
            });

            // Add active styles to clicked link
            this.classList.remove('text-slate-400');
            this.classList.add('text-[#00327d]', 'bg-[#cbe7f5]/30', 'rounded-2xl');
            var activeIcon = this.querySelector('.material-symbols-outlined');
            activeIcon.style.fontVariationSettings = "'FILL' 1";
        });
    });
});