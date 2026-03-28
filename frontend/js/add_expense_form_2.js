/* =============================================
   add_expense_form_2.js
   JavaScript for Add Expense Form 2 page
   ============================================= */

// ── Category Selection ──────────────────────────────────────────────────────
const categoryButtons = document.querySelectorAll('[data-category]');

categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Reset all category buttons to inactive state
        categoryButtons.forEach(b => {
            b.classList.remove('bg-primary', 'text-on-primary', 'shadow-lg', 'shadow-primary/20');
            b.classList.add('bg-surface-container-low', 'text-on-surface-variant');
        });
        // Set clicked button to active state
        btn.classList.remove('bg-surface-container-low', 'text-on-surface-variant');
        btn.classList.add('bg-primary', 'text-on-primary', 'shadow-lg', 'shadow-primary/20');
    });
});


// ── Split Method Toggle ─────────────────────────────────────────────────────
const splitEquallyBtn = document.getElementById('split-equally');
const splitPercentBtn = document.getElementById('split-percent');

splitEquallyBtn.addEventListener('click', () => {
    splitEquallyBtn.classList.add('bg-surface-container-lowest', 'text-primary');
    splitEquallyBtn.classList.remove('text-on-surface-variant');
    splitPercentBtn.classList.remove('bg-surface-container-lowest', 'text-primary');
    splitPercentBtn.classList.add('text-on-surface-variant');
    recalculateSplit();
});

splitPercentBtn.addEventListener('click', () => {
    splitPercentBtn.classList.add('bg-surface-container-lowest', 'text-primary');
    splitPercentBtn.classList.remove('text-on-surface-variant');
    splitEquallyBtn.classList.remove('bg-surface-container-lowest', 'text-primary');
    splitEquallyBtn.classList.add('text-on-surface-variant');
    recalculateSplit();
});


// ── Amount Input → Live Split Recalculation ─────────────────────────────────
const amountInput = document.getElementById('amount-input');
const splitAmounts = document.querySelectorAll('.split-amount');
const MEMBER_COUNT = 3;

amountInput.addEventListener('input', recalculateSplit);

function recalculateSplit() {
    const total = parseFloat(amountInput.value) || 0;
    const perPerson = (total / MEMBER_COUNT).toFixed(2);
    splitAmounts.forEach(el => {
        el.textContent = `₹ ${perPerson}`;
    });
}


// ── Cancel Button ───────────────────────────────────────────────────────────
const cancelBtn = document.getElementById('cancel-btn');

cancelBtn.addEventListener('click', () => {
    // Placeholder: replace with actual navigation/cancel logic
    history.back();
});


// ── Save Expense Button ─────────────────────────────────────────────────────
const saveBtn = document.getElementById('save-btn');

saveBtn.addEventListener('click', () => {
    const amount = amountInput.value;
    const description = document.getElementById('description-input').value;
    const activeCategory = document.querySelector('[data-category].bg-primary');
    const category = activeCategory ? activeCategory.dataset.category : null;

    if (!amount || parseFloat(amount) <= 0) {
        alert('Please enter a valid amount.');
        return;
    }
    if (!description.trim()) {
        alert('Please enter a description.');
        return;
    }
    if (!category) {
        alert('Please select a category.');
        return;
    }

    // Placeholder: replace with actual save/API logic
    console.log('Saving expense:', { amount, description, category });
    alert(`Expense of ₹${parseFloat(amount).toFixed(2)} saved successfully!`);
});