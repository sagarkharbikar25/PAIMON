tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "tertiary-fixed": "#ffdbcb",
                "on-secondary-container": "#4e6874",
                "surface-bright": "#f6fafe",
                "inverse-on-surface": "#edf1f5",
                "on-primary": "#ffffff",
                "on-tertiary-fixed-variant": "#7a3000",
                "on-error-container": "#93000a",
                "on-primary-fixed": "#001946",
                "surface": "#f6fafe",
                "on-tertiary": "#ffffff",
                "on-error": "#ffffff",
                "surface-variant": "#dfe3e7",
                "secondary-fixed": "#cbe7f5",
                "outline": "#737784",
                "surface-container-high": "#e4e9ed",
                "inverse-primary": "#b1c5ff",
                "primary": "#00327d",
                "tertiary": "#602400",
                "on-secondary-fixed": "#021f29",
                "secondary-container": "#cbe7f5",
                "tertiary-container": "#843500",
                "surface-container": "#eaeef2",
                "background": "#f6fafe",
                "primary-fixed": "#dae2ff",
                "on-surface": "#171c1f",
                "on-tertiary-fixed": "#341100",
                "surface-container-low": "#f0f4f8",
                "error-container": "#ffdad6",
                "primary-container": "#0047ab",
                "outline-variant": "#c3c6d5",
                "on-secondary-fixed-variant": "#304a55",
                "surface-container-highest": "#dfe3e7",
                "on-surface-variant": "#434653",
                "surface-container-lowest": "#ffffff",
                "on-secondary": "#ffffff",
                "primary-fixed-dim": "#b1c5ff",
                "on-tertiary-container": "#ffaa80",
                "inverse-surface": "#2c3134",
                "on-primary-fixed-variant": "#00419e",
                "secondary-fixed-dim": "#afcbd8",
                "surface-tint": "#2559bd",
                "on-background": "#171c1f",
                "secondary": "#48626e",
                "error": "#ba1a1a",
                "on-primary-container": "#a5bdff",
                "tertiary-fixed-dim": "#ffb692",
                "surface-dim": "#d6dade"
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
    var chatInput = document.getElementById('chat-input');
    var sendBtn = document.getElementById('send-btn');
    var chatMessages = document.getElementById('chat-messages');
    var chatCanvas = document.getElementById('chat-canvas');
    var suggestionChips = document.querySelectorAll('.suggestion-chip');
    var navTabs = document.querySelectorAll('.nav-tab');
    var bottomNavBtns = document.querySelectorAll('.bottom-nav-btn');
    var menuBtn = document.querySelector('.menu-btn');

    // Helper function to get current time formatted
    function getCurrentTime() {
        var now = new Date();
        var hours = now.getHours();
        var minutes = now.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return hours + ':' + minutes + ' ' + ampm;
    }

    // Function to add a user message to the chat
    function addUserMessage(text) {
        var messageDiv = document.createElement('div');
        messageDiv.className = 'flex flex-col items-end max-w-[85%] ml-auto';
        messageDiv.innerHTML =
            '<div class="bg-primary p-5 rounded-xl rounded-tr-none shadow-lg">' +
                '<p class="text-on-primary leading-relaxed">' + text + '</p>' +
            '</div>' +
            '<span class="text-[10px] text-on-surface-variant mt-2 px-1 font-medium uppercase tracking-widest">' + getCurrentTime() + '</span>';
        chatMessages.appendChild(messageDiv);
        scrollToBottom();
    }

    // Function to add an AI message to the chat
    function addAIMessage(text) {
        var messageDiv = document.createElement('div');
        messageDiv.className = 'flex flex-col items-start max-w-[85%] animate-fade-in';
        messageDiv.innerHTML =
            '<div class="flex items-center gap-3 mb-2 px-1">' +
                '<div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">' +
                    '<span class="material-symbols-outlined text-sm" data-icon="auto_awesome">auto_awesome</span>' +
                '</div>' +
                '<span class="font-headline font-bold text-sm tracking-tight text-primary">प्रvaas Concierge</span>' +
            '</div>' +
            '<div class="bg-surface-container-lowest p-5 rounded-xl rounded-tl-none shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-outline-variant/10">' +
                '<p class="text-on-surface leading-relaxed">' + text + '</p>' +
            '</div>' +
            '<span class="text-[10px] text-on-surface-variant mt-2 px-1 font-medium uppercase tracking-widest">' + getCurrentTime() + '</span>';
        chatMessages.appendChild(messageDiv);
        scrollToBottom();
    }

    // Function to scroll chat to bottom
    function scrollToBottom() {
        chatCanvas.scrollTop = chatCanvas.scrollHeight;
    }

    // Send message handler
    function sendMessage() {
        var text = chatInput.value.trim();
        if (text === '') return;

        addUserMessage(text);
        chatInput.value = '';

        // Simulate AI response after a short delay
        setTimeout(function () {
            addAIMessage("Thank you for your message! I'm processing your request about \"" + text + "\". Let me find the best options for you.");
        }, 1000);
    }

    // Send button click event
    sendBtn.addEventListener('click', function () {
        sendMessage();
    });

    // Enter key to send message
    chatInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    });

    // Suggestion chips click events
    suggestionChips.forEach(function (chip) {
        chip.addEventListener('click', function () {
            var chipText = this.textContent.trim();
            chatInput.value = chipText;
            sendMessage();
        });
    });

    // Desktop navigation tabs click events
    navTabs.forEach(function (tab) {
        tab.addEventListener('click', function (e) {
            e.preventDefault();

            // Remove active styles from all tabs
            navTabs.forEach(function (t) {
                t.classList.remove('text-[#00327d]', 'border-b-2', 'border-primary');
                t.classList.add('text-slate-500');
            });

            // Add active styles to clicked tab
            this.classList.remove('text-slate-500');
            this.classList.add('text-[#00327d]', 'border-b-2', 'border-primary');
        });
    });

    // Bottom navigation buttons click events (Mobile)
    bottomNavBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {

            // Remove active styles from all bottom nav buttons
            bottomNavBtns.forEach(function (b) {
                b.classList.remove('bg-[#cbe7f5]', 'dark:bg-[#0047AB]/30', 'text-[#00327d]', 'dark:text-white', 'rounded-2xl', 'scale-105');
                b.classList.add('text-slate-400', 'dark:text-slate-500');
                var icon = b.querySelector('.material-symbols-outlined');
                icon.style.fontVariationSettings = "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24";
            });

            // Add active styles to clicked button
            this.classList.remove('text-slate-400', 'dark:text-slate-500');
            this.classList.add('bg-[#cbe7f5]', 'dark:bg-[#0047AB]/30', 'text-[#00327d]', 'dark:text-white', 'rounded-2xl', 'scale-105');
            var activeIcon = this.querySelector('.material-symbols-outlined');
            activeIcon.style.fontVariationSettings = "'FILL' 1";
        });
    });

    // Menu button click event
    menuBtn.addEventListener('click', function () {
        console.log('Menu button clicked');
    });

    // Scroll to bottom on initial load
    scrollToBottom();
});