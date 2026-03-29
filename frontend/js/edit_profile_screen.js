/* =============================================
   edit_profile_screen.js — Pravas Edit Profile Scripts
   ============================================= */

/* ── Tailwind Config ── */
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "on-secondary-container":       "#4e6874",
        "error-container":              "#ffdad6",
        "tertiary-container":           "#843500",
        "surface-tint":                 "#2559bd",
        "error":                        "#ba1a1a",
        "background":                   "#f6fafe",
        "primary-fixed-dim":            "#b1c5ff",
        "on-surface":                   "#171c1f",
        "on-secondary":                 "#ffffff",
        "on-primary-fixed":             "#001946",
        "primary":                      "#00327d",
        "surface-dim":                  "#d6dade",
        "on-background":                "#171c1f",
        "inverse-on-surface":           "#edf1f5",
        "surface-container-low":        "#f0f4f8",
        "surface-container-high":       "#e4e9ed",
        "outline":                      "#737784",
        "on-surface-variant":           "#434653",
        "tertiary":                     "#602400",
        "on-primary-fixed-variant":     "#00419e",
        "surface-container-highest":    "#dfe3e7",
        "primary-fixed":                "#dae2ff",
        "inverse-primary":              "#b1c5ff",
        "secondary-container":          "#cbe7f5",
        "secondary":                    "#48626e",
        "on-tertiary-fixed":            "#341100",
        "primary-container":            "#0047ab",
        "surface":                      "#f6fafe",
        "on-primary-container":         "#a5bdff",
        "on-error":                     "#ffffff",
        "inverse-surface":              "#2c3134",
        "surface-bright":               "#f6fafe",
        "on-secondary-fixed":           "#021f29",
        "on-tertiary-container":        "#ffaa80",
        "surface-variant":              "#dfe3e7",
        "tertiary-fixed":               "#ffdbcb",
        "surface-container-lowest":     "#ffffff",
        "on-tertiary":                  "#ffffff",
        "surface-container":            "#eaeef2",
        "on-primary":                   "#ffffff",
        "outline-variant":              "#c3c6d5",
        "secondary-fixed-dim":          "#afcbd8",
        "on-error-container":           "#93000a",
        "secondary-fixed":              "#cbe7f5",
        "on-secondary-fixed-variant":   "#304a55",
        "tertiary-fixed-dim":           "#ffb692",
        "on-tertiary-fixed-variant":    "#7a3000"
      },
      fontFamily: {
        "headline": ["Plus Jakarta Sans"],
        "body":     ["Inter"],
        "label":    ["Inter"]
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg":      "1rem",
        "xl":      "1.5rem",
        "full":    "9999px"
      }
    }
  }
};

/* ── API Config ── */
const API_BASE = 'http://localhost:5000';

/* ── Get JWT token ── */
function getToken() {
  return localStorage.getItem('token') || localStorage.getItem('authToken') || '';
}

/* ── Toast notification ── */
function showToast(message, type = 'success') {
  const existing = document.getElementById('pravas-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'pravas-toast';
  toast.className = `
    fixed top-20 left-1/2 -translate-x-1/2 z-[100]
    flex items-center gap-3 px-6 py-4 rounded-xl shadow-xl
    text-sm font-semibold transition-all duration-300
    ${type === 'success' ? 'bg-[#00327d] text-white' : 'bg-[#ffdad6] text-[#93000a]'}
  `.trim();
  toast.innerHTML = `
    <span class="material-symbols-outlined text-base">${type === 'success' ? 'check_circle' : 'error'}</span>
    <span>${message}</span>
  `;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translate(-50%, -8px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* ── Button loading state ── */
function setButtonLoading(btn, isLoading) {
  if (isLoading) {
    btn.disabled = true;
    btn.dataset.originalHtml = btn.innerHTML;
    btn.innerHTML = `
      <svg class="animate-spin w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
      </svg>
      <span>Saving...</span>
    `;
  } else {
    btn.disabled = false;
    btn.innerHTML = btn.dataset.originalHtml || btn.innerHTML;
  }
}

/* ── Email validation ── */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ── Load profile → GET /api/users/me ──
   Controller returns: { success: true, user }          ── */
async function loadProfile() {
  const token = getToken();
  if (!token) return;

  try {
    const res = await fetch(`${API_BASE}/api/users/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to load profile');

    const { user } = await res.json(); // ← { success, user }

    document.getElementById('full-name-input').value  = user.name   || '';
    document.getElementById('email-input').value      = user.email  || '';
    document.getElementById('phone-input').value      = user.mobile || ''; // ← field is "mobile"
    document.getElementById('display-name').textContent = user.name || 'Your Name';

    if (user.photoUrl) {
      document.getElementById('profile-image').src = user.photoUrl;
    }
  } catch (err) {
    console.warn('Could not load profile:', err.message);
  }
}

/* ── DOMContentLoaded ── */
document.addEventListener('DOMContentLoaded', function () {

  const backBtn                 = document.querySelector('.back-btn');
  const settingsBtn             = document.querySelector('.settings-btn');
  const changePhotoBtn          = document.getElementById('change-photo-btn');
  const photoInput              = document.getElementById('photo-input');
  const profileImage            = document.getElementById('profile-image');
  const displayName             = document.getElementById('display-name');
  const profileForm             = document.getElementById('profile-form');
  const fullNameInput           = document.getElementById('full-name-input');
  const emailInput              = document.getElementById('email-input');
  const phoneInput              = document.getElementById('phone-input');
  const updateProfileBtn        = document.getElementById('update-profile-btn');
  const changePasswordBtn       = document.getElementById('change-password-btn');
  const notificationSettingsBtn = document.getElementById('notification-settings-btn');
  const bottomNavItems          = document.querySelectorAll('.bottom-nav-item');

  // ── Load existing profile on open ──
  loadProfile();

  // ── Back ──
  backBtn.addEventListener('click', () => window.history.back());

  // ── Settings ──
  settingsBtn.addEventListener('click', () => console.log('Settings clicked'));

  // ── Change photo → pick file ──
  changePhotoBtn.addEventListener('click', () => photoInput.click());

  /* ── Photo selected → preview + convert to base64
       → PATCH /api/users/photo  { photoUrl: "data:image/..." }
       Controller expects: { photoUrl }                    ── */
  photoInput.addEventListener('change', async function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Url = event.target.result;

      // Live preview
      profileImage.src = base64Url;

      const token = getToken();
      try {
        const res = await fetch(`${API_BASE}/api/users/photo`, {
          method:  'PATCH',
          headers: {
            'Content-Type':  'application/json',     // ← JSON not FormData
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ photoUrl: base64Url }) // ← field is "photoUrl"
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Photo upload failed');
        showToast('Profile photo updated!', 'success');
      } catch (err) {
        showToast(err.message || 'Photo upload failed.', 'error');
      }
    };
    reader.readAsDataURL(file);
  });

  // ── Live display name update ──
  fullNameInput.addEventListener('input', function () {
    displayName.textContent = this.value || 'Your Name';
  });

  // ── Phone number formatting ──
  phoneInput.addEventListener('input', function (e) {
    let value = e.target.value.replace(/\D/g, '');
    let formatted = '';
    if (value.charAt(0) === '1') { formatted = '+1 '; value = value.substring(1); }
    if (value.length > 0) formatted += '(' + value.substring(0, 3);
    if (value.length > 3) formatted += ') ' + value.substring(3, 6);
    if (value.length > 6) formatted += '-' + value.substring(6, 10);
    e.target.value = formatted;
  });

  /* ── Save profile → PUT /api/users/me
       Controller accepts: { name, mobile, dateOfBirth, age, country, state }
       This screen only has name + email + mobile                            ── */
  updateProfileBtn.addEventListener('click', async function (e) {
    e.preventDefault();

    const name   = fullNameInput.value.trim();
    const email  = emailInput.value.trim();
    const mobile = phoneInput.value.trim();  // ← field is "mobile"

    // Validation
    if (!name) {
      showToast('Please enter your full name.', 'error');
      fullNameInput.focus(); return;
    }
    if (!email || !isValidEmail(email)) {
      showToast('Please enter a valid email address.', 'error');
      emailInput.focus(); return;
    }
    if (!mobile) {
      showToast('Please enter your phone number.', 'error');
      phoneInput.focus(); return;
    }

    const token = getToken();
    if (!token) { showToast('You must be logged in.', 'error'); return; }

    setButtonLoading(updateProfileBtn, true);

    try {
      const res = await fetch(`${API_BASE}/api/users/me`, {
        method:  'PUT',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, mobile }) // ← email handled by auth, not user controller
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `Error ${res.status}`);

      displayName.textContent = name;
      showToast('Profile updated successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Update failed. Please try again.', 'error');
    } finally {
      setButtonLoading(updateProfileBtn, false);
    }
  });

  // ── Form submit ──
  profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    updateProfileBtn.click();
  });

  // ── Change Password ──
  changePasswordBtn.addEventListener('click', () => console.log('Change Password clicked'));

  // ── Notification Settings ──
  notificationSettingsBtn.addEventListener('click', () => console.log('Notification Settings clicked'));

  // ── Bottom nav active state ──
  bottomNavItems.forEach(function (item) {
    item.addEventListener('click', function () {
      bottomNavItems.forEach(function (navItem) {
        navItem.classList.remove('text-[#00327d]', 'bg-[#cbe7f5]/50', 'rounded-2xl');
        navItem.classList.add('text-[#434653]');
        navItem.querySelector('.material-symbols-outlined').style.fontVariationSettings =
          "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24";
      });
      this.classList.remove('text-[#434653]');
      this.classList.add('text-[#00327d]', 'bg-[#cbe7f5]/50', 'rounded-2xl');
      this.querySelector('.material-symbols-outlined').style.fontVariationSettings = "'FILL' 1";
    });
  });

});