/* =============================================
   onboarding_features_intro.js
   ============================================= */

/**
 * Onboarding – Step 1 of 3: "Track Expenses Effortlessly"
 *
 * All interactive behaviour for the onboarding screen lives here.
 * Currently the screen has two interactive elements:
 *   • "Skip"  button  → navigates away from onboarding entirely
 *   • "Next"  button  → advances to Step 2 of 3
 *
 * Wire up additional logic (e.g. step routing, analytics) below.
 */

document.addEventListener('DOMContentLoaded', function () {

    /* ------------------------------------------------------------------
       Skip button
       ------------------------------------------------------------------ */
    const skipBtn = document.querySelector('[data-action="skip"]');
    if (skipBtn) {
        skipBtn.addEventListener('click', function () {
            // TODO: navigate to the main app or close the onboarding flow
            console.log('Onboarding skipped');
        });
    }

    /* ------------------------------------------------------------------
       Next button
       ------------------------------------------------------------------ */
    const nextBtn = document.querySelector('[data-action="next"]');
    if (nextBtn) {
        nextBtn.addEventListener('click', function () {
            // TODO: navigate to Step 2 of the onboarding flow
            console.log('Advancing to Step 2 of 3');
        });
    }

});