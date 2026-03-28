tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary-fixed": "#dae2ff",
                "background": "#f6fafe",
                "surface-dim": "#d6dade",
                "secondary": "#48626e",
                "on-surface": "#171c1f",
                "tertiary": "#602400",
                "tertiary-fixed": "#ffdbcb",
                "primary": "#00327d",
                "on-tertiary-fixed": "#341100",
                "surface-bright": "#f6fafe",
                "on-secondary-container": "#4e6874",
                "secondary-fixed": "#cbe7f5",
                "surface-tint": "#2559bd",
                "on-primary-fixed": "#001946",
                "primary-fixed-dim": "#b1c5ff",
                "on-tertiary-fixed-variant": "#7a3000",
                "on-primary": "#ffffff",
                "on-error": "#ffffff",
                "primary-container": "#0047ab",
                "on-secondary-fixed": "#021f29",
                "surface-container-highest": "#dfe3e7",
                "surface-container": "#eaeef2",
                "surface": "#f6fafe",
                "inverse-primary": "#b1c5ff",
                "error-container": "#ffdad6",
                "tertiary-fixed-dim": "#ffb692",
                "surface-variant": "#dfe3e7",
                "on-surface-variant": "#434653",
                "on-secondary": "#ffffff",
                "on-primary-fixed-variant": "#00419e",
                "on-tertiary": "#ffffff",
                "outline": "#737784",
                "surface-container-low": "#f0f4f8",
                "surface-container-high": "#e4e9ed",
                "error": "#ba1a1a",
                "on-tertiary-container": "#ffaa80",
                "on-primary-container": "#a5bdff",
                "outline-variant": "#c3c6d5",
                "secondary-container": "#cbe7f5",
                "inverse-on-surface": "#edf1f5",
                "secondary-fixed-dim": "#afcbd8",
                "surface-container-lowest": "#ffffff",
                "inverse-surface": "#2c3134",
                "on-error-container": "#93000a",
                "on-secondary-fixed-variant": "#304a55",
                "on-background": "#171c1f",
                "tertiary-container": "#843500"
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

// Category button toggle functionality
document.addEventListener('DOMContentLoaded', function () {
    const categoryButtons = document.querySelectorAll('.category-btn');

    categoryButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            // Remove active styles from all buttons
            categoryButtons.forEach(function (btn) {
                btn.classList.remove('bg-primary', 'text-on-primary', 'shadow-md');
                btn.classList.add('bg-white', 'text-on-surface-variant', 'border', 'border-outline-variant/30');
            });

            // Add active styles to clicked button
            this.classList.remove('bg-white', 'text-on-surface-variant', 'border', 'border-outline-variant/30');
            this.classList.add('bg-primary', 'text-on-primary', 'shadow-md');
        });
    });

    // Form submission handler
    const form = document.querySelector('form');
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        console.log('Activity saved!');
    });

    // Discard button handler
    const discardBtn = document.getElementById('discard-btn');
    discardBtn.addEventListener('click', function () {
        form.reset();
        console.log('Form discarded.');
    });

    // Bottom navigation active state
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            // Remove active styles from all nav links
            navLinks.forEach(function (navLink) {
                navLink.classList.remove('text-[#00327d]', 'bg-[#0047AB]/10', 'rounded-2xl');
                navLink.classList.add('text-slate-400');
                var icon = navLink.querySelector('.material-symbols-outlined');
                icon.style.fontVariationSettings = "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24";
            });

            // Add active styles to clicked nav link
            this.classList.remove('text-slate-400');
            this.classList.add('text-[#00327d]', 'bg-[#0047AB]/10', 'rounded-2xl');
            var activeIcon = this.querySelector('.material-symbols-outlined');
            activeIcon.style.fontVariationSettings = "'FILL' 1";
        });
    });
});