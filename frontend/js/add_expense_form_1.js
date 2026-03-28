/* =============================================
   Add Expenses Form 1 — JavaScript
   ============================================= */

// ── Tailwind config (must run before Tailwind parses classes) ──────────────
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "on-tertiary": "#ffffff",
        "on-secondary-fixed-variant": "#304a55",
        "primary-fixed-dim": "#b1c5ff",
        "surface-dim": "#d6dade",
        "surface": "#f6fafe",
        "outline": "#737784",
        "on-tertiary-container": "#ffaa80",
        "background": "#f6fafe",
        "surface-tint": "#2559bd",
        "on-tertiary-fixed": "#341100",
        "error": "#ba1a1a",
        "on-secondary-fixed": "#021f29",
        "surface-container-high": "#e4e9ed",
        "on-primary-fixed": "#001946",
        "error-container": "#ffdad6",
        "outline-variant": "#c3c6d5",
        "secondary-container": "#cbe7f5",
        "surface-bright": "#f6fafe",
        "secondary-fixed": "#cbe7f5",
        "primary": "#00327d",
        "secondary-fixed-dim": "#afcbd8",
        "on-primary": "#ffffff",
        "surface-variant": "#dfe3e7",
        "on-error-container": "#93000a",
        "on-secondary-container": "#4e6874",
        "primary-container": "#0047ab",
        "inverse-on-surface": "#edf1f5",
        "inverse-surface": "#2c3134",
        "on-primary-container": "#a5bdff",
        "inverse-primary": "#b1c5ff",
        "on-background": "#171c1f",
        "surface-container-highest": "#dfe3e7",
        "surface-container-low": "#f0f4f8",
        "tertiary-fixed": "#ffdbcb",
        "tertiary-fixed-dim": "#ffb692",
        "tertiary": "#602400",
        "on-tertiary-fixed-variant": "#7a3000",
        "surface-container": "#eaeef2",
        "tertiary-container": "#843500",
        "primary-fixed": "#dae2ff",
        "on-secondary": "#ffffff",
        "on-error": "#ffffff",
        "surface-container-lowest": "#ffffff",
        "on-surface": "#171c1f",
        "on-primary-fixed-variant": "#00419e",
        "on-surface-variant": "#434653",
        "secondary": "#48626e"
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
      }
    }
  }
};

// ── DOM References ─────────────────────────────────────────────────────────
const amountInput    = document.getElementById('amountInput');
const descInput      = document.getElementById('descriptionInput');
const categoryBtns   = document.querySelectorAll('.category-btn');
const splitBtns      = document.querySelectorAll('.split-btn');
const splitAmounts   = document.querySelectorAll('.split-amount');
const splitLabels    = document.querySelectorAll('.split-label');
const saveBtn        = document.getElementById('saveBtn');
const cancelBtn      = document.getElementById('cancelBtn');

// ── State ──────────────────────────────────────────────────────────────────
const MEMBER_COUNT = 3;
let currentSplitMethod = 'equally';

// ── Category Selection ─────────────────────────────────────────────────────
categoryBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    categoryBtns.forEach(b => {
      b.classList.remove('active', 'bg-primary', 'text-on-primary', 'shadow-lg', 'shadow-primary/20');
      b.classList.add('bg-surface-container-low', 'text-on-surface-variant');
    });
    btn.classList.add('active', 'bg-primary', 'text-on-primary', 'shadow-lg', 'shadow-primary/20');
    btn.classList.remove('bg-surface-container-low', 'text-on-surface-variant');
  });
});

// ── Split Method Toggle ────────────────────────────────────────────────────
splitBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    splitBtns.forEach(b => b.classList.remove('active', 'bg-surface-container-lowest', 'text-primary'));
    btn.classList.add('active', 'bg-surface-container-lowest', 'text-primary');
    currentSplitMethod = btn.dataset.split;
    updateSplitPreview();
  });
});

// ── Split Preview Calculation ──────────────────────────────────────────────
function updateSplitPreview() {
  const total = parseFloat(amountInput.value) || 0;

  if (currentSplitMethod === 'equally') {
    const share = total / MEMBER_COUNT;
    splitAmounts.forEach(el => {
      el.textContent = `₹ ${share.toFixed(2)}`;
    });
    splitLabels.forEach(el => {
      el.textContent = `1/${MEMBER_COUNT} Share`;
    });
  } else {
    // Percent mode — example: each gets 33.33 %
    const pct = (100 / MEMBER_COUNT).toFixed(1);
    const share = total / MEMBER_COUNT;
    splitAmounts.forEach(el => {
      el.textContent = `₹ ${share.toFixed(2)}`;
    });
    splitLabels.forEach(el => {
      el.textContent = `${pct}%`;
    });
  }
}

// Re-calculate whenever the amount changes
amountInput.addEventListener('input', updateSplitPreview);

// ── Save Expense ───────────────────────────────────────────────────────────
saveBtn.addEventListener('click', () => {
  const amount      = parseFloat(amountInput.value);
  const description = descInput.value.trim();
  const activeCategory = document.querySelector('.category-btn.active');
  const category    = activeCategory ? activeCategory.dataset.category : 'uncategorised';

  if (!amount || amount <= 0) {
    alert('Please enter a valid amount.');
    return;
  }
  if (!description) {
    alert('Please add a description.');
    return;
  }

  const expense = {
    amount,
    description,
    category,
    splitMethod: currentSplitMethod,
    date: 'Oct 24, 2024'
  };

  console.log('Expense saved:', expense);
  alert(`Expense of ₹${amount.toFixed(2)} saved successfully!`);
});

// ── Cancel ─────────────────────────────────────────────────────────────────
cancelBtn.addEventListener('click', () => {
  if (confirm('Discard this expense?')) {
    amountInput.value = '';
    descInput.value = '';
    updateSplitPreview();
  }
});

// ── Init ───────────────────────────────────────────────────────────────────
updateSplitPreview();