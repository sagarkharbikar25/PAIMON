/* =============================================
   onboarding_features_intro.js
   Pravas — Onboarding Step 1 of 3
   No backend needed for this screen.
   Navigation + onboarding state tracked in localStorage.
   ============================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ── Skip onboarding entirely ── */
  const skipBtn = document.querySelector('[data-action="skip"]');
  if (skipBtn) {
    skipBtn.addEventListener('click', function () {
      localStorage.setItem('onboardingComplete', 'true');
      localStorage.setItem('onboardingCompletedAt', new Date().toISOString());
      window.location.href = '../html/navigation_drawer.html';
    });
  }

  /* ── Next → go to Step 2 (onboarding_benefits) ── */
  const nextBtn = document.querySelector('[data-action="next"]');
  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      window.location.href = '../html/onboarding_benefits.html';
    });
  }

  /* ── Skip this screen if onboarding already completed ── */
  if (localStorage.getItem('onboardingComplete') === 'true') {
    window.location.href = '../html/navigation_drawer.html';
  }

});