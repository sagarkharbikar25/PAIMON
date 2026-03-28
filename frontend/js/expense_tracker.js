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
                "lg": "0.5rem",
                "xl": "0.75rem",
                "full": "9999px"
            },
        },
    },
};

document.addEventListener('DOMContentLoaded', function () {

    // Get DOM elements
    var notificationBtn = document.querySelector('.notification-btn');
    var budgetPercentage = document.getElementById('budget-percentage');
    var progressBar = document.getElementById('progress-bar');
    var spentAmount = document.getElementById('spent-amount');
    var remainingAmount = document.getElementById('remaining-amount');
    var owedAmount = document.getElementById('owed-amount');
    var oweAmount = document.getElementById('owe-amount');
    var seeAllBtn = document.getElementById('see-all-btn');
    var activityItems = document.querySelectorAll('.activity-item');
    var fabBtn = document.getElementById('fab-btn');
    var bottomNavLinks = document.querySelectorAll('.bottom-nav-link');
    var owedCard = document.getElementById('owed-card');
    var oweCard = document.getElementById('owe-card');

    // Budget data
    var totalBudget = 3500.00;
    var spent = 2485.00;
    var remaining = totalBudget - spent;
    var percentage = Math.round((spent / totalBudget) * 100);

    // Format currency
    function formatCurrency(amount) {
        return '$' + amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    // Update budget display
    function updateBudgetDisplay() {
        budgetPercentage.textContent = percentage + '%';
        progressBar.style.width = percentage + '%';
        spentAmount.textContent = formatCurrency(spent);
        remainingAmount.textContent = formatCurrency(remaining);
    }

    // Initialize budget display
    updateBudgetDisplay();

    // Notification button click handler
    notificationBtn.addEventListener('click', function () {
        console.log('Notifications clicked');
    });

    // See all button click handler
    seeAllBtn.addEventListener('click', function () {
        console.log('See all activities clicked');
    });

    // Activity items click handlers
    activityItems.forEach(function (item) {
        item.addEventListener('click', function () {
            var expenseName = this.querySelector('.font-bold.text-on-surface').textContent;
            var expenseAmount = this.querySelector('.text-right .font-bold').textContent;
            console.log('Expense clicked:', expenseName, '-', expenseAmount);
        });
    });

    // Owed card click handler
    owedCard.addEventListener('click', function () {
        console.log('You are owed:', owedAmount.textContent);
    });

    // Owe card click handler
    oweCard.addEventListener('click', function () {
        console.log('You owe:', oweAmount.textContent);
    });

    // FAB button click handler
    fabBtn.addEventListener('click', function () {
        console.log('Add new expense clicked');
    });

    // Bottom navigation active state handler
    bottomNavLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            // Remove active styles from all links
            bottomNavLinks.forEach(function (navLink) {
                navLink.classList.remove('text-[#00327d]', 'bg-[#0047AB]/10', 'rounded-2xl');
                navLink.classList.add('text-slate-400');
                var icon = navLink.querySelector('.material-symbols-outlined');
                icon.style.fontVariationSettings = "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24";
            });

            // Add active styles to clicked link
            this.classList.remove('text-slate-400');
            this.classList.add('text-[#00327d]', 'bg-[#0047AB]/10', 'rounded-2xl');
            var activeIcon = this.querySelector('.material-symbols-outlined');
            activeIcon.style.fontVariationSettings = "'FILL' 1";

            var navType = this.getAttribute('data-nav');
            console.log('Navigating to:', navType);
        });
    });

    // Animate progress bar on load
    progressBar.style.width = '0%';
    setTimeout(function () {
        progressBar.style.transition = 'width 1s ease-out';
        progressBar.style.width = percentage + '%';
    }, 300);
});