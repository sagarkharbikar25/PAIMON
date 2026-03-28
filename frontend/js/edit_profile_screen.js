tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "on-secondary-container": "#4e6874",
                "error-container": "#ffdad6",
                "tertiary-container": "#843500",
                "surface-tint": "#2559bd",
                "error": "#ba1a1a",
                "background": "#f6fafe",
                "primary-fixed-dim": "#b1c5ff",
                "on-surface": "#171c1f",
                "on-secondary": "#ffffff",
                "on-primary-fixed": "#001946",
                "primary": "#00327d",
                "surface-dim": "#d6dade",
                "on-background": "#171c1f",
                "inverse-on-surface": "#edf1f5",
                "surface-container-low": "#f0f4f8",
                "surface-container-high": "#e4e9ed",
                "outline": "#737784",
                "on-surface-variant": "#434653",
                "tertiary": "#602400",
                "on-primary-fixed-variant": "#00419e",
                "surface-container-highest": "#dfe3e7",
                "primary-fixed": "#dae2ff",
                "inverse-primary": "#b1c5ff",
                "secondary-container": "#cbe7f5",
                "secondary": "#48626e",
                "on-tertiary-fixed": "#341100",
                "primary-container": "#0047ab",
                "surface": "#f6fafe",
                "on-primary-container": "#a5bdff",
                "on-error": "#ffffff",
                "inverse-surface": "#2c3134",
                "surface-bright": "#f6fafe",
                "on-secondary-fixed": "#021f29",
                "on-tertiary-container": "#ffaa80",
                "surface-variant": "#dfe3e7",
                "tertiary-fixed": "#ffdbcb",
                "surface-container-lowest": "#ffffff",
                "on-tertiary": "#ffffff",
                "surface-container": "#eaeef2",
                "on-primary": "#ffffff",
                "outline-variant": "#c3c6d5",
                "secondary-fixed-dim": "#afcbd8",
                "on-error-container": "#93000a",
                "secondary-fixed": "#cbe7f5",
                "on-secondary-fixed-variant": "#304a55",
                "tertiary-fixed-dim": "#ffb692",
                "on-tertiary-fixed-variant": "#7a3000"
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
    var backBtn = document.querySelector('.back-btn');
    var settingsBtn = document.querySelector('.settings-btn');
    var changePhotoBtn = document.getElementById('change-photo-btn');
    var photoInput = document.getElementById('photo-input');
    var profileImage = document.getElementById('profile-image');
    var displayName = document.getElementById('display-name');
    var profileForm = document.getElementById('profile-form');
    var fullNameInput = document.getElementById('full-name-input');
    var emailInput = document.getElementById('email-input');
    var phoneInput = document.getElementById('phone-input');
    var updateProfileBtn = document.getElementById('update-profile-btn');
    var changePasswordBtn = document.getElementById('change-password-btn');
    var notificationSettingsBtn = document.getElementById('notification-settings-btn');
    var bottomNavItems = document.querySelectorAll('.bottom-nav-item');

    // Back button click handler
    backBtn.addEventListener('click', function () {
        console.log('Back button clicked');
        window.history.back();
    });

    // Settings button click handler
    settingsBtn.addEventListener('click', function () {
        console.log('Settings button clicked');
    });

    // Change photo button click handler
    changePhotoBtn.addEventListener('click', function () {
        photoInput.click();
    });

    // Photo input change handler
    photoInput.addEventListener('change', function (e) {
        var file = e.target.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function (event) {
                profileImage.src = event.target.result;
                console.log('Profile photo updated');
            };
            reader.readAsDataURL(file);
        }
    });

    // Update display name when full name input changes
    fullNameInput.addEventListener('input', function () {
        displayName.textContent = this.value || 'Your Name';
    });

    // Phone number formatting
    phoneInput.addEventListener('input', function (e) {
        var value = e.target.value.replace(/\D/g, '');
        var formattedValue = '';

        if (value.length > 0) {
            // Check if it starts with country code
            if (value.charAt(0) === '1') {
                formattedValue = '+1 ';
                value = value.substring(1);
            }
        }

        if (value.length > 0) {
            formattedValue += '(' + value.substring(0, 3);
        }
        if (value.length > 3) {
            formattedValue += ') ' + value.substring(3, 6);
        }
        if (value.length > 6) {
            formattedValue += '-' + value.substring(6, 10);
        }

        e.target.value = formattedValue;
    });

    // Email validation
    function isValidEmail(email) {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Update profile button click handler
    updateProfileBtn.addEventListener('click', function (e) {
        e.preventDefault();

        var profileData = {
            fullName: fullNameInput.value.trim(),
            email: emailInput.value.trim(),
            phone: phoneInput.value.trim()
        };

        // Validation
        if (profileData.fullName === '') {
            console.log('Please enter your full name.');
            fullNameInput.focus();
            return;
        }

        if (profileData.email === '' || !isValidEmail(profileData.email)) {
            console.log('Please enter a valid email address.');
            emailInput.focus();
            return;
        }

        if (profileData.phone === '') {
            console.log('Please enter your phone number.');
            phoneInput.focus();
            return;
        }

        console.log('Profile updated:', profileData);
        console.log('Profile updated successfully!');
    });

    // Form submit handler (prevent default)
    profileForm.addEventListener('submit', function (e) {
        e.preventDefault();
        updateProfileBtn.click();
    });

    // Change password button click handler
    changePasswordBtn.addEventListener('click', function () {
        console.log('Change Password clicked');
    });

    // Notification settings button click handler
    notificationSettingsBtn.addEventListener('click', function () {
        console.log('Notification Settings clicked');
    });

    // Bottom navigation active state handler
    bottomNavItems.forEach(function (item) {
        item.addEventListener('click', function () {
            // Remove active styles from all items
            bottomNavItems.forEach(function (navItem) {
                navItem.classList.remove('text-[#00327d]', 'bg-[#cbe7f5]/50', 'rounded-2xl');
                navItem.classList.add('text-[#434653]');
                var icon = navItem.querySelector('.material-symbols-outlined');
                icon.style.fontVariationSettings = "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24";
            });

            // Add active styles to clicked item
            this.classList.remove('text-[#434653]');
            this.classList.add('text-[#00327d]', 'bg-[#cbe7f5]/50', 'rounded-2xl');
            var activeIcon = this.querySelector('.material-symbols-outlined');
            activeIcon.style.fontVariationSettings = "'FILL' 1";

            var navType = this.getAttribute('data-nav');
            console.log('Navigating to:', navType);
        });
    });
});