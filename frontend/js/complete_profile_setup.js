tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "on-secondary-fixed": "#021f29",
                "secondary": "#48626e",
                "on-secondary": "#ffffff",
                "outline-variant": "#c3c6d5",
                "on-primary-container": "#a5bdff",
                "surface-dim": "#d6dade",
                "surface-container-highest": "#dfe3e7",
                "surface-container-high": "#e4e9ed",
                "secondary-fixed-dim": "#afcbd8",
                "surface-container": "#eaeef2",
                "primary-container": "#0047ab",
                "primary-fixed": "#dae2ff",
                "on-tertiary-container": "#ffaa80",
                "outline": "#737784",
                "surface-container-lowest": "#ffffff",
                "primary-fixed-dim": "#b1c5ff",
                "tertiary": "#602400",
                "tertiary-container": "#843500",
                "secondary-container": "#cbe7f5",
                "inverse-primary": "#b1c5ff",
                "tertiary-fixed": "#ffdbcb",
                "background": "#f6fafe",
                "surface-tint": "#2559bd",
                "secondary-fixed": "#cbe7f5",
                "on-primary-fixed-variant": "#00419e",
                "surface-container-low": "#f0f4f8",
                "on-secondary-container": "#4e6874",
                "on-error": "#ffffff",
                "on-error-container": "#93000a",
                "tertiary-fixed-dim": "#ffb692",
                "on-primary": "#ffffff",
                "inverse-on-surface": "#edf1f5",
                "surface-bright": "#f6fafe",
                "error-container": "#ffdad6",
                "primary": "#00327d",
                "on-tertiary-fixed": "#341100",
                "error": "#ba1a1a",
                "surface": "#f6fafe",
                "on-surface": "#171c1f",
                "on-tertiary-fixed-variant": "#7a3000",
                "on-primary-fixed": "#001946",
                "inverse-surface": "#2c3134",
                "on-background": "#171c1f",
                "on-surface-variant": "#434653",
                "on-secondary-fixed-variant": "#304a55",
                "surface-variant": "#dfe3e7",
                "on-tertiary": "#ffffff"
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
    var backBtn = document.querySelector('.back-btn');
    var editProfileBtn = document.getElementById('edit-profile-btn');
    var profileImageInput = document.getElementById('profile-image-input');
    var profileImage = document.getElementById('profile-image');
    var profilePlaceholder = document.getElementById('profile-placeholder');
    var profileForm = document.getElementById('profile-form');
    var saveProfileBtn = document.getElementById('save-profile-btn');
    var fullNameInput = document.getElementById('full-name-input');
    var ageInput = document.getElementById('age-input');
    var dobInput = document.getElementById('dob-input');
    var mobileInput = document.getElementById('mobile-input');
    var countrySelect = document.getElementById('country-select');
    var stateInput = document.getElementById('state-input');
    var countryCode = document.getElementById('country-code');

    // Country code mapping
    var countryCodes = {
        'United States': '+1',
        'United Kingdom': '+44',
        'Canada': '+1',
        'Australia': '+61'
    };

    // Back button click handler
    backBtn.addEventListener('click', function () {
        console.log('Back button clicked');
        window.history.back();
    });

    // Edit profile image button click handler
    editProfileBtn.addEventListener('click', function () {
        profileImageInput.click();
    });

    // Profile image input change handler
    profileImageInput.addEventListener('change', function (e) {
        var file = e.target.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function (event) {
                profileImage.src = event.target.result;
                profileImage.classList.remove('hidden');
                profilePlaceholder.classList.add('hidden');
            };
            reader.readAsDataURL(file);
        }
    });

    // Country select change handler - update country code
    countrySelect.addEventListener('change', function () {
        var selectedCountry = this.value;
        countryCode.textContent = countryCodes[selectedCountry] || '+1';
    });

    // Date of birth change handler - auto calculate age
    dobInput.addEventListener('change', function () {
        var dob = new Date(this.value);
        var today = new Date();
        var age = today.getFullYear() - dob.getFullYear();
        var monthDiff = today.getMonth() - dob.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
            age--;
        }
        if (age > 0 && age < 150) {
            ageInput.value = age;
        }
    });

    // Save profile button click handler
    saveProfileBtn.addEventListener('click', function (e) {
        e.preventDefault();

        var profileData = {
            fullName: fullNameInput.value.trim(),
            age: ageInput.value.trim(),
            dateOfBirth: dobInput.value,
            mobile: countryCode.textContent + ' ' + mobileInput.value.trim(),
            country: countrySelect.value,
            state: stateInput.value.trim()
        };

        // Validation
        if (profileData.fullName === '') {
            console.log('Please enter your full name.');
            fullNameInput.focus();
            return;
        }

        if (profileData.mobile === countryCode.textContent + ' ') {
            console.log('Please enter your mobile number.');
            mobileInput.focus();
            return;
        }

        console.log('Profile saved:', profileData);
        console.log('Profile saved successfully!');
    });

    // Form submit handler (prevent default)
    profileForm.addEventListener('submit', function (e) {
        e.preventDefault();
        saveProfileBtn.click();
    });

    // Phone number formatting
    mobileInput.addEventListener('input', function (e) {
        var value = e.target.value.replace(/\D/g, '');
        var formattedValue = '';

        if (value.length > 0) {
            formattedValue = '(' + value.substring(0, 3);
        }
        if (value.length > 3) {
            formattedValue += ') ' + value.substring(3, 6);
        }
        if (value.length > 6) {
            formattedValue += '-' + value.substring(6, 10);
        }

        e.target.value = formattedValue;
    });
});