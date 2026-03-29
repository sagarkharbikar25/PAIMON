/* =============================================
   onboarding_benefits.js — Pravas Onboarding Benefits Screen
   No backend endpoint needed for this screen.
   Onboarding completion tracked in localStorage.
   ============================================= */

/* ── Tailwind Config ── */
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "background":                   "#f6fafe",
        "secondary":                    "#48626e",
        "tertiary":                     "#602400",
        "surface-dim":                  "#d6dade",
        "on-primary-container":         "#a5bdff",
        "surface-container":            "#eaeef2",
        "surface-tint":                 "#2559bd",
        "surface":                      "#f6fafe",
        "on-primary-fixed-variant":     "#00419e",
        "inverse-primary":              "#b1c5ff",
        "tertiary-container":           "#843500",
        "on-secondary-container":       "#4e6874",
        "surface-container-highest":    "#dfe3e7",
        "inverse-on-surface":           "#edf1f5",
        "on-tertiary-fixed":            "#341100",
        "on-background":                "#171c1f",
        "on-primary-fixed":             "#001946",
        "surface-variant":              "#dfe3e7",
        "surface-container-low":        "#f0f4f8",
        "inverse-surface":              "#2c3134",
        "tertiary-fixed-dim":           "#ffb692",
        "surface-bright":               "#f6fafe",
        "secondary-container":          "#cbe7f5",
        "tertiary-fixed":               "#ffdbcb",
        "primary-fixed-dim":            "#b1c5ff",
        "outline":                      "#737784",
        "on-surface-variant":           "#434653",
        "primary-fixed":                "#dae2ff",
        "on-secondary-fixed-variant":   "#304a55",
        "secondary-fixed-dim":          "#afcbd8",
        "primary-container":            "#0047ab",
        "primary":                      "#00327d",
        "outline-variant":              "#c3c6d5",
        "on-primary":                   "#ffffff",
        "secondary-fixed":              "#cbe7f5",
        "surface-container-high":       "#e4e9ed",
        "on-tertiary-container":        "#ffaa80",
        "error-container":              "#ffdad6",
        "surface-container-lowest":     "#ffffff",
        "on-surface":                   "#171c1f",
        "on-tertiary":                  "#ffffff",
        "on-error":                     "#ffffff",
        "error":                        "#ba1a1a",
        "on-secondary":                 "#ffffff",
        "on-tertiary-fixed-variant":    "#7a3000",
        "on-error-container":           "#93000a",
        "on-secondary-fixed":           "#021f29"
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

/* ── Onboarding step state ── */
const TOTAL_STEPS = 3;
let currentStep = 2; // This screen is step 2

/* ── Mark onboarding complete in localStorage ── */
function completeOnboarding() {
  localStorage.setItem('onboardingComplete', 'true');
  localStorage.setItem('onboardingCompletedAt', new Date().toISOString());
}

/* ── Next step navigation ── */
function nextStep() {
  if (currentStep < TOTAL_STEPS) {
    currentStep++;
    updateStepUI();
  } else {
    // Last step — mark done and go to dashboard
    completeOnboarding();
    window.location.href = '../html/navigation_drawer.html';
  }
}

/* ── Skip onboarding entirely ── */
function skipOnboarding() {
  completeOnboarding();
  window.location.href = '../html/navigation_drawer.html';
}

/* ── Update step label and pagination dots ── */
function updateStepUI() {
  const label = document.getElementById('stepLabel');
  if (label) label.textContent = `Step ${currentStep} of ${TOTAL_STEPS}`;

  const dots = document.querySelectorAll('#paginationDots div');
  dots.forEach((dot, i) => {
    const isActive = i + 1 === currentStep;
    dot.className = isActive
      ? 'w-6 h-2 rounded-full bg-primary transition-all duration-300'
      : 'w-2 h-2 rounded-full bg-surface-container-highest transition-all duration-300';
  });
}

/* ── On page load: skip onboarding if already completed ── */
document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('onboardingComplete') === 'true') {
    window.location.href = '../html/navigation_drawer.html';
  }
});