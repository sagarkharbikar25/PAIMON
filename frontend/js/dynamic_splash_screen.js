tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "background": "#f6fafe",
                "secondary": "#48626e",
                "tertiary": "#602400",
                "surface-dim": "#d6dade",
                "on-primary-container": "#a5bdff",
                "surface-container": "#eaeef2",
                "surface-tint": "#2559bd",
                "surface": "#f6fafe",
                "on-primary-fixed-variant": "#00419e",
                "inverse-primary": "#b1c5ff",
                "tertiary-container": "#843500",
                "on-secondary-container": "#4e6874",
                "surface-container-highest": "#dfe3e7",
                "inverse-on-surface": "#edf1f5",
                "on-tertiary-fixed": "#341100",
                "on-background": "#171c1f",
                "on-primary-fixed": "#001946",
                "surface-variant": "#dfe3e7",
                "surface-container-low": "#f0f4f8",
                "inverse-surface": "#2c3134",
                "tertiary-fixed-dim": "#ffb692",
                "surface-bright": "#f6fafe",
                "secondary-container": "#cbe7f5",
                "tertiary-fixed": "#ffdbcb",
                "primary-fixed-dim": "#b1c5ff",
                "outline": "#737784",
                "on-surface-variant": "#434653",
                "primary-fixed": "#dae2ff",
                "on-secondary-fixed-variant": "#304a55",
                "secondary-fixed-dim": "#afcbd8",
                "primary-container": "#0047ab",
                "primary": "#00327d",
                "outline-variant": "#c3c6d5",
                "on-primary": "#ffffff",
                "secondary-fixed": "#cbe7f5",
                "surface-container-high": "#e4e9ed",
                "on-tertiary-container": "#ffaa80",
                "error-container": "#ffdad6",
                "surface-container-lowest": "#ffffff",
                "on-surface": "#171c1f",
                "on-tertiary": "#ffffff",
                "on-error": "#ffffff",
                "error": "#ba1a1a",
                "on-secondary": "#ffffff",
                "on-tertiary-fixed-variant": "#7a3000",
                "on-error-container": "#93000a",
                "on-secondary-fixed": "#021f29"
            },
            fontFamily: {
                "headline": ["Plus Jakarta Sans"],
                "body": ["Inter"],
                "label": ["Inter"]
            },
            borderRadius: {
                "DEFAULT": "0.25rem",
                "lg": "0.5rem",
                "xl": "0.75rem",
                "full": "9999px"
            },
        },
    },
};

document.addEventListener('DOMContentLoaded', function () {

    // Get DOM elements
    var splashScreen = document.getElementById('splash-screen');
    var startJourneyBtn = document.getElementById('start-journey-btn');
    var logoContainer = document.getElementById('logo-container');
    var appTitle = document.getElementById('app-title');
    var tagline = document.getElementById('tagline');

    // Add entrance animations with delays
    function initAnimations() {
        // Logo animation
        logoContainer.style.opacity = '0';
        logoContainer.style.transform = 'scale(0.8)';
        
        setTimeout(function () {
            logoContainer.style.transition = 'all 0.8s ease-out';
            logoContainer.style.opacity = '1';
            logoContainer.style.transform = 'scale(1)';
        }, 300);

        // Title animation
        appTitle.style.opacity = '0';
        appTitle.style.transform = 'translateY(20px)';
        
        setTimeout(function () {
            appTitle.style.transition = 'all 0.8s ease-out';
            appTitle.style.opacity = '1';
            appTitle.style.transform = 'translateY(0)';
        }, 600);

        // Tagline animation
        tagline.style.opacity = '0';
        tagline.style.transform = 'translateY(20px)';
        
        setTimeout(function () {
            tagline.style.transition = 'all 0.8s ease-out';
            tagline.style.opacity = '1';
            tagline.style.transform = 'translateY(0)';
        }, 900);

        // Button animation
        startJourneyBtn.style.opacity = '0';
        startJourneyBtn.style.transform = 'translateY(20px)';
        
        setTimeout(function () {
            startJourneyBtn.style.transition = 'all 0.8s ease-out';
            startJourneyBtn.style.opacity = '1';
            startJourneyBtn.style.transform = 'translateY(0)';
        }, 1200);
    }

    // Initialize animations
    initAnimations();

    // Add subtle pulse animation to logo
    setInterval(function () {
        logoContainer.style.transform = 'scale(1.02)';
        setTimeout(function () {
            logoContainer.style.transform = 'scale(1)';
        }, 1500);
    }, 3000);

    // Start Journey button click handler
    startJourneyBtn.addEventListener('click', function () {
        console.log('Starting journey...');

        // Add exit animation
        splashScreen.style.transition = 'opacity 0.5s ease-out';
        splashScreen.style.opacity = '0';

        setTimeout(function () {
            // Navigate to next screen or show main content
            console.log('Navigating to main application...');
            // window.location.href = 'home.html';
        }, 500);
    });

    // Logo hover effect enhancement
    logoContainer.addEventListener('mouseenter', function () {
        this.style.transform = 'scale(1.1) rotate(5deg)';
    });

    logoContainer.addEventListener('mouseleave', function () {
        this.style.transform = 'scale(1) rotate(0deg)';
    });

    // Touch feedback for mobile
    startJourneyBtn.addEventListener('touchstart', function () {
        this.style.transform = 'scale(0.95)';
    });

    startJourneyBtn.addEventListener('touchend', function () {
        this.style.transform = 'scale(1)';
    });

    // Preload background image for smoother experience
    var bgImage = new Image();
    bgImage.src = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBO4ceTowasppywz_qcM5prGvwBuzMGd1uQUlwopb3mcWoMcdwNa4lXhNb0qrREJkVpFiSa4KWlWYG8BJ408wSpScMsgBUU2M-MFmtbfRYayxjY_zMabcjnzPjyuAlrVWxFDeo0iLiYeT79pmzl9ExBll5oj3IwIGjxztyvNZIN9nDk_VsOI5phUdeD2O4wJzESB7aEy0kafSFsWvDo4zHjV06_I9-s3gQzLPTdPopAVzIQhyC663qibs-QYfnWA9LlZrLhmHowh_SZ';

    bgImage.onload = function () {
        console.log('Background image loaded');
    };
});