/* =============================================
   translator.js
   Pravas — Global Translator
   Fully connected to backend

   Endpoints used:
     POST /api/translator/text         → translate text
     GET  /api/translator/word-meaning → word definition on double-click
   ============================================= */

/* ── Tailwind Config ── */
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
        "body":     ["Inter"],
        "label":    ["Inter"]
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

/* ══════════════════════════════════════════════
   CONFIG
══════════════════════════════════════════════ */
const BASE_URL = 'http://localhost:5000/api';

/* Full language list — value = what the backend expects in targetLanguage */
const LANGUAGES = [
  { label: 'English',    value: 'English'    },
  { label: 'Hindi',      value: 'Hindi'      },
  { label: 'Japanese',   value: 'Japanese'   },
  { label: 'French',     value: 'French'     },
  { label: 'German',     value: 'German'     },
  { label: 'Spanish',    value: 'Spanish'    },
  { label: 'Italian',    value: 'Italian'    },
  { label: 'Portuguese', value: 'Portuguese' },
  { label: 'Arabic',     value: 'Arabic'     },
  { label: 'Chinese',    value: 'Chinese'    },
  { label: 'Korean',     value: 'Korean'     },
  { label: 'Thai',       value: 'Thai'       },
  { label: 'Russian',    value: 'Russian'    },
];

/* ── State ── */
let translateDebounceTimer = null;
let lastTranslatedText     = '';
let lastTranslation        = '';
let recentHistory          = JSON.parse(localStorage.getItem('translator_history') || '[]');

/* ══════════════════════════════════════════════
   API HELPER
══════════════════════════════════════════════ */
function getToken() {
    return localStorage.getItem('pravas_token') || null;
}

async function apiFetch(endpoint, options = {}) {
    const token = getToken();
    const res   = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers || {}),
        },
    });
    const data = await res.json();
    if (!res.ok) {
        const err  = new Error(data.message || 'Request failed');
        err.status = res.status;
        throw err;
    }
    return data;
}

/* ══════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════ */
function showToast(message, type = 'info') {
    document.getElementById('translator-toast')?.remove();
    const toast     = document.createElement('div');
    toast.id        = 'translator-toast';
    const isError   = type === 'error';
    toast.className = `fixed top-20 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3
        px-5 py-3 rounded-xl shadow-xl text-sm font-semibold pointer-events-none
        ${isError ? 'bg-error-container text-on-error-container' : 'bg-secondary-container text-on-secondary-container'}`;
    toast.innerHTML = `
        <span class="material-symbols-outlined text-base">${isError ? 'error' : 'check_circle'}</span>
        <span>${message}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function setOutputLoading(isLoading) {
    const outputText        = document.getElementById('translated-text');
    const outputRomanized   = document.getElementById('translated-romanized');
    const outputDetected    = document.getElementById('detected-language');
    const outputContainer   = document.getElementById('output-container');

    if (isLoading) {
        if (outputContainer) outputContainer.classList.add('opacity-50');
        if (outputText)      outputText.innerHTML = `
            <span class="inline-flex items-center gap-2 text-on-surface-variant text-base font-body">
              <span class="material-symbols-outlined animate-spin text-lg">progress_activity</span>
              Translating…
            </span>`;
        if (outputRomanized) outputRomanized.textContent = '';
        if (outputDetected)  outputDetected.textContent  = '';
    } else {
        if (outputContainer) outputContainer.classList.remove('opacity-50');
    }
}

/* Populate a <select> with LANGUAGES */
function populateLanguageSelect(selectEl, defaultValue) {
    if (!selectEl) return;
    selectEl.innerHTML = LANGUAGES.map(lang =>
        `<option value="${lang.value}" ${lang.value === defaultValue ? 'selected' : ''}>${lang.label}</option>`
    ).join('');
}

/* ══════════════════════════════════════════════
   CORE — TRANSLATE
   POST /api/translator/text
   Body: { text, targetLanguage }
   Response: { success, result: { translated, detectedLanguage } }
══════════════════════════════════════════════ */
async function translate() {
    const inputEl     = document.getElementById('translate-input');
    const toLangEl    = document.getElementById('lang-to');
    const outputText  = document.getElementById('translated-text');
    const outputRom   = document.getElementById('translated-romanized');
    const outputDet   = document.getElementById('detected-language');

    const text           = inputEl?.value.trim();
    const targetLanguage = toLangEl?.value || 'Japanese';

    if (!text) {
        if (outputText) outputText.textContent = '';
        if (outputRom)  outputRom.textContent  = '';
        return;
    }

    // Don't re-translate the same text to the same language
    const cacheKey = `${text}::${targetLanguage}`;
    if (cacheKey === lastTranslatedText) return;

    setOutputLoading(true);

    try {
        const data = await apiFetch('/translator/text', {
            method: 'POST',
            body: JSON.stringify({ text, targetLanguage }),
        });

        const { translated, detectedLanguage } = data.result;

        lastTranslatedText = cacheKey;
        lastTranslation    = translated;

        if (outputText) outputText.textContent = translated;
        if (outputRom)  outputRom.textContent  = '';   // romanization returned only if model includes it
        if (outputDet && detectedLanguage) {
            outputDet.textContent = `Detected: ${detectedLanguage}`;
        }

        // Save to recent history
        saveToHistory({ text, translated, targetLanguage, detectedLanguage });

    } catch (err) {
        console.error('Translation failed:', err);
        if (outputText) outputText.textContent = 'Translation failed. Please try again.';
        showToast('Translation failed. Check your connection.', 'error');
    } finally {
        setOutputLoading(false);
    }
}

/* ══════════════════════════════════════════════
   WORD MEANING
   GET /api/translator/word-meaning?word=...&language=...
   Response: { success, result: { word, meaning, example, pronunciation } }
   Triggered by double-clicking a word in the output
══════════════════════════════════════════════ */
async function fetchWordMeaning(word, language) {
    try {
        const params = new URLSearchParams({ word, language: language || 'English' });
        const data   = await apiFetch(`/translator/word-meaning?${params}`);
        const { word: w, meaning, example, pronunciation } = data.result;
        openWordMeaningModal({ word: w, meaning, example, pronunciation });
    } catch (err) {
        console.error('Word meaning failed:', err);
        showToast('Could not fetch word meaning.', 'error');
    }
}

/* ══════════════════════════════════════════════
   WORD MEANING MODAL
══════════════════════════════════════════════ */
function openWordMeaningModal({ word, meaning, example, pronunciation }) {
    document.getElementById('word-meaning-modal')?.remove();

    const modal     = document.createElement('div');
    modal.id        = 'word-meaning-modal';
    modal.className = 'fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm';
    modal.innerHTML = `
        <div class="bg-surface-container-lowest w-full max-w-md rounded-t-[2rem] md:rounded-[2rem] p-8 shadow-2xl">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="font-headline font-bold text-2xl text-primary">${word}</h3>
              ${pronunciation ? `<p class="text-on-surface-variant text-sm font-mono mt-1">${pronunciation}</p>` : ''}
            </div>
            <button id="close-word-modal" class="p-2 rounded-full hover:bg-surface-container-high transition-colors">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <div class="space-y-4">
            <div>
              <p class="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Meaning</p>
              <p class="text-on-surface font-medium leading-relaxed">${meaning || '—'}</p>
            </div>
            ${example ? `
            <div>
              <p class="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Example</p>
              <p class="text-on-surface-variant italic">"${example}"</p>
            </div>` : ''}
          </div>
          <button id="close-word-modal-btn"
            class="w-full mt-6 py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-bold rounded-xl active:scale-[0.98] transition-all">
            Done
          </button>
        </div>`;
    document.body.appendChild(modal);

    const close = () => modal.remove();
    document.getElementById('close-word-modal').addEventListener('click', close);
    document.getElementById('close-word-modal-btn').addEventListener('click', close);
    modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
}

/* ══════════════════════════════════════════════
   RECENT HISTORY
══════════════════════════════════════════════ */
function saveToHistory(entry) {
    recentHistory = [entry, ...recentHistory.filter(h => h.text !== entry.text)].slice(0, 20);
    localStorage.setItem('translator_history', JSON.stringify(recentHistory));
}

function openHistoryPanel() {
    document.getElementById('history-panel')?.remove();
    if (!recentHistory.length) { showToast('No recent translations yet.', 'info'); return; }

    const panel     = document.createElement('div');
    panel.id        = 'history-panel';
    panel.className = 'fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm';
    panel.innerHTML = `
        <div class="bg-surface-container-lowest w-full max-w-md rounded-t-[2rem] md:rounded-[2rem] p-6 shadow-2xl max-h-[70vh] flex flex-col">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-headline font-bold text-xl text-primary">Recent Translations</h3>
            <button id="close-history" class="p-2 rounded-full hover:bg-surface-container-high transition-colors">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <div class="overflow-y-auto flex-1 space-y-3 pr-1">
            ${recentHistory.map(h => `
              <button class="history-item w-full text-left p-4 bg-surface-container-low rounded-xl hover:bg-surface-container-high transition-colors"
                      data-text="${encodeURIComponent(h.text)}" data-lang="${h.targetLanguage}">
                <p class="font-medium text-sm text-on-surface truncate">${h.text}</p>
                <p class="text-xs text-on-surface-variant mt-1 truncate">${h.translated} • ${h.targetLanguage}</p>
              </button>`).join('')}
          </div>
        </div>`;
    document.body.appendChild(panel);

    document.getElementById('close-history').addEventListener('click', () => panel.remove());
    panel.addEventListener('click', (e) => { if (e.target === panel) panel.remove(); });

    panel.querySelectorAll('.history-item').forEach(btn => {
        btn.addEventListener('click', () => {
            const text = decodeURIComponent(btn.dataset.text);
            const lang = btn.dataset.lang;
            const inputEl  = document.getElementById('translate-input');
            const toLangEl = document.getElementById('lang-to');
            if (inputEl)  inputEl.value  = text;
            if (toLangEl) toLangEl.value = lang;
            panel.remove();
            translate();
        });
    });
}

/* ══════════════════════════════════════════════
   SPEECH — TEXT TO SPEECH (output)
══════════════════════════════════════════════ */
function speakTranslation() {
    const text = document.getElementById('translated-text')?.textContent;
    if (!text || text.includes('Translating')) return;
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
    showToast('Playing translation…', 'info');
}

/* ══════════════════════════════════════════════
   SPEECH — SPEECH TO TEXT (input mic)
══════════════════════════════════════════════ */
function startSpeechInput() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        showToast('Speech recognition not supported in this browser.', 'error');
        return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition       = new SpeechRecognition();
    recognition.lang        = 'en-US';
    recognition.interimResults = false;

    const micBtn = document.getElementById('mic-btn');
    if (micBtn) {
        micBtn.classList.add('text-error', 'animate-pulse');
        micBtn.classList.remove('text-on-surface-variant');
    }

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const inputEl    = document.getElementById('translate-input');
        if (inputEl) {
            inputEl.value = transcript;
            triggerDebounceTranslate();
        }
    };
    recognition.onerror  = () => showToast('Microphone error. Please try again.', 'error');
    recognition.onend    = () => {
        if (micBtn) {
            micBtn.classList.remove('text-error', 'animate-pulse');
            micBtn.classList.add('text-on-surface-variant');
        }
    };
    recognition.start();
}

/* ══════════════════════════════════════════════
   COPY TO CLIPBOARD
══════════════════════════════════════════════ */
async function copyTranslation() {
    const text = document.getElementById('translated-text')?.textContent;
    if (!text || text.includes('Translating')) return;
    try {
        await navigator.clipboard.writeText(text);
        showToast('Copied to clipboard!', 'info');
    } catch {
        showToast('Copy failed.', 'error');
    }
}

/* ══════════════════════════════════════════════
   SWAP LANGUAGES
══════════════════════════════════════════════ */
function swapLanguages() {
    const fromEl    = document.getElementById('lang-from');
    const toEl      = document.getElementById('lang-to');
    const inputEl   = document.getElementById('translate-input');
    const outputEl  = document.getElementById('translated-text');

    if (!fromEl || !toEl) return;

    const fromVal   = fromEl.value;
    const toVal     = toEl.value;
    fromEl.value    = toVal;
    toEl.value      = fromVal;

    // Swap text content too if there's a translation
    const currentOutput = outputEl?.textContent;
    if (currentOutput && !currentOutput.includes('Translating') && inputEl) {
        const currentInput = inputEl.value;
        inputEl.value      = currentOutput;
        if (outputEl) outputEl.textContent = currentInput;
    }

    lastTranslatedText = ''; // reset cache so it re-translates
    if (inputEl?.value.trim()) triggerDebounceTranslate();
}

/* ══════════════════════════════════════════════
   DEBOUNCED AUTO-TRANSLATE
   Fires 800ms after user stops typing
══════════════════════════════════════════════ */
function triggerDebounceTranslate() {
    clearTimeout(translateDebounceTimer);
    translateDebounceTimer = setTimeout(translate, 800);
}

/* ══════════════════════════════════════════════
   DOM READY
══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

    /* ── Auth guard ── */
    const token = getToken();
    if (!token) {
        window.location.href = '/html/login.html';
        return;
    }

    /* ── Populate language dropdowns ── */
    populateLanguageSelect(document.getElementById('lang-from'), 'English');
    populateLanguageSelect(document.getElementById('lang-to'),   'Japanese');

    /* ── Input textarea — debounced translate ── */
    const inputEl = document.getElementById('translate-input');
    if (inputEl) {
        inputEl.addEventListener('input', triggerDebounceTranslate);
        inputEl.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Enter → translate immediately
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                clearTimeout(translateDebounceTimer);
                translate();
            }
        });
    }

    /* ── Language selects → re-translate on change ── */
    document.getElementById('lang-from')?.addEventListener('change', () => {
        lastTranslatedText = '';
        if (inputEl?.value.trim()) translate();
    });
    document.getElementById('lang-to')?.addEventListener('change', () => {
        lastTranslatedText = '';
        if (inputEl?.value.trim()) translate();
    });

    /* ── Swap button ── */
    document.getElementById('swap-btn')?.addEventListener('click', swapLanguages);

    /* ── Clear input button ── */
    document.getElementById('clear-btn')?.addEventListener('click', () => {
        if (inputEl) inputEl.value = '';
        const outputText = document.getElementById('translated-text');
        const outputRom  = document.getElementById('translated-romanized');
        const outputDet  = document.getElementById('detected-language');
        if (outputText) outputText.textContent = '';
        if (outputRom)  outputRom.textContent  = '';
        if (outputDet)  outputDet.textContent  = '';
        lastTranslatedText = '';
        inputEl?.focus();
    });

    /* ── Mic button ── */
    document.getElementById('mic-btn')?.addEventListener('click', startSpeechInput);

    /* ── Speak (volume) button ── */
    document.getElementById('speak-btn')?.addEventListener('click', speakTranslation);

    /* ── Copy button ── */
    document.getElementById('copy-btn')?.addEventListener('click', copyTranslation);

    /* ── Double-click word in output → word meaning ── */
    const outputArea = document.getElementById('output-container');
    if (outputArea) {
        outputArea.addEventListener('dblclick', (e) => {
            const selection = window.getSelection().toString().trim();
            if (selection && selection.split(' ').length <= 3) {
                const toLang = document.getElementById('lang-to')?.value || 'English';
                fetchWordMeaning(selection, toLang);
            }
        });
    }

    /* ── Quick action buttons ── */
    document.getElementById('btn-recent')?.addEventListener('click',  openHistoryPanel);
    document.getElementById('btn-favorites')?.addEventListener('click', () =>
        showToast('Favourites coming soon.', 'info'));
    document.getElementById('btn-offline')?.addEventListener('click',  () =>
        showToast('Offline mode coming soon.', 'info'));

    /* ── Bottom Nav ── */
    const navRoutes = {
        planner:   '/html/itinerary_planner.html',
        chat:      '/html/chatbot.html',
        weather:   '/html/weather_alerts.html',
        translate: null,
        saved:     '/html/tickets_documents.html',
    };
    document.querySelectorAll('[data-nav]').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.nav;
            if (navRoutes[target]) window.location.href = navRoutes[target];
        });
    });

});